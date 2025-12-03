import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Sparkles,
  Zap,
  ArrowRight,
  Rocket,
  Shield,
} from "lucide-react";
import { Link } from "wouter";

interface LowCreditsDialogProps {
  open: boolean;
  onClose: () => void;
  creditsNeeded: number;
  currentCredits: number;
  actionName?: string;
  onContinue?: () => void;
}

export function LowCreditsDialog({
  open,
  onClose,
  creditsNeeded,
  currentCredits,
  actionName = "diese Aktion",
  onContinue,
}: LowCreditsDialogProps) {
  const canAfford = currentCredits >= creditsNeeded;
  const isLow = currentCredits < 20 && currentCredits > 0;
  const isEmpty = currentCredits === 0;
  const creditsMissing = creditsNeeded - currentCredits;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass border-white/20 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {isEmpty ? (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            ) : isLow || !canAfford ? (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20">
                <Sparkles className="h-6 w-6 text-orange-400" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)]">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            )}
            <DialogTitle className="text-xl">
              {isEmpty
                ? "Credits aufgebraucht"
                : !canAfford
                  ? "Nicht genug Credits"
                  : isLow
                    ? "Guthaben knapp"
                    : "Credit-Kosten bestätigen"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {isEmpty ? (
              <>
                Dein Guthaben ist leer. Um <strong>{actionName}</strong> zu
                nutzen, brauchst du {creditsNeeded} Credits.
                <span className="block mt-2 text-muted-foreground">
                  Keine Sorge – mit einem kleinen Booster bist du sofort wieder
                  dabei.
                </span>
              </>
            ) : !canAfford ? (
              <>
                <strong>{actionName}</strong> kostet{" "}
                <span className="text-[#ffb606] font-semibold">
                  {creditsNeeded} Credits
                </span>
                , du hast aber nur {currentCredits}.
                <span className="block mt-2 text-muted-foreground">
                  Dir fehlen noch {creditsMissing} Credits.
                </span>
              </>
            ) : (
              <>
                <strong>{actionName}</strong> kostet{" "}
                <span className="text-[#ffb606] font-semibold">
                  {creditsNeeded} {creditsNeeded === 1 ? "Credit" : "Credits"}
                </span>
                .
                {isLow && (
                  <span className="block mt-2 text-orange-400">
                    Dein Guthaben wird knapp – denke daran, bald aufzuladen.
                  </span>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Credit Status */}
        <div className="py-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <p className="text-sm text-muted-foreground">Dein Guthaben</p>
              <p
                className={`text-2xl font-bold ${isEmpty ? "text-red-400" : isLow || !canAfford ? "text-orange-400" : "text-white"}`}
              >
                {currentCredits} Credits
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Kosten</p>
              <p className="text-2xl font-bold text-[#ffb606]">
                -{creditsNeeded}
              </p>
            </div>
          </div>

          {canAfford && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              Nach der Aktion:{" "}
              <strong>{currentCredits - creditsNeeded} Credits</strong> übrig
            </p>
          )}
        </div>

        {/* 3-Button Footer with clear hierarchy */}
        <DialogFooter className="flex-col gap-2">
          {isEmpty || !canAfford ? (
            <>
              {/* Primary: Quick Booster Purchase */}
              <Link href="/app/credits?tab=topups" className="w-full">
                <Button className="w-full bg-gradient-to-r from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] hover:shadow-lg hover:shadow-[#FF6B9D]/30">
                  <Zap className="mr-2 h-4 w-4" />
                  Schnell-Booster (ab €5,99)
                </Button>
              </Link>

              {/* Secondary: View Plans */}
              <Link href="/app/credits?tab=plans" className="w-full">
                <Button variant="outline" className="w-full">
                  <Rocket className="mr-2 h-4 w-4" />
                  Monatliche Pläne ansehen
                </Button>
              </Link>

              {/* Tertiary: Cancel */}
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full text-muted-foreground"
              >
                Später erinnern
              </Button>
            </>
          ) : (
            <>
              {/* Can afford - show continue button prominently */}
              {onContinue && (
                <Button
                  onClick={() => {
                    onContinue();
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)]"
                >
                  Fortfahren
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}

              {/* If low credits, offer to top up */}
              {isLow && (
                <Link href="/app/credits?tab=topups" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Trotzdem aufladen
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full text-muted-foreground"
              >
                Abbrechen
              </Button>
            </>
          )}
        </DialogFooter>

        {/* Trust signal */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="w-3 h-3 text-green-400" />
            Sichere Zahlung · Jederzeit kündbar · Keine Abo-Falle
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
