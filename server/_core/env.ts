export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  houstonEmbeddedModel:
    process.env.HOUSTON_EMBEDDED_MODEL ?? "gemini-2.5-flash",
  houstonTtsModel: process.env.HOUSTON_TTS_MODEL ?? "gpt-4o-mini-tts",
  houstonSttModel: process.env.HOUSTON_STT_MODEL ?? "whisper-1",
  embeddedTimeoutMs: Number(process.env.EMBEDDED_TIMEOUT_MS ?? 120_000),
  aiProvider: process.env.HOUSTON_AI_PROVIDER ?? "embedded",
  aiFallback:
    (process.env.HOUSTON_AI_FALLBACK ?? "true").toLowerCase() === "true",
  manusApiBase: process.env.MANUS_API_BASE ?? "https://api.manus.ai",
  manusApiKey: process.env.MANUS_API_KEY ?? "",
  manusApiTimeoutMs: Number(process.env.MANUS_API_TIMEOUT_MS ?? 120_000),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
};
