"use client";

import React, { useState } from "react";
import {
  Ticket,
  Eye,
  CheckCircle2,
  UserCheck,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { TableRowSkeleton } from "@/components/ui/Skeletons";
import { useTickets, type TicketApi } from "@/hooks/use-tickets";
import { cn, formatDate } from "@/lib/utils";

export default function TicketsPage() {
  const {
    data: tickets,
    isLoading,
    error,
    isFallback,
    isMutating,
    refetch,
    claimTicket,
    closeTicket,
  } = useTickets();

  const [filter, setFilter] = useState<"all" | "open" | "claimed" | "closed">(
    "all"
  );
  const [selectedTicket, setSelectedTicket] = useState<TicketApi | null>(null);
  const [replyInput, setReplyInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const ticketsList = tickets ?? [];

  const filteredTickets = ticketsList.filter(
    (t) => filter === "all" || t.status === filter
  );

  const handleClaim = async (id: string) => {
    await claimTicket(id);
    showToast(`Ticket claimed by @radiantpeak`);
  };

  const handleClose = async (id: string) => {
    await closeTicket(id);
    showToast(`Ticket has been closed`);
    if (selectedTicket?.id === id) {
      setSelectedTicket((prev) =>
        prev ? { ...prev, status: "closed" } : null
      );
    }
  };

  const handleSendReply = () => {
    if (!replyInput.trim() || !selectedTicket) return;
    showToast(`Staff response posted to Ticket #${selectedTicket.id.slice(0, 6)}`);
    setReplyInput("");
  };

  const statusVariant: Record<string, "amber" | "teal" | "muted"> = {
    open: "amber",
    claimed: "teal",
    closed: "muted",
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

      {/* Fallback Banner */}
      {(error || isFallback) && (
        <ErrorBanner
          message={
            error?.message ?? "Displaying cached demo data — API unreachable"
          }
          isFallback={isFallback}
          onRetry={refetch}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl obsidian-panel px-5 py-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-content-primary flex items-center gap-2">
            <Ticket className="text-brand-amber" size={24} />
            Support Ticket Center
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 font-sans">
            Manage user inquiries, technical support tickets, and staff
            assignments.
          </p>
        </div>

        {/* Filter Tab Group */}
        <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-surface-border">
          {(["all", "open", "claimed", "closed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-heading font-medium transition-colors capitalize",
                filter === f
                  ? "bg-brand-amber text-background shadow-sm"
                  : "text-content-secondary hover:text-content-primary hover:bg-surface"
              )}
            >
              {f} (
              {f === "all"
                ? ticketsList.length
                : ticketsList.filter((t) => t.status === f).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-xl overflow-hidden obsidian-panel">
        <div className="grid grid-cols-12 px-4 py-3 text-[10px] uppercase tracking-widest font-mono text-content-tertiary bg-card-subtle border-b border-surface-border">
          <span className="col-span-2 sm:col-span-1">ID</span>
          <span className="col-span-3 sm:col-span-2">Opener</span>
          <span className="col-span-4 sm:col-span-4">Subject</span>
          <span className="col-span-3 sm:col-span-2">Status</span>
          <span className="hidden sm:block sm:col-span-2">Claimed By</span>
          <span className="col-span-3 sm:col-span-1 text-right">Actions</span>
        </div>

        <div className="divide-y divide-surface-subtleBorder">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))
          ) : filteredTickets.length === 0 ? (
            <div className="px-4 py-8 text-center text-content-secondary text-sm font-sans">
              No tickets found for this filter.
            </div>
          ) : (
            filteredTickets.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-12 px-4 py-3.5 items-center transition-colors hover:bg-surface"
              >
                <div className="col-span-2 sm:col-span-1 font-mono text-xs text-content-tertiary font-bold truncate">
                  {t.id.slice(0, 6)}
                </div>

                <div className="col-span-3 sm:col-span-2">
                  <span className="text-xs font-sans text-content-primary font-medium block truncate">
                    @{t.openerId}
                  </span>
                  <span className="text-[10px] font-mono text-content-tertiary">
                    {formatDate(t.createdAt)}
                  </span>
                </div>

                <div className="col-span-4 sm:col-span-4 pr-2 truncate text-xs font-sans text-content-secondary">
                  {t.subject}
                </div>

                <div className="col-span-3 sm:col-span-2">
                  <Badge label={t.status} variant={statusVariant[t.status]} />
                </div>

                <div className="hidden sm:block sm:col-span-2 text-xs font-sans text-content-secondary">
                  {t.claimedBy ? (
                    `@${t.claimedBy}`
                  ) : (
                    <span className="text-content-tertiary">—</span>
                  )}
                </div>

                <div className="col-span-3 sm:col-span-1 flex items-center justify-end gap-1.5">
                  {t.status === "open" && (
                    <button
                      onClick={() => handleClaim(t.id)}
                      disabled={isMutating}
                      className="px-2 py-1 rounded bg-brand-amber/15 text-brand-amber hover:bg-brand-amber/25 text-[11px] font-heading font-medium transition-colors disabled:opacity-50"
                    >
                      Claim
                    </button>
                  )}
                  {t.status === "claimed" && (
                    <button
                      onClick={() => handleClose(t.id)}
                      disabled={isMutating}
                      className="px-2 py-1 rounded bg-brand-red/15 text-brand-red hover:bg-brand-red/25 text-[11px] font-heading font-medium transition-colors disabled:opacity-50"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="p-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface transition-colors"
                    title="View details & transcript"
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ticket Transcript Detail Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Support Ticket #${selectedTicket.id.slice(0, 6)}`}
          maxWidth="lg"
        >
          <div className="space-y-4 font-sans text-xs">
            {/* Metadata Bar */}
            <div className="p-3 rounded-lg bg-surface border border-surface-border flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-content-secondary">Opener: </span>
                <span className="font-semibold text-content-primary">
                  @{selectedTicket.openerId}
                </span>
                <span className="text-content-tertiary mx-1.5">·</span>
                <span className="text-content-secondary">Opened: </span>
                <span className="font-mono text-content-primary">
                  {formatDate(selectedTicket.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  label={selectedTicket.status}
                  variant={statusVariant[selectedTicket.status]}
                />
                {selectedTicket.claimedBy && (
                  <span className="text-brand-teal font-mono text-[11px] flex items-center gap-1">
                    <UserCheck size={13} />@{selectedTicket.claimedBy}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-content-primary text-sm mb-1">
                Subject: {selectedTicket.subject}
              </h3>
              {selectedTicket._count && (
                <p className="text-content-tertiary font-mono text-[10px]">
                  {selectedTicket._count.messages} message
                  {selectedTicket._count.messages !== 1 ? "s" : ""} in
                  transcript
                </p>
              )}
            </div>

            {/* Transcript Simulator */}
            <div className="border border-surface-border rounded-xl p-3 bg-card-subtle space-y-3 max-h-64 overflow-y-auto">
              <div className="bg-surface p-2.5 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-content-primary">
                    @{selectedTicket.openerId}
                  </span>
                  <span className="text-content-tertiary font-mono">
                    {formatDate(selectedTicket.createdAt)}
                  </span>
                </div>
                <p className="text-content-secondary leading-relaxed">
                  Hi staff, I encountered an issue where{" "}
                  {selectedTicket.subject.toLowerCase()}. Could someone take a
                  look into this?
                </p>
              </div>

              {selectedTicket.status !== "open" && (
                <div className="bg-brand-amber/10 border border-brand-amber/20 p-2.5 rounded-lg space-y-1 ml-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-brand-amber">
                      @{selectedTicket.claimedBy || "radiantpeak"} (Staff)
                    </span>
                    <span className="text-content-tertiary font-mono">
                      14:02
                    </span>
                  </div>
                  <p className="text-content-primary leading-relaxed">
                    Hello @{selectedTicket.openerId}, I have claimed your ticket
                    and verified your account permissions in database.
                  </p>
                </div>
              )}
            </div>

            {/* Staff Reply Box */}
            {selectedTicket.status !== "closed" ? (
              <div className="space-y-2 pt-2 border-t border-surface-border">
                <label className="block font-heading uppercase text-content-secondary tracking-wider">
                  Post Staff Response
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type reply to user..."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                    className="flex-1 px-3 py-2 rounded-lg obsidian-input border text-content-primary outline-none"
                  />
                  <button
                    onClick={handleSendReply}
                    className="px-4 py-2 rounded-lg bg-brand-amber text-background font-heading font-semibold hover:brightness-110"
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-surface-muted text-content-tertiary font-mono text-center flex items-center justify-center gap-2">
                <Lock size={14} />
                <span>This ticket is closed and archived.</span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
