"use client";

import React, { useState } from "react";
import { Plus, Trash2, Hash, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { MOCK_AUTOMOD_RULES } from "@/lib/mock-data";
import { AutoModRule } from "@/types/dashboard";

const TRIGGERS = ["Spam", "Caps", "Links", "Mentions", "Profanity", "Repeated Chars"];
const ACTIONS_LIST = ["Warn", "Delete", "Mute (1h)", "Mute (24h)", "Kick", "Ban"];

export default function AutoModPage() {
  const [rules, setRules] = useState<AutoModRule[]>(MOCK_AUTOMOD_RULES);
  const [exemptChannels, setExemptChannels] = useState([
    "staff-chat",
    "bot-commands",
    "admin-lounge",
  ]);
  const [newChannelInput, setNewChannelInput] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Rule Form state
  const [newTrigger, setNewTrigger] = useState("Spam");
  const [newThreshold, setNewThreshold] = useState("5 msgs / 3s");
  const [newAction, setNewAction] = useState("Mute (1h)");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleRule = (id: number) => {
    setRules((rs) =>
      rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    showToast("Auto-mod rule updated!");
  };

  const deleteRule = (id: number) => {
    setRules((rs) => rs.filter((r) => r.id !== id));
    showToast("Rule removed successfully");
  };

  const addRule = () => {
    const newId = Math.max(...rules.map((r) => r.id), 0) + 1;
    setRules((rs) => [
      ...rs,
      {
        id: newId,
        trigger: newTrigger,
        threshold: newThreshold,
        action: newAction,
        enabled: true,
      },
    ]);
    setShowAddModal(false);
    showToast("New auto-mod rule created!");
  };

  const addExemptChannel = () => {
    if (!newChannelInput.trim()) return;
    const cleaned = newChannelInput.replace(/^#/, "").trim();
    if (!exemptChannels.includes(cleaned)) {
      setExemptChannels([...exemptChannels, cleaned]);
    }
    setNewChannelInput("");
    showToast(`Added #${cleaned} to exempt channels`);
  };

  const removeExemptChannel = (ch: string) => {
    setExemptChannels(exemptChannels.filter((c) => c !== ch));
    showToast(`Removed #${ch} from exempt channels`);
  };

  const activeCount = rules.filter((r) => r.enabled).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-brand-teal/30 text-brand-teal px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-content-primary flex items-center gap-2">
            <ShieldAlert className="text-brand-amber" size={24} />
            Auto-Moderation Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 font-sans">
            Configure automated message filters, thresholds, and penalty enforcement.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-content-secondary bg-surface px-3 py-1.5 rounded-lg border border-surface-border">
            Active Rules: <span className="text-brand-teal font-bold">{activeCount} / {rules.length}</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-amber text-background font-heading font-semibold text-xs transition-all hover:brightness-110 active:scale-95 shadow-glow"
          >
            <Plus size={15} />
            Add Rule
          </button>
        </div>
      </div>

      {/* Rules Table Container */}
      <div className="rounded-xl overflow-hidden bg-card border border-surface-border shadow-xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-4 py-3 text-[10px] uppercase tracking-widest font-mono text-content-tertiary bg-card-subtle border-b border-surface-border">
          <span className="col-span-3 sm:col-span-3">Trigger</span>
          <span className="col-span-4 sm:col-span-3">Threshold</span>
          <span className="col-span-3 sm:col-span-3">Action</span>
          <span className="col-span-1 sm:col-span-2 text-center">Status</span>
          <span className="col-span-1 text-right">Delete</span>
        </div>

        {/* Rule Rows */}
        <div className="divide-y divide-surface-subtleBorder">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`grid grid-cols-12 px-4 py-3.5 items-center transition-colors ${
                rule.enabled ? "bg-card" : "bg-card-subtle/50 opacity-60"
              }`}
            >
              {/* Trigger */}
              <div className="col-span-3 sm:col-span-3 font-heading font-semibold text-sm text-content-primary">
                {rule.trigger}
              </div>

              {/* Threshold */}
              <div className="col-span-4 sm:col-span-3 font-mono text-xs text-content-secondary">
                {rule.threshold}
              </div>

              {/* Action */}
              <div className="col-span-3 sm:col-span-3 font-mono text-xs text-brand-teal">
                {rule.action}
              </div>

              {/* Status Toggle */}
              <div className="col-span-1 sm:col-span-2 flex justify-center">
                <Toggle
                  on={rule.enabled}
                  onToggle={() => toggleRule(rule.id)}
                  ariaLabel={`Toggle rule ${rule.trigger}`}
                />
              </div>

              {/* Delete Button */}
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-1.5 rounded-lg text-content-tertiary hover:text-brand-red hover:bg-brand-red/10 transition-colors"
                  aria-label="Delete rule"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exempt Channels Section */}
      <div className="bg-card border border-surface-border rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold font-heading text-content-primary">
            Exempt Channels & Bypasses
          </h2>
          <p className="text-xs text-content-secondary mt-0.5">
            Auto-moderation rules will not execute on messages posted in these channels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {exemptChannels.map((ch) => (
            <span
              key={ch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-mono text-content-primary"
            >
              <Hash size={13} className="text-brand-amber" />
              <span>{ch}</span>
              <button
                onClick={() => removeExemptChannel(ch)}
                className="ml-1 text-content-tertiary hover:text-brand-red font-bold transition-colors"
              >
                ×
              </button>
            </span>
          ))}

          {/* Add Channel Inline Input */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface border border-surface-border rounded-lg px-2.5 py-1 text-xs">
              <Hash size={13} className="text-content-tertiary mr-1" />
              <input
                type="text"
                placeholder="channel-name"
                value={newChannelInput}
                onChange={(e) => setNewChannelInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addExemptChannel()}
                className="bg-transparent text-content-primary outline-none w-28 font-mono"
              />
            </div>
            <button
              onClick={addExemptChannel}
              className="px-3 py-1 rounded-lg bg-surface-muted hover:bg-surface text-content-primary text-xs font-heading font-medium transition-colors border border-surface-border"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Adding New Rule */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Auto-Mod Rule"
      >
        <div className="space-y-4 font-sans text-xs">
          <div>
            <label className="block text-content-secondary font-heading mb-1 uppercase tracking-wider">
              Filter Trigger
            </label>
            <select
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              className="w-full bg-surface border border-surface-border text-content-primary rounded-lg p-2.5 outline-none font-heading"
            >
              {TRIGGERS.map((t) => (
                <option key={t} value={t} className="bg-card">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-content-secondary font-heading mb-1 uppercase tracking-wider">
              Threshold Condition
            </label>
            <input
              type="text"
              value={newThreshold}
              onChange={(e) => setNewThreshold(e.target.value)}
              className="w-full bg-surface border border-surface-border text-content-primary rounded-lg p-2.5 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-content-secondary font-heading mb-1 uppercase tracking-wider">
              Penalty Action
            </label>
            <select
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              className="w-full bg-surface border border-surface-border text-content-primary rounded-lg p-2.5 outline-none font-mono"
            >
              {ACTIONS_LIST.map((a) => (
                <option key={a} value={a} className="bg-card">
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-lg bg-surface text-content-secondary hover:text-content-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addRule}
              className="px-4 py-2 rounded-lg bg-brand-amber text-background font-heading font-semibold transition-all hover:brightness-110"
            >
              Create Rule
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
