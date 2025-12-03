import { toast } from "sonner";
import confetti from "canvas-confetti";

type CelebrationLevel = "small" | "medium" | "large";

interface CelebrationConfig {
  title: string;
  description: string;
  emoji: string;
  level: CelebrationLevel;
}

// Storage key prefix for tracking celebrations
const CELEBRATION_KEY_PREFIX = "houston-celebration-";

// Check if a celebration has been shown before
function hasShownCelebration(key: string): boolean {
  return localStorage.getItem(`${CELEBRATION_KEY_PREFIX}${key}`) === "true";
}

// Mark a celebration as shown
function markCelebrationShown(key: string): void {
  localStorage.setItem(`${CELEBRATION_KEY_PREFIX}${key}`, "true");
}

// Trigger confetti animation based on level
function triggerConfetti(level: CelebrationLevel) {
  const configs = {
    small: {
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
    },
    medium: {
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    },
    large: {
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FF6B9D', '#8B5CF6', '#3B82F6', '#10B981', '#F97316'],
    },
  };

  confetti(configs[level]);
}

// Generic celebration function
export function celebrate(config: CelebrationConfig, storageKey?: string) {
  // If storage key provided, check if already shown
  if (storageKey && hasShownCelebration(storageKey)) {
    return;
  }

  // Show toast with emoji and title
  toast.success(`${config.emoji} ${config.title}`, {
    description: config.description,
    duration: 5000,
    className: "celebration-toast",
  });

  // Trigger confetti
  triggerConfetti(config.level);

  // Mark as shown if storage key provided
  if (storageKey) {
    markCelebrationShown(storageKey);
  }
}

// Pre-defined Aha-Moment celebrations
export const celebrations = {
  // Onboarding completed
  onboardingCompleted: () => celebrate({
    title: "Willkommen an Bord!",
    description: "Du hast das Onboarding abgeschlossen. Houston ist bereit für dich!",
    emoji: "🎉",
    level: "large",
  }, "onboarding-completed"),

  // First chat message sent
  firstChat: () => celebrate({
    title: "Erstes Gespräch gestartet!",
    description: "Super, du hast Houston kennengelernt. Frag, was dich beschäftigt!",
    emoji: "🚀",
    level: "medium",
  }, "first-chat"),

  // First goal created
  firstGoal: () => celebrate({
    title: "Erstes Ziel erstellt!",
    description: "Der erste Schritt zum Erfolg ist gemacht.",
    emoji: "🎯",
    level: "medium",
  }, "first-goal"),

  // First strategy saved
  firstStrategy: () => celebrate({
    title: "Strategie gespeichert!",
    description: "Deine Marketing-Roadmap steht. Du bist auf Kurs!",
    emoji: "🧭",
    level: "medium",
  }, "first-strategy"),

  // First todo created
  firstTodo: () => celebrate({
    title: "Erste Aufgabe erstellt!",
    description: "Jetzt heißt es dranbleiben. Du schaffst das!",
    emoji: "📝",
    level: "small",
  }, "first-todo"),

  // First todo completed
  firstTodoCompleted: () => celebrate({
    title: "Erste Aufgabe erledigt!",
    description: "Boom! So fühlt sich Fortschritt an.",
    emoji: "✅",
    level: "medium",
  }, "first-todo-completed"),

  // All daily tasks completed
  allTasksCompleted: () => celebrate({
    title: "Alle Aufgaben erledigt!",
    description: "Super Arbeit! Zeit für eine wohlverdiente Pause.",
    emoji: "🎉",
    level: "large",
  }),

  // 5 tasks completed (milestone)
  fiveTasksCompleted: () => celebrate({
    title: "5 Aufgaben geschafft!",
    description: "Du bist richtig produktiv heute!",
    emoji: "🏆",
    level: "medium",
  }, "five-tasks-completed"),

  // First AI insights generated
  firstInsights: () => celebrate({
    title: "Erste AI-Insights!",
    description: "Houston hat Empfehlungen für dich. Schau sie dir an!",
    emoji: "💡",
    level: "small",
  }, "first-insights"),

  // Goal completed
  goalCompleted: (goalTitle: string) => celebrate({
    title: "Ziel erreicht!",
    description: `Du hast "${goalTitle}" abgeschlossen. Weiter so!`,
    emoji: "🏅",
    level: "large",
  }),

  // Weekly streak
  weeklyStreak: (days: number) => celebrate({
    title: `${days} Tage in Folge!`,
    description: "Du baust eine starke Gewohnheit auf. Keep going!",
    emoji: "🔥",
    level: "large",
  }, `streak-${days}`),

  // First referral
  firstReferral: () => celebrate({
    title: "Erste Einladung verschickt!",
    description: "Danke fürs Teilen! Du bekommst Credits, wenn dein Freund startet.",
    emoji: "🎁",
    level: "medium",
  }, "first-referral"),

  // PDF export
  firstExport: () => celebrate({
    title: "Erster Export!",
    description: "Deine Strategie als PDF – bereit zum Teilen.",
    emoji: "📄",
    level: "small",
  }, "first-export"),

  // Activation complete (all 5 steps)
  activationComplete: () => celebrate({
    title: "Mission gestartet!",
    description: "Du hast alle Schritte abgeschlossen. Houston ist bereit für dich!",
    emoji: "🚀",
    level: "large",
  }, "activation-complete"),
};

// Utility to check activation status and trigger celebration if needed
export function checkActivationMilestone(status: {
  hasFirstChat: boolean;
  hasFirstGoal: boolean;
  hasStrategy: boolean;
  hasFirstTodo: boolean;
  hasCompletedTodo: boolean;
}) {
  const completedCount = Object.values(status).filter(Boolean).length;
  
  // Check for activation complete
  if (completedCount === 5 && !hasShownCelebration("activation-complete")) {
    // Delay to let the last action settle
    setTimeout(() => {
      celebrations.activationComplete();
    }, 500);
  }
}

// Utility to track and celebrate task completion milestones
export function checkTaskMilestone(completedCount: number) {
  if (completedCount === 1 && !hasShownCelebration("first-todo-completed")) {
    celebrations.firstTodoCompleted();
  } else if (completedCount === 5 && !hasShownCelebration("five-tasks-completed")) {
    celebrations.fiveTasksCompleted();
  }
}

// Reset all celebrations (for testing)
export function resetCelebrations() {
  const keys = Object.keys(localStorage).filter(key => key.startsWith(CELEBRATION_KEY_PREFIX));
  keys.forEach(key => localStorage.removeItem(key));
}
