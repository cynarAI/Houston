import { Sparkles, Brain, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  plan: "free" | "pro" | "enterprise";
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  if (plan === "free") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1.5 px-3 py-1 text-xs font-medium text-muted-foreground bg-transparent border-0 [&>svg]:w-4 [&>svg]:h-4",
          className,
        )}
      >
        <Sparkles className="w-4 h-4" />
        <span>Starter</span>
      </Badge>
    );
  }

  if (plan === "pro") {
    return (
      <Badge
        className={cn(
          "gap-1.5 px-3 py-1 text-xs font-medium bg-primary/12 text-primary border-0",
          className,
        )}
      >
        <Rocket className="w-4 h-4 fill-current" />
        <span>Houston Pro</span>
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        "gap-1.5 px-3 py-1 text-xs font-medium bg-primary text-primary-foreground border-0",
        className,
      )}
    >
      <Brain className="w-4 h-4" />
      <span>Enterprise</span>
    </Badge>
  );
}
