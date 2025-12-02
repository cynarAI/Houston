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
            Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] || "there"}</span>!
          </h1>
          <p className="text-muted-foreground">
            Here's your Houston dashboard overview.
          </p>
        </div>



        {/* Mission Control Stats */}
        <Card className="glass border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Mission Control</CardTitle>
            <CardDescription>Your current mission status</CardDescription>
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
                label="Active Goals"
                icon={<Target className="h-5 w-5 text-white" />}
                gradient="gradient-blue"
              />
              <CircularProgress
                value={openTodos}
                max={50}
                label="Open To-dos"
                icon={<CheckSquare className="h-5 w-5 text-white" />}
                gradient="gradient-purple"
              />
              <CircularProgress
                value={totalChatSessions}
                max={100}
                label="Chat Sessions"
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
                  <CardDescription>AI-powered recommendations for your marketing</CardDescription>
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
                <span className="text-xs text-muted-foreground">3 credits</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insightsLoading && (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Analyzing your marketing data...</p>
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
                  <p className="text-sm text-muted-foreground">No insights available yet.</p>
                  <Button variant="link" size="sm" onClick={loadInsights} className="mt-2 gap-2">
                    Generate insights <RefreshCw className="ml-1 h-3 w-3" />
                    <span className="text-xs text-muted-foreground">(3 credits)</span>
                  </Button>
                </div>
              )}
              
              {totalChatSessions === 0 && (
                <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Chat with me anytime</h4>
                      <p className="text-sm text-muted-foreground">
                        I'm here to help! Ask me about marketing strategies, content ideas, or get feedback on your campaigns.
                      </p>
                      <Link href="/app/chats">
                        <Button variant="link" size="sm" className="px-0 mt-2">
                          Start a conversation <ArrowRight className="ml-1 h-3 w-3" />
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
                      <h4 className="font-semibold text-sm mb-1">You're on track!</h4>
                      <p className="text-sm text-muted-foreground">
                        Great progress! You have {activeGoals} active {activeGoals === 1 ? 'goal' : 'goals'} and {openTodos} open {openTodos === 1 ? 'task' : 'tasks'}. Keep up the momentum!
                      </p>
                      <Link href="/app/strategy">
                        <Button variant="link" size="sm" className="px-0 mt-2">
                          Review your strategy <ArrowRight className="ml-1 h-3 w-3" />
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
          {/* Today / Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Today / Next Steps</CardTitle>
              <CardDescription>Your most important tasks for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)] mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start your onboarding</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Answer a few questions and get your personalized marketing roadmap.
                </p>
                <Link href="/app/onboarding">
                  <Button>
                    Start Onboarding
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Goals & Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Goals & Progress</CardTitle>
              <CardDescription>Your marketing goals overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)] mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No goals defined yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Let your coach help you set SMART goals.
                </p>
                <Link href="/app/goals">
                  <Button variant="outline">
                    Define Goals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Strategy at a Glance */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy at a Glance</CardTitle>
              <CardDescription>Your marketing strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gradient-purple)] to-[var(--color-gradient-indigo)] mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No strategy yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Develop a clear marketing strategy with your coach.
                </p>
                <Link href="/app/strategy">
                  <Button variant="outline">
                    Develop Strategy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Conversations with Your Coach */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations with Your Coach</CardTitle>
              <CardDescription>Your chat history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] mb-4">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Start your first conversation with Houston now!
                </p>
                <Link href="/app/chats">
                  <Button variant="outline">
                    Start New Conversation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Onboarding Dialog */}
      <Onboarding open={onboardingOpen} onComplete={handleOnboardingComplete} />
    </DashboardLayout>
  );
}
