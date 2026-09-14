import { useCustomerAuthStore } from "@/stores/customer-auth-store";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAPIError {
  message: string;
  statusCode: number;
  status: string;
  safe: boolean;
  type: string;
  details?: string;
  errors?: Record<string, string | boolean>;
}

export function isAPIError(error: unknown): error is IAPIError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "statusCode" in error &&
    "status" in error &&
    "type" in error
  );
}

interface BannedInfo {
  reason: string;
  message: string;
}

/**
 * Detect the "banned" response shape coming from the server.
 *
 * Server payload:
 * {
 *   status: "fail",
 *   statusCode: 403,
 *   message: "Your account has been banned: <reason>",
 *   errors: { banned: true, reason: "..." }
 * }
 */
function isBannedResponse(status: number, parsed: Partial<IAPIError>): boolean {
  if (status !== 403) return false;
  const banned = parsed.errors?.banned;
  return banned === true || banned === "true";
}

const NO_REASON_VALUES = new Set(["", "no reason", "n/a", "none", "unknown"]);

function cleanReason(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (NO_REASON_VALUES.has(trimmed.toLowerCase())) return null;
  return trimmed;
}

function extractBannedInfo(
  parsed: Partial<IAPIError>,
  fallbackMessage: string,
): BannedInfo {
  const errors = parsed.errors ?? {};

  // Server sends: errors: { banned: true, reason: "no reason" }
  const rawReason = typeof errors.reason === "string" ? errors.reason : "";

  // Server message is: "Your account has been banned: <reason>"
  const message = parsed.message ?? fallbackMessage;
  const prefix = "Your account has been banned:";

  let reason = cleanReason(rawReason);
  if (!reason && message.startsWith(prefix)) {
    reason = cleanReason(message.slice(prefix.length));
  }

  return {
    reason: reason ?? "No reason provided",
    message,
  };
}

/**
 * Handle a banned account:
 *  - persist reason + message to Zustand (for the /banned page)
 *  - mirror to sessionStorage (survives hard reload)
 *  - clear the customer's auth state (stale token shouldn't be reused)
 *  - redirect to /banned (unless already there)
 *
 * Uses `window.location.replace` so the back button doesn't loop
 * back into an authenticated page.
 */
function handleBannedRedirect(info: BannedInfo): void {
  if (typeof window === "undefined") return;

  // Avoid redirect loops
  if (window.location.pathname === "/banned") return;

  // 1. Store reason + banned flag in Zustand so /banned can read it
  try {
    useCustomerAuthStore.getState().setBanned(info.reason, info.message);
  } catch {
    // never block the redirect on this
  }

  // 2. Mirror to sessionStorage as a hard-reload fallback
  try {
    sessionStorage.setItem("banned_info", JSON.stringify(info));
  } catch {
    // sessionStorage may be unavailable (SSR, private mode)
  }

  // 3. Clear the stale token so no further requests carry it
  //    (setBanned already clears `user` in the store, but we call
  //    logout here too as a belt-and-braces safeguard for older stores
  //    that don't null out the user inside setBanned.)
  try {
    const state = useCustomerAuthStore.getState();
    if (state.user) state.logout();
  } catch {
    // ignore
  }

  window.location.replace("/banned");
}

/**
 * Handle an unauthorized (401) response:
 *  - clear the customer auth state (token is invalid/expired)
 *  - send the user home
 *
 * Uses `window.location.replace` so the back button doesn't
 * re-trigger the failing request.
 */
function handleUnauthorizedRedirect(): void {
  if (typeof window === "undefined") return;

  // Avoid redirect loops if we're already home
  if (window.location.pathname === "/") return;

  try {
    useCustomerAuthStore.getState().logout();
  } catch {
    // never block the redirect on this
  }

  window.location.replace("/");
}

async function handleErrorResponse(response: Response): Promise<never> {
  let parsedError: Partial<IAPIError> = {};

  try {
    parsedError = await response.json();
  } catch {}

  if (isBannedResponse(response.status, parsedError)) {
    const info = extractBannedInfo(parsedError, "Your account has been banned");

    handleBannedRedirect(info);

    throw {
      message: info.message,
      statusCode: 403,
      status: "fail",
      safe: true,
      type: "banned",
      errors: parsedError.errors,
    } satisfies IAPIError;
  }
  // ────────────────────────────────────────────────────────────────────

  // ── Unauthorized short-circuit ──────────────────────────────────────
  if (response.status === 401) {
    handleUnauthorizedRedirect();

    throw {
      message: parsedError.message ?? "Your session has expired",
      statusCode: 401,
      status: "fail",
      safe: true,
      type: "unauthorized",
      errors: parsedError.errors,
    } satisfies IAPIError;
  }
  // ────────────────────────────────────────────────────────────────────

  const errorObject: IAPIError = {
    message: parsedError.message || "An unexpected error occurred",
    statusCode: parsedError.statusCode || response.status,
    status: parsedError.status || "error",
    safe: parsedError.safe ?? false,
    type: parsedError.type || "unknown",
    details: parsedError.details,
    errors: parsedError.errors,
  };

  throw errorObject;
}
export async function storefrontFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const store = useCustomerAuthStore.getState();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Platform-slug": getStoreSlug(),
    ...(options.headers as Record<string, string>),
  };

  if (store?.user?.token) {
    headers.Authorization = `Bearer ${store.user.token}`;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      ...options,
      headers,
      ...(options.signal ? { signal: options.signal } : {}),
    },
  );

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

function getStoreSlug(): string {
  const envSlug = process.env.NEXT_PUBLIC_STORE_SLUG;
  if (envSlug) return envSlug;

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "fashion-store";
    }
    if (parts.length >= 3) {
      return parts[0];
    }
  }

  return "fashion-store";
}

// Convenience methods
export const apiFetch = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    storefrontFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    storefrontFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    storefrontFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: any, options?: RequestInit) =>
    storefrontFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    storefrontFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
