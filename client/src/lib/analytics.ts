declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

export function initAnalytics() {
  if (!PLAUSIBLE_DOMAIN) {
    console.log("Plausible domain not configured, skipping analytics");
    return;
  }
  if (!import.meta.env.PROD && import.meta.env.VITE_PLAUSIBLE_DEBUG !== "true") {
    return;
  }
  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = PLAUSIBLE_DOMAIN;
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);
}

export function trackEvent(event: string, props?: Record<string, string | number>) {
  if (typeof window.plausible === "function") {
    window.plausible(event, { props });
  }
}

export const AnalyticsEvents = {
  SIGNUP: "Signup",
  LOGIN: "Login",
  CHAT_STARTED: "Chat Started",
  GOAL_CREATED: "Goal Created",
  CREDITS_PURCHASED: "Credits Purchased",
  ONBOARDING_COMPLETED: "Onboarding Completed",
} as const;
