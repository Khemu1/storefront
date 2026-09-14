import { IAPIError } from "./api";

/**
 * Extracts a flat field->message map from an API error's `errors` payload.
 * Boolean values (e.g. { phone: true }) fall back to a supplied message
 * since there's no string to show the user directly.
 */
export function getFieldErrors(
  error: unknown,
  fallbackMessages: Record<string, string> = {},
): Record<string, string> {
  const apiError = error as Partial<IAPIError> | undefined;

  if (!apiError?.errors) return {};

  return Object.entries(apiError.errors).reduce<Record<string, string>>(
    (acc, [field, value]) => {
      if (typeof value === "string") {
        acc[field] = value;
      } else if (value === true) {
        acc[field] = fallbackMessages[field] ?? `Invalid ${field}`;
      }
      return acc;
    },
    {},
  );
}

/** Best-effort human-readable message for a toast/banner. */
export function getErrorMessage(
  error: unknown,
  fallback = "Please try again",
): string {
  const apiError = error as Partial<IAPIError> | undefined;
  return apiError?.message || fallback;
}

/** True if the error is safe to show verbatim to the user (per `safe` flag). */
export function isSafeError(error: unknown): boolean {
  return Boolean((error as Partial<IAPIError> | undefined)?.safe);
}
