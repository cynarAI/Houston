import { ENV } from "./env";
import { LLMError } from "@shared/_core/errors";
import { callText, configureRouter } from "../../packages/ai-core/router";
import type {
  ChatMessage as AiChatMessage,
  TextRequest,
} from "../../packages/ai-core/types";
import { ManusEmbeddedAdapter } from "../../packages/ai-providers/manus-embedded";
import { ManusApiAdapter } from "../../packages/ai-providers/manus-api";
import { MockAiAdapter } from "../../packages/ai-providers/mock";
import { TelemetryClient } from "../../packages/ai-telemetry";
import { incrementUsageCounter, isUsageAllowed } from "../db";

/**
 * LLM Configuration
 */
const LLM_CONFIG = {
  /** Timeout for LLM requests in milliseconds */
  TIMEOUT_MS: 60000, // 60 seconds - LLM can be slow
  /** Maximum number of retry attempts */
  MAX_RETRIES: 3,
  /** Base delay for exponential backoff in milliseconds */
  BASE_RETRY_DELAY_MS: 1000,
  /** Jitter factor for retry delay (0-1) */
  RETRY_JITTER: 0.2,
} as const;

const telemetry = new TelemetryClient();
let routerConfigured = false;

const ensureRouterConfigured = () => {
  if (routerConfigured) return;
  configureRouter({
    providers: {
      embedded: new ManusEmbeddedAdapter(),
      manus_api: new ManusApiAdapter(),
      mock: new MockAiAdapter(),
    },
    telemetry: {
      beforeCall: ({ modality, provider }) =>
        telemetry.recordUsage({
          userId: "unknown",
          modality,
          provider,
        }),
    },
    requestTimeoutMs: LLM_CONFIG.TIMEOUT_MS,
    retryBackoffMs: LLM_CONFIG.BASE_RETRY_DELAY_MS,
  });
  if (
    process.env.NODE_ENV === "production" &&
    (process.env.HOUSTON_AI_PROVIDER ?? "").trim() === "mock"
  ) {
    console.warn("[AI Router] WARNING: provider=mock in production env");
  }
  routerConfigured = true;
};

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?:
      | "audio/mpeg"
      | "audio/wav"
      | "application/pdf"
      | "audio/mp4"
      | "video/mp4";
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice =
  | ToolChoicePrimitive
  | ToolChoiceByName
  | ToolChoiceExplicit;

export type InvokeParams = {
  userId?: string;
  sessionId?: string;
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

const ensureArray = (
  value: MessageContent | MessageContent[],
): MessageContent[] => (Array.isArray(value) ? value : [value]);

const normalizeContentPart = (
  part: MessageContent,
): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  if (part.type === "file_url") {
    return part;
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map((part) => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");

    return {
      role,
      name,
      tool_call_id,
      content,
    };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);

  // If there's only text content, collapse to a single string for compatibility
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text,
    };
  }

  return {
    role,
    name,
    content: contentParts,
  };
};

const toAiMessage = (message: Message): AiChatMessage => {
  const normalized = normalizeMessage(message);
  const content =
    typeof normalized.content === "string"
      ? normalized.content
      : Array.isArray(normalized.content)
        ? normalized.content
            .map((part) =>
              typeof part === "string" ? part : JSON.stringify(part),
            )
            .join("\n")
        : JSON.stringify(normalized.content);
  return {
    role: (normalized.role as AiChatMessage["role"]) ?? "user",
    content,
    name: normalized.name,
    tool_call_id: (normalized as any).tool_call_id,
  };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined,
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }

  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured",
      );
    }

    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly",
      );
    }

    return {
      type: "function",
      function: { name: tools[0].function.name },
    };
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice;
};

const resolveApiUrl = () =>
  ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0
    ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`
    : "https://forge.manus.im/v1/chat/completions";

const assertApiKey = () => {
  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}):
  | { type: "json_schema"; json_schema: JsonSchema }
  | { type: "text" }
  | { type: "json_object" }
  | undefined => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (
      explicitFormat.type === "json_schema" &&
      !explicitFormat.json_schema?.schema
    ) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object",
      );
    }
    return explicitFormat;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  };
};

/**
 * Check if an error is retryable (temporary/transient)
 */
function isRetryableError(error: unknown, statusCode?: number): boolean {
  // Retry on network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true;
  }

  // Retry on specific HTTP status codes
  if (statusCode) {
    // 429 = Too Many Requests
    // 500, 502, 503, 504 = Server errors (often temporary)
    return [429, 500, 502, 503, 504].includes(statusCode);
  }

  return false;
}

/**
 * Calculate retry delay with exponential backoff and jitter
 */
function calculateRetryDelay(attempt: number): number {
  const baseDelay = LLM_CONFIG.BASE_RETRY_DELAY_MS * Math.pow(2, attempt);
  const jitter = baseDelay * LLM_CONFIG.RETRY_JITTER * Math.random();
  return baseDelay + jitter;
}

/**
 * Invoke the LLM using the provider-agnostic router.
 */
export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  ensureRouterConfigured();

  const textRequest: TextRequest = {
    userId: params.userId ?? "unknown",
    sessionId: params.sessionId,
    messages: params.messages.map(toAiMessage),
    tools: params.tools as any,
    toolChoice: (params.toolChoice || params.tool_choice) as any,
    maxTokens: params.maxTokens ?? params.max_tokens,
    temperature: params.temperature ?? 0.7,
    timeoutMs: params.timeoutMs ?? LLM_CONFIG.TIMEOUT_MS,
  };

  const numericUserId = Number(textRequest.userId);
  if (!Number.isNaN(numericUserId)) {
    const allowed = await isUsageAllowed({
      userId: numericUserId,
      modality: "text",
    });
    if (!allowed.allowed) {
      throw LLMError("Tageslimit erreicht – bitte morgen erneut versuchen.");
    }
  }

  const res = await callText(textRequest);

  if (!Number.isNaN(numericUserId)) {
    const promptTokens =
      (res.usage as any)?.promptTokens ?? (res.usage as any)?.prompt_tokens;
    const completionTokens =
      (res.usage as any)?.completionTokens ??
      (res.usage as any)?.completion_tokens;

    await incrementUsageCounter({
      userId: numericUserId,
      modality: "text",
      delta: 1,
      promptTokens,
      completionTokens,
    });
  }

  return {
    id: res.trace.traceId,
    created: Date.now(),
    model: ENV.houstonEmbeddedModel,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: res.output,
          tool_calls: res.toolCalls,
        } as any,
        finish_reason: null,
      },
    ],
    usage: res.usage
      ? {
          prompt_tokens: res.usage.promptTokens ?? res.usage.prompt_tokens ?? 0,
          completion_tokens:
            res.usage.completionTokens ?? res.usage.completion_tokens ?? 0,
          total_tokens: res.usage.totalTokens ?? res.usage.total_tokens ?? 0,
        }
      : undefined,
  };
}

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
