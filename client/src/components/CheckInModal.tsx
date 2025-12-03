import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Rocket, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

interface CheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: number;
  goalTitle: string;
  currentProgress: number;
  onSuccess?: () => void;
}

export function CheckInModal({ open, onOpenChange, goalId, goalTitle, currentProgress, onSuccess }: CheckInModalProps) {
  const [progress, setProgress] = useState(currentProgress);
  const [note, setNote] = useState("");
  const updateGoalMutation = trpc.goals.updateProgress.useMutation();

  const handleSubmit = async () => {
    try {
      await updateGoalMutation.mutateAsync({
        id: goalId,
        progress: progress,
      });
      
      trackEvent(AnalyticsEvents.GOAL_UPDATED, { goal_id: goalId, new_progress: progress });
      toast.success("Fortschritt gespeichert! 🚀");
      
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Fehler beim Speichern.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-[#FF6B9D]" />
            Check-in: {goalTitle}
          </DialogTitle>
          <DialogDescription>
            Hast du diese Woche Fortschritte gemacht? Aktualisiere deinen Status.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Neuer Fortschritt</Label>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <Slider
              defaultValue={[currentProgress]}
              value={[progress]}
              max={100}
              step={5}
              onValueChange={(vals) => setProgress(vals[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Start</span>
              <span>Halbzeit</span>
              <span>Ziel erreicht</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Notiz (Optional)</Label>
            <Input
              id="note"
              placeholder="Was hast du erreicht? (z.B. +5 neue Leads)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={updateGoalMutation.isLoading}>
            {updateGoalMutation.isLoading ? "Speichert..." : "Check-in speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
