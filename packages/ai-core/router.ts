import { aiError, isRetryable } from "./errors";
import type { AiProvider } from "./provider";
import type {
  AiModality,
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
} from "./types";

type TelemetryHooks = {
  beforeCall?: (args: {
    modality: AiModality;
    provider: string;
  }) => Promise<void> | void;
  afterCall?: (args: {
    modality: AiModality;
    provider: string;
    success: boolean;
    latencyMs: number;
    usage?: Record<string, unknown>;
  }) => Promise<void> | void;
  onError?: (args: {
    modality: AiModality;
    provider: string;
    error: unknown;
  }) => Promise<void> | void;
};

type RouterConfig = {
  providers: Record<string, AiProvider>;
  telemetry?: TelemetryHooks;
  requestTimeoutMs?: number;
  retryBackoffMs?: number;
};

const DEFAULT_TIMEOUT_MS = 90_000;
const DEFAULT_RETRY_BACKOFF_MS = 2_000;

let config: RouterConfig = {
  providers: {},
  telemetry: {},
  requestTimeoutMs: DEFAULT_TIMEOUT_MS,
  retryBackoffMs: DEFAULT_RETRY_BACKOFF_MS,
};

export const configureRouter = (next: Partial<RouterConfig>) => {
  config = {
    ...config,
    ...next,
    providers: next.providers ?? config.providers,
  };
};

type Policy = { primary: string; fallback?: string };

const resolvePolicy = (): Policy => {
  const primary = process.env.HOUSTON_AI_PROVIDER?.trim() || "embedded";
  const allowFallback =
    (process.env.HOUSTON_AI_FALLBACK ?? "true").toLowerCase() === "true";
  const fallback =
    allowFallback && primary !== "manus_api" ? "manus_api" : undefined;

  if (!config.providers[primary]) {
    throw aiError(`Provider ${primary} not configured`, "validation");
  }
  if (fallback && !config.providers[fallback]) {
    return { primary };
  }
  return { primary, fallback };
};

const withTelemetry = async <T>(
  modality: AiModality,
  provider: string,
  fn: () => Promise<T>,
): Promise<T> => {
  const start = Date.now();
  await config.telemetry?.beforeCall?.({ modality, provider });
  try {
    const result = await fn();
    const latencyMs = Date.now() - start;
    await config.telemetry?.afterCall?.({
      modality,
      provider,
      success: true,
      latencyMs,
      usage: (result as any)?.usage,
    });
    return result;
  } catch (error) {
    const latencyMs = Date.now() - start;
    await config.telemetry?.afterCall?.({
      modality,
      provider,
      success: false,
      latencyMs,
    });
    await config.telemetry?.onError?.({ modality, provider, error });
    throw error;
  }
};

const callProvider = async <T>(
  modality: AiModality,
  providerId: string,
  fn: (provider: AiProvider) => Promise<T>,
): Promise<T> => {
  const provider = config.providers[providerId];
  if (!provider) {
    throw aiError(`Provider ${providerId} not configured`, "validation");
  }
  return withTelemetry(modality, providerId, () => fn(provider));
};

const maybeFallback = async <T>(
  modality: AiModality,
  execute: (providerId: string) => Promise<T>,
): Promise<T> => {
  const policy = resolvePolicy();
  try {
    return await execute(policy.primary);
  } catch (error) {
    if (!policy.fallback || !isRetryable(error)) {
      throw error;
    }
    await sleep(config.retryBackoffMs ?? DEFAULT_RETRY_BACKOFF_MS);
    return execute(policy.fallback);
  }
};

export const callText = (request: TextRequest): Promise<TextResponse> =>
  maybeFallback("text", (providerId) =>
    callProvider("text", providerId, (provider) => provider.text(request)),
  );

export const callImage = (request: ImageRequest): Promise<ImageResponse> =>
  maybeFallback("image", (providerId) =>
    callProvider("image", providerId, (provider) => provider.image(request)),
  );

export const callTts = (request: TtsRequest): Promise<TtsResponse> =>
  maybeFallback("tts", (providerId) =>
    callProvider("tts", providerId, (provider) => provider.tts(request)),
  );

export const callStt = (request: SttRequest): Promise<SttResponse> =>
  maybeFallback("stt", (providerId) =>
    callProvider("stt", providerId, (provider) => provider.stt(request)),
  );

export const callAgent = (
  request: AgentTaskRequest,
): Promise<AgentTaskResponse> =>
  maybeFallback("agent", (providerId) =>
    callProvider("agent", providerId, (provider) => {
      if (!provider.agent) {
        throw aiError(
          `Provider ${providerId} does not support agent`,
          "validation",
          providerId,
          false,
        );
      }
      return provider.agent(request);
    }),
  );

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
