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
          "gap-1 text-muted-foreground border-muted-foreground/30",
          className,
        )}
      >
        <Sparkles className="w-3 h-3" />
        <span>Starter</span>
      </Badge>
    );
  }

  if (plan === "pro") {
    return (
      <Badge
        className={cn(
          "gap-1 bg-gradient-to-r from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] border-0 text-white shadow-md shadow-purple-500/20",
          className,
        )}
      >
        <Rocket className="w-3 h-3 fill-current" />
        <span>Houston Pro</span>
      </Badge>
    );
  }

  return (
    <Badge className={cn("gap-1 bg-blue-600 text-white border-0", className)}>
      <Brain className="w-3 h-3" />
      <span>Enterprise</span>
    </Badge>
  );
}
