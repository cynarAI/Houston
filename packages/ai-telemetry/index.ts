type UsageEvent = {
  userId: string;
  modality: "text" | "image" | "tts" | "stt" | "agent";
  provider: string;
  promptTokens?: number;
  completionTokens?: number;
  occurredAt?: Date;
};

type RateLimitRule = {
  windowMs: number;
  maxCalls: number;
};

const inMemoryCounters = new Map<string, { count: number; resetAt: number }>();

export class TelemetryClient {
  constructor(
    private readonly rateLimitRules: Partial<
      Record<UsageEvent["modality"], RateLimitRule>
    > = {},
  ) {}

  recordUsage(event: UsageEvent) {
    const now = Date.now();
    const key = this.buildKey(event.userId, event.modality);
    const rule = this.rateLimitRules[event.modality];

    if (rule) {
      const bucket = inMemoryCounters.get(key);
      if (!bucket || bucket.resetAt < now) {
        inMemoryCounters.set(key, { count: 1, resetAt: now + rule.windowMs });
      } else {
        bucket.count += 1;
        inMemoryCounters.set(key, bucket);
      }
    }

    // hook for db/export: override in host app
    return {
      ...event,
      occurredAt: event.occurredAt ?? new Date(now),
    };
  }

  checkRateLimit(userId: string, modality: UsageEvent["modality"]) {
    const rule = this.rateLimitRules[modality];
    if (!rule) return { allowed: true };
    const key = this.buildKey(userId, modality);
    const bucket = inMemoryCounters.get(key);
    if (!bucket) return { allowed: true };
    if (bucket.resetAt < Date.now()) return { allowed: true };
    return {
      allowed: bucket.count < rule.maxCalls,
      remaining: rule.maxCalls - bucket.count,
    };
  }

  private buildKey(userId: string, modality: UsageEvent["modality"]) {
    return `${userId}:${modality}`;
  }
}
