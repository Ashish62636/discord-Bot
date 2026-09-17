"use client";

import { useState, useCallback } from "react";
import { useGuild } from "@/hooks/use-guild";
import { useApi, type UseApiState } from "@/hooks/use-api";
import { api } from "@/lib/api-client";
import { MOCK_TICKETS } from "@/lib/mock-data";

// ─── API Response Shape ───────────────────────────────────────────────────────

/** Ticket as returned by the Prisma model via the API */
export interface TicketApi {
  id: string;
  guildId: string;
  channelId: string | null;
  openerId: string;
  subject: string;
  status: "open" | "claimed" | "closed";
  priority: "low" | "medium" | "high";
  claimedBy: string | null;
  createdAt: string;
  closedAt: string | null;
  _count?: { messages: number };
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

/** Map mock tickets to the API shape for offline fallback */
const FALLBACK_TICKETS: TicketApi[] = MOCK_TICKETS.map((t) => ({
  id: t.id,
  guildId: "1234567890",
  channelId: null,
  openerId: t.user,
  subject: t.subject,
  status: t.status,
  priority: t.priority ?? "medium",
  claimedBy: t.claimer ?? null,
  createdAt: new Date().toISOString(),
  closedAt: t.status === "closed" ? new Date().toISOString() : null,
  _count: { messages: t.messagesCount ?? 0 },
}));

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseTicketsReturn extends UseApiState<TicketApi[]> {
  /** Claim a ticket (sets status to "claimed") via PATCH */
  claimTicket: (ticketId: string, claimedBy?: string) => Promise<void>;
  /** Close a ticket via PATCH */
  closeTicket: (ticketId: string) => Promise<void>;
  /** Whether a mutation is currently in flight */
  isMutating: boolean;
}

/**
 * Fetches tickets for the active guild and exposes
 * claim and close mutation helpers.
 *
 * All mutations hit the API then refetch to stay in sync.
 * Falls back to mock ticket data when the API is unreachable.
 */
export function useTickets(): UseTicketsReturn {
  const { apiPath } = useGuild();
  const path = `${apiPath}/tickets`;
  const state = useApi<TicketApi[]>(path, FALLBACK_TICKETS);
  const [isMutating, setIsMutating] = useState(false);

  const claimTicket = useCallback(
    async (ticketId: string, claimedBy = "radiantpeak") => {
      setIsMutating(true);
      try {
        await api.patch(`${path}/${ticketId}`, {
          status: "claimed",
          claimedBy,
        });
        await state.refetch();
      } catch (err) {
        console.error("[useTickets] claimTicket failed:", err);
        await state.refetch();
      } finally {
        setIsMutating(false);
      }
    },
    [path, state.refetch]
  );

  const closeTicket = useCallback(
    async (ticketId: string) => {
      setIsMutating(true);
      try {
        await api.patch(`${path}/${ticketId}`, {
          status: "closed",
        });
        await state.refetch();
      } catch (err) {
        console.error("[useTickets] closeTicket failed:", err);
        await state.refetch();
      } finally {
        setIsMutating(false);
      }
    },
    [path, state.refetch]
  );

  return { ...state, claimTicket, closeTicket, isMutating };
}
