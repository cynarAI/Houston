import { Loader2 } from "lucide-react";
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
}

/**
 * Space-themed loading state component with Houston branding
 */
export function LoadingState({
  message = "Lädt...",
  size = "md",
  className,
  fullPage = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = fullPage
    ? "min-h-[50vh] flex items-center justify-center"
    : "py-12";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        containerClasses,
        className
      )}
    >
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffb606] to-[#442e66] rounded-full blur-xl opacity-30 animate-pulse" />
        
        {/* Spinner */}
        <Loader2
          className={cn(
            "relative animate-spin text-[#ffb606]",
            sizeClasses[size]
          )}
        />
      </div>
      
      {message && (
        <p className="text-sm text-muted-foreground mt-4 animate-pulse">
          {message}
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
