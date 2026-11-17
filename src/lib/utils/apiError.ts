import axios, { AxiosError } from "axios";

type ApiErrorPayload = {
  message?: unknown;
  error?: unknown;
  errors?: unknown;
  data?: unknown;
  success?: boolean;
};

const TECHNICAL_MESSAGE_PATTERNS = [
  /^request failed with status code \d+$/i,
  /^network error$/i,
  /^timeout of \d+ms exceeded$/i,
  /^axioserror:/i,
];

function isTechnicalMessage(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed) return true;
  if (/^\d{3}$/.test(trimmed)) return true;
  return TECHNICAL_MESSAGE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function normalizeMessage(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (Array.isArray(value)) {
    const messages = value
      .map((item) => normalizeMessage(item))
      .filter((item): item is string => Boolean(item));
    return messages.length > 0 ? messages.join(", ") : null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return (
      normalizeMessage(record.message) ||
      normalizeMessage(record.error) ||
      normalizeMessage(record.msg) ||
      null
    );
  }

  return null;
}

function extractFromPayload(payload: unknown): string | null {
  if (payload == null) return null;

  if (typeof payload === "string") {
    return normalizeMessage(payload);
  }

  if (typeof payload !== "object") return null;

  const data = payload as ApiErrorPayload;

  return (
    normalizeMessage(data.message) ||
    normalizeMessage(data.error) ||
    normalizeMessage(data.errors) ||
    extractFromPayload(data.data)
  );
}

function getStatusFallback(status?: number): string | null {
  switch (status) {
    case 400:
      return "Invalid request. Please check your input and try again.";
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested item was not found.";
    case 409:
      return "This action conflicts with existing data.";
    case 413:
      return "The uploaded file is too large.";
    case 422:
      return "Some fields are invalid. Please review and try again.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return "Something went wrong on the server. Please try again later.";
    case 503:
      return "The service is temporarily unavailable. Please try again later.";
    default:
      return null;
  }
}

/**
 * Extract a user-friendly message from axios / API / thunk errors.
 * Avoids showing technical messages like "Request failed with status code 404".
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (typeof error === "string") {
    const message = error.trim();
    if (message && !isTechnicalMessage(message)) return message;
    return fallback;
  }

  if (axios.isAxiosError(error)) {
    const payloadMessage = extractFromPayload(error.response?.data);
    if (payloadMessage && !isTechnicalMessage(payloadMessage)) {
      return payloadMessage;
    }

    const statusFallback = getStatusFallback(error.response?.status);
    if (statusFallback) return statusFallback;

    const axiosMessage = error.message?.trim();
    if (axiosMessage && !isTechnicalMessage(axiosMessage)) {
      return axiosMessage;
    }

    return fallback;
  }

  if (error instanceof Error) {
    const message = error.message.trim();
    if (message && !isTechnicalMessage(message)) return message;
  }

  return fallback;
}

/**
 * Extract a user-friendly success message from API responses when available.
 */
export function getApiSuccessMessage(
  data: unknown,
  fallback: string
): string {
  const message = extractFromPayload(data);
  return message && !isTechnicalMessage(message) ? message : fallback;
}

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

export type ApiFieldError = {
  path: string;
  msg: string;
  type?: string;
  location?: string;
};

function getErrorPayload(error: unknown): unknown {
  if (axios.isAxiosError(error)) return error.response?.data;
  return error;
}

/**
 * Map backend validation errors (`errors[].path` / `errors[].msg`) onto form paths.
 * Example path: `contacts[0].person_name` → `contacts.0.person_name`
 */
export function getApiFieldErrors(error: unknown): ApiFieldError[] {
  const payload = getErrorPayload(error);
  if (!payload || typeof payload !== "object") return [];

  const errors = (payload as ApiErrorPayload).errors;
  if (!Array.isArray(errors)) return [];

  return errors.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const path = typeof record.path === "string" ? record.path.trim() : "";
    const msg =
      (typeof record.msg === "string" && record.msg.trim()) ||
      (typeof record.message === "string" && record.message.trim()) ||
      "";
    if (!path || !msg) return [];
    return [
      {
        path,
        msg,
        type: typeof record.type === "string" ? record.type : undefined,
        location: typeof record.location === "string" ? record.location : undefined,
      },
    ];
  });
}

export function toFormErrorPath(apiPath: string): string {
  return apiPath.replace(/\[(\d+)\]/g, ".$1");
}
