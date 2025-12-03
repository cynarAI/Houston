/**
 * Analytics Tracking Utility for Houston
 * 
 * Provides event tracking with:
 * - Plausible Analytics integration (production)
 * - Console logging fallback (development)
 * - Type-safe event definitions
 * 
 * @see /docs/analytics_events.md for event documentation
 */

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
const ANALYTICS_DEBUG = import.meta.env.VITE_ANALYTICS_DEBUG === "true";
const IS_DEV = !import.meta.env.PROD;

/**
 * All tracked analytics events
 * 
 * Naming convention: snake_case for event names
 * Categories:
 * - Authentication: signed_up, login
 * - Onboarding: onboarding_*
 * - Goals: goal_*
 * - Strategy: strategy_*
 * - Chat: chat_*, message_*
 * - Todos: todo_*
 * - Credits: credits_*
 * - General: page_viewed, pdf_exported, insights_generated
 */
export const AnalyticsEvents = {
  // Authentication
  SIGNED_UP: "signed_up",
  LOGIN: "login",
  LOGOUT: "logout",
  
  // Onboarding
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_STEP_COMPLETED: "onboarding_step_completed",
  ONBOARDING_COMPLETED: "onboarding_completed",
  
  // Goals
  GOAL_CREATED: "goal_created",
  GOAL_UPDATED: "goal_updated",
  GOAL_DELETED: "goal_deleted",
  
  // Strategy
  STRATEGY_SAVED: "strategy_saved",
  
  // Chat
  CHAT_STARTED: "chat_started",
  MESSAGE_SENT: "message_sent",
  MESSAGE_FEEDBACK: "message_feedback",
  MESSAGE_COPIED: "message_copied",
  MESSAGE_REGENERATED: "message_regenerated",
  
  // Todos
  TODO_CREATED: "todo_created",
  TODO_COMPLETED: "todo_completed",
  TODO_DELETED: "todo_deleted",
  
  // Credits & Purchases
  CREDITS_PURCHASED: "credits_purchased",
  PLAN_UPGRADED: "plan_upgraded",
  
  // AI Features
  INSIGHTS_GENERATED: "insights_generated",
  
  // Exports
  PDF_EXPORTED: "pdf_exported",
  
  // Navigation & Engagement
  PAGE_VIEWED: "page_viewed",
  FEATURE_USED: "feature_used",
} as const;

export type AnalyticsEventName = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];

/**
 * Event property definitions for type safety
 */
export interface EventProperties {
  // Authentication
  signed_up: { method?: string };
  login: { method?: string };
  logout: Record<string, never>;
  
  // Onboarding
  onboarding_started: Record<string, never>;
  onboarding_step_completed: { step: number; step_name?: string };
  onboarding_completed: { duration_seconds?: number };
  
  // Goals
  goal_created: { is_first_goal?: boolean; has_smart_fields?: boolean };
  goal_updated: { goal_id?: number };
  goal_deleted: { goal_id?: number };
  
  // Strategy
  strategy_saved: { is_first_strategy?: boolean; fields_filled?: number };
  
  // Chat
  chat_started: { is_first_chat?: boolean };
  message_sent: { message_length?: number; session_id?: number };
  message_feedback: { feedback_type: "positive" | "negative"; message_id?: number };
  message_copied: { message_id?: number };
  message_regenerated: { message_id?: number };
  
  // Todos
  todo_created: { priority?: string; has_due_date?: boolean };
  todo_completed: { todo_id?: number };
  todo_deleted: { todo_id?: number };
  
  // Credits & Purchases
  credits_purchased: { product_key: string; amount?: number; credits?: number };
  plan_upgraded: { plan_key: string; from_plan?: string };
  
  // AI Features
  insights_generated: { workspace_id?: number };
  
  // Exports
  pdf_exported: { type: "chat" | "goals" | "strategy" | "todos" };
  
  // Navigation & Engagement
  page_viewed: { page: string; referrer?: string };
  feature_used: { feature: string; context?: string };
}

/**
 * Initialize analytics (Plausible script loading)
 * Call this once on app startup (e.g., in main.tsx)
 */
export function initAnalytics() {
  if (!PLAUSIBLE_DOMAIN) {
    if (IS_DEV || ANALYTICS_DEBUG) {
      console.log("[Analytics] Plausible domain not configured, using console-only mode");
    }
    return;
  }
  
  if (IS_DEV && !ANALYTICS_DEBUG) {
    console.log("[Analytics] Development mode - events will be logged to console only");
    return;
  }
  
  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = PLAUSIBLE_DOMAIN;
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);
  
  if (ANALYTICS_DEBUG) {
    console.log("[Analytics] Plausible initialized for domain:", PLAUSIBLE_DOMAIN);
  }
}

/**
 * Track an analytics event
 * 
 * In development: Logs to console
 * In production: Sends to Plausible (if configured)
 * 
 * @param event - Event name from AnalyticsEvents
 * @param props - Optional event properties
 * 
 * @example
 * trackEvent(AnalyticsEvents.GOAL_CREATED, { is_first_goal: true });
 * trackEvent(AnalyticsEvents.PAGE_VIEWED, { page: "/app/dashboard" });
 */
export function trackEvent<T extends AnalyticsEventName>(
  event: T,
  props?: T extends keyof EventProperties ? EventProperties[T] : Record<string, string | number | boolean>
) {
  const timestamp = new Date().toISOString();
  const eventData = {
    event,
    props: props || {},
    timestamp,
  };
  
  // Always log in development or when debug mode is enabled
  if (IS_DEV || ANALYTICS_DEBUG) {
    console.log(
      `%c[Analytics] ${event}`,
      "color: #8B5CF6; font-weight: bold;",
      props || "(no props)"
    );
  }
  
  // Send to Plausible if available
  if (typeof window.plausible === "function") {
    window.plausible(event, { props: props as Record<string, string | number> });
  }
}

/**
 * Track a page view
 * Convenience wrapper for page_viewed event
 * 
 * @param page - Page path (e.g., "/app/dashboard")
 */
export function trackPageView(page: string) {
  trackEvent(AnalyticsEvents.PAGE_VIEWED, { page });
}

/**
 * Track feature usage
 * Convenience wrapper for feature_used event
 * 
 * @param feature - Feature name
 * @param context - Optional context
 */
export function trackFeatureUsed(feature: string, context?: string) {
  trackEvent(AnalyticsEvents.FEATURE_USED, { feature, context });
}
