import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Sparkles, TrendingUp, Zap, Check, ArrowRight, Clock, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditUsageChart } from "@/components/CreditUsageChart";
import { UsageStatsCards } from "@/components/UsageStatsCards";
import { TopFeaturesCard } from "@/components/TopFeaturesCard";
import { TransactionHistoryTable } from "@/components/TransactionHistoryTable";

export default function Credits() {
  const [activeTab, setActiveTab] = useState("plans");
  const { data: balance } = trpc.credits.getBalance.useQuery();
  const { data: history } = trpc.credits.getUsageHistory.useQuery({ limit: 20 });
  const { data: monthlyUsage } = trpc.credits.getMonthlyUsage.useQuery();
  const { data: subscription } = trpc.credits.getActiveSubscription.useQuery();
  const { data: plans } = trpc.credits.getPlans.useQuery();
  const { data: topups } = trpc.credits.getTopups.useQuery();
  const { data: costs } = trpc.credits.getAllCosts.useQuery();
  
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation();

  const credits = balance ?? 0;
  const isLow = credits < 20;
  
  const handlePurchase = async (productKey: "orbit_pack" | "galaxy_pack" | "mini_booster" | "power_booster" | "mega_booster") => {
    try {
      const result = await createCheckoutSession.mutateAsync({ productKey });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Checkout konnte nicht gestartet werden. Bitte versuche es erneut.");
      console.error("Checkout error:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Credits & Pläne</h1>
          <p className="text-muted-foreground">
            Verwalte deine Credits und dein Abonnement
          </p>
        </div>

        {/* Current Balance Card */}
        <Card className="glass border-white/10 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#ffb606] to-[#442e66]">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dein Guthaben</p>
                  <h2 className="text-4xl font-bold gradient-text">
                    {credits} Credits
                  </h2>
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
          </CardContent>
        </Card>

        {/* Active Subscription */}
        {subscription && subscription.plan && (
          <Card className="glass border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Aktives Abonnement</CardTitle>
              <CardDescription>Dein aktueller Plan</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
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
              <h2 className="text-2xl font-bold mb-4">Abonnement-Pläne</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {plans?.map((plan) => {
              const features = plan.features ? JSON.parse(plan.features) : [];
              const isActive = subscription?.plan?.id === plan.id;
              
              return (
                <Card
                  key={plan.id}
                  className={`glass border-white/10 backdrop-blur-xl hover:border-white/20 transition-all ${
                    isActive ? 'border-[#ffb606]/50 shadow-[0_0_30px_rgba(255,182,6,0.2)]' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      {isActive && (
                        <Badge className="bg-[#ffb606]/20 text-[#ffb606] border-[#ffb606]/30">
                          Active
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                    <div className="space-y-2">
                      {features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full"
                      variant={isActive ? "outline" : "default"}
                      disabled={isActive || createCheckoutSession.isPending}
                      onClick={() => !isActive && handlePurchase(plan.key as any)}
                    >
                      {createCheckoutSession.isPending ? 'Lädt...' : isActive ? 'Aktueller Plan' : 'Abonnieren'}
                      {!isActive && !createCheckoutSession.isPending && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
            </div>
          </TabsContent>

          {/* Topups Tab */}
          <TabsContent value="topups" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Mission Boosters</h2>
          <p className="text-muted-foreground mb-4">Einmalige Credit-Aufladungen</p>
          <div className="grid gap-4 md:grid-cols-3">
            {topups?.map((topup) => (
              <Card key={topup.id} className="glass border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#ffb606]/20 to-[#442e66]/20 mx-auto">
                    <Zap className="w-6 h-6 text-[#ffb606]" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-1">{topup.name}</h3>
                    <p className="text-3xl font-bold gradient-text">{topup.credits}</p>
                    <p className="text-sm text-muted-foreground">credits</p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold">€{(topup.price / 100).toFixed(2)}</p>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled={createCheckoutSession.isPending}
                    onClick={() => handlePurchase(topup.key as any)}
                  >
                    {createCheckoutSession.isPending ? 'Lädt...' : 'Kaufen'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <UsageStatsCards />
            <div className="grid gap-6 lg:grid-cols-2">
              <CreditUsageChart />
              <TopFeaturesCard />
            </div>
            <TransactionHistoryTable />
          </TabsContent>
        </Tabs>

        {/* Credit Costs Reference */}
        {costs && (
          <Card className="glass border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Feature-Kosten</CardTitle>
              <CardDescription>So werden Credits in Houston verwendet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(costs).map(([key, cost]) => {
                  const displayName = key
                    .split('_')
                    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(' ');
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-sm">{displayName}</span>
                      <Badge variant="outline" className="border-[#ffb606]/30 text-[#ffb606]">
                        {cost === 0 ? 'Kostenlos' : `${cost} Credits`}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage History */}
        <Card className="glass border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Letzte Aktivitäten</CardTitle>
            <CardDescription>Dein Credit-Transaktionsverlauf</CardDescription>
          </CardHeader>
          <CardContent>
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
                            {new Date(transaction.createdAt).toLocaleString()}
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
                          Balance: {transaction.balanceAfter}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Noch keine Transaktionen</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
