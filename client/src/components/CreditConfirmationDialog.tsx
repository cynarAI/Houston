import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface CreditConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
  featureKey: string;
  creditCost: number;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function CreditConfirmationDialog({
  open,
  onOpenChange,
  featureName,
  featureKey,
  creditCost,
  onConfirm,
  onCancel,
}: CreditConfirmationDialogProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { data: balance } = trpc.credits.getBalance.useQuery();

  const currentBalance = balance ?? 0;
  const hasEnoughCredits = currentBalance >= creditCost;
  const remainingBalance = currentBalance - creditCost;

  const handleConfirm = () => {
    if (dontShowAgain) {
      // Store preference in localStorage
      const hiddenDialogs = JSON.parse(
        localStorage.getItem("hiddenCreditDialogs") || "[]"
      );
      if (!hiddenDialogs.includes(featureKey)) {
        hiddenDialogs.push(featureKey);
        localStorage.setItem("hiddenCreditDialogs", JSON.stringify(hiddenDialogs));
      }
    }
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ffb606]" />
            {featureName} starten?
          </DialogTitle>
          <DialogDescription>
            Diese Aktion verbraucht Credits aus deinem Guthaben.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Credit Cost */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#ffb606]/10 to-[#442e66]/10 border border-[#ffb606]/20">
            <span className="text-sm font-medium">Kosten</span>
            <span className="text-lg font-bold gradient-text">
              {creditCost} {creditCost === 1 ? 'Credit' : 'Credits'}
            </span>
          </div>

          {/* Balance Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Aktuelles Guthaben</span>
              <span className="font-semibold">{currentBalance} Credits</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Nach Ausführung</span>
              <span className={`font-semibold ${
                remainingBalance < 10 ? 'text-orange-400' : ''
              }`}>
                {hasEnoughCredits ? remainingBalance : currentBalance} Credits
              </span>
            </div>
          </div>

          {/* Insufficient Credits Warning */}
          {!hasEnoughCredits && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-400 mb-1">
                  Nicht genug Credits
                </p>
                <p className="text-red-400/80">
                  Du benötigst {creditCost - currentBalance} weitere Credits, um diese Aktion auszuführen.
                </p>
              </div>
            </div>
          )}

          {/* Don't Show Again Checkbox */}
          {hasEnoughCredits && creditCost >= 5 && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="dont-show-again"
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
              />
              <label
                htmlFor="dont-show-again"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Nicht mehr anzeigen
              </label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Abbrechen
          </Button>
          {hasEnoughCredits ? (
            <Button onClick={handleConfirm} className="gap-2">
              <Sparkles className="w-4 h-4" />
              {featureName} starten
            </Button>
          ) : (
            <Button onClick={() => window.location.href = "/app/credits"} className="gap-2">
              Credits aufladen
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Helper function to check if dialog should be shown
 */
export function shouldShowCreditDialog(featureKey: string): boolean {
  const hiddenDialogs = JSON.parse(
    localStorage.getItem("hiddenCreditDialogs") || "[]"
  );
  return !hiddenDialogs.includes(featureKey);
}
