import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Sparkles,
  Target,
  CheckSquare,
  MessageSquare,
  ArrowRight,
  Brain,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
// Onboarding is handled by DashboardLayout's OnboardingWizard
import type { Goal, Todo } from "@shared/types";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { CreditBanner } from "@/components/CreditBanner";
import { ActivationChecklist } from "@/components/ActivationChecklist";
// ReturnReminder removed - Today's Focus Hero provides this context
import { checkActivationMilestone } from "@/lib/celebrations";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { handleMutationError, ErrorMessages } from "@/lib/errorHandling";
import { PlaybookCard } from "@/components/PlaybookCard";
import { PlaybookDetailModal } from "@/components/PlaybookDetailModal";
import { getSuggestedPlaybooks, type Playbook } from "@/data/playbooks";
import { useLocation } from "wouter";
import { CheckInModal } from "@/components/CheckInModal";

// Type for AI Insights recommendations
interface InsightRecommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action: string;
  link: string;
}

interface InsightsResult {
  recommendations: InsightRecommendation[];
}

// Daily Wisdom Tips - Auf Deutsch
const DAILY_TIPS = [
  {
    title: "Fokus auf Retention",
    text: "Es kostet 5x mehr, einen neuen Kunden zu gewinnen, als einen bestehenden zu halten.",
  },
  {
    title: "Content Recycling",
    text: "Nimm deinen besten Blogpost und mach daraus 3 Social Media Posts und eine E-Mail.",
  },
  {
    title: "Social Proof",
    text: "Platziere Testimonials direkt neben deinen 'Kaufen'-Buttons für höhere Conversion.",
  },
  {
    title: "E-Mail Betreffzeilen",
    text: "Fragen in Betreffzeilen erhöhen oft die Öffnungsrate um über 15%.",
  },
  {
    title: "Pareto-Prinzip",
    text: "20% deiner Marketing-Aktivitäten bringen 80% der Ergebnisse. Finde diese 20%.",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Time-based greeting - Deutsch
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  };

  const [dailyTip] = useState(
    () => DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)],
  );
  const {
    data: workspaces,
    isLoading: workspacesLoading,
    isError: workspacesError,
    refetch: refetchWorkspaces,
  } = trpc.workspaces.list.useQuery();

  // Playbook state
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(
    null,
  );
  const [isPlaybookModalOpen, setIsPlaybookModalOpen] = useState(false);

  // Check-in state
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkInGoal, setCheckInGoal] = useState<Goal | null>(null);

  const currentWorkspace = workspaces?.[0];
  const {
    data: goals,
    isLoading: goalsLoading,
    isError: goalsError,
  } = trpc.goals.listByWorkspace.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id },
  );
  const {
    data: todos,
    isLoading: todosLoading,
    isError: todosError,
  } = trpc.todos.listByWorkspace.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id },
  );
  const {
    data: chatSessions,
    isLoading: chatsLoading,
    isError: chatsError,
  } = trpc.chat.listSessions.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id },
  );
  const { data: strategy } = trpc.strategy.getByWorkspace.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id },
  );

  // Combined loading/error states
  const isLoading =
    workspacesLoading ||
    (currentWorkspace && (goalsLoading || todosLoading || chatsLoading));
  const hasError = workspacesError || goalsError || todosError || chatsError;

  // Activation status for checklist
  const activationStatus = useMemo(
    () => ({
      hasFirstChat: (chatSessions?.length || 0) > 0,
      hasFirstGoal: (goals?.length || 0) > 0,
      hasStrategy: !!strategy?.positioning,
      hasFirstTodo: (todos?.length || 0) > 0,
      hasCompletedTodo: todos?.some((t: Todo) => t.status === "done") || false,
    }),
    [chatSessions, goals, strategy, todos],
  );

  // Check for activation milestone celebrations
  useEffect(() => {
    if (!isLoading && goals !== undefined && todos !== undefined) {
      checkActivationMilestone(activationStatus);
    }
  }, [activationStatus, isLoading, goals, todos]);

  const activeGoals =
    goals?.filter((g: Goal) => g.status === "active").length || 0;
  const openTodos = todos?.filter((t: Todo) => t.status !== "done").length || 0;
  const totalChatSessions = chatSessions?.length || 0;

  // AI Insights
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insights, setInsights] = useState<InsightsResult | null>(null);
  const generateInsightsMutation =
    trpc.insights.generateRecommendations.useMutation();
  const createGoalMutation = trpc.goals.create.useMutation();
  const createTodoMutation = trpc.todos.create.useMutation();

  // Get suggested playbooks based on user state
  const suggestedPlaybooks = useMemo(() => {
    return getSuggestedPlaybooks({
      hasGoals: activeGoals > 0,
      hasStrategy: !!strategy?.positioning,
      hasTodos: (todos?.length || 0) > 0,
      hasEmailList: false, // We don't track this yet
    });
  }, [activeGoals, strategy, todos]);

  const loadInsights = async () => {
    if (!currentWorkspace?.id) return;
    setInsightsLoading(true);
    try {
      const result = await generateInsightsMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
      });
      setInsights(result);

      // Track insights generation
      trackEvent(AnalyticsEvents.INSIGHTS_GENERATED, {
        workspace_id: currentWorkspace.id,
      });
    } catch (error) {
      handleMutationError(error, ErrorMessages.insightsGenerate);
    } finally {
      setInsightsLoading(false);
    }
  };

  // Removed automatic insights loading to prevent unwanted credit deductions
  // User must click "Generate Insights" button manually

  // Note: Onboarding is now handled by DashboardLayout's OnboardingWizard component
  // which uses server-side onboarding status instead of localStorage

  // Playbook handlers
  const handleSelectPlaybook = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setIsPlaybookModalOpen(true);
  };

  const handleStartMission = async (playbook: Playbook) => {
    const workspaceId = currentWorkspace?.id;
    if (!workspaceId) return;

    try {
      // Create goal from playbook
      if (playbook.goals.length > 0) {
        const goal = playbook.goals[0];
        await createGoalMutation.mutateAsync({
          workspaceId,
          title: goal.title,
          description: goal.description,
          specific: goal.specific,
          measurable: goal.measurable,
          achievable: goal.achievable,
          relevant: goal.relevant,
          timeBound: goal.timeBound,
        });
      }

      // Create todos from playbook steps
      for (const step of playbook.steps) {
        if (step.todoTemplate) {
          await createTodoMutation.mutateAsync({
            workspaceId,
            title: step.todoTemplate.title,
            description: step.todoTemplate.description,
            priority: "medium",
          });
        }
      }

      // Track the event
      trackEvent(AnalyticsEvents.GOAL_CREATED, {
        is_first_goal: activeGoals === 0,
      });

      setIsPlaybookModalOpen(false);
      navigate("/app/todos");
    } catch (error) {
      handleMutationError(error, ErrorMessages.goalCreate);
    }
  };

  const handleAskHouston = (prompt: string) => {
    navigate(`/app/chats?prompt=${encodeURIComponent(prompt)}`);
    setIsPlaybookModalOpen(false);
  };

  const handleCheckIn = (goal: Goal) => {
    setCheckInGoal(goal);
    setIsCheckInModalOpen(true);
  };

  const handleCheckInSuccess = () => {
    // In a real app we might refetch goals, but trpc useQuery usually handles this via invalidation
    // or we can manually refetch if needed. For now, just close modal.
  };

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Dashboard wird geladen..." fullPage />
      </DashboardLayout>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <ErrorState
            title="Dashboard konnte nicht geladen werden"
            message="Es gab ein Problem beim Laden deiner Daten. Bitte versuche es erneut."
            onRetry={() => refetchWorkspaces()}
            fullPage
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-4 md:py-6 lg:py-8 space-y-4 md:space-y-6">
        {/* Credit Banner - Shows when credits are low */}
        <CreditBanner threshold={20} />

        {/* ============ TODAY'S FOCUS - Hero Element ============ */}
        {/* Glassmorphism + 4-Farben AI-Gradient für visuelles Highlight */}
        <Card className="glass border-border/50 backdrop-blur-xl bg-gradient-to-br from-[#FF6B9D]/5 via-background to-[#00D4FF]/5 dark:from-[#FF6B9D]/10 dark:via-[#1a1a2e]/80 dark:to-[#00D4FF]/10 overflow-hidden hero-entrance relative">
          {/* Gradient Overlay für mehr Tiefe */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#8B5CF6]/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-[#C44FE2]/5 to-transparent pointer-events-none" />

          <CardContent className="p-4 md:p-6 lg:p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Left: Focus Content */}
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  {getTimeGreeting()}, {user?.name?.split(" ")[0] || "Captain"}
                </p>

                {/* Dynamic Focus Message */}
                {openTodos > 0 ? (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      {openTodos} {openTodos === 1 ? "Aufgabe" : "Aufgaben"}{" "}
                      warten auf dich
                    </h1>
                    <p className="text-muted-foreground mb-4 max-w-lg">
                      Schritt für Schritt zum Ziel. Houston hilft dir, wenn du
                      nicht weiter weißt.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="/app/todos">
                        <Button
                          variant="gradient"
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          Aufgaben ansehen
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/app/chats">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          Houston fragen
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : activeGoals > 0 && (todos?.length || 0) === 0 ? (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      Deine Ziele sind bereit! 🎯
                    </h1>
                    <p className="text-muted-foreground mb-4 max-w-lg">
                      Lass uns jetzt konkrete Schritte definieren, um dein
                      erstes Ziel zu erreichen.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="/app/chats?prompt=Lass+uns+einen+Plan+für+mein+erstes+Ziel+erstellen">
                        <Button
                          variant="gradient"
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          Plan erstellen
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/app/goals">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          Ziele ansehen
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : activeGoals > 0 ? (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      Alle Aufgaben erledigt! 🎉
                    </h1>
                    <p className="text-muted-foreground mb-4 max-w-lg">
                      Super gemacht! Frag Houston nach den nächsten Schritten
                      für dein Ziel.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="/app/chats">
                        <Button
                          variant="gradient"
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          Mit Houston planen
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/app/goals">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          Ziele ansehen
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      Los geht's! 🚀
                    </h1>
                    <p className="text-muted-foreground mb-4 max-w-lg">
                      {activationStatus.hasStrategy
                        ? "Deine Strategie steht. Jetzt brauchen wir konkrete Ziele für deinen Erfolg."
                        : "Erzähl Houston von deinem Business und deinen Zielen. Er erstellt einen Plan für dich."}
                    </p>
                    <Link
                      href={
                        activationStatus.hasStrategy
                          ? "/app/chats?prompt=Hilf+mir+ein+neues+Ziel+zu+definieren"
                          : "/app/chats"
                      }
                    >
                      <Button
                        variant="gradient"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        {activationStatus.hasStrategy
                          ? "Ziel definieren"
                          : "Ersten Chat starten"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Right: Quick Stats */}
              <div className="flex gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text-aistronaut">
                    {activeGoals}
                  </div>
                  <div className="text-xs text-muted-foreground">Ziele</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text-aistronaut">
                    {openTodos}
                  </div>
                  <div className="text-xs text-muted-foreground">To-dos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text-aistronaut">
                    {totalChatSessions}
                  </div>
                  <div className="text-xs text-muted-foreground">Chats</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ReturnReminder removed - Today's Focus Hero already provides this context */}

        {/* Activation Checklist - Shows until user is activated */}
        {!activationStatus.hasFirstChat || !activationStatus.hasFirstGoal ? (
          <ActivationChecklist
            hasFirstChat={activationStatus.hasFirstChat}
            hasFirstGoal={activationStatus.hasFirstGoal}
            hasStrategy={activationStatus.hasStrategy}
            hasFirstTodo={activationStatus.hasFirstTodo}
            hasCompletedTodo={activationStatus.hasCompletedTodo}
          />
        ) : null}

        {/* AI Insights Card - Prominent */}
        {/* SMART INSIGHTS: Daily Wisdom + Upsell */}
        <Card className="glass border-border/50 backdrop-blur-xl relative overflow-hidden">
          {/* Background decoration - 4-Farben Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#8B5CF6]/10 via-[#C44FE2]/5 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#00D4FF]/10 to-transparent rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#C44FE2] to-[#00D4FF] shadow-lg shadow-purple-500/20">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Tägliche Weisheit</CardTitle>
                  <CardDescription>
                    Dein Marketing-Impuls für heute
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Free Daily Tip */}
              <div className="flex-1 bg-card/50 border border-border/50 rounded-xl p-5 relative">
                <div className="absolute -left-1 top-6 w-1 h-12 bg-gradient-to-b from-[#FF6B9D] via-[#C44FE2] to-[#00D4FF] rounded-r-full" />
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C44FE2]" />
                  {dailyTip.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  „{dailyTip.text}"
                </p>
              </div>

              {/* Upsell / Deep Dive */}
              <div className="flex-shrink-0 w-full md:w-auto flex flex-col gap-3 p-5 rounded-xl border border-[#C44FE2]/20 bg-gradient-to-br from-[#C44FE2]/5 to-[#8B5CF6]/5">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-[#C44FE2]" />
                  <h4 className="font-medium text-sm">Tiefer eintauchen?</h4>
                </div>
                <p className="text-xs text-muted-foreground max-w-[250px]">
                  Lass Houston dein Marketing analysieren und konkrete
                  Möglichkeiten finden.
                </p>

                {insights ? (
                  // If insights are already loaded, show them
                  <div className="space-y-3 mt-2">
                    {insights.recommendations.map(
                      (rec: InsightRecommendation, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-background/80 rounded-lg border border-border/50"
                        >
                          <p className="font-medium text-sm text-foreground">
                            {rec.title}
                          </p>
                          <Link
                            href={rec.link}
                            className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            {rec.action} <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadInsights}
                    disabled={insightsLoading}
                    className="w-full justify-between group border-[#C44FE2]/30 hover:border-[#C44FE2] hover:bg-[#C44FE2]/10"
                  >
                    <span className="flex items-center gap-2">
                      {insightsLoading ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Brain className="h-3 w-3" />
                      )}
                      Deep Dive Analyse
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 h-5 bg-background/80"
                    >
                      3 Credits
                    </Badge>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Playbooks */}
        {suggestedPlaybooks.length > 0 && (
          <Card className="glass border-border/50 backdrop-blur-xl bg-gradient-to-br from-[#FF6B9D]/3 via-transparent to-[#C44FE2]/3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B9D] via-[#C44FE2] to-[#8B5CF6]">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Empfohlene Playbooks</CardTitle>
                    <CardDescription>
                      Bewährte Marketing-Strategien für deinen nächsten Schritt
                    </CardDescription>
                  </div>
                </div>
                <Link href="/app/playbooks">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Alle Playbooks
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {suggestedPlaybooks.map((playbook) => (
                  <PlaybookCard
                    key={playbook.id}
                    playbook={playbook}
                    onSelect={handleSelectPlaybook}
                    compact
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Secondary Content Grid - Just 2 essential cards */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          {/* Goals & Progress */}
          <Card className="bg-gradient-to-br from-[#00D4FF]/3 via-transparent to-[#8B5CF6]/3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Ziele & Fortschritt</CardTitle>
                <CardDescription>
                  Deine Marketing-Ziele im Überblick
                </CardDescription>
              </div>
              {activeGoals > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 px-2"
                  onClick={() => {
                    const firstGoal = goals?.find(
                      (g: Goal) => g.status === "active",
                    );
                    if (firstGoal) handleCheckIn(firstGoal);
                  }}
                >
                  <CheckSquare className="h-3 w-3 mr-1" />
                  Check-in
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {activeGoals > 0 ? (
                <div className="space-y-4">
                  {goals?.slice(0, 2).map((goal: Goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 cursor-pointer hover:bg-[#00D4FF]/20 transition-colors"
                      onClick={() => handleCheckIn(goal)}
                    >
                      <Target className="h-5 w-5 text-[#00D4FF] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium truncate">
                            {goal.title}
                          </p>
                          <span className="text-xs text-[#00D4FF] font-bold">
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#00D4FF]/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] rounded-full"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/app/goals">
                    <Button variant="outline" className="w-full text-xs h-8">
                      Alle {activeGoals} Ziele ansehen
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="bg-accent/30 rounded-lg p-4 relative mt-2">
                  {/* Chat Bubble Tail */}
                  <div className="absolute -top-2 left-6 w-4 h-4 bg-accent/30 transform rotate-45 border-t border-l border-transparent" />

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B9D] via-[#C44FE2] to-[#8B5CF6] flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm mb-3">
                        „Hey! Wir haben noch keine Ziele definiert. Soll ich dir
                        helfen, ein SMART-Ziel für deinen Erfolg zu erstellen?"
                      </p>
                      <Link href="/app/chats?prompt=Hilf+mir+ein+SMART+Marketing-Ziel+zu+erstellen">
                        <Button
                          size="sm"
                          variant="gradient"
                          className="w-full text-xs h-8"
                        >
                          Ja, Ziel erstellen
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Conversations with Houston */}
          <Card className="bg-gradient-to-br from-[#FF6B9D]/3 via-transparent to-[#C44FE2]/3">
            <CardHeader>
              <CardTitle>Gespräche mit Houston</CardTitle>
              <CardDescription>Dein Chat-Verlauf</CardDescription>
            </CardHeader>
            <CardContent>
              {totalChatSessions > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FF6B9D]/10 border border-[#FF6B9D]/20">
                    <MessageSquare className="h-5 w-5 text-[#FF6B9D]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {totalChatSessions}{" "}
                        {totalChatSessions === 1 ? "Gespräch" : "Gespräche"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Setze deinen Chat fort oder starte einen neuen
                      </p>
                    </div>
                  </div>
                  <Link href="/app/chats">
                    <Button variant="outline" className="w-full">
                      Zum Chat
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="bg-accent/30 rounded-lg p-4 relative mt-2">
                  {/* Chat Bubble Tail */}
                  <div className="absolute -top-2 left-6 w-4 h-4 bg-accent/30 transform rotate-45 border-t border-l border-transparent" />

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B9D] via-[#C44FE2] to-[#8B5CF6] flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm mb-3">
                        „Ich warte auf dich! Lass uns über deine Strategie
                        sprechen oder Content-Ideen brainstormen."
                      </p>
                      <Link href="/app/chats">
                        <Button
                          size="sm"
                          variant="gradient"
                          className="w-full text-xs h-8"
                        >
                          Hallo Houston! 👋
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Note: Onboarding is handled by DashboardLayout's OnboardingWizard */}

      {/* Playbook Detail Modal */}
      <PlaybookDetailModal
        playbook={selectedPlaybook}
        open={isPlaybookModalOpen}
        onOpenChange={setIsPlaybookModalOpen}
        onStartMission={handleStartMission}
        onAskHouston={handleAskHouston}
      />

      {/* Check-in Modal */}
      {checkInGoal && (
        <CheckInModal
          open={isCheckInModalOpen}
          onOpenChange={setIsCheckInModalOpen}
          goalId={checkInGoal.id}
          goalTitle={checkInGoal.title}
          currentProgress={checkInGoal.progress || 0}
          onSuccess={handleCheckInSuccess}
        />
      )}
    </DashboardLayout>
  );
}
