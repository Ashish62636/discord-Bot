"use client";

import { useState, useCallback } from "react";
import { useGuild } from "@/hooks/use-guild";
import { useApi, type UseApiState } from "@/hooks/use-api";
import { api, ApiError } from "@/lib/api-client";

// ─── API Response Shape ───────────────────────────────────────────────────────

/** Guild config as returned by GET /api/v1/guilds/[guildId] */
export interface GuildConfigResponse {
  id: string;
  name: string;
  premium: boolean;
  config: {
    guildId: string;
    version: number;
    settings: {
      modules?: Record<string, boolean>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  } | null;
  _count: {
    members: number;
    tickets: number;
    giveaways: number;
    moderationLogs: number;
    autoModRules: number;
  };
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

const FALLBACK_CONFIG: GuildConfigResponse = {
  id: "1234567890",
  name: "GuildCraft",
  premium: true,
  config: {
    guildId: "1234567890",
    version: 1,
    settings: {
      modules: {
        automod: true,
        logging: true,
        tickets: true,
        giveaways: true,
        music: true,
        welcomer: true,
        levels: true,
        reminders: false,
        starboard: false,
        polls: true,
        reactionRoles: true,
        confessions: false,
      },
    },
  },
  _count: {
    members: 8,
    tickets: 5,
    giveaways: 3,
    moderationLogs: 6,
    autoModRules: 6,
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseGuildConfigReturn extends UseApiState<GuildConfigResponse> {
  /** Toggle a module on/off and persist via PATCH */
  toggleModule: (moduleId: string) => Promise<void>;
  /** Whether a mutation is currently in flight */
  isMutating: boolean;
}

/**
 * Fetches the full guild config (including module toggles from the JSONB
 * `settings` column) and exposes a `toggleModule` helper that PATCHes
 * the change to the API and bumps the config version.
 */
export function useGuildConfig(): UseGuildConfigReturn {
  const { apiPath } = useGuild();
  const state = useApi<GuildConfigResponse>(apiPath, FALLBACK_CONFIG);
  const [isMutating, setIsMutating] = useState(false);

  const toggleModule = useCallback(
    async (moduleId: string) => {
      if (!state.data?.config) return;

      const currentModules = state.data.config.settings.modules ?? {};
      const newValue = !currentModules[moduleId];

      // Optimistic update
      const prev = state.data;
      const optimistic: GuildConfigResponse = {
        ...prev,
        config: {
          ...prev.config!,
          settings: {
            ...prev.config!.settings,
            modules: { ...currentModules, [moduleId]: newValue },
          },
        },
      };

      // Update local state optimistically (via refetch after PATCH)
      setIsMutating(true);
      try {
        await api.patch(apiPath, {
          settings: {
            modules: { ...currentModules, [moduleId]: newValue },
          },
        });
        // Refetch to get the server-authoritative version
        await state.refetch();
      } catch (err) {
        // If PATCH fails, refetch to revert optimistic update
        console.error("[useGuildConfig] toggleModule failed:", err);
        await state.refetch();
      } finally {
        setIsMutating(false);
      }
    },
    [state.data, apiPath, state.refetch]
  );

  return { ...state, toggleModule, isMutating };
}
