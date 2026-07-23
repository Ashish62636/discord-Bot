"use client";

import React, { useState } from "react";
import { Gift, Plus, Trophy, Clock, CheckCircle2, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { MOCK_GIVEAWAYS } from "@/lib/mock-data";
import { GiveawayItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export default function GiveawaysPage() {
  const [giveaways, setGiveaways] = useState<GiveawayItem[]>(MOCK_GIVEAWAYS);
  const [tab, setTab] = useState<"active" | "ended">("active");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Giveaway Form State
  const [newPrize, setNewPrize] = useState("Discord Nitro (1 Month)");
  const [newChannel, setNewChannel] = useState("#giveaways");
  const [newWinnersCount, setNewWinnersCount] = useState(1);
  const [newDuration, setNewDuration] = useState("24 Hours");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeGiveaways = giveaways.filter((g) => g.status === "active");
  const endedGiveaways = giveaways.filter((g) => g.status === "ended");

  const handleEnterGiveaway = (id: string) => {
    setGiveaways((gs) =>
      gs.map((g) =>
        g.id === id ? { ...g, entriesCount: g.entriesCount + 1 } : g
      )
    );
    showToast("Successfully entered giveaway! Entry recorded.");
  };

  const handleCreateGiveaway = () => {
    if (!newPrize.trim()) return;
    const created: GiveawayItem = {
      id: `gw-${Date.now()}`,
      prize: newPrize,
      channel: newChannel,
      winnerCount: newWinnersCount,
      endsAt: newDuration,
      entriesCount: 1,
      status: "active",
    };
    setGiveaways([created, ...giveaways]);
    setShowCreateModal(false);
    showToast(`New giveaway created for ${newPrize}!`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-brand-teal/30 text-brand-teal px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-content-primary flex items-center gap-2">
            <Gift className="text-brand-amber" size={24} />
            Community Giveaways Manager
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 font-sans">
            Schedule reaction-based giveaways, set duration, and track entrant pools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-amber text-background font-heading font-semibold text-xs transition-all hover:brightness-110 shadow-glow"
          >
            <Plus size={16} />
            Create Giveaway
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-surface-border w-fit">
        <button
          onClick={() => setTab("active")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-heading font-medium transition-colors flex items-center gap-2",
            tab === "active"
              ? "bg-brand-amber text-background shadow-sm"
              : "text-content-secondary hover:text-content-primary hover:bg-surface"
          )}
        >
          <Clock size={14} />
          <span>Active ({activeGiveaways.length})</span>
        </button>

        <button
          onClick={() => setTab("ended")}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-heading font-medium transition-colors flex items-center gap-2",
            tab === "ended"
              ? "bg-brand-amber text-background shadow-sm"
              : "text-content-secondary hover:text-content-primary hover:bg-surface"
          )}
        >
          <Trophy size={14} />
          <span>Ended & Winners ({endedGiveaways.length})</span>
        </button>
      </div>

      {/* Tab 1: Active Giveaways Grid */}
      {tab === "active" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeGiveaways.map((gw) => (
            <div
              key={gw.id}
              className="bg-card border border-surface-border rounded-xl p-5 space-y-4 hover:border-brand-amber/30 transition-all shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Badge label="ACTIVE" variant="amber" />
                  <h3 className="text-base font-bold font-heading text-content-primary mt-2">
                    {gw.prize}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-brand-amber font-semibold block">
                    {gw.endsAt}
                  </span>
                  <span className="text-[10px] font-mono text-content-tertiary">
                    Target: {gw.channel}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-surface-subtleBorder text-content-secondary">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-brand-teal" />
                  <span>{gw.entriesCount} Entrants</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy size={14} className="text-brand-yellow" />
                  <span>{gw.winnerCount} Winner(s)</span>
                </div>
              </div>

              <button
                onClick={() => handleEnterGiveaway(gw.id)}
                className="w-full py-2.5 rounded-lg bg-surface border border-surface-border hover:bg-brand-amber/15 hover:border-brand-amber/30 text-content-primary font-heading font-medium text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles size={15} className="text-brand-amber" />
                <span>Simulate User Entry 🎉</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Ended Giveaways List */}
      {tab === "ended" && (
        <div className="rounded-xl overflow-hidden bg-card border border-surface-border shadow-xl">
          <div className="grid grid-cols-12 px-4 py-3 text-[10px] uppercase tracking-widest font-mono text-content-tertiary bg-card-subtle border-b border-surface-border">
            <span className="col-span-4 sm:col-span-4">Prize</span>
            <span className="col-span-3 sm:col-span-3">Channel</span>
            <span className="col-span-2 sm:col-span-2">Entrants</span>
            <span className="col-span-3 sm:col-span-3 text-right">Winners</span>
          </div>

          <div className="divide-y divide-surface-subtleBorder">
            {endedGiveaways.map((gw) => (
              <div
                key={gw.id}
                className="grid grid-cols-12 px-4 py-3.5 items-center transition-colors hover:bg-surface text-xs"
              >
                <div className="col-span-4 sm:col-span-4 font-heading font-semibold text-content-primary">
                  {gw.prize}
                </div>
                <div className="col-span-3 sm:col-span-3 font-mono text-content-secondary">
                  {gw.channel}
                </div>
                <div className="col-span-2 sm:col-span-2 font-mono text-content-tertiary">
                  {gw.entriesCount} entries
                </div>
                <div className="col-span-3 sm:col-span-3 text-right font-mono text-brand-teal font-semibold truncate">
                  {gw.winners?.join(", ") || "@winner"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Giveaway */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Launch New Giveaway"
      >
        <div className="space-y-4 font-sans text-xs">
          <div>
            <label className="block text-content-secondary font-heading mb-1 uppercase tracking-wider">
              Prize Name
            </label>
            <input
              type="text"
              value={newPrize}
              onChange={(e) => setNewPrize(e.target.value)}
              className="w-full bg-surface border border-surface-border text-content-primary rounded-lg p-2.5 outline-none font-heading"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-content-secondary font-heading mb-1 uppercase tracking-wider">
                Target Channel
              </label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full bg-surface border border-surface-border text-content-primary rounded-lg p-2.5 outline-none font-mono"
              >
                <option value="#giveaways"># giveaways</option>
                <option value="#announcements"># announcements</option>
                <option value="#events"># events</option>
              </select>
            </div>

            <div>
              <label className="block text-content-secondary font-heading mb-1 uppercase tracking-wider">
                Winner Count
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newWinnersCount}
                onChange={(e) => setNewWinnersCount(Number(e.target.value))}
                className="w-full bg-surface border border-surface-border text-content-primary rounded-lg p-2.5 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-content-secondary font-heading mb-1 uppercase tracking-wider">
              Duration
            </label>
            <select
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="w-full bg-surface border border-surface-border text-content-primary rounded-lg p-2.5 outline-none font-mono"
            >
              <option value="1 Hour">1 Hour</option>
              <option value="24 Hours">24 Hours</option>
              <option value="3 Days">3 Days</option>
              <option value="7 Days">7 Days</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-lg bg-surface text-content-secondary hover:text-content-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGiveaway}
              className="px-4 py-2 rounded-lg bg-brand-amber text-background font-heading font-semibold hover:brightness-110"
            >
              Launch Giveaway
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
