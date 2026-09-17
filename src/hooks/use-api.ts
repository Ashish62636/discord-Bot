"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api, ApiError } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseApiState<T> {
  /** Fetched data, or fallback data if the API is unreachable */
  data: T | null;
  /** True while the initial or re-fetch request is in flight */
  isLoading: boolean;
  /** Non-null when the last request failed */
  error: ApiError | null;
  /** True when data came from the fallback rather than the API */
  isFallback: boolean;
  /** Imperatively re-fetch data (called after mutations) */
  refetch: () => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Generic data-fetching hook powering all domain hooks.
 *
 * - Fetches `path` on mount and whenever `path` changes.
 * - Exposes `refetch()` for imperative re-fetching after mutations.
 * - Falls back to `fallbackData` when the API is unreachable,
 *   so the dashboard always renders (useful during dev without Postgres).
 *
 * @param path      API path relative to `/api/v1`, e.g. `/guilds/123/stats`.
 *                  Pass `null` to skip fetching.
 * @param fallback  Optional data to use when the API call fails.
 */
export function useApi<T>(
  path: string | null,
  fallback?: T
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  // Ref keeps fallback stable across renders without re-triggering fetches
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const fetchData = useCallback(async () => {
    if (!path) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.get<T>(path);
      setData(result);
      setIsFallback(false);
    } catch (err) {
      const apiErr =
        err instanceof ApiError
          ? err
          : new ApiError("Network error — is the server running?", 0);
      setError(apiErr);

      // Graceful degradation: use fallback data so the UI isn't blank
      if (fallbackRef.current !== undefined) {
        setData(fallbackRef.current);
        setIsFallback(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [path]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, isFallback, refetch: fetchData };
}
