"use client";

import React, { useState } from "react";
import { ScrollText, Search, Shield, Activity, Lock, KeyRound, Download, CheckCircle2 } from "lucide-react";
import { MOCK_MOD_LOGS, MOCK_ACTIVITY_LOGS, MOCK_CONFESSION_LOGS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type LogTab = "moderation" | "activity" | "confessions";

export default function LogsPage() {
  const [tab, setTab] = useState<LogTab>("moderation");
  const [search, setSearch] = useState("");
  const [unlockedConfessions, setUnlockedConfessions] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUnlockConfessions = () => {
    if (pinInput === "1337" || pinInput.length >= 4) {
      setUnlockedConfessions(true);
      showToast("Security Clearance Granted: Confession Logs Unlocked");
    } else {
      showToast("Invalid Security PIN. Enter 1337 or any 4 digits to simulate.");
    }
  };

  const handleExportLogs = () => {
    showToast(`Exported ${tab} logs to file!`);
  };

  function severityColor(s: string) {
    if (s === "high") return "text-brand-red font-semibold";
    if (s === "medium") return "text-brand-amber font-medium";
    return "text-content-secondary";
  }

  const filteredModLogs = MOCK_MOD_LOGS.filter(
    (l) =>
      !search ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.mod.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.reason.toLowerCase().includes(search.toLowerCase())
  );

  const filteredActivityLogs = MOCK_ACTIVITY_LOGS.filter(
    (l) =>
      !search ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.event.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Toast */}
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
            <ScrollText className="text-brand-amber" size={24} />
            Server Audit & Security Logs
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 font-sans">
            Centralized telemetry for moderation enforcement, user join/leaves, and anonymous confessions.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-surface-border">
            <Search size={15} className="text-content-tertiary" />
            <input
              type="text"
              placeholder="Search logs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-content-primary outline-none w-36 font-sans"
            />
          </div>

          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-surface-border text-xs font-heading font-medium text-content-primary hover:bg-card transition-colors"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-surface-border w-fit">
        <button
          onClick={() => setTab("moderation")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-heading font-medium transition-colors flex items-center gap-2",
            tab === "moderation"
              ? "bg-brand-amber text-background shadow-sm"
              : "text-content-secondary hover:text-content-primary hover:bg-surface"
          )}
        >
          <Shield size={14} />
          <span>Moderation Logs</span>
        </button>

        <button
          onClick={() => setTab("activity")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-heading font-medium transition-colors flex items-center gap-2",
            tab === "activity"
              ? "bg-brand-amber text-background shadow-sm"
              : "text-content-secondary hover:text-content-primary hover:bg-surface"
          )}
        >
          <Activity size={14} />
          <span>Activity Stream</span>
        </button>

        <button
          onClick={() => setTab("confessions")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-heading font-medium transition-colors flex items-center gap-2",
            tab === "confessions"
              ? "bg-brand-amber text-background shadow-sm"
              : "text-content-secondary hover:text-content-primary hover:bg-surface"
          )}
        >
          <Lock size={14} />
          <span>Confession Logs</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-purple/20 text-brand-purple">
            GATED
          </span>
        </button>
      </div>

      {/* Tab Content 1: Moderation Logs */}
      {tab === "moderation" && (
        <div className="rounded-xl overflow-hidden bg-card border border-surface-border shadow-xl">
          <div className="grid grid-cols-12 px-4 py-3 text-[10px] uppercase tracking-widest font-mono text-content-tertiary bg-card-subtle border-b border-surface-border">
            <span className="col-span-2 sm:col-span-2">Time</span>
            <span className="col-span-3 sm:col-span-2">Moderator</span>
            <span className="col-span-3 sm:col-span-2">Target User</span>
            <span className="col-span-4 sm:col-span-3">Action</span>
            <span className="hidden sm:block sm:col-span-3">Reason</span>
          </div>

          <div className="divide-y divide-surface-subtleBorder">
            {filteredModLogs.map((l, i) => (
              <div
                key={i}
                className="grid grid-cols-12 px-4 py-3.5 items-center transition-colors hover:bg-surface"
              >
                <div className="col-span-2 sm:col-span-2 font-mono text-xs text-content-tertiary">
                  {l.time}
                </div>
                <div className="col-span-3 sm:col-span-2 font-sans text-xs text-content-secondary">
                  @{l.mod}
                </div>
                <div className="col-span-3 sm:col-span-2 font-sans text-xs font-medium text-content-primary">
                  @{l.target}
                </div>
                <div className={cn("col-span-4 sm:col-span-3 font-heading text-xs", severityColor(l.severity))}>
                  {l.action}
                </div>
                <div className="hidden sm:block sm:col-span-3 font-mono text-xs text-content-secondary truncate">
                  {l.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Activity Logs */}
      {tab === "activity" && (
        <div className="rounded-xl overflow-hidden bg-card border border-surface-border shadow-xl">
          <div className="grid grid-cols-12 px-4 py-3 text-[10px] uppercase tracking-widest font-mono text-content-tertiary bg-card-subtle border-b border-surface-border">
            <span className="col-span-3 sm:col-span-2">Time</span>
            <span className="col-span-3 sm:col-span-3">User</span>
            <span className="col-span-4 sm:col-span-5">Event Description</span>
            <span className="col-span-2 sm:col-span-2">Channel</span>
          </div>

          <div className="divide-y divide-surface-subtleBorder">
            {filteredActivityLogs.map((l, i) => (
              <div
                key={i}
                className="grid grid-cols-12 px-4 py-3.5 items-center transition-colors hover:bg-surface"
              >
                <div className="col-span-3 sm:col-span-2 font-mono text-xs text-content-tertiary">
                  {l.time}
                </div>
                <div className="col-span-3 sm:col-span-3 font-sans text-xs text-content-primary font-medium">
                  @{l.user}
                </div>
                <div className="col-span-4 sm:col-span-5 font-sans text-xs text-content-secondary">
                  {l.event}
                </div>
                <div className="col-span-2 sm:col-span-2 font-mono text-xs text-brand-amber">
                  {l.channel}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Confession Logs (Security Gated) */}
      {tab === "confessions" && (
        <div className="space-y-4">
          {!unlockedConfessions ? (
            <div className="rounded-xl bg-card border border-brand-purple/30 p-8 text-center max-w-md mx-auto space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center mx-auto">
                <KeyRound size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold font-heading text-content-primary">
                  Owner Security Clearance Required
                </h2>
                <p className="text-xs text-content-secondary mt-1 leading-relaxed">
                  Confession logs store encrypted original author metadata for abuse investigation. Enter authorization PIN to proceed.
                </p>
              </div>

              <div className="flex items-center gap-2 max-w-xs mx-auto">
                <input
                  type="password"
                  placeholder="PIN (e.g. 1337)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlockConfessions()}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface border border-surface-border text-center font-mono text-content-primary outline-none focus:border-brand-purple"
                />
                <button
                  onClick={handleUnlockConfessions}
                  className="px-4 py-2 rounded-lg bg-brand-purple text-white font-heading font-semibold text-xs hover:brightness-110"
                >
                  Unlock
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden bg-card border border-surface-border shadow-xl">
              <div className="px-4 py-3 bg-brand-purple/10 border-b border-brand-purple/20 flex items-center justify-between text-xs text-brand-purple font-mono">
                <span>SECURITY CLEARANCE ACTIVE · ENCRYPTED CONFESSIONS LOG</span>
                <span>SHA-256 HASH VERIFIED</span>
              </div>

              <div className="divide-y divide-surface-subtleBorder">
                {MOCK_CONFESSION_LOGS.map((c) => (
                  <div key={c.id} className="p-4 space-y-2 hover:bg-surface transition-colors">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-brand-amber font-bold">{c.id}</span>
                      <span className="text-content-tertiary">{c.time} · Hash: {c.hash}</span>
                    </div>
                    <p className="text-xs text-content-primary font-sans leading-relaxed">
                      "{c.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
