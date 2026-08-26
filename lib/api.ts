import { useCustomerAuthStore } from "@/stores/customer-auth-store";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAPIError {
  message: string;
  statusCode: number;
  status: string;
  safe: boolean;
  type: string;
  details?: string;
  errors?: Record<string, string>;
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

async function handleErrorResponse(response: Response): Promise<never> {
  let parsedError: Partial<IAPIError> = {};

  try {
    parsedError = await response.json();
  } catch {
    // Response body wasn't JSON
  }

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

/**
 * Storefront API fetch - no auth, but includes store slug
 */
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
    headers.Authorization = `Bearer ${store?.user?.token}`;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      ...options,
      headers,
      // Signal is already in options, but ensure it's passed
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

/**
 * Get store slug from subdomain or query param (dev)
 */
function getStoreSlug(): string {
  // Get slug from environment variable
  const envSlug = process.env.NEXT_PUBLIC_STORE_SLUG;

  if (envSlug) {
    return envSlug;
  }

  // Fallback for production - extract from subdomain
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    // Handle localhost
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

  delete: <T>(endpoint: string, options?: RequestInit) =>
    storefrontFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
