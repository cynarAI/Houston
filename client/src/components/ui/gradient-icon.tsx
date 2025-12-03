import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const gradientIconVariants = cva(
  "flex items-center justify-center rounded-full",
  {
    variants: {
      size: {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-14 h-14",
        xl: "w-20 h-20",
      },
      gradient: {
        "orange-pink": "bg-gradient-to-br from-[var(--color-gradient-orange)] to-[var(--color-gradient-pink)]",
        "pink-purple": "bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)]",
        "blue-purple": "bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)]",
        "purple-indigo": "bg-gradient-to-br from-[var(--color-gradient-purple)] to-[var(--color-gradient-indigo)]",
        "cyan-purple": "bg-gradient-to-br from-[var(--color-gradient-cyan)] to-[var(--color-gradient-purple)]",
        "red-orange": "bg-gradient-to-br from-[var(--color-gradient-red)] to-[var(--color-gradient-orange)]",
        "green-emerald": "bg-gradient-to-br from-[var(--color-gradient-green)] to-[var(--color-gradient-emerald)]",
        "aistronaut": "bg-gradient-to-br from-[#FF6B9D] to-[#8B5CF6]",
        // Priority-based gradients
        "high": "bg-gradient-to-br from-red-500 to-orange-500",
        "medium": "bg-gradient-to-br from-blue-500 to-purple-500",
        "low": "bg-gradient-to-br from-green-500 to-emerald-500",
      },
    },
    defaultVariants: {
      size: "md",
      gradient: "blue-purple",
    },
  }
);

const iconSizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
  xl: "h-10 w-10",
};

interface GradientIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gradientIconVariants> {
  icon: LucideIcon;
  iconClassName?: string;
}

/**
 * GradientIcon - Icon wrapped in a gradient circle for Houston's space theme
 * 
 * @example
 * <GradientIcon 
 *   icon={Brain} 
 *   gradient="blue-purple" 
 *   size="lg" 
 * />
 * 
 * @example Priority-based usage
 * <GradientIcon 
 *   icon={Sparkles} 
 *   gradient={priority === 'high' ? 'high' : priority === 'medium' ? 'medium' : 'low'} 
 * />
 */
function GradientIcon({
  icon: Icon,
  size = "md",
  gradient,
  className,
  iconClassName,
  ...props
}: GradientIconProps) {
  const iconSize = iconSizeMap[size || "md"];

  return (
    <div
      data-slot="gradient-icon"
      className={cn(gradientIconVariants({ size, gradient }), className)}
      {...props}
    >
      <Icon className={cn(iconSize, "text-white", iconClassName)} />
    </div>
  );
}

export { GradientIcon, gradientIconVariants };
export type { GradientIconProps };
