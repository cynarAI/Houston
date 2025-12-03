import { Loader2, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  /** Custom message to display below the spinner */
  message?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Whether to show as full page/section or inline */
  fullPage?: boolean;
  /** Show Houston branding */
  branded?: boolean;
}

// Houston-themed loading messages
const loadingMessages = [
  "Houston bereitet alles vor...",
  "Analysiere deine Daten...",
  "Gleich geht's los...",
  "Lade Marketing-Magie...",
];

/**
 * Space-themed loading state component with Houston branding
 */
export function LoadingState({
  message,
  size = "md",
  className,
  fullPage = false,
  branded = true,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  const containerClasses = fullPage
    ? "min-h-[50vh] flex items-center justify-center"
    : "py-12";

  // Random message if none provided
  const displayMessage = message || loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center animate-in fade-in duration-300",
        containerClasses,
        className
      )}
    >
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B9D] to-[#C44FE2] rounded-full blur-xl opacity-30 animate-pulse" />
        
        {/* Icon Container */}
        <div className={cn(
          "relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B9D]/10 to-[#C44FE2]/10 border border-[#FF6B9D]/20",
          size === "sm" ? "w-8 h-8" : size === "md" ? "w-14 h-14" : "w-20 h-20"
        )}>
          {branded ? (
            <Brain className={cn("text-[#FF6B9D] animate-pulse", iconSizes[size])} />
          ) : (
            <Loader2 className={cn("animate-spin text-[#FF6B9D]", sizeClasses[size])} />
          )}
        </div>
      </div>
      
      {displayMessage && (
        <p className="text-sm text-muted-foreground mt-4 animate-pulse">
          {displayMessage}
        </p>
      )}
    </div>
  );
}

/**
 * Skeleton loading for cards
 */
export function LoadingCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass border-white/10 rounded-lg p-6 animate-pulse",
        className
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/10" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-5/6 rounded bg-white/10" />
        <div className="h-3 w-4/6 rounded bg-white/10" />
      </div>
    </div>
  );
}

export default LoadingState;
