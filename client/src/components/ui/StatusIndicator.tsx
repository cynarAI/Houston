import * as React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  Loader2,
} from "lucide-react";

export type StatusType = "success" | "warning" | "info" | "error" | "loading";

export interface StatusIndicatorProps {
  type: StatusType;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showPulse?: boolean;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-green-500 dark:text-green-400",
    bgColor: "bg-green-500/10 dark:bg-green-500/20",
    borderColor: "border-green-500/20 dark:border-green-500/30",
  },
  warning: {
    icon: AlertCircle,
    color: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
    borderColor: "border-amber-500/20 dark:border-amber-500/30",
  },
  info: {
    icon: Info,
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    borderColor: "border-blue-500/20 dark:border-blue-500/30",
  },
  error: {
    icon: XCircle,
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-500/10 dark:bg-red-500/20",
    borderColor: "border-red-500/20 dark:border-red-500/30",
  },
  loading: {
    icon: Loader2,
    color: "text-primary dark:text-primary",
    bgColor: "bg-primary/10 dark:bg-primary/20",
    borderColor: "border-primary/20 dark:border-primary/30",
  },
};

const sizeConfig = {
  sm: {
    icon: "h-3 w-3",
    container: "px-2 py-1 text-xs",
  },
  md: {
    icon: "h-4 w-4",
    container: "px-3 py-1.5 text-sm",
  },
  lg: {
    icon: "h-5 w-5",
    container: "px-4 py-2 text-base",
  },
};

export function StatusIndicator({
  type,
  label,
  size = "md",
  className,
  showPulse = false,
}: StatusIndicatorProps) {
  const config = statusConfig[type];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border",
        config.bgColor,
        config.borderColor,
        sizeStyles.container,
        showPulse && type === "loading" && "animate-pulse",
        className,
      )}
    >
      <Icon
        className={cn(
          sizeStyles.icon,
          config.color,
          type === "loading" && "animate-spin",
        )}
      />
      {label && (
        <span className="font-medium text-foreground dark:text-foreground">
          {label}
        </span>
      )}
    </div>
  );
}
