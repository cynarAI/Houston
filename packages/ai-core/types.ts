export type AiModality = "text" | "image" | "tts" | "stt" | "agent";

export type TraceMeta = {
  traceId: string;
  provider: string;
  latencyMs: number;
};

export type Usage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

export type AiErrorCode =
  | "timeout"
  | "quota"
  | "auth"
  | "unavailable"
  | "validation"
  | "unknown";

export type AiError = Error & {
  code: AiErrorCode;
  provider?: string;
  retryable: boolean;
};

export type ChatMessage = {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
};

export type ToolDefinition = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

export type ToolResult = {
  tool_call_id: string;
  content: string;
};

export type TextRequest = {
  userId: string;
  sessionId?: string;
  messages: ChatMessage[];
  tools?: ToolDefinition[];
  toolChoice?: "none" | "auto" | "required" | { name: string };
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
};

export type TextResponse = {
  output: string;
  toolCalls?: ToolCall[];
  usage?: Usage;
  trace: TraceMeta;
};

export type ImageRequest = {
  userId: string;
  prompt: string;
  size?: "512x512" | "768x768" | "1024x1024" | string;
  count?: number;
  style?: string;
  timeoutMs?: number;
};

export type ImageResponse = {
  urls: string[];
  usage?: Usage;
  trace: TraceMeta;
};

export type TtsRequest = {
  userId: string;
  text: string;
  voice?: string;
  format?: "mp3" | "wav" | "aac";
  timeoutMs?: number;
};

export type TtsResponse = {
  audioUrl?: string;
  audioBufferRef?: string;
  usage?: Usage;
  trace: TraceMeta;
};

export type SttRequest = {
  userId: string;
  audioUrl?: string;
  audioBufferRef?: string;
  language?: string;
  timeoutMs?: number;
};

export type SttResponse = {
  text: string;
  usage?: Usage;
  trace: TraceMeta;
};

export type AgentTaskRequest = {
  userId: string;
  goal: string;
  context?: Record<string, unknown>;
  tools?: ToolDefinition[];
  webhookUrl?: string;
  timeoutMs?: number;
};

export type AgentTaskResponse = {
  taskId: string;
  status: "queued" | "running" | "succeeded" | "failed";
  result?: unknown;
  usage?: Usage;
  trace: TraceMeta;
};
