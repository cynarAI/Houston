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
import { designTokens } from "@/lib/design-tokens";

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

// Daily Wisdom Tips
const DAILY_TIPS = [
  {
    title: "Focus on Retention",
    text: "It costs 5x more to acquire a new customer than to retain an existing one.",
  },
  {
    title: "Content Recycling",
    text: "Take your best blog post and turn it into 3 social media posts and an email.",
  },
  {
    title: "Social Proof",
    text: "Place testimonials right next to your 'Buy' buttons for higher conversion.",
  },
  {
    title: "Email Subject Lines",
    text: "Questions in subject lines often increase open rates by over 15%.",
  },
  {
    title: "Pareto Principle",
    text: "20% of your marketing activities bring 80% of the results. Find that 20%.",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Time-based greeting
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
        <LoadingState message="Loading your dashboard..." fullPage />
      </DashboardLayout>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <ErrorState
            title="Could not load dashboard"
            message="There was a problem loading your data. Please try again."
            onRetry={() => refetchWorkspaces()}
            fullPage
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Mobile-first: Smaller padding on mobile, larger on desktop */}
      <div className="container py-4 md:py-6 lg:py-8 space-y-4 md:space-y-6">
        {/* Credit Banner - Shows when credits are low */}
        <CreditBanner threshold={20} />

        {/* ============ TODAY'S FOCUS - Hero Element ============ */}
        {/* Glassmorphism + AI-Gradient für visuelles Highlight */}
        <Card
          variant="glass"
          className="relative overflow-hidden hero-entrance bg-gradient-to-br from-[#FF6B9D]/5 via-background to-[#00D4FF]/5 dark:from-[#FF6B9D]/10 dark:via-[#1a1a2e]/80 dark:to-[#00D4FF]/10"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#8B5CF6]/5 to-transparent pointer-events-none" />
          <CardContent className="!py-6 md:!py-8 relative">
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
                    <p className="text-muted-foreground mb-6 max-w-lg">
                      Schritt für Schritt zum Ziel. Houston hilft dir, wenn du
                      nicht weiter weißt.
                    </p>
                    {/* Steve Jobs: Klarer primärer CTA, sekundärer subtiler */}
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
                          variant="ghost"
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
                    <p className="text-muted-foreground mb-6 max-w-lg">
                      Lass uns jetzt konkrete Schritte definieren, um dein
                      erstes Ziel zu erreichen.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="/app/chats?prompt=Let's+create+a+plan+for+my+first+goal">
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
                          variant="ghost"
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
                    <p className="text-muted-foreground mb-6 max-w-lg">
                      Großartig! Frag Houston nach den nächsten Schritten für
                      dein Ziel.
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
                          variant="ghost"
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
                    <p className="text-muted-foreground mb-6 max-w-lg">
                      {activationStatus.hasStrategy
                        ? "Deine Strategie steht. Jetzt brauchen wir konkrete Ziele für deinen Erfolg."
                        : "Erzähl Houston von deinem Business und deinen Träumen. Er erstellt dir einen Plan."}
                    </p>
                    <Link
                      href={
                        activationStatus.hasStrategy
                          ? "/app/chats?prompt=Help+me+define+a+new+goal"
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
                          : "Erstes Gespräch starten"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Right: Quick Stats - Mobile-first: Stack on mobile, horizontal on desktop */}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-4 md:mt-0">
                <div
                  className="text-center animate-in fade-in slide-in-from-right-2 duration-300"
                  style={{
                    animationDelay: designTokens.animation.delay.stagger2,
                  }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text-aistronaut">
                    {activeGoals}
                  </div>
                  <div className="text-xs text-muted-foreground">Goals</div>
                </div>
                <div
                  className="text-center animate-in fade-in slide-in-from-right-2 duration-300"
                  style={{
                    animationDelay: designTokens.animation.delay.stagger3,
                  }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text-aistronaut">
                    {openTodos}
                  </div>
                  <div className="text-xs text-muted-foreground">To-dos</div>
                </div>
                <div
                  className="text-center animate-in fade-in slide-in-from-right-2 duration-300"
                  style={{
                    animationDelay: designTokens.animation.delay.stagger4,
                  }}
                >
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
        <Card
          variant="glass"
          className="relative overflow-hidden bg-gradient-to-br from-[#8B5CF6]/5 via-background to-[#00D4FF]/5"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#8B5CF6]/10 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)] shadow-lg shadow-blue-500/20">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Daily Wisdom</CardTitle>
                  <CardDescription>
                    Your marketing impulse for today
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Free Daily Tip */}
              <div className="flex-1 bg-card/50 border border-border/50 rounded-xl p-5 relative">
                <div className="absolute -left-1 top-6 w-1 h-12 bg-gradient-to-b from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)] rounded-r-full" />
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--color-gradient-purple)]" />
                  {dailyTip.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  "{dailyTip.text}"
                </p>
              </div>

              {/* Upsell / Deep Dive */}
              <div className="flex-shrink-0 w-full md:w-auto flex flex-col gap-3 p-5 rounded-xl border border-[var(--color-gradient-purple)]/20 bg-[var(--color-gradient-purple)]/5">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-[var(--color-gradient-purple)]" />
                  <h4 className="font-medium text-sm">Dive Deeper?</h4>
                </div>
                <p className="text-xs text-muted-foreground max-w-[250px]">
                  Let Houston analyze your marketing and find concrete
                  opportunities.
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
                    className="w-full justify-between group border-[var(--color-gradient-purple)]/30 hover:border-[var(--color-gradient-purple)] hover:bg-[var(--color-gradient-purple)]/10"
                  >
                    <span className="flex items-center gap-2">
                      {insightsLoading ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Brain className="h-3 w-3" />
                      )}
                      Deep Dive Analysis
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
          <Card
            variant="glass"
            className="bg-gradient-to-br from-[#FF6B9D]/5 via-background to-[#C44FE2]/5"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)]">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Recommended Playbooks</CardTitle>
                    <CardDescription>
                      Proven marketing strategies for your next step
                    </CardDescription>
                  </div>
                </div>
                <Link href="/app/playbooks">
                  <Button variant="ghost" size="sm" className="gap-1">
                    All Playbooks
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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Goals & Progress */}
          <Card
            variant="elevated"
            className="bg-gradient-to-br from-[#00D4FF]/5 via-background to-[#8B5CF6]/5"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Goals & Progress</CardTitle>
                <CardDescription>
                  Your marketing goals at a glance
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
                      className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 cursor-pointer hover:bg-blue-500/20 transition-colors"
                      onClick={() => handleCheckIn(goal)}
                    >
                      <Target className="h-5 w-5 text-blue-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium truncate">
                            {goal.title}
                          </p>
                          <span className="text-xs text-blue-400 font-bold">
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-blue-900/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-400 rounded-full"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/app/goals">
                    <Button variant="outline" className="w-full text-xs h-8">
                      View all {activeGoals} goals
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm mb-3">
                        "Hey! We haven't defined any goals yet. Should I help
                        you create a SMART goal for your success?"
                      </p>
                      <Link href="/app/chats?prompt=Help+me+create+a+SMART+marketing+goal">
                        <Button
                          size="sm"
                          variant="gradient"
                          className="w-full text-xs h-8"
                        >
                          Yes, Create Goal
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Conversations with Houston */}
          <Card
            variant="elevated"
            className="bg-gradient-to-br from-[#FF6B9D]/5 via-background to-[#C44FE2]/5"
          >
            <CardHeader>
              <CardTitle>Conversations with Houston</CardTitle>
              <CardDescription>Your chat history</CardDescription>
            </CardHeader>
            <CardContent>
              {totalChatSessions > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                    <MessageSquare className="h-5 w-5 text-pink-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {totalChatSessions}{" "}
                        {totalChatSessions === 1
                          ? "Conversation"
                          : "Conversations"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Continue your chat or start a new one
                      </p>
                    </div>
                  </div>
                  <Link href="/app/chats">
                    <Button variant="outline" className="w-full">
                      Go to Chat
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm mb-3">
                        "I'm waiting for you! Let's talk about your strategy or
                        brainstorm content ideas."
                      </p>
                      <Link href="/app/chats">
                        <Button
                          size="sm"
                          variant="gradient"
                          className="w-full text-xs h-8"
                        >
                          Hello Houston! 👋
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
