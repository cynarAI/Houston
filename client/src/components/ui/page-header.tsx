import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Optional name to highlight with gradient text (e.g., user's name) */
  highlightedName?: string;
  /** Optional emoji or icon to append after highlighted name */
  emoji?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * PageHeader - Consistent page header component for Houston app
 * 
 * @example
 * <PageHeader 
 *   title="Willkommen zurück" 
 *   highlightedName="Captain"
 *   emoji="🚀"
 *   description="Hier ist dein Houston Dashboard-Überblick."
 * />
 */
function PageHeader({
  title,
  description,
  highlightedName,
  emoji,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="text-3xl font-bold mb-2">
        {title}
        {highlightedName && (
          <>
            {" "}
            <span className="gradient-text">{highlightedName}</span>
          </>
        )}
        {emoji && ` ${emoji}`}
      </h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}

export { PageHeader };
export type { PageHeaderProps };
