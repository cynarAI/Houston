import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkles, Zap, ArrowRight } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass border-white/20 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {isEmpty ? (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            ) : isLow ? (
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
                ? "Keine Credits mehr"
                : isLow
                ? "Credits knapp"
                : "Credit-Kosten"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {isEmpty ? (
              <>
                Du hast keine Credits mehr. Lade dein Guthaben auf, um{" "}
                <strong>{actionName}</strong> zu nutzen.
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
                    ⚠️ Dein Guthaben ist fast aufgebraucht ({currentCredits} Credits übrig).
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
              <p className={`text-2xl font-bold ${isEmpty ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-white'}`}>
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

          {!isEmpty && canAfford && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              Nach der Aktion: <strong>{currentCredits - creditsNeeded} Credits</strong> übrig
            </p>
          )}
          {!isEmpty && !canAfford && (
            <p className="text-sm text-red-400 mt-3 text-center">
              ⚠️ Du brauchst noch <strong>{creditsNeeded - currentCredits} Credits</strong> mehr für diese Aktion.
            </p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isEmpty ? (
            <>
              <Button variant="outline" onClick={onClose} className="sm:flex-1">
                Abbrechen
              </Button>
              <Link href="/app/credits" className="sm:flex-1">
                <Button className="w-full bg-gradient-to-r from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)]">
                  <Zap className="mr-2 h-4 w-4" />
                  Credits aufladen
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} className="sm:flex-1">
                Abbrechen
              </Button>
              {canAfford && onContinue && (
                <Button
                  onClick={() => {
                    onContinue();
                    onClose();
                  }}
                  className="sm:flex-1 bg-gradient-to-r from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)]"
                >
                  Fortfahren
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {!canAfford && (
                <Link href="/app/credits" className="sm:flex-1">
                  <Button className="w-full bg-gradient-to-r from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)]">
                    <Zap className="mr-2 h-4 w-4" />
                    Credits aufladen
                  </Button>
                </Link>
              )}
              {canAfford && isLow && (
                <Link href="/app/credits" className="sm:flex-1">
                  <Button variant="outline" className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                    <Zap className="mr-2 h-4 w-4" />
                    Mehr kaufen
                  </Button>
                </Link>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
