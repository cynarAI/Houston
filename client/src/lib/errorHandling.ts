import { toast } from "sonner";

/**
 * Handles mutation errors with proper German messages and credit-specific handling
 * @param error The caught error object
 * @param defaultMessage The default German message to show if no specific case matches
 * @returns true if the error was a credit-related error
 */
export function handleMutationError(error: unknown, defaultMessage: string): boolean {
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : "";
  
  // Credit-specific errors
  if (
    errorMessage.includes("credit") ||
    errorMessage.includes("insufficient") ||
    errorMessage.includes("nicht genügend") ||
    errorMessage.includes("guthaben")
  ) {
    toast.error("Nicht genügend Credits. Bitte lade dein Guthaben auf, um fortzufahren.");
    return true;
  }
  
  // Network errors
  if (
    errorMessage.includes("network") ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("verbindung")
  ) {
    toast.error("Verbindungsproblem. Bitte prüfe deine Internetverbindung und versuche es erneut.");
    return false;
  }
  
  // Timeout errors
  if (
    errorMessage.includes("timeout") ||
    errorMessage.includes("zeitüberschreitung")
  ) {
    toast.error("Die Anfrage hat zu lange gedauert. Bitte versuche es erneut.");
    return false;
  }
  
  // Authentication errors
  if (
    errorMessage.includes("unauthorized") ||
    errorMessage.includes("unauthenticated") ||
    errorMessage.includes("401")
  ) {
    toast.error("Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.");
    return false;
  }
  
  // Rate limiting
  if (
    errorMessage.includes("rate limit") ||
    errorMessage.includes("too many requests") ||
    errorMessage.includes("429")
  ) {
    toast.error("Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.");
    return false;
  }
  
  // Default error
  toast.error(defaultMessage);
  return false;
}

/**
 * Checks if an error is credit-related without showing a toast
 * Useful when you want to handle the error display yourself
 */
export function isCreditError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : "";
  return (
    errorMessage.includes("credit") ||
    errorMessage.includes("insufficient") ||
    errorMessage.includes("nicht genügend") ||
    errorMessage.includes("guthaben")
  );
}

/**
 * Feature-specific error messages for common operations
 */
export const ErrorMessages = {
  // Chat
  chatCreate: "Chat konnte nicht erstellt werden. Bitte versuche es erneut.",
  chatSend: "Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.",
  chatRegenerate: "Antwort konnte nicht neu generiert werden. Bitte versuche es erneut.",
  
  // Goals
  goalCreate: "Ziel konnte nicht erstellt werden. Bitte versuche es erneut.",
  goalUpdate: "Ziel konnte nicht aktualisiert werden. Bitte versuche es erneut.",
  goalDelete: "Ziel konnte nicht gelöscht werden. Bitte versuche es erneut.",
  
  // Todos
  todoCreate: "To-do konnte nicht erstellt werden. Bitte versuche es erneut.",
  todoUpdate: "To-do konnte nicht aktualisiert werden. Bitte versuche es erneut.",
  todoDelete: "To-do konnte nicht gelöscht werden. Bitte versuche es erneut.",
  
  // Strategy
  strategySave: "Strategie konnte nicht gespeichert werden. Bitte versuche es erneut.",
  
  // Export
  pdfExport: "PDF konnte nicht exportiert werden. Bitte versuche es erneut.",
  
  // Insights
  insightsGenerate: "Insights konnten nicht generiert werden. Bitte versuche es erneut.",
  
  // Generic
  generic: "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
} as const;
