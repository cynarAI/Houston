import { TelemetryClient } from "./index";

type PlanKey = "free" | "pro";

const DEFAULT_RULES: Record<
  PlanKey,
  Parameters<TelemetryClient["constructor"]>[0]
> = {
  free: {
    text: { windowMs: 24 * 60 * 60 * 1000, maxCalls: 50 },
    image: { windowMs: 24 * 60 * 60 * 1000, maxCalls: 10 },
    tts: { windowMs: 24 * 60 * 60 * 1000, maxCalls: 20 },
    stt: { windowMs: 24 * 60 * 60 * 1000, maxCalls: 20 },
  },
  pro: {
    text: { windowMs: 24 * 60 * 60 * 1000, maxCalls: 500 },
    image: { windowMs: 24 * 60 * 60 * 1000, maxCalls: 50 },
    tts: { windowMs: 24 * 60 * 60 * 1000, maxCalls: 200 },
    stt: { windowMs: 24 * 60 * 60 * 1000, maxCalls: 200 },
  },
};

export const createTelemetryForPlan = (plan: PlanKey) =>
  new TelemetryClient(DEFAULT_RULES[plan] ?? DEFAULT_RULES.free);
