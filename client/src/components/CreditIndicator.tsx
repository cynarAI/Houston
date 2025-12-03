import { memo, useMemo } from "react";
import { Sparkles, AlertTriangle, Zap } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { PlanBadge } from "./PlanBadge"; // Import new component

interface CreditIndicatorProps {
  onClick?: () => void;
}

/**
 * CreditIndicator - Memoized component to prevent unnecessary re-renders
 * Only re-renders when onClick prop changes (which is stable in most cases)
 *
 * Accessibility: Uses Link as the single interactive element (no nested button)
 */
export const CreditIndicator = memo(function CreditIndicator({
  onClick,
}: CreditIndicatorProps) {
  const { data: balance, isLoading } = trpc.credits.getBalance.useQuery();

  // Fake plan detection for now (would come from user subscription query)
  const plan = "free"; // Default to free

  // Calculate derived values (needed for useMemo before any early returns)
  const credits = balance ?? 0;
  const isLow = credits < 20 && credits > 0;
  const isEmpty = credits === 0;

  // Memoize aria-label - MUST be called before any early returns to maintain hook order
  const ariaLabel = useMemo(() => {
    if (isEmpty) return "No credits left - go to credits page to top up";
    if (isLow) return `${credits} Credits - Low balance, go to credits page`;
    return `${credits} Credits (approx. ${credits} chats left) - go to credits page`;
  }, [isEmpty, isLow, credits]);

  if (isLoading) {
    return (
      <div
        className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 animate-pulse"
        aria-label="Loading credits..."
        role="status"
      >
        <div className="h-4 w-16 bg-white/10 rounded" aria-hidden="true"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Plan Badge - hidden on very small screens */}
      <div className="hidden sm:block">
        <PlanBadge plan={plan} />
      </div>

      <Link
        href="/app/credits"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          font-semibold text-sm transition-all duration-300
          ${
            isEmpty
              ? "bg-red-500/20 border-2 border-red-500/50 text-red-400 hover:bg-red-500/30 animate-pulse"
              : isLow
                ? "bg-orange-500/20 border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/30"
                : "glass border-white/10 text-white hover:bg-white/10 hover:border-white/20"
          }
          hover:scale-105 hover:shadow-glow
        `}
      >
        {isEmpty ? (
          <AlertTriangle
            className="w-4 h-4 animate-bounce text-red-400"
            aria-hidden="true"
          />
        ) : (
          <Zap
            className={`w-4 h-4 ${isLow ? "animate-pulse text-orange-400" : "text-yellow-400 fill-yellow-400"}`}
            aria-hidden="true"
          />
        )}
        <span
          aria-hidden="true"
          title={credits > 0 ? `Approx. ${credits} chats left` : undefined}
        >
          {isEmpty ? (
            "Top up"
          ) : (
            <>
              {credits}
              {isLow && (
                <span className="hidden sm:inline text-xs ml-1 opacity-75">
                  • Low
                </span>
              )}
            </>
          )}
        </span>
      </Link>
    </div>
  );
});
