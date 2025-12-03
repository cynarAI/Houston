import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Sparkles, Target, CheckSquare, MessageSquare, TrendingUp, ArrowRight, Brain, RefreshCw, BookOpen, Rocket } from "lucide-react";
import { CircularProgress } from "@/components/CircularProgress";
import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
// Onboarding is handled by DashboardLayout's OnboardingWizard
import type { Goal, Todo } from "@shared/types";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { CreditBanner } from "@/components/CreditBanner";
import { ActivationChecklist } from "@/components/ActivationChecklist";
import { ReturnReminder } from "@/components/ReturnReminder";
import { checkActivationMilestone } from "@/lib/celebrations";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { handleMutationError, ErrorMessages } from "@/lib/errorHandling";
import { PlaybookCard } from "@/components/PlaybookCard";
import { PlaybookDetailModal } from "@/components/PlaybookDetailModal";
import { getSuggestedPlaybooks, type Playbook } from "@/data/playbooks";
import { useLocation } from "wouter";

// Type for AI Insights recommendations
interface InsightRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  link: string;
}

interface InsightsResult {
  recommendations: InsightRecommendation[];
}


export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: workspaces, isLoading: workspacesLoading, isError: workspacesError, refetch: refetchWorkspaces } = trpc.workspaces.list.useQuery();
  
  // Playbook state
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [isPlaybookModalOpen, setIsPlaybookModalOpen] = useState(false);
  
  const currentWorkspace = workspaces?.[0];
  const { data: goals, isLoading: goalsLoading, isError: goalsError } = trpc.goals.listByWorkspace.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id }
  );
  const { data: todos, isLoading: todosLoading, isError: todosError } = trpc.todos.listByWorkspace.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id }
  );
  const { data: chatSessions, isLoading: chatsLoading, isError: chatsError } = trpc.chat.listSessions.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id }
  );
  const { data: strategy } = trpc.strategy.getByWorkspace.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id }
  );
  
  // Combined loading/error states
  const isLoading = workspacesLoading || (currentWorkspace && (goalsLoading || todosLoading || chatsLoading));
  const hasError = workspacesError || goalsError || todosError || chatsError;
  
  // Activation status for checklist
  const activationStatus = useMemo(() => ({
    hasFirstChat: (chatSessions?.length || 0) > 0,
    hasFirstGoal: (goals?.length || 0) > 0,
    hasStrategy: !!strategy?.positioning,
    hasFirstTodo: (todos?.length || 0) > 0,
    hasCompletedTodo: todos?.some((t: Todo) => t.status === "done") || false,
  }), [chatSessions, goals, strategy, todos]);
  
  // Check for activation milestone celebrations
  useEffect(() => {
    if (!isLoading && goals !== undefined && todos !== undefined) {
      checkActivationMilestone(activationStatus);
    }
  }, [activationStatus, isLoading, goals, todos]);
  
  const activeGoals = goals?.filter((g: Goal) => g.status === "active").length || 0;
  const openTodos = todos?.filter((t: Todo) => t.status !== "done").length || 0;
  const totalChatSessions = chatSessions?.length || 0;
  
  // AI Insights
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insights, setInsights] = useState<InsightsResult | null>(null);
  const generateInsightsMutation = trpc.insights.generateRecommendations.useMutation();
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
      trackEvent(AnalyticsEvents.INSIGHTS_GENERATED, { workspace_id: currentWorkspace.id });
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
        is_first_goal: activeGoals === 0
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

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Lade dein Dashboard..." fullPage />
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

      <div className="container py-8 space-y-8">
        {/* Credit Banner - Shows when credits are low */}
        <CreditBanner threshold={20} />
        
        {/* Return Reminder - Contextual nudge to continue working */}
        <ReturnReminder
          openTodosCount={openTodos}
          activeGoalsCount={activeGoals}
          lastChatDate={chatSessions?.[0]?.createdAt ? new Date(chatSessions[0].createdAt) : null}
        />
        
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Willkommen zurück, <span className="gradient-text">{user?.name?.split(" ")[0] || "Captain"}</span>! 🚀
          </h1>
          <p className="text-muted-foreground">
            Hier ist dein Houston Dashboard-Überblick.
          </p>
        </div>
        
        {/* Activation Checklist - Shows until all steps are complete */}
        <ActivationChecklist
          hasFirstChat={activationStatus.hasFirstChat}
          hasFirstGoal={activationStatus.hasFirstGoal}
          hasStrategy={activationStatus.hasStrategy}
          hasFirstTodo={activationStatus.hasFirstTodo}
          hasCompletedTodo={activationStatus.hasCompletedTodo}
        />

        {/* Mission Control Stats */}
        <Card className="glass border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Mission Control</CardTitle>
            <CardDescription>Dein aktueller Missions-Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <CircularProgress
                value={workspaces?.length || 0}
                max={10}
                label="Workspaces"
                icon={<Sparkles className="h-5 w-5 text-white" />}
                gradient="gradient-orange"
              />
              <CircularProgress
                value={activeGoals}
                max={20}
                label="Aktive Ziele"
                icon={<Target className="h-5 w-5 text-white" />}
                gradient="gradient-blue"
              />
              <CircularProgress
                value={openTodos}
                max={50}
                label="Offene To-dos"
                icon={<CheckSquare className="h-5 w-5 text-white" />}
                gradient="gradient-purple"
              />
              <CircularProgress
                value={totalChatSessions}
                max={100}
                label="Chat-Sessions"
                icon={<MessageSquare className="h-5 w-5 text-white" />}
                gradient="gradient-pink"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Card */}
        <Card className="glass border-white/10 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)]">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Houston's Insights</CardTitle>
                  <CardDescription>KI-gestützte Empfehlungen für dein Marketing</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadInsights}
                disabled={insightsLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${insightsLoading ? 'animate-spin' : ''}`} />
                <span className="text-xs text-muted-foreground">3 Credits</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insightsLoading && (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Analysiere deine Marketing-Daten...</p>
                </div>
              )}
              
              {!insightsLoading && insights?.recommendations?.map((rec: InsightRecommendation, idx: number) => (
                <Card
                  key={idx}
                  className={`dashboard-insight-card glass border-white/10 backdrop-blur-xl hover:border-white/20 transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] group ${
                    rec.priority === 'high'
                      ? 'hover:shadow-[0_8px_32px_rgba(239,68,68,0.3)]'
                      : rec.priority === 'medium'
                      ? 'hover:shadow-[0_8px_32px_rgba(59,130,246,0.3)]'
                      : 'hover:shadow-[0_8px_32px_rgba(34,197,94,0.3)]'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        rec.priority === 'high'
                          ? 'bg-gradient-to-br from-red-500 to-orange-500'
                          : rec.priority === 'medium'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                          : 'bg-gradient-to-br from-green-500 to-emerald-500'
                      }`}>
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm truncate">{rec.title}</h4>
                          <Badge
                            variant="outline"
                            className={`text-xs border ${
                              rec.priority === 'high'
                                ? 'border-red-500/50 text-red-400'
                                : rec.priority === 'medium'
                                ? 'border-blue-500/50 text-blue-400'
                                : 'border-green-500/50 text-green-400'
                            }`}
                          >
                            {rec.priority === 'high' ? 'Hoch' : rec.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{rec.description}</p>
                        <Link href={rec.link}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-0 hover:bg-transparent group-hover:translate-x-1 transition-transform"
                          >
                            {rec.action} <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {!insightsLoading && (!insights || insights.recommendations?.length === 0) && (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">Noch keine Insights vorhanden.</p>
                  <Button variant="link" size="sm" onClick={loadInsights} className="mt-2 gap-2">
                    Insights generieren <RefreshCw className="ml-1 h-3 w-3" />
                    <span className="text-xs text-muted-foreground">(3 Credits)</span>
                  </Button>
                </div>
              )}
              
              {totalChatSessions === 0 && (
                <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Chatte jederzeit mit mir</h4>
                      <p className="text-sm text-muted-foreground">
                        Ich bin für dich da! Frag mich nach Marketing-Strategien, Content-Ideen oder hol dir Feedback zu deinen Kampagnen.
                      </p>
                      <Link href="/app/chats">
                        <Button variant="link" size="sm" className="px-0 mt-2">
                          Gespräch starten <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {activeGoals > 0 && openTodos > 0 && totalChatSessions > 0 && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Du bist auf Kurs!</h4>
                      <p className="text-sm text-muted-foreground">
                        Super Fortschritt! Du hast {activeGoals} {activeGoals === 1 ? 'aktives Ziel' : 'aktive Ziele'} und {openTodos} {openTodos === 1 ? 'offene Aufgabe' : 'offene Aufgaben'}. Weiter so!
                      </p>
                      <Link href="/app/strategy">
                        <Button variant="link" size="sm" className="px-0 mt-2">
                          Strategie überprüfen <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Playbooks */}
        {suggestedPlaybooks.length > 0 && (
          <Card className="glass border-white/10 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)]">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Empfohlene Playbooks</CardTitle>
                    <CardDescription>Bewährte Marketing-Strategien für deinen nächsten Schritt</CardDescription>
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

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Today / Next Steps - Dynamic based on user state */}
          <Card>
            <CardHeader>
              <CardTitle>Heute / Nächste Schritte</CardTitle>
              <CardDescription>Deine wichtigsten Aufgaben</CardDescription>
            </CardHeader>
            <CardContent>
              {openTodos > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <CheckSquare className="h-5 w-5 text-green-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Du hast {openTodos} offene {openTodos === 1 ? 'Aufgabe' : 'Aufgaben'}</p>
                      <p className="text-xs text-muted-foreground">Arbeite sie ab, um deine Ziele zu erreichen</p>
                    </div>
                  </div>
                  <Link href="/app/todos">
                    <Button className="w-full">
                      Zu meinen To-dos
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : activeGoals === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)] mb-4">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Lass uns starten! 🚀</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                    Chatte mit Houston, um deine erste Marketing-Strategie zu entwickeln.
                  </p>
                  <Link href="/app/chats">
                    <Button>
                      Mit Houston chatten
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                    <CheckSquare className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Alles erledigt! 🎉</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                    Super, du hast alle Aufgaben abgeschlossen. Zeit für neue Ziele?
                  </p>
                  <Link href="/app/chats">
                    <Button variant="outline">
                      Houston um Rat fragen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals & Progress - Dynamic */}
          <Card>
            <CardHeader>
              <CardTitle>Ziele & Fortschritt</CardTitle>
              <CardDescription>Deine Marketing-Ziele im Überblick</CardDescription>
            </CardHeader>
            <CardContent>
              {activeGoals > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Target className="h-5 w-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activeGoals} {activeGoals === 1 ? 'aktives Ziel' : 'aktive Ziele'}</p>
                      <p className="text-xs text-muted-foreground">Bleib dran und erreiche deine Marketing-Ziele</p>
                    </div>
                  </div>
                  <Link href="/app/goals">
                    <Button variant="outline" className="w-full">
                      Ziele anzeigen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)] mb-4">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Noch keine Ziele</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                    Lass Houston dir helfen, SMART-Ziele zu definieren.
                  </p>
                  <Link href="/app/goals">
                    <Button variant="outline">
                      Ziele definieren
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Strategy at a Glance */}
          <Card>
            <CardHeader>
              <CardTitle>Strategie auf einen Blick</CardTitle>
              <CardDescription>Deine Marketing-Strategie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-gradient-purple)] to-[var(--color-gradient-indigo)] mb-4">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Strategie entwickeln</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                  Definiere Positionierung, Zielgruppen und Kernbotschaften.
                </p>
                <Link href="/app/strategy">
                  <Button variant="outline">
                    Zur Strategie
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Conversations with Your Coach - Dynamic */}
          <Card>
            <CardHeader>
              <CardTitle>Gespräche mit Houston</CardTitle>
              <CardDescription>Dein Chat-Verlauf</CardDescription>
            </CardHeader>
            <CardContent>
              {totalChatSessions > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                    <MessageSquare className="h-5 w-5 text-pink-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{totalChatSessions} {totalChatSessions === 1 ? 'Gespräch' : 'Gespräche'}</p>
                      <p className="text-xs text-muted-foreground">Setze deine Unterhaltung fort oder starte eine neue</p>
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
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] mb-4">
                    <MessageSquare className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Noch keine Gespräche</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                    Starte jetzt dein erstes Gespräch mit Houston!
                  </p>
                  <Link href="/app/chats">
                    <Button variant="outline">
                      Gespräch starten
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
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
    </DashboardLayout>
  );
}
