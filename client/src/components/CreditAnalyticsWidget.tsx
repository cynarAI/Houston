import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, Zap, Activity } from "lucide-react";
import { Link } from "wouter";

/**
 * Credit Analytics Widget - Shows credit usage breakdown and stats
 * Displays on Dashboard for quick insights
 */
export function CreditAnalyticsWidget() {
  const { data: breakdown, isLoading: breakdownLoading } = trpc.analytics.getCreditUsageBreakdown.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.analytics.getUsageStats.useQuery();
  const { data: mostUsed, isLoading: mostUsedLoading } = trpc.analytics.getMostUsedFeature.useQuery();

  if (breakdownLoading || statsLoading || mostUsedLoading) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Credit Usage Analytics
          </CardTitle>
          <CardDescription>Loading your usage insights...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalUsed = breakdown?.totalUsed || 0;
  const thisMonth = stats?.thisMonth || 0;
  const creditsSaved = stats?.creditsSaved || 0;
  const mostUsedFeature = mostUsed?.feature || "none";
  const mostUsedCredits = mostUsed?.credits || 0;

  // Format feature name for display
  const formatFeatureName = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get top 3 features
  const topFeatures = breakdown?.breakdown.slice(0, 3) || [];

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Credit Usage Analytics
        </CardTitle>
        <CardDescription>Last 30 days • <Link href="/app/credits" className="text-primary hover:underline">View full history</Link></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Used This Month */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">{thisMonth} credits</p>
          </div>

          {/* Most Used Feature */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Most Used</p>
            <p className="text-lg font-semibold truncate" title={formatFeatureName(mostUsedFeature)}>
              {formatFeatureName(mostUsedFeature)}
            </p>
            <p className="text-xs text-muted-foreground">{mostUsedCredits} credits</p>
          </div>

          {/* Credits Saved */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {creditsSaved > 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  Saved
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Usage
                </>
              )}
            </p>
            <p className={`text-2xl font-bold ${creditsSaved > 0 ? "text-green-500" : "text-orange-500"}`}>
              {creditsSaved > 0 ? `+${creditsSaved}` : thisMonth > (stats?.lastMonth || 0) ? `+${thisMonth - (stats?.lastMonth || 0)}` : "0"}
            </p>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </div>
        </div>

        {/* Feature Breakdown */}
        {topFeatures.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Top Features</p>
            {topFeatures.map((item) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{formatFeatureName(item.feature)}</span>
                  <span className="font-medium">{item.credits} credits ({item.percentage}%)</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {totalUsed === 0 && (
          <div className="text-center py-8 space-y-2">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-sm text-muted-foreground">No credit usage yet</p>
            <p className="text-xs text-muted-foreground">Start using AI features to see analytics</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
