import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, TrendingUp, Calendar, Sparkles } from "lucide-react";

export function UsageStatsCards() {
  const { data: stats, isLoading, isError } = trpc.credits.getUsageStats.useQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lädt...</CardTitle>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center text-muted-foreground">
            Statistiken konnten nicht geladen werden
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Credits Used */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verbrauchte Credits</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCreditsUsed}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Gesamtverbrauch
          </p>
        </CardContent>
      </Card>

      {/* Average Per Day */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Durchschnitt pro Tag</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averagePerDay}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Credits pro Tag
          </p>
        </CardContent>
      </Card>

      {/* Most Active Feature */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meist genutztes Feature</CardTitle>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {stats.mostActiveFeature || "Keine Daten"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.mostActiveFeatureCredits > 0
              ? `${stats.mostActiveFeatureCredits} Credits verbraucht`
              : "Noch keine Nutzung"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
