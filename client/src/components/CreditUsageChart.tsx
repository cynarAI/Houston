import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function CreditUsageChart() {
  const { data, isLoading, isError } = trpc.credits.getDailyUsageHistory.useQuery({
    days: 30,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit-Verbrauch (Letzte 30 Tage)</CardTitle>
          <CardDescription>Täglicher Credit-Verbrauch</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit-Verbrauch (Letzte 30 Tage)</CardTitle>
          <CardDescription>Täglicher Credit-Verbrauch</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Daten konnten nicht geladen werden</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit-Verbrauch (Letzte 30 Tage)</CardTitle>
          <CardDescription>Täglicher Credit-Verbrauch</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center">
          <TrendingDown className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Noch keine Nutzungsdaten</p>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
    }),
    credits: item.credits,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit-Verbrauch (Letzte 30 Tage)</CardTitle>
        <CardDescription>Täglicher Credit-Verbrauch</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))" }}
              formatter={(value: number) => [`${value} Credits`, "Verbrauch"]}
            />
            <Line
              type="monotone"
              dataKey="credits"
              stroke="#ffb606"
              strokeWidth={2}
              dot={{ fill: "#ffb606", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
