import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export interface ConversationCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost" | "gradient";
  };
  children?: React.ReactNode;
  className?: string;
  gradient?: "pink-purple" | "blue-purple" | "cyan-purple" | "orange-pink";
}

export function ConversationCard({
  title,
  description,
  icon,
  action,
  children,
  className,
  gradient = "pink-purple",
}: ConversationCardProps) {
  const gradientClasses = {
    "pink-purple":
      "from-[var(--aistronaut-pink)]/10 to-[var(--aistronaut-purple)]/10 dark:from-[var(--aistronaut-pink)]/20 dark:to-[var(--aistronaut-purple)]/20",
    "blue-purple":
      "from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20",
    "cyan-purple":
      "from-cyan-500/10 to-purple-500/10 dark:from-cyan-500/20 dark:to-purple-500/20",
    "orange-pink":
      "from-orange-500/10 to-pink-500/10 dark:from-orange-500/20 dark:to-pink-500/20",
  };

  return (
    <Card
      className={cn(
        "border-border/50 backdrop-blur-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10",
        `bg-gradient-to-br ${gradientClasses[gradient]}`,
        className,
      )}
    >
      {icon && (
        <div className="absolute top-4 right-4 opacity-20 dark:opacity-30">
          {icon}
        </div>
      )}
      <CardHeader className="relative">
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--aistronaut-pink)] to-[var(--aistronaut-purple)] shadow-lg shadow-pink-500/20 mb-2">
            {typeof icon === "string" ? (
              <Sparkles className="h-5 w-5 text-white" />
            ) : (
              <div className="text-white">{icon}</div>
            )}
          </div>
        )}
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm mt-1">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {action && (
        <CardContent className="pt-0">
          <Button
            variant={action.variant || "outline"}
            onClick={action.onClick}
            className="w-full group"
          >
            {action.label}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
