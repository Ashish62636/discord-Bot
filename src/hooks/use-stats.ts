"use client";

import { useGuild } from "@/hooks/use-guild";
import { useApi } from "@/hooks/use-api";

// ─── API Response Shape ───────────────────────────────────────────────────────

/** Matches the shape returned by GET /api/v1/guilds/[guildId]/stats */
export interface GuildStats {
  members: { total: number };
  tickets: { open: number };
  moderation: { last24h: number; last7d: number };
  giveaways: { active: number };
  automod: { enabledRules: number };
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

const FALLBACK_STATS: GuildStats = {
  members: { total: 4218 },
  tickets: { open: 9 },
  moderation: { last24h: 47, last7d: 132 },
  giveaways: { active: 2 },
  automod: { enabledRules: 5 },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Fetches aggregated guild statistics for the Overview page stat cards.
 * Falls back to demo numbers when the API is unreachable.
 */
export function useStats() {
  const { apiPath } = useGuild();
  return useApi<GuildStats>(`${apiPath}/stats`, FALLBACK_STATS);
}
