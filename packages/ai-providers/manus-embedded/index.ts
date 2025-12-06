import { aiError } from "../../ai-core/errors";
import type { AiProvider } from "../../ai-core/provider";
import type {
  ImageRequest,
  ImageResponse,
  SttRequest,
  SttResponse,
  TextRequest,
  TextResponse,
  TtsRequest,
  TtsResponse,
} from "../../ai-core/types";

const EMBEDDED_TIMEOUT_MS = Number(process.env.EMBEDDED_TIMEOUT_MS ?? 120_000);

const normalizeMessages = (messages: TextRequest["messages"]) =>
  messages.map((message) => ({
    role: message.role,
    content: message.content,
    name: message.name,
    tool_call_id: message.tool_call_id,
  }));

const resolveUrl = (path: string) => {
  const base =
    process.env.BUILT_IN_FORGE_API_URL &&
    process.env.BUILT_IN_FORGE_API_URL.length > 0
      ? process.env.BUILT_IN_FORGE_API_URL.replace(/\/$/, "")
      : "https://forge.manus.im";
  return `${base}${path}`;
};

const withTimeout = async <T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  timeoutMs: number,
) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
};

const createTrace = (provider: string, startedAt: number) => ({
  provider,
  traceId: `trace_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
  latencyMs: Date.now() - startedAt,
});

export class ManusEmbeddedAdapter implements AiProvider {
  id = "embedded" as const;

  async text(request: TextRequest): Promise<TextResponse> {
    const startedAt = Date.now();
    if (!process.env.BUILT_IN_FORGE_API_KEY) {
      throw aiError("BUILT_IN_FORGE_API_KEY missing", "auth", this.id, false);
    }

    const url = resolveUrl("/v1/chat/completions");
    const payload = {
      model: process.env.HOUSTON_EMBEDDED_MODEL ?? "gemini-2.5-flash",
      messages: normalizeMessages(request.messages),
      max_tokens: request.maxTokens ?? 32_768,
      temperature: request.temperature ?? 0.7,
    };

    const doFetch = async (signal?: AbortSignal) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
        },
        body: JSON.stringify(payload),
        signal,
      });

      if (!response.ok) {
        const body = await response.text();
        throw aiError(
          `Embedded call failed: ${response.status} ${response.statusText} ${body}`,
          response.status === 401
            ? "auth"
            : response.status >= 500
              ? "unavailable"
              : "unknown",
          this.id,
          response.status >= 500,
        );
      }

      const json = (await response.json()) as {
        choices: Array<{ message: { content: string; tool_calls?: any[] } }>;
        usage?: {
          prompt_tokens?: number;
          completion_tokens?: number;
          total_tokens?: number;
        };
      };

      const first = json.choices?.[0]?.message;
      return {
        output: first?.content ?? "",
        toolCalls: first?.tool_calls,
        usage: json.usage,
        trace: createTrace(this.id, startedAt),
      };
    };

    return withTimeout(doFetch, request.timeoutMs ?? EMBEDDED_TIMEOUT_MS);
  }

  async image(request: ImageRequest): Promise<ImageResponse> {
    const startedAt = Date.now();
    if (!process.env.BUILT_IN_FORGE_API_KEY) {
      throw aiError("BUILT_IN_FORGE_API_KEY missing", "auth", this.id, false);
    }

    const url = resolveUrl("/v1/images/generations");
    const payload = {
      prompt: request.prompt,
      size: request.size ?? "1024x1024",
      n: request.count ?? 1,
      style: request.style,
    };

    const doFetch = async (signal?: AbortSignal) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
        },
        body: JSON.stringify(payload),
        signal,
      });

      if (!response.ok) {
        const body = await response.text();
        throw aiError(
          `Embedded image failed: ${response.status} ${response.statusText} ${body}`,
          response.status >= 500 ? "unavailable" : "unknown",
          this.id,
          response.status >= 500,
        );
      }

      const json = (await response.json()) as { data: Array<{ url: string }> };
      return {
        urls: json.data?.map((item) => item.url) ?? [],
        trace: createTrace(this.id, startedAt),
      };
    };

    return withTimeout(doFetch, request.timeoutMs ?? EMBEDDED_TIMEOUT_MS);
  }

  async tts(request: TtsRequest): Promise<TtsResponse> {
    const startedAt = Date.now();
    if (!process.env.BUILT_IN_FORGE_API_KEY) {
      throw aiError("BUILT_IN_FORGE_API_KEY missing", "auth", this.id, false);
    }

    const url = resolveUrl("/v1/audio/speech");
    const payload = {
      model: process.env.HOUSTON_TTS_MODEL ?? "gpt-4o-mini-tts",
      input: request.text,
      voice: request.voice ?? "alloy",
      format: request.format ?? "mp3",
    };

    const doFetch = async (signal?: AbortSignal) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
        },
        body: JSON.stringify(payload),
        signal,
      });

      if (!response.ok) {
        const body = await response.text();
        throw aiError(
          `Embedded tts failed: ${response.status} ${response.statusText} ${body}`,
          response.status >= 500 ? "unavailable" : "unknown",
          this.id,
          response.status >= 500,
        );
      }

      await response.arrayBuffer(); // buffer not persisted here
      const ref = `tts_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      // host app can persist buffer; here we just expose pseudo reference
      return {
        audioBufferRef: ref,
        usage: undefined,
        trace: createTrace(this.id, startedAt),
      };
    };

    return withTimeout(doFetch, request.timeoutMs ?? EMBEDDED_TIMEOUT_MS);
  }

  async stt(request: SttRequest): Promise<SttResponse> {
    const startedAt = Date.now();
    if (!process.env.BUILT_IN_FORGE_API_KEY) {
      throw aiError("BUILT_IN_FORGE_API_KEY missing", "auth", this.id, false);
    }
    if (!request.audioUrl && !request.audioBufferRef) {
      throw aiError(
        "audioUrl or audioBufferRef required",
        "validation",
        this.id,
        false,
      );
    }

    const url = resolveUrl("/v1/audio/transcriptions");
    const payload = {
      model: process.env.HOUSTON_STT_MODEL ?? "whisper-1",
      file: request.audioUrl ?? request.audioBufferRef,
      language: request.language,
    };

    const doFetch = async (signal?: AbortSignal) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
        },
        body: JSON.stringify(payload),
        signal,
      });

      if (!response.ok) {
        const body = await response.text();
        throw aiError(
          `Embedded stt failed: ${response.status} ${response.statusText} ${body}`,
          response.status >= 500 ? "unavailable" : "unknown",
          this.id,
          response.status >= 500,
        );
      }

      const json = (await response.json()) as { text?: string };
      return {
        text: json.text ?? "",
        trace: createTrace(this.id, startedAt),
      };
    };

    return withTimeout(doFetch, request.timeoutMs ?? EMBEDDED_TIMEOUT_MS);
  }
}
