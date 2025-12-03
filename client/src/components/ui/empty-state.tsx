import * as React from "react";
import { cn } from "@/lib/utils";
import { GradientIcon } from "./gradient-icon";
import { Button } from "./button";
import type { LucideIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import type { gradientIconVariants } from "./gradient-icon";
import { designTokens } from "@/lib/design-tokens";

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
        "flex flex-col items-center justify-center py-12 text-center animate-in fade-in slide-in-from-bottom-2 duration-300",
        className,
      )}
      {...props}
    >
      <GradientIcon
        icon={icon}
        gradient={gradient}
        size={iconSize}
        className="mb-4 animate-in zoom-in duration-300"
      />

      <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-foreground">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div
          className="flex flex-wrap gap-3 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ animationDelay: designTokens.animation.delay.stagger2 }}
        >
          {action && (
            <Button
              variant={
                action.variant === "gradient"
                  ? "gradient"
                  : action.variant || "default"
              }
              onClick={action.onClick}
              asChild={!!action.href}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
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
              variant={
                secondaryAction.variant === "gradient"
                  ? "gradient"
                  : secondaryAction.variant || "outline"
              }
              onClick={secondaryAction.onClick}
              asChild={!!secondaryAction.href}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
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
