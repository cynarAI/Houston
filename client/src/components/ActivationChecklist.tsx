import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  MessageSquare,
  Target,
  Compass,
  CheckSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Rocket,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface ActivationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  link: string;
  linkText: string;
}

interface ActivationChecklistProps {
  hasFirstChat: boolean;
  hasFirstGoal: boolean;
  hasStrategy: boolean;
  hasFirstTodo: boolean;
  hasCompletedTodo: boolean;
  className?: string;
}

export function ActivationChecklist({
  hasFirstChat,
  hasFirstGoal,
  hasStrategy,
  hasFirstTodo,
  hasCompletedTodo,
  className,
}: ActivationChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [previousProgress, setPreviousProgress] = useState(0);

  // Check if checklist was dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("activation-checklist-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const steps: ActivationStep[] = [
    {
      id: "chat",
      title: "Mit Houston chatten",
      description: "Starte dein erstes Gespräch mit deinem KI-Marketing-Coach",
      icon: MessageSquare,
      completed: hasFirstChat,
      link: "/app/chats",
      linkText: "Zum Chat",
    },
    {
      id: "goal",
      title: "Erstes Ziel erstellen",
      description: "Definiere ein SMART-Ziel für dein Marketing",
      icon: Target,
      completed: hasFirstGoal,
      link: "/app/goals",
      linkText: "Ziel erstellen",
    },
    {
      id: "strategy",
      title: "Strategie definieren",
      description: "Lege deine Positionierung und Zielgruppen fest",
      icon: Compass,
      completed: hasStrategy,
      link: "/app/strategy",
      linkText: "Zur Strategie",
    },
    {
      id: "todo",
      title: "Aufgabe erstellen",
      description: "Erstelle deine erste Marketing-Aufgabe",
      icon: CheckSquare,
      completed: hasFirstTodo,
      link: "/app/todos",
      linkText: "Aufgabe erstellen",
    },
    {
      id: "complete-todo",
      title: "Aufgabe erledigen",
      description: "Erlebe deinen ersten Erfolg durch eine erledigte Aufgabe",
      icon: Sparkles,
      completed: hasCompletedTodo,
      link: "/app/todos",
      linkText: "Zu den Aufgaben",
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;
  const isComplete = completedSteps === steps.length;

  // Trigger confetti when all steps are completed
  useEffect(() => {
    if (isComplete && previousProgress < 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF6B9D", "#8B5CF6", "#3B82F6", "#10B981"],
      });
    }
    setPreviousProgress(progress);
  }, [isComplete, progress, previousProgress]);

  // Don't show if dismissed or complete
  if (isDismissed || isComplete) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem("activation-checklist-dismissed", "true");
    setIsDismissed(true);
  };

  // Find next incomplete step
  const nextStep = steps.find((s) => !s.completed);

  return (
    <Card
      className={cn(
        "glass border-white/10 backdrop-blur-xl overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)]">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Mission starten</CardTitle>
              <CardDescription>
                Schließe diese Schritte ab, um Houston voll zu nutzen
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-medium">
              {completedSteps}/{steps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Fortschritt</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      {/* Steps */}
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {steps.map((step) => {
              const Icon = step.icon;
              const isNext = nextStep?.id === step.id;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                    step.completed
                      ? "bg-green-500/10 border border-green-500/20"
                      : isNext
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted/30 border border-transparent",
                  )}
                >
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle
                        className={cn(
                          "h-5 w-5",
                          isNext ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          step.completed
                            ? "text-green-500"
                            : isNext
                              ? "text-primary"
                              : "text-muted-foreground",
                        )}
                      />
                      <h4
                        className={cn(
                          "text-sm font-medium",
                          step.completed &&
                            "text-muted-foreground line-through",
                        )}
                      >
                        {step.title}
                      </h4>
                      {isNext && (
                        <Badge
                          variant="outline"
                          className="text-xs border-primary/50 text-primary"
                        >
                          Nächster Schritt
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-6">
                      {step.description}
                    </p>
                  </div>

                  {/* Action */}
                  {!step.completed && (
                    <Link href={step.link}>
                      <Button
                        variant={isNext ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "flex-shrink-0",
                          isNext &&
                            "bg-gradient-to-r from-[#FF6B9D] to-[#8B5CF6] hover:opacity-90",
                        )}
                      >
                        {step.linkText}
                      </Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Motivation Message */}
          {completedSteps > 0 && completedSteps < steps.length && (
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
              <p className="text-sm text-center">
                <span className="font-medium">Super Fortschritt!</span>{" "}
                <span className="text-muted-foreground">
                  Noch {steps.length - completedSteps}{" "}
                  {steps.length - completedSteps === 1 ? "Schritt" : "Schritte"}{" "}
                  bis zur vollen Power von Houston.
                </span>
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
