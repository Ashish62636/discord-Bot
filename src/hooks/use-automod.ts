"use client";

import { useState, useCallback } from "react";
import { useGuild } from "@/hooks/use-guild";
import { useApi, type UseApiState } from "@/hooks/use-api";
import { api } from "@/lib/api-client";
import { MOCK_AUTOMOD_RULES } from "@/lib/mock-data";

// ─── API Response Shape ───────────────────────────────────────────────────────

/** Auto-mod rule as returned by the API (Prisma model shape) */
export interface AutoModRuleApi {
  id: string;
  guildId: string;
  trigger: string;
  threshold: string;
  action: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  createdAt: string;
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

/** Map mock data (numeric IDs) to the API shape (string IDs) */
const FALLBACK_RULES: AutoModRuleApi[] = MOCK_AUTOMOD_RULES.map((r) => ({
  id: String(r.id),
  guildId: "1234567890",
  trigger: r.trigger,
  threshold: r.threshold,
  action: r.action,
  enabled: r.enabled,
  settings: {},
  createdAt: new Date().toISOString(),
}));

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseAutoModReturn extends UseApiState<AutoModRuleApi[]> {
  /** Toggle a rule's enabled state via PATCH */
  toggleRule: (ruleId: string) => Promise<void>;
  /** Delete a rule via DELETE */
  deleteRule: (ruleId: string) => Promise<void>;
  /** Create a new rule via POST */
  createRule: (rule: {
    trigger: string;
    threshold: string;
    action: string;
  }) => Promise<void>;
  /** Whether a mutation is currently in flight */
  isMutating: boolean;
}

/**
 * Fetches auto-mod rules for the active guild and exposes
 * toggle, delete, and create mutation helpers.
 *
 * All mutations hit the API then refetch the list to stay in sync
 * with the server. Falls back to mock rules when offline.
 */
export function useAutoMod(): UseAutoModReturn {
  const { apiPath } = useGuild();
  const path = `${apiPath}/automod`;
  const state = useApi<AutoModRuleApi[]>(path, FALLBACK_RULES);
  const [isMutating, setIsMutating] = useState(false);

  const toggleRule = useCallback(
    async (ruleId: string) => {
      const rule = state.data?.find((r) => r.id === ruleId);
      if (!rule) return;

      setIsMutating(true);
      try {
        await api.patch(`${path}/${ruleId}`, { enabled: !rule.enabled });
        await state.refetch();
      } catch (err) {
        console.error("[useAutoMod] toggleRule failed:", err);
        await state.refetch();
      } finally {
        setIsMutating(false);
      }
    },
    [path, state.data, state.refetch]
  );

  const deleteRule = useCallback(
    async (ruleId: string) => {
      setIsMutating(true);
      try {
        await api.delete(`${path}/${ruleId}`);
        await state.refetch();
      } catch (err) {
        console.error("[useAutoMod] deleteRule failed:", err);
        await state.refetch();
      } finally {
        setIsMutating(false);
      }
    },
    [path, state.refetch]
  );

  const createRule = useCallback(
    async (rule: { trigger: string; threshold: string; action: string }) => {
      setIsMutating(true);
      try {
        await api.post(path, rule);
        await state.refetch();
      } catch (err) {
        console.error("[useAutoMod] createRule failed:", err);
        await state.refetch();
      } finally {
        setIsMutating(false);
      }
    },
    [path, state.refetch]
  );

  return { ...state, toggleRule, deleteRule, createRule, isMutating };
}
