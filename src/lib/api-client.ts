/**
 * Typed fetch client for the /api/v1 endpoints.
 *
 * Every backend route returns a standard envelope:
 *   { success: true,  data: T }
 *   { success: false, error: string, details?: unknown }
 *
 * `apiFetch` unwraps the envelope and throws `ApiError` on failure,
 * so consumers only deal with the typed `data` value.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** Standard API response envelope (mirrors api-helpers.ts server-side) */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

/**
 * Dev guild ID — matches the seeded guild in prisma/seed.ts.
 * Replaced by the real guild from Discord OAuth2 once auth is wired.
 */
export const DEV_GUILD_ID = "1234567890";

/** Base path for versioned API routes */
const API_BASE = "/api/v1";

// ─── Error Class ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// ─── Core Fetch ───────────────────────────────────────────────────────────────

/**
 * Typed fetch wrapper that unwraps the API envelope.
 * Throws `ApiError` on non-success responses or network failures.
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  // Attempt to parse the response body regardless of status code
  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new ApiError(
      `Unexpected response from ${url} (status ${res.status})`,
      res.status
    );
  }

  if (!res.ok || !json.success) {
    throw new ApiError(
      json.error ?? `Request failed with status ${res.status}`,
      res.status,
      json.details
    );
  }

  return json.data as T;
}

// ─── Convenience Methods ──────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),

  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    apiFetch<T>(path, { method: "DELETE" }),
};
