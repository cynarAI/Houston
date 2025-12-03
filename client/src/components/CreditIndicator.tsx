import { Sparkles, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

interface CreditIndicatorProps {
  onClick?: () => void;
}

export function CreditIndicator({ onClick }: CreditIndicatorProps) {
  const { data: balance, isLoading } = trpc.credits.getBalance.useQuery();

  if (isLoading) {
    return (
      <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 animate-pulse">
        <div className="h-4 w-16 bg-white/10 rounded"></div>
      </div>
    );
  }

  const credits = balance ?? 0;
  const isLow = credits < 20 && credits > 0;
  const isEmpty = credits === 0;

  // Tooltip text based on state
  const tooltipText = isEmpty 
    ? "Keine Credits mehr – jetzt aufladen!"
    : isLow 
    ? "Credits knapp – bald aufladen"
    : "Dein Credit-Guthaben";

  return (
    <Link href="/app/credits">
      <button
        onClick={onClick}
        title={tooltipText}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          font-semibold text-sm transition-all duration-300
          ${isEmpty 
            ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400 hover:bg-red-500/30 animate-pulse' 
            : isLow
            ? 'bg-orange-500/20 border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/30'
            : 'bg-gradient-to-r from-[#ffb606]/20 to-[#442e66]/20 border border-[#ffb606]/30 text-white hover:from-[#ffb606]/30 hover:to-[#442e66]/30'
          }
          hover:scale-105 hover:shadow-lg
        `}
      >
        {isEmpty ? (
          <AlertTriangle className="w-4 h-4 animate-bounce" />
        ) : (
          <Sparkles className={`w-4 h-4 ${isLow ? 'animate-pulse' : ''}`} />
        )}
        <span>
          {isEmpty ? (
            "Aufladen"
          ) : (
            <>
              {credits} {credits === 1 ? 'Credit' : 'Credits'}
              {isLow && <span className="hidden sm:inline text-xs ml-1 opacity-75">• Knapp</span>}
            </>
          )}
        </span>
      </button>
    </Link>
  );
}
