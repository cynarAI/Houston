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
} from "./types";

export interface AiProvider {
  id: "embedded" | "manus_api" | "mock";
  text(request: TextRequest): Promise<TextResponse>;
  image(request: ImageRequest): Promise<ImageResponse>;
  tts(request: TtsRequest): Promise<TtsResponse>;
  stt(request: SttRequest): Promise<SttResponse>;
  agent?(request: AgentTaskRequest): Promise<AgentTaskResponse>;
}
