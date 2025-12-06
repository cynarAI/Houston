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

const nowTrace = (provider: string) => ({
  provider,
  traceId: `mock_${Date.now().toString(16)}`,
  latencyMs: 5,
});

export class MockAiAdapter implements AiProvider {
  id = "mock" as const;

  async text(request: TextRequest): Promise<TextResponse> {
    const last = request.messages[request.messages.length - 1];
    const content = last?.content ?? "";
    return {
      output: `[MOCK] ${typeof content === "string" ? content : JSON.stringify(content)}`,
      usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 },
      trace: nowTrace(this.id),
    };
  }

  async image(_: ImageRequest): Promise<ImageResponse> {
    return {
      urls: ["https://placehold.co/512x512?text=mock"],
      usage: { promptTokens: 1, completionTokens: 0, totalTokens: 1 },
      trace: nowTrace(this.id),
    };
  }

  async tts(_: TtsRequest): Promise<TtsResponse> {
    return {
      audioBufferRef: "mock-audio-ref",
      usage: { promptTokens: 1, completionTokens: 0, totalTokens: 1 },
      trace: nowTrace(this.id),
    };
  }

  async stt(_: SttRequest): Promise<SttResponse> {
    return {
      text: "[MOCK] transkribierter Text",
      usage: { promptTokens: 0, completionTokens: 5, totalTokens: 5 },
      trace: nowTrace(this.id),
    };
  }
}
