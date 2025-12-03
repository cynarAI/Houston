import * as React from "react";
import { cn } from "@/lib/utils";
import { GradientIcon } from "./gradient-icon";
import { Button } from "./button";
import type { LucideIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import type { gradientIconVariants } from "./gradient-icon";

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "gradient" | "outline" | "ghost";
  icon?: LucideIcon;
}

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Primary action button */
  action?: EmptyStateAction;
  /** Secondary action button */
  secondaryAction?: EmptyStateAction;
  /** Gradient for the icon background */
  gradient?: VariantProps<typeof gradientIconVariants>["gradient"];
  /** Size of the icon */
  iconSize?: "md" | "lg" | "xl";
}

/**
 * EmptyState - Consistent empty state component for Houston app
 * 
 * @example Basic usage
 * <EmptyState
 *   icon={Target}
 *   title="Noch keine Ziele"
 *   description="Lass Houston dir helfen, SMART-Ziele zu definieren."
 *   action={{ label: "Ziel erstellen", onClick: () => {} }}
 * />
 * 
 * @example With secondary action
 * <EmptyState
 *   icon={MessageSquare}
 *   title="Keine Gespräche"
 *   description="Starte jetzt dein erstes Gespräch mit Houston!"
 *   action={{ label: "Gespräch starten", onClick: () => {} }}
 *   secondaryAction={{ label: "Mehr erfahren", variant: "outline" }}
 *   gradient="pink-purple"
 * />
 */
function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  gradient = "blue-purple",
  iconSize = "lg",
  className,
  ...props
}: EmptyStateProps) {
  const ActionIcon = action?.icon;
  const SecondaryIcon = secondaryAction?.icon;

  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
      {...props}
    >
      <GradientIcon
        icon={icon}
        gradient={gradient}
        size={iconSize}
        className="mb-4"
      />
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
      )}
      
      {(action || secondaryAction) && (
        <div className="flex flex-wrap gap-3 justify-center">
          {action && (
            <Button
              variant={action.variant === "gradient" ? "default" : action.variant}
              className={action.variant === "gradient" ? "btn-gradient" : undefined}
              onClick={action.onClick}
              asChild={!!action.href}
            >
              {action.href ? (
                <a href={action.href}>
                  {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                  {action.label}
                </a>
              ) : (
                <>
                  {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                  {action.label}
                </>
              )}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "outline"}
              className={secondaryAction.variant === "gradient" ? "btn-gradient" : undefined}
              onClick={secondaryAction.onClick}
              asChild={!!secondaryAction.href}
            >
              {secondaryAction.href ? (
                <a href={secondaryAction.href}>
                  {SecondaryIcon && <SecondaryIcon className="mr-2 h-4 w-4" />}
                  {secondaryAction.label}
                </a>
              ) : (
                <>
                  {SecondaryIcon && <SecondaryIcon className="mr-2 h-4 w-4" />}
                  {secondaryAction.label}
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps, EmptyStateAction };
