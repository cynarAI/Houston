import type { AiError, AiErrorCode } from "./types";

const retryableCodes: AiErrorCode[] = ["timeout", "unavailable", "quota"];

export const aiError = (
  message: string,
  code: AiErrorCode = "unknown",
  provider?: string,
  retryable = retryableCodes.includes(code),
): AiError => {
  const error = new Error(message) as AiError;
  error.code = code;
  error.provider = provider;
  error.retryable = retryable;
  return error;
};

export const isRetryable = (error: unknown): error is AiError => {
  if (!error || typeof error !== "object") return false;
  const candidate = error as Partial<AiError>;
  return candidate.retryable === true;
};
