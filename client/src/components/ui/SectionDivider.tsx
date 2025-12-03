import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionDividerProps {
  label?: string;
  variant?: "solid" | "gradient" | "space";
  className?: string;
}

export function SectionDivider({
  label,
  variant = "solid",
  className,
}: SectionDividerProps) {
  if (variant === "space") {
    return (
      <div className={cn("relative flex items-center gap-4 py-4", className)}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--aistronaut-pink)] opacity-60 dark:opacity-80" />
          <div className="h-1 w-1 rounded-full bg-[var(--aistronaut-purple)] opacity-40 dark:opacity-60" />
          <div className="h-0.5 w-0.5 rounded-full bg-[var(--aistronaut-cyan)] opacity-30 dark:opacity-50" />
        </div>
        {label && (
          <span className="text-xs font-medium text-muted-foreground px-2">
            {label}
          </span>
        )}
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-0.5 rounded-full bg-[var(--aistronaut-cyan)] opacity-30 dark:opacity-50" />
          <div className="h-1 w-1 rounded-full bg-[var(--aistronaut-purple)] opacity-40 dark:opacity-60" />
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--aistronaut-pink)] opacity-60 dark:opacity-80" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className={cn("relative flex items-center gap-4 py-4", className)}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--aistronaut-pink)]/30 to-transparent" />
        {label && (
          <span className="text-xs font-medium text-muted-foreground px-2">
            {label}
          </span>
        )}
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--aistronaut-purple)]/30 to-transparent" />
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center gap-4 py-4", className)}>
      <div className="flex-1 h-px bg-border" />
      {label && (
        <span className="text-xs font-medium text-muted-foreground px-2">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
