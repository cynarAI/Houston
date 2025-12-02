import * as Sentry from "@sentry/node";
import { ENV } from "./env";

export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.log("Sentry DSN not configured, skipping initialization");
    return;
  }
  Sentry.init({
    dsn,
    environment: ENV.isProduction ? "production" : "development",
    tracesSampleRate: ENV.isProduction ? 0.1 : 1.0,
    enabled: ENV.isProduction,
  });
}

export { Sentry };
