"use client";

import { useState, useCallback } from "react";
import { useGuild } from "@/hooks/use-guild";
import { useApi, type UseApiState } from "@/hooks/use-api";
import { api } from "@/lib/api-client";
import { MOCK_MOD_LOGS, MOCK_ACTIVITY_LOGS } from "@/lib/mock-data";

// ─── API Response Shapes ──────────────────────────────────────────────────────

/** Moderation log entry as returned by the Prisma model */
export interface ModLogApi {
  id: string;
  guildId: string;
  actorId: string;
  targetId: string;
  action: string;
  reason: string | null;
  severity: "low" | "medium" | "high";
  createdAt: string;
}

/** Activity (audit) log entry as returned by the Prisma model */
export interface ActivityLogApi {
  id: string;
  guildId: string;
  actorId: string;
  action: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

/** Paginated response wrapper from the logs API */
export interface LogsResponse<T> {
  logs: T[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
    limit: number;
  };
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

const FALLBACK_MOD_LOGS: LogsResponse<ModLogApi> = {
  logs: MOCK_MOD_LOGS.map((l, i) => ({
    id: `fallback-mod-${i}`,
    guildId: "1234567890",
    actorId: l.mod,
    targetId: l.target,
    action: l.action,
    reason: l.reason,
    severity: l.severity,
    createdAt: new Date().toISOString(),
  })),
  pagination: { hasMore: false, nextCursor: null, limit: 50 },
};

const FALLBACK_ACTIVITY_LOGS: LogsResponse<ActivityLogApi> = {
  logs: MOCK_ACTIVITY_LOGS.map((l, i) => ({
    id: `fallback-act-${i}`,
    guildId: "1234567890",
    actorId: l.user,
    action: l.event,
    metadata: { channel: l.channel },
    createdAt: new Date().toISOString(),
  })),
  pagination: { hasMore: false, nextCursor: null, limit: 50 },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseModLogsReturn extends UseApiState<LogsResponse<ModLogApi>> {
  /** Load the next page of results (cursor-based) */
  loadMore: () => Promise<void>;
  /** Whether a load-more request is in flight */
  isLoadingMore: boolean;
}

/**
 * Fetches moderation logs for the active guild with optional
 * search filtering and cursor-based pagination.
 *
 * Falls back to mock mod-log data when offline.
 */
export function useModLogs(search = ""): UseModLogsReturn {
  const { apiPath } = useGuild();
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const path = `${apiPath}/logs?type=moderation${searchParam}`;
  const state = useApi<LogsResponse<ModLogApi>>(path, FALLBACK_MOD_LOGS);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    const cursor = state.data?.pagination.nextCursor;
    if (!cursor || !state.data?.pagination.hasMore) return;

    setIsLoadingMore(true);
    try {
      const next = await api.get<LogsResponse<ModLogApi>>(
        `${apiPath}/logs?type=moderation${searchParam}&cursor=${cursor}`
      );
      // Append new logs to existing data
      state.data.logs.push(...next.logs);
      state.data.pagination = next.pagination;
    } catch (err) {
      console.error("[useModLogs] loadMore failed:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [apiPath, searchParam, state.data]);

  return { ...state, loadMore, isLoadingMore };
}

// ─── Activity Logs Hook ───────────────────────────────────────────────────────

export interface UseActivityLogsReturn
  extends UseApiState<LogsResponse<ActivityLogApi>> {
  /** Load the next page of results */
  loadMore: () => Promise<void>;
  /** Whether a load-more request is in flight */
  isLoadingMore: boolean;
}

/**
 * Fetches activity (audit) logs for the active guild with optional
 * search filtering and cursor-based pagination.
 *
 * Falls back to mock activity-log data when offline.
 */
export function useActivityLogs(search = ""): UseActivityLogsReturn {
  const { apiPath } = useGuild();
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const path = `${apiPath}/logs?type=activity${searchParam}`;
  const state = useApi<LogsResponse<ActivityLogApi>>(
    path,
    FALLBACK_ACTIVITY_LOGS
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    const cursor = state.data?.pagination.nextCursor;
    if (!cursor || !state.data?.pagination.hasMore) return;

    setIsLoadingMore(true);
    try {
      const next = await api.get<LogsResponse<ActivityLogApi>>(
        `${apiPath}/logs?type=activity${searchParam}&cursor=${cursor}`
      );
      state.data.logs.push(...next.logs);
      state.data.pagination = next.pagination;
    } catch (err) {
      console.error("[useActivityLogs] loadMore failed:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [apiPath, searchParam, state.data]);

  return { ...state, loadMore, isLoadingMore };
}
