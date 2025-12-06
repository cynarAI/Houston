import { aiError } from "../../ai-core/errors";
import { saveWebhookUpdate } from "./task-client";

type ManusWebhookPayload = {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed";
  result?: unknown;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: { code?: string; message?: string };
};

export const handleManusWebhook = async (payload: ManusWebhookPayload) => {
  if (!payload?.id) {
    throw aiError(
      "Invalid webhook payload: missing id",
      "validation",
      "manus_api",
      false,
    );
  }
  saveWebhookUpdate(payload.id, {
    status: payload.status,
    result: payload.result,
    usage: payload.usage,
    error: payload.error,
  } as any);
  return { ok: true };
};
