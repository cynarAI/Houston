import { aiError } from "../../ai-core/errors";
import type { AiProvider } from "../../ai-core/provider";
import type {
  AgentTaskRequest,
  AgentTaskResponse,
  ImageRequest,
  ImageResponse,
  SttRequest,
  SttResponse,
  TextRequest,
  TextResponse,
  TtsRequest,
  TtsResponse,
} from "../../ai-core/types";
import { postTask, waitForResult } from "./task-client";

const API_TIMEOUT = Number(process.env.MANUS_API_TIMEOUT_MS ?? 120_000);

const toTrace = (startedAt: number) => ({
  provider: "manus_api",
  traceId: `manus_api_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
  latencyMs: Date.now() - startedAt,
});

export class ManusApiAdapter implements AiProvider {
  id = "manus_api" as const;

  async text(request: TextRequest): Promise<TextResponse> {
    const started = Date.now();
    const task = await postTask({
      type: "text",
      payload: request,
    });
    const result = await waitForResult<{
      output: string;
      usage?: TextResponse["usage"];
    }>(task.id, request.timeoutMs ?? API_TIMEOUT);
    if (result.status !== "succeeded") {
      throw aiError("Task did not succeed", "unknown", this.id, true);
    }
    const output =
      (result.result as any)?.output ?? (result.result as any)?.content ?? "";
    return {
      output,
      usage: result.usage,
      trace: toTrace(started),
    };
  }

  async image(request: ImageRequest): Promise<ImageResponse> {
    const started = Date.now();
    const task = await postTask({
      type: "image",
      payload: request,
    });
    const result = await waitForResult<{ urls: string[] }>(
      task.id,
      request.timeoutMs ?? API_TIMEOUT,
    );
    if (result.status !== "succeeded") {
      throw aiError("Task did not succeed", "unknown", this.id, true);
    }
    return {
      urls: (result.result as any)?.urls ?? [],
      usage: result.usage,
      trace: toTrace(started),
    };
  }

  async tts(request: TtsRequest): Promise<TtsResponse> {
    const started = Date.now();
    const task = await postTask({
      type: "tts",
      payload: request,
    });
    const result = await waitForResult<{
      audioUrl?: string;
      audioBufferRef?: string;
    }>(task.id, request.timeoutMs ?? API_TIMEOUT);
    if (result.status !== "succeeded") {
      throw aiError("Task did not succeed", "unknown", this.id, true);
    }
    return {
      audioUrl: (result.result as any)?.audioUrl,
      audioBufferRef: (result.result as any)?.audioBufferRef,
      usage: result.usage,
      trace: toTrace(started),
    };
  }

  async stt(request: SttRequest): Promise<SttResponse> {
    const started = Date.now();
    const task = await postTask({
      type: "stt",
      payload: request,
    });
    const result = await waitForResult<{ text: string }>(
      task.id,
      request.timeoutMs ?? API_TIMEOUT,
    );
    if (result.status !== "succeeded") {
      throw aiError("Task did not succeed", "unknown", this.id, true);
    }
    return {
      text: (result.result as any)?.text ?? "",
      usage: result.usage,
      trace: toTrace(started),
    };
  }

  async agent(request: AgentTaskRequest): Promise<AgentTaskResponse> {
    const started = Date.now();
    const task = await postTask({
      type: "agent",
      payload: request,
      webhookUrl: request.webhookUrl,
    });
    return {
      taskId: task.id,
      status: "queued",
      trace: toTrace(started),
    };
  }
}
