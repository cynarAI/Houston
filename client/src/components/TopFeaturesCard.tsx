import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Award } from "lucide-react";
import { Progress } from "./ui/progress";

export function TopFeaturesCard() {
  const { data: features, isLoading } = trpc.credits.getTopFeatures.useQuery({
    limit: 5,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Features by Credits</CardTitle>
          <CardDescription>Most credit-consuming features</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!features || features.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Features by Credits</CardTitle>
          <CardDescription>Most credit-consuming features</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <Award className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No feature usage yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Features by Credits</CardTitle>
        <CardDescription>Most credit-consuming features</CardDescription>
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
                  <span className="font-medium">{feature.featureKey}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {feature.credits} credits
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
