import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ProgressiveLoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
  className?: string;
  label?: string;
}

const sizeConfig = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function ProgressiveLoader({
  size = "md",
  variant = "spinner",
  className,
  label,
}: ProgressiveLoaderProps) {
  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2
          className={cn(
            sizeConfig[size],
            "animate-spin text-primary dark:text-primary",
          )}
        />
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "rounded-full bg-primary dark:bg-primary animate-bounce",
              size === "sm"
                ? "h-1.5 w-1.5"
                : size === "md"
                  ? "h-2 w-2"
                  : "h-2.5 w-2.5",
            )}
            style={{ animationDelay: "0ms", animationDuration: "600ms" }}
          />
          <div
            className={cn(
              "rounded-full bg-primary dark:bg-primary animate-bounce",
              size === "sm"
                ? "h-1.5 w-1.5"
                : size === "md"
                  ? "h-2 w-2"
                  : "h-2.5 w-2.5",
            )}
            style={{ animationDelay: "150ms", animationDuration: "600ms" }}
          />
          <div
            className={cn(
              "rounded-full bg-primary dark:bg-primary animate-bounce",
              size === "sm"
                ? "h-1.5 w-1.5"
                : size === "md"
                  ? "h-2 w-2"
                  : "h-2.5 w-2.5",
            )}
            style={{ animationDelay: "300ms", animationDuration: "600ms" }}
          />
        </div>
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className={cn(
            "rounded-full bg-primary/20 dark:bg-primary/30 animate-pulse",
            sizeConfig[size],
          )}
        />
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}
      </div>
    );
  }

  return null;
}
