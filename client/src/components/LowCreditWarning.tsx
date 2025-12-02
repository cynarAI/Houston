import { AlertCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Link } from "wouter";

export function LowCreditWarning() {
  const { data: balance } = trpc.credits.getBalance.useQuery();
  const [dismissed, setDismissed] = useState(false);

  const credits = balance ?? 0;
  const isLow = credits < 20 && credits > 0;
  const isEmpty = credits === 0;

  // Reset dismissed state when credits change significantly
  useEffect(() => {
    if (credits >= 20) {
      setDismissed(false);
      localStorage.removeItem("lowCreditWarningDismissed");
    }
  }, [credits]);

  // Check if user dismissed the warning
  useEffect(() => {
    const isDismissed = localStorage.getItem("lowCreditWarningDismissed") === "true";
    setDismissed(isDismissed);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("lowCreditWarningDismissed", "true");
  };

  if (dismissed || (!isLow && !isEmpty)) {
    return null;
  }

  return (
    <div
      className={`
        relative mb-6 p-4 rounded-lg border-2
        ${isEmpty
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-orange-500/10 border-orange-500/30'
        }
        animate-in slide-in-from-top-2 duration-300
      `}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Dismiss warning"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-full shrink-0
          ${isEmpty ? 'bg-red-500/20' : 'bg-orange-500/20'}
        `}>
          {isEmpty ? (
            <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
          ) : (
            <Sparkles className="w-5 h-5 text-orange-400" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h3 className={`font-semibold ${
            isEmpty ? 'text-red-400' : 'text-orange-400'
          }`}>
            {isEmpty ? 'Keine Credits mehr!' : 'Deine Credits werden knapp'}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {isEmpty
              ? 'Du hast alle deine Credits verbraucht. Lade jetzt auf, um weiter mit Houston zu arbeiten.'
              : `Du hast noch ${credits} Credits verfügbar. Lade jetzt auf, um alle Features nutzen zu können.`
            }
          </p>

          <div className="flex items-center gap-2 pt-1">
            <Link href="/app/credits">
              <Button
                size="sm"
                className={isEmpty ? 'animate-pulse' : ''}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Credits aufladen
              </Button>
            </Link>
            <Link href="/app/credits">
              <Button size="sm" variant="outline">
                Pläne ansehen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
