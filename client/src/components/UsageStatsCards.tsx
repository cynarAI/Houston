import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, TrendingUp, Calendar, Sparkles } from "lucide-react";

export function UsageStatsCards() {
  const { data: stats, isLoading } = trpc.credits.getUsageStats.useQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Credits Used */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Credits Used</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCreditsUsed}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Lifetime consumption
          </p>
        </CardContent>
      </Card>

      {/* Average Per Day */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Per Day</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averagePerDay}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Credits per day
          </p>
        </CardContent>
      </Card>

      {/* Most Active Feature */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Used Feature</CardTitle>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {stats.mostActiveFeature || "N/A"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.mostActiveFeatureCredits > 0
              ? `${stats.mostActiveFeatureCredits} credits used`
              : "No usage yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
