"use client";

import React, { createContext, useContext, useMemo } from "react";
import { DEV_GUILD_ID } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuildContextValue {
  /** Discord guild snowflake ID */
  guildId: string;
  /** Display name for the current guild */
  guildName: string;
  /** Base API path for guild-scoped endpoints */
  apiPath: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GuildContext = createContext<GuildContextValue>({
  guildId: DEV_GUILD_ID,
  guildName: "GuildCraft",
  apiPath: `/guilds/${DEV_GUILD_ID}`,
});

/**
 * Returns the current guild context.
 *
 * `guildId` and `apiPath` are used by data-fetching hooks to scope
 * all API calls to the active guild. Once OAuth2 is wired, the
 * GuildProvider will receive the guild selected by the user.
 */
export function useGuild() {
  return useContext(GuildContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface GuildProviderProps {
  children: React.ReactNode;
  guildId?: string;
  guildName?: string;
}

/**
 * Provides guild scope to the entire dashboard.
 *
 * Currently hardcoded to the dev-seeded guild.
 * When Discord OAuth2 is implemented, this will accept the guild
 * chosen from the user's guild list after login.
 */
export function GuildProvider({
  children,
  guildId = DEV_GUILD_ID,
  guildName = "GuildCraft",
}: GuildProviderProps) {
  const value = useMemo<GuildContextValue>(
    () => ({
      guildId,
      guildName,
      apiPath: `/guilds/${guildId}`,
    }),
    [guildId, guildName]
  );

  return (
    <GuildContext.Provider value={value}>{children}</GuildContext.Provider>
  );
}
