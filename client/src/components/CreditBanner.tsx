import { useState, useEffect } from "react";
import { Sparkles, X, ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

interface CreditBannerProps {
  /** Threshold below which the banner shows (default: 20) */
  threshold?: number;
  /** Unique key for localStorage dismiss tracking */
  dismissKey?: string;
}

/**
 * CreditBanner - A soft upsell banner that appears when credits are low
 * 
 * - Shows when user has < threshold credits
 * - Can be dismissed (persists for 24h in localStorage)
 * - Friendly, non-pushy messaging
 * - Links to both plans and boosters
 */
export function CreditBanner({ threshold = 20, dismissKey = "credit-banner-dismissed" }: CreditBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to avoid flash
  const { data: balance, isLoading } = trpc.credits.getBalance.useQuery();

  useEffect(() => {
    // Check if banner was dismissed recently (within 24h)
    const dismissedAt = localStorage.getItem(dismissKey);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const now = Date.now();
      const hoursElapsed = (now - dismissedTime) / (1000 * 60 * 60);
      
      // Show again after 24 hours
      if (hoursElapsed < 24) {
        setIsDismissed(true);
        return;
      }
    }
    setIsDismissed(false);
  }, [dismissKey]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(dismissKey, Date.now().toString());
  };

  // Don't show if loading, dismissed, or credits are above threshold
  if (isLoading || isDismissed) return null;
  
  const credits = balance ?? 0;
  if (credits >= threshold) return null;

  const isEmpty = credits === 0;

  return (
    <div 
      className={`
        relative rounded-xl p-4 mb-6
        ${isEmpty 
          ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20' 
          : 'bg-gradient-to-r from-[#ffb606]/10 to-[#8B5CF6]/10 border border-[#ffb606]/20'
        }
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
        aria-label="Banner schließen"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4 pr-8">
        {/* Icon */}
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-full shrink-0
          ${isEmpty 
            ? 'bg-red-500/20' 
            : 'bg-gradient-to-br from-[#ffb606]/20 to-[#8B5CF6]/20'
          }
        `}>
          {isEmpty ? (
            <Zap className="w-5 h-5 text-red-400" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#ffb606]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold mb-1 ${isEmpty ? 'text-red-400' : 'text-white'}`}>
            {isEmpty 
              ? "Deine Credits sind aufgebraucht" 
              : `Noch ${credits} Credits übrig`
            }
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {isEmpty 
              ? "Houston kann dich besser unterstützen, wenn du dein Guthaben aufladest. Keine Sorge – es gibt flexible Optionen."
              : "Dein Guthaben wird knapp. Mit einem Abo oder Booster-Pack bist du bestens gerüstet für deine Marketing-Projekte."
            }
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-2">
            <Link href="/app/credits?tab=topups">
              <Button size="sm" variant="gradient" className="gap-1">
                <Zap className="w-3 h-3" />
                Schnell aufladen
              </Button>
            </Link>
            <Link href="/app/credits?tab=plans">
              <Button size="sm" variant="outline" className="gap-1">
                Pläne ansehen
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Optional: Credit count display */}
      {!isEmpty && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Aktuelles Guthaben</span>
            <span className={`font-semibold ${credits < 10 ? 'text-red-400' : 'text-orange-400'}`}>
              {credits} Credits
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
