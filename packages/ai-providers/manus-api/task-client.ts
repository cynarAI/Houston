import { aiError } from "../../ai-core/errors";
import type { TextResponse } from "../../ai-core/types";

type TaskStatus = "queued" | "running" | "succeeded" | "failed";

type TaskResult =
  | {
      status: "succeeded";
      result: unknown;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
    }
  | { status: "failed"; error?: { code?: string; message?: string } }
  | { status: "running" | "queued" };

type TaskResponse = { id: string; status: TaskStatus };

const BASE_URL =
  process.env.MANUS_API_BASE?.replace(/\/$/, "") || "https://api.manus.ai";
const API_TIMEOUT = Number(process.env.MANUS_API_TIMEOUT_MS ?? 120_000);

const taskCache = new Map<string, TaskResult>();

const headers = () => {
  if (!process.env.MANUS_API_KEY) {
    throw aiError("MANUS_API_KEY missing", "auth", "manus_api", false);
  }
  return {
    "content-type": "application/json",
    authorization: `Bearer ${process.env.MANUS_API_KEY}`,
  };
};

export const postTask = async (
  body: Record<string, unknown>,
): Promise<TaskResponse> => {
  const res = await fetch(`${BASE_URL}/v1/tasks`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw aiError(
      `Manus API create task failed ${res.status}: ${text}`,
      res.status >= 500 ? "unavailable" : "unknown",
      "manus_api",
      res.status >= 500,
    );
  }
  const json = (await res.json()) as TaskResponse;
  return json;
};

export const fetchTask = async (id: string): Promise<TaskResult> => {
  const res = await fetch(`${BASE_URL}/v1/tasks/${id}`, {
    method: "GET",
    headers: headers(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw aiError(
      `Manus API fetch task failed ${res.status}: ${text}`,
      res.status >= 500 ? "unavailable" : "unknown",
      "manus_api",
      res.status >= 500,
    );
  }

  const json = (await res.json()) as TaskResult;
  return json;
};

export const waitForResult = async <T = unknown>(
  id: string,
  timeoutMs: number = API_TIMEOUT,
  pollIntervalMs = 2_000,
): Promise<{
  status: TaskStatus;
  result?: T;
  usage?: TextResponse["usage"];
}> => {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const cached = taskCache.get(id);
    if (cached) {
      if (cached.status === "succeeded") {
        return {
          status: "succeeded",
          result: cached.result as T,
          usage: cached.usage,
        };
      }
      if (cached.status === "failed") {
        throw aiError(
          cached.error?.message ?? "Task failed",
          "unknown",
          "manus_api",
          false,
        );
      }
    }

    const current = await fetchTask(id);
    if (current.status === "succeeded") {
      taskCache.set(id, current);
      return {
        status: "succeeded",
        result: (current as any).result as T,
        usage: (current as any).usage,
      };
    }
    if (current.status === "failed") {
      taskCache.set(id, current);
      throw aiError(
        (current as any).error?.message ?? "Task failed",
        "unknown",
        "manus_api",
        false,
      );
    }

    await sleep(pollIntervalMs);
  }
  throw aiError("Task timed out", "timeout", "manus_api", true);
};

export const saveWebhookUpdate = (id: string, payload: TaskResult) => {
  taskCache.set(id, payload);
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
