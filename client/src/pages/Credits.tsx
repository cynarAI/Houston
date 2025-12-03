import { useState, lazy, Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Sparkles, TrendingUp, Zap, Check, ArrowRight, Clock, BarChart3, Loader2, Shield, Star, Users, Rocket, Gift } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from "@/components/ui/glass-card";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

// Lazy load analytics components (CreditUsageChart uses recharts ~250kb)
const CreditUsageChart = lazy(() => import("@/components/CreditUsageChart").then(m => ({ default: m.CreditUsageChart })));
const UsageStatsCards = lazy(() => import("@/components/UsageStatsCards").then(m => ({ default: m.UsageStatsCards })));
const TopFeaturesCard = lazy(() => import("@/components/TopFeaturesCard").then(m => ({ default: m.TopFeaturesCard })));
const TransactionHistoryTable = lazy(() => import("@/components/TransactionHistoryTable").then(m => ({ default: m.TransactionHistoryTable })));

// Loading fallback for analytics tab
function AnalyticsLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function Credits() {
  const [activeTab, setActiveTab] = useState("plans");
  const { data: balance, isLoading: balanceLoading, isError: balanceError, refetch: refetchBalance } = trpc.credits.getBalance.useQuery();
  const { data: history } = trpc.credits.getUsageHistory.useQuery({ limit: 20 });
  const { data: monthlyUsage } = trpc.credits.getMonthlyUsage.useQuery();
  const { data: subscription } = trpc.credits.getActiveSubscription.useQuery();
  const { data: plans, isLoading: plansLoading, isError: plansError } = trpc.credits.getPlans.useQuery();
  const { data: topups } = trpc.credits.getTopups.useQuery();
  const { data: costs } = trpc.credits.getAllCosts.useQuery();
  
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation();
  
  // Combined loading/error states for essential data
  const isLoading = balanceLoading || plansLoading;
  const hasError = balanceError || plansError;

  const credits = balance ?? 0;
  const isLow = credits < 20 && credits > 0;
  const isEmpty = credits === 0;
  
  const handlePurchase = async (productKey: "orbit_pack" | "galaxy_pack" | "mini_booster" | "power_booster" | "mega_booster") => {
    try {
      // Track purchase intent
      trackEvent(AnalyticsEvents.CREDITS_PURCHASED, { product_key: productKey });
      
      const result = await createCheckoutSession.mutateAsync({ productKey });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Checkout konnte nicht gestartet werden. Bitte versuche es erneut.");
      console.error("Checkout error:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Lade Credit-Informationen..." fullPage />
      </DashboardLayout>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <ErrorState
            title="Credits konnten nicht geladen werden"
            message="Es gab ein Problem beim Laden deiner Credit-Informationen. Bitte versuche es erneut."
            onRetry={() => refetchBalance()}
            fullPage
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <PageHeader
          title="Credits & Pläne"
          description="Verwalte deine Credits und dein Abonnement"
        />

        {/* Current Balance Card */}
        <GlassCard variant="elevated">
          <GlassCardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <GradientIcon icon={Sparkles} gradient="orange-pink" size="xl" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dein Guthaben</p>
                  <h2 className="text-4xl font-bold gradient-text">
                    {credits} Credits
                  </h2>
                  {isEmpty && (
                    <Badge variant="outline" className="mt-2 border-red-500/50 text-red-400">
                      Keine Credits
                    </Badge>
                  )}
                  {isLow && (
                    <Badge variant="outline" className="mt-2 border-orange-500/50 text-orange-400">
                      Guthaben knapp
                    </Badge>
                  )}
                </div>
              </div>
              
              {monthlyUsage && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Diesen Monat</p>
                  <p className="text-2xl font-semibold">{monthlyUsage.totalSpent} verbraucht</p>
                </div>
              )}
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Active Subscription */}
        {subscription && subscription.plan && (
          <GlassCard variant="elevated">
            <GlassCardHeader>
              <GlassCardTitle>Aktives Abonnement</GlassCardTitle>
              <GlassCardDescription>Dein aktueller Plan</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{subscription.plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {subscription.plan.monthlyCredits} Credits pro Monat
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    €{(subscription.plan.priceMonthly / 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">pro Monat</p>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        )}

        {/* Tabs for Plans, Topups, and Analytics */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">
              <Sparkles className="w-4 h-4 mr-2" />
              Pläne
            </TabsTrigger>
            <TabsTrigger value="topups">
              <Zap className="w-4 h-4 mr-2" />
              Aufladungen
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistiken
            </TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Abonnement-Pläne</h2>
                <p className="text-muted-foreground">Wähle den Plan, der zu deinem Marketing passt. Jederzeit kündbar, keine versteckten Kosten.</p>
              </div>
              
              {/* Trust Signals */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Sichere Zahlung via Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Jederzeit kündbar</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gift className="w-4 h-4 text-green-400" />
                  <span>Keine versteckten Kosten</span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {plans?.map((plan, index) => {
                  const features = plan.features ? JSON.parse(plan.features) : [];
                  const isActive = subscription?.plan?.id === plan.id;
                  const isRecommended = index === 0; // First plan (Solo/Orbit) is recommended
                  
                  // Use-Case descriptions based on plan
                  const useCase = plan.key === 'orbit_pack' 
                    ? "Ideal für Solo-Marketer und kleine Teams mit 2-3 Projekten pro Monat."
                    : "Perfekt für Agenturen und wachsende Teams mit vielen parallelen Kampagnen.";
                  
                  const targetIcon = plan.key === 'orbit_pack' ? Users : Rocket;
                  
                  return (
                    <GlassCard
                      key={plan.id}
                      variant={isActive ? "glow" : isRecommended ? "glow" : "elevated"}
                      className={`relative ${isActive ? 'border-[#ffb606]/50' : isRecommended ? 'border-[#FF6B9D]/50' : ''}`}
                    >
                      {/* Recommended Badge */}
                      {isRecommended && !isActive && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-[#FF6B9D] to-[#8B5CF6] text-white border-none px-4 py-1 shadow-lg">
                            <Star className="w-3 h-3 mr-1" />
                            Empfohlen
                          </Badge>
                        </div>
                      )}
                      
                      <GlassCardHeader className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <GradientIcon icon={targetIcon} gradient={isRecommended ? "pink-purple" : "blue-purple"} size="md" />
                            <GlassCardTitle>{plan.name}</GlassCardTitle>
                          </div>
                          {isActive && (
                            <Badge className="bg-[#ffb606]/20 text-[#ffb606] border-[#ffb606]/30">
                              Aktiv
                            </Badge>
                          )}
                        </div>
                        <GlassCardDescription className="mt-2">{plan.description}</GlassCardDescription>
                      </GlassCardHeader>
                      <GlassCardContent className="space-y-4">
                        <div>
                          <p className="text-4xl font-bold">
                            €{(plan.priceMonthly / 100).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">pro Monat</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Sparkles className="w-5 h-5 text-[#ffb606]" />
                          {plan.monthlyCredits} Credits/Monat
                        </div>

                        {/* Use-Case Description */}
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-sm text-muted-foreground">{useCase}</p>
                        </div>

                        <div className="space-y-2">
                          {features.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-400 shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          className="w-full"
                          variant={isActive ? "outline" : "gradient"}
                          disabled={isActive || createCheckoutSession.isPending}
                          onClick={() => !isActive && handlePurchase(plan.key as any)}
                        >
                          {createCheckoutSession.isPending ? 'Lädt...' : isActive ? 'Dein aktueller Plan' : 'Plan wählen'}
                          {!isActive && !createCheckoutSession.isPending && <ArrowRight className="ml-2 w-4 h-4" />}
                        </Button>
                        
                        {!isActive && (
                          <p className="text-xs text-center text-muted-foreground">
                            Du kannst jederzeit wechseln oder kündigen.
                          </p>
                        )}
                      </GlassCardContent>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Topups Tab */}
          <TabsContent value="topups" className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Credit-Booster</h2>
                <p className="text-muted-foreground">Einmalige Aufladungen für maximale Flexibilität. Verfallen nicht und sind sofort verfügbar.</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                {topups?.map((topup, index) => {
                  // Calculate price per credit for value comparison
                  const pricePerCredit = (topup.price / 100) / topup.credits;
                  const isBestValue = index === (topups?.length || 0) - 1; // Last one is best value
                  
                  // Use-case descriptions
                  const description = topup.credits <= 50 
                    ? "Perfekt für einen schnellen Boost zwischendurch."
                    : topup.credits <= 150 
                    ? "Ideal für ein größeres Projekt oder mehrere Analysen."
                    : "Maximale Ersparnis für Power-User und intensives Marketing.";
                  
                  return (
                    <GlassCard 
                      key={topup.id} 
                      variant={isBestValue ? "glow" : "elevated"}
                      className={`relative ${isBestValue ? 'border-[#00D4FF]/50' : ''}`}
                    >
                      {/* Best Value Badge */}
                      {isBestValue && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white border-none px-3 py-1 shadow-lg text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Beste Ersparnis
                          </Badge>
                        </div>
                      )}
                      
                      <GlassCardContent className="pt-8 space-y-4">
                        <GradientIcon 
                          icon={Zap} 
                          gradient={isBestValue ? "blue-purple" : "orange-pink"} 
                          size="lg" 
                          className="mx-auto" 
                        />
                        
                        <div className="text-center">
                          <h3 className="text-xl font-semibold mb-1">{topup.name}</h3>
                          <p className="text-3xl font-bold gradient-text">{topup.credits}</p>
                          <p className="text-sm text-muted-foreground">Credits</p>
                        </div>

                        <div className="text-center">
                          <p className="text-2xl font-bold">€{(topup.price / 100).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            €{pricePerCredit.toFixed(2)} pro Credit
                          </p>
                        </div>
                        
                        {/* Use-case description */}
                        <p className="text-xs text-center text-muted-foreground px-2">
                          {description}
                        </p>

                        <Button 
                          className="w-full" 
                          variant={isBestValue ? "gradient" : "outline"}
                          disabled={createCheckoutSession.isPending}
                          onClick={() => handlePurchase(topup.key as any)}
                        >
                          {createCheckoutSession.isPending ? 'Lädt...' : 'Jetzt kaufen'}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </GlassCardContent>
                    </GlassCard>
                  );
                })}
              </div>
              
              {/* Trust note */}
              <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 inline-block mr-2 text-green-400" />
                  Einmal gekaufte Credits verfallen nicht. Du behältst sie, bis du sie nutzt.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab - Lazy loaded (recharts ~250kb) */}
          <TabsContent value="analytics" className="space-y-6">
            <Suspense fallback={<AnalyticsLoader />}>
              <UsageStatsCards />
              <div className="grid gap-6 lg:grid-cols-2">
                <CreditUsageChart />
                <TopFeaturesCard />
              </div>
              <TransactionHistoryTable />
            </Suspense>
          </TabsContent>
        </Tabs>

        {/* Credit Costs Reference */}
        {costs && (
          <GlassCard variant="elevated">
            <GlassCardHeader>
              <GlassCardTitle>So nutzt du deine Credits</GlassCardTitle>
              <GlassCardDescription>Transparente Übersicht aller Feature-Kosten - keine versteckten Gebühren</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(costs).map(([key, cost]) => {
                  // German-friendly feature names
                  const featureNames: Record<string, string> = {
                    CHAT_BASIC: "Chat-Nachrichten",
                    VIEW_CONTENT: "Inhalte ansehen",
                    CHAT_DEEP_ANALYSIS: "Tiefenanalyse im Chat",
                    PDF_EXPORT: "PDF-Export",
                    AI_INSIGHTS: "KI-Empfehlungen",
                    GOALS_GENERATION: "Ziele generieren",
                    STRATEGY_ANALYSIS: "Strategie-Analyse",
                    CAMPAIGN_BLUEPRINT: "Kampagnen-Plan",
                    MARKETING_AUDIT: "Marketing-Audit",
                    COMPETITOR_ANALYSIS: "Wettbewerbs-Analyse",
                    CONTENT_CALENDAR: "Content-Kalender",
                  };
                  
                  const displayName = featureNames[key] || key
                    .split('_')
                    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(' ');
                  
                  const isFree = cost === 0;
                  
                  return (
                    <div key={key} className={`flex items-center justify-between p-3 rounded-lg ${isFree ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5'}`}>
                      <span className="text-sm">{displayName}</span>
                      <Badge 
                        variant="outline" 
                        className={isFree 
                          ? "border-green-500/50 text-green-400 bg-green-500/10" 
                          : "border-[#ffb606]/30 text-[#ffb606]"
                        }
                      >
                        {isFree ? '✓ Kostenlos' : `${cost} Credits`}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </GlassCardContent>
          </GlassCard>
        )}

        {/* Usage History */}
        <GlassCard variant="elevated">
          <GlassCardHeader>
            <GlassCardTitle>Letzte Aktivitäten</GlassCardTitle>
            <GlassCardDescription>Dein Credit-Transaktionsverlauf</GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            {history && history.length > 0 ? (
              <div className="space-y-3">
                {history.map((transaction) => {
                  const isDeduction = transaction.creditsSpent < 0;
                  const displayName = transaction.featureKey
                    .split('_')
                    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(' ');
                  
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          isDeduction 
                            ? 'bg-red-500/20' 
                            : 'bg-green-500/20'
                        }`}>
                          {isDeduction ? (
                            <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{displayName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(transaction.createdAt).toLocaleString("de-DE")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          isDeduction ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {isDeduction ? '' : '+'}{transaction.creditsSpent}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Saldo: {transaction.balanceAfter}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Clock}
                gradient="blue-purple"
                title="Noch keine Transaktionen"
                description="Dein Credit-Verlauf erscheint hier, sobald du Features nutzt."
              />
            )}
          </GlassCardContent>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
