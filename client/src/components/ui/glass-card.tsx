import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassCardVariants = cva(
  "rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--glass-bg)] backdrop-blur-xl",
          "border-white/10",
          "hover:border-white/20",
        ].join(" "),
        elevated: [
          "bg-[var(--glass-bg)] backdrop-blur-xl",
          "border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.37)]",
          "hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]",
          "hover:border-white/20",
        ].join(" "),
        glow: [
          "bg-[var(--glass-bg)] backdrop-blur-xl",
          "border-white/10",
          "shadow-[0_0_20px_rgba(255,107,157,0.2),0_0_40px_rgba(139,92,246,0.1)]",
          "hover:shadow-[0_0_30px_rgba(255,107,157,0.4),0_0_60px_rgba(139,92,246,0.2)]",
          "hover:border-white/20",
        ].join(" "),
        subtle: [
          "bg-card/50 backdrop-blur-sm",
          "border-border/50",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

/**
 * GlassCard - Card component with glassmorphism effect for Houston's space theme
 * 
 * @example
 * <GlassCard variant="elevated">
 *   <GlassCardHeader>
 *     <GlassCardTitle>Mission Control</GlassCardTitle>
 *     <GlassCardDescription>Dein aktueller Missions-Status</GlassCardDescription>
 *   </GlassCardHeader>
 *   <GlassCardContent>...</GlassCardContent>
 * </GlassCard>
 */
function GlassCard({ className, variant, ...props }: GlassCardProps) {
  return (
    <div
      data-slot="glass-card"
      className={cn(glassCardVariants({ variant }), className)}
      {...props}
    />
  );
}

function GlassCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="glass-card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  );
}

function GlassCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="glass-card-title"
      className={cn("text-xl font-bold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function GlassCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="glass-card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function GlassCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="glass-card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

function GlassCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="glass-card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
  glassCardVariants,
};
export type { GlassCardProps };
