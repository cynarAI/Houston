import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Rocket, Target, Lightbulb, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface OnboardingProps {
  open: boolean;
  onComplete: () => void;
}

export default function Onboarding({ open, onComplete }: OnboardingProps) {
  // DEPRECATED: This component is replaced by OnboardingWizard in DashboardLayout
  // Return null to prevent rendering - will be removed in future cleanup
  return null;
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Form data
  const [goalData, setGoalData] = useState({
    title: "",
    description: "",
    specific: "",
    measurable: "",
  });
  
  const [strategyData, setStrategyData] = useState({
    positioning: "",
    personas: "",
    coreMessages: "",
  });

  const { data: workspaces } = trpc.workspaces.list.useQuery();
  const createGoalMutation = trpc.goals.create.useMutation();
  const createStrategyMutation = trpc.strategy.createOrUpdate.useMutation();
  const createTodoMutation = trpc.todos.create.useMutation();

  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const workspaceId = workspaces?.[0]?.id;
      if (!workspaceId) {
        toast.error("Workspace nicht gefunden");
        return;
      }

      // Create goal
      if (goalData.title) {
        const goal = await createGoalMutation.mutateAsync({
          workspaceId,
          title: goalData.title,
          description: goalData.description,
          specific: goalData.specific,
          measurable: goalData.measurable,
          achievable: "",
          relevant: "",
          timeBound: "",
          // targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        });

        // Create initial tasks from goal
        await createTodoMutation.mutateAsync({
          workspaceId,
          title: `Definiere Meilensteine für: ${goalData.title}`,
          description: "Breche dein Ziel in kleinere, erreichbare Meilensteine herunter.",
          priority: "high",
          goalId: goal.id,
        });

        await createTodoMutation.mutateAsync({
          workspaceId,
          title: `Erstelle Aktionsplan für: ${goalData.title}`,
          description: "Plane konkrete Schritte und Ressourcen für dein Ziel.",
          priority: "medium",
          goalId: goal.id,
        });
      }

      // Create strategy
      if (strategyData.positioning) {
        await createStrategyMutation.mutateAsync({
          workspaceId,
          positioning: strategyData.positioning,
          personas: strategyData.personas,
          coreMessages: strategyData.coreMessages,
          channels: "",
          contentPillars: "",
        });
      }

      toast.success("Onboarding abgeschlossen! 🎉");
      onComplete();
    } catch (error) {
      toast.error("Fehler beim Abschließen des Onboardings");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Willkommen bei Houston!
          </DialogTitle>
          <DialogDescription>
            Lass uns gemeinsam deine Marketing-Mission starten.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Schritt {step} von {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Bereit für den Start?</h3>
              <p className="text-muted-foreground">
                Houston ist dein AI Marketing Coach. Ich helfe dir dabei, klare Ziele zu setzen,
                eine effektive Strategie zu entwickeln und deine Marketing-Aktivitäten zu organisieren.
              </p>
              <div className="grid gap-4 text-left">
                <div className="flex gap-3">
                  <Target className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">SMART-Ziele setzen</h4>
                    <p className="text-sm text-muted-foreground">
                      Definiere messbare Ziele und verfolge deinen Fortschritt
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Strategie entwickeln</h4>
                    <p className="text-sm text-muted-foreground">
                      Positionierung, Zielgruppen und Kernbotschaften festlegen
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Aufgaben organisieren</h4>
                    <p className="text-sm text-muted-foreground">
                      To-dos erstellen und den Überblick behalten
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Define First Goal */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                Dein erstes Ziel
              </h3>
              <p className="text-sm text-muted-foreground">
                Was möchtest du in den nächsten 3 Monaten erreichen?
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-title">Ziel-Titel *</Label>
                <Input
                  id="goal-title"
                  placeholder="z.B. 100 neue Leads generieren"
                  value={goalData.title}
                  onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-description">Beschreibung</Label>
                <Textarea
                  id="goal-description"
                  placeholder="Was genau möchtest du erreichen?"
                  value={goalData.description}
                  onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-specific">Spezifisch</Label>
                <Textarea
                  id="goal-specific"
                  placeholder="Was genau soll erreicht werden?"
                  value={goalData.specific}
                  onChange={(e) => setGoalData({ ...goalData, specific: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-measurable">Messbar</Label>
                <Textarea
                  id="goal-measurable"
                  placeholder="Wie wird der Erfolg gemessen?"
                  value={goalData.measurable}
                  onChange={(e) => setGoalData({ ...goalData, measurable: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Initial Strategy */}
        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Deine Marketing-Strategie
              </h3>
              <p className="text-sm text-muted-foreground">
                Definiere die Grundlagen deiner Marketing-Strategie.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="positioning">Positionierung *</Label>
                <Textarea
                  id="positioning"
                  placeholder="z.B. Wir sind die führende Lösung für KMUs im DACH-Raum..."
                  value={strategyData.positioning}
                  onChange={(e) => setStrategyData({ ...strategyData, positioning: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="personas">Zielgruppen & Personas</Label>
                <Textarea
                  id="personas"
                  placeholder="z.B. Marketing-Manager in KMUs (25-45 Jahre), suchen effiziente Lösungen..."
                  value={strategyData.personas}
                  onChange={(e) => setStrategyData({ ...strategyData, personas: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="core-messages">Kernbotschaften</Label>
                <Textarea
                  id="core-messages"
                  placeholder="z.B. 1. Wir machen Marketing einfach und messbar. 2. Datenbasierte Entscheidungen..."
                  value={strategyData.coreMessages}
                  onChange={(e) => setStrategyData({ ...strategyData, coreMessages: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="space-y-4 py-4">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Bereit zum Start!</h3>
              <p className="text-muted-foreground">
                Perfekt! Ich habe basierend auf deinen Angaben:
              </p>
              <div className="grid gap-3 text-left bg-muted/50 p-4 rounded-lg">
                {goalData.title && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Ziel erstellt</p>
                      <p className="text-sm text-muted-foreground">{goalData.title}</p>
                    </div>
                  </div>
                )}
                {strategyData.positioning && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Strategie angelegt</p>
                      <p className="text-sm text-muted-foreground">Positionierung und Zielgruppen definiert</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Erste Aufgaben generiert</p>
                    <p className="text-sm text-muted-foreground">2 To-dos basierend auf deinem Ziel</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Klicke auf "Mission starten" um zu deinem Dashboard zu gelangen!
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Zurück
          </Button>
          
          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={
                (step === 2 && !goalData.title) ||
                (step === 3 && !strategyData.positioning)
              }
            >
              Weiter
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              Mission starten 🚀
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
