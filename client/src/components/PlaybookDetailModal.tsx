import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Playbook, PlaybookDifficulty } from "@/data/playbooks";
import { PLAYBOOK_CATEGORIES, PLAYBOOK_DIFFICULTIES } from "@/data/playbooks";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Lightbulb,
  MessageSquare,
  Play,
  Rocket,
  Target,
} from "lucide-react";
import { useState } from "react";

interface PlaybookDetailModalProps {
  playbook: Playbook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartMission: (playbook: Playbook) => void;
  onAskHouston: (prompt: string) => void;
}

const difficultyColors: Record<PlaybookDifficulty, string> = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function PlaybookDetailModal({
  playbook,
  open,
  onOpenChange,
  onStartMission,
  onAskHouston,
}: PlaybookDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!playbook) return null;

  const Icon = playbook.icon;
  const difficulty = PLAYBOOK_DIFFICULTIES[playbook.difficulty];
  const category = PLAYBOOK_CATEGORIES[playbook.category];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-[var(--color-gradient-pink)]/20 to-[var(--color-gradient-purple)]/20 p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] shadow-lg shadow-purple-500/20 shrink-0">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {category.label}
                </Badge>
                <Badge
                  variant="outline"
                  className={difficultyColors[playbook.difficulty]}
                >
                  {difficulty.label}
                </Badge>
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl">{playbook.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {playbook.subtitle}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{playbook.durationDays} Tage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>{playbook.steps.length} Schritte</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              <span>{playbook.goals.length} {playbook.goals.length === 1 ? "Ziel" : "Ziele"}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="border-b px-6">
            <TabsList className="bg-transparent h-12 p-0 gap-4">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                Übersicht
              </TabsTrigger>
              <TabsTrigger
                value="steps"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                Schritte
              </TabsTrigger>
              <TabsTrigger
                value="goals"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                Ziele
              </TabsTrigger>
              <TabsTrigger
                value="houston"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                Houston-Hilfe
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[350px]">
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 m-0">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Beschreibung</h4>
                  <p className="text-muted-foreground">{playbook.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Das bringt dir dieses Playbook
                  </h4>
                  <ul className="grid gap-2">
                    {playbook.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {playbook.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Steps Tab */}
            <TabsContent value="steps" className="p-6 m-0">
              <div className="space-y-4">
                {playbook.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="relative flex gap-4 p-4 rounded-lg border border-border/50 bg-card/30"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)] text-white text-sm font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{step.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {step.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="p-6 m-0">
              <div className="space-y-6">
                {playbook.goals.map((goal, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-border/50 bg-card/30"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-5 w-5 text-[var(--color-gradient-pink)]" />
                      <h4 className="font-semibold">{goal.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {goal.description}
                    </p>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-blue-400 w-24 shrink-0">
                          Spezifisch:
                        </span>
                        <span className="text-muted-foreground">
                          {goal.specific}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-green-400 w-24 shrink-0">
                          Messbar:
                        </span>
                        <span className="text-muted-foreground">
                          {goal.measurable}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-yellow-400 w-24 shrink-0">
                          Erreichbar:
                        </span>
                        <span className="text-muted-foreground">
                          {goal.achievable}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-purple-400 w-24 shrink-0">
                          Relevant:
                        </span>
                        <span className="text-muted-foreground">
                          {goal.relevant}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-pink-400 w-24 shrink-0">
                          Zeitgebunden:
                        </span>
                        <span className="text-muted-foreground">
                          {goal.timeBound}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Houston Help Tab */}
            <TabsContent value="houston" className="p-6 m-0">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Frag Houston nach Unterstützung für dieses Playbook. Klicke auf
                  einen Vorschlag oder formuliere deine eigene Frage.
                </p>
                {playbook.houstonPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAskHouston(prompt)}
                    className="w-full flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 hover:border-border transition-all text-left group"
                  >
                    <MessageSquare className="h-5 w-5 text-[var(--color-gradient-pink)] shrink-0" />
                    <span className="flex-1 text-sm">{prompt}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer with CTA */}
        <div className="border-t p-6 bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {playbook.steps.length} Aufgaben
              </span>{" "}
              werden für dich erstellt
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Schließen
              </Button>
              <Button
                variant="gradient"
                onClick={() => onStartMission(playbook)}
                className="gap-2"
              >
                <Rocket className="h-4 w-4" />
                Mission starten
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PlaybookDetailModal;
