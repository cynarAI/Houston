import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Sparkles, Target, CheckSquare, MessageSquare, TrendingUp, ArrowRight, Brain, RefreshCw } from "lucide-react";
import { CircularProgress } from "@/components/CircularProgress";


import { useState, useEffect } from "react";
import { Link } from "wouter";
import Onboarding from "@/components/Onboarding";


export default function Dashboard() {
  const { user } = useAuth();
  const { data: workspaces } = trpc.workspaces.list.useQuery();
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  
  const currentWorkspace = workspaces?.[0];
  const { data: goals } = trpc.goals.listByWorkspace.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id }
  );
  const { data: todos } = trpc.todos.listByWorkspace.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id }
  );
  const { data: chatSessions } = trpc.chat.listSessions.useQuery(
    { workspaceId: currentWorkspace?.id || 0 },
    { enabled: !!currentWorkspace?.id }
  );
  
  const activeGoals = goals?.filter((g: any) => g.status === "active").length || 0;
  const openTodos = todos?.filter((t: any) => t.status !== "done").length || 0;
  const totalChatSessions = chatSessions?.length || 0;
  
  // AI Insights
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const generateInsightsMutation = trpc.insights.generateRecommendations.useMutation();
  
  const loadInsights = async () => {
    if (!currentWorkspace?.id) return;
    setInsightsLoading(true);
    try {
      const result = await generateInsightsMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
      });
      setInsights(result);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };
  
  // Removed automatic insights loading to prevent unwanted credit deductions
  // User must click "Generate Insights" button manually
  
  // Check if user needs onboarding
  useEffect(() => {
    if (goals !== undefined && todos !== undefined) {
      const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
      if (!hasCompletedOnboarding && goals.length === 0 && todos.length === 0) {
        setOnboardingOpen(true);
      }
    }
  }, [goals, todos]);
  
  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setOnboardingOpen(false);
    // Refresh data
    window.location.reload();
  };

  return (
    <DashboardLayout>

      <div className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Willkommen zurück, <span className="gradient-text">{user?.name?.split(" ")[0] || "Captain"}</span>! 🚀
          </h1>
          <p className="text-muted-foreground">
            Hier ist dein Houston Dashboard-Überblick.
          </p>
        </div>



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
              
              {!insightsLoading && insights?.recommendations?.map((rec: any, idx: number) => (
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
                            {rec.priority}
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
      
      {/* Onboarding Dialog */}
      <Onboarding open={onboardingOpen} onComplete={handleOnboardingComplete} />
    </DashboardLayout>
  );
}
