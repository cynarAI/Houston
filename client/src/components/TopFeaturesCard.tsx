import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Award } from "lucide-react";
import { Progress } from "./ui/progress";

export function TopFeaturesCard() {
  const { data: features, isLoading, isError } = trpc.credits.getTopFeatures.useQuery({
    limit: 5,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Features nach Credits</CardTitle>
          <CardDescription>Die meistgenutzten Features</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Features nach Credits</CardTitle>
          <CardDescription>Die meistgenutzten Features</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-sm text-muted-foreground">Daten konnten nicht geladen werden</p>
        </CardContent>
      </Card>
    );
  }

  if (!features || features.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Features nach Credits</CardTitle>
          <CardDescription>Die meistgenutzten Features</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <Award className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Noch keine Feature-Nutzung</p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to format feature keys to German
  const formatFeatureName = (featureKey: string) => {
    const featureNames: Record<string, string> = {
      CHAT_MESSAGE: "Chat-Nachricht",
      DEEP_ANALYSIS: "Deep Analysis",
      AI_INSIGHTS: "KI-Insights",
      PDF_EXPORT: "PDF-Export",
      GOALS_GENERATION: "Ziele-Generierung",
      STRATEGY_ANALYSIS: "Strategie-Analyse",
    };
    return featureNames[featureKey] || featureKey.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Features nach Credits</CardTitle>
        <CardDescription>Die meistgenutzten Features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={feature.featureKey} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">
                    #{index + 1}
                  </span>
                  <span className="font-medium">{formatFeatureName(feature.featureKey)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {feature.credits} Credits
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({feature.percentage}%)
                  </span>
                </div>
              </div>
              <Progress value={feature.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
