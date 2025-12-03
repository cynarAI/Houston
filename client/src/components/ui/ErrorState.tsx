import { AlertTriangle, RotateCcw, Wifi, WifiOff, ServerCrash, Sparkles } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface ErrorStateProps {
  /** Error title - defaults to space-themed message */
  title?: string;
  /** Detailed error message */
  message?: string;
  /** Callback for retry button */
  onRetry?: () => void;
  /** Type of error for specialized messaging */
  variant?: "default" | "network" | "server" | "credits" | "notFound";
  /** Additional CSS classes */
  className?: string;
  /** Whether to show as full page/section */
  fullPage?: boolean;
}

const errorConfig = {
  default: {
    icon: AlertTriangle,
    title: "Houston, wir haben ein Problem! 🚀",
    message: "Keine Sorge – das passiert den Besten. Versuch es einfach nochmal.",
    iconColor: "text-red-400",
    bgColor: "from-red-500/20 to-orange-500/20",
  },
  network: {
    icon: WifiOff,
    title: "Houston meldet: Kein Signal!",
    message: "Wir haben die Verbindung verloren. Prüf mal dein Internet – ich warte hier.",
    iconColor: "text-orange-400",
    bgColor: "from-orange-500/20 to-yellow-500/20",
  },
  server: {
    icon: ServerCrash,
    title: "Mission Control ist beschäftigt",
    message: "Unsere Server arbeiten gerade auf Hochtouren. Gib uns einen Moment.",
    iconColor: "text-purple-400",
    bgColor: "from-purple-500/20 to-indigo-500/20",
  },
  credits: {
    icon: Sparkles,
    title: "Zeit für einen Tankstop! ⛽",
    message: "Deine Credits sind aufgebraucht. Lade nach, um weiterzumachen.",
    iconColor: "text-[#FF6B9D]",
    bgColor: "from-[#FF6B9D]/20 to-[#C44FE2]/20",
  },
  notFound: {
    icon: AlertTriangle,
    title: "Das haben wir leider nicht gefunden",
    message: "Entweder existiert es nicht mehr, oder der Link war fehlerhaft.",
    iconColor: "text-blue-400",
    bgColor: "from-blue-500/20 to-purple-500/20",
  },
};

/**
 * Space-themed error state component
 */
export function ErrorState({
  title,
  message,
  onRetry,
  variant = "default",
  className,
  fullPage = false,
}: ErrorStateProps) {
  const config = errorConfig[variant];
  const Icon = config.icon;

  const containerClasses = fullPage
    ? "min-h-[50vh] flex items-center justify-center"
    : "";

  return (
    <div className={cn(containerClasses, className)}>
      <Card className="glass border-red-500/20 max-w-md mx-auto">
        <CardContent className="py-12 text-center">
          {/* Icon with glow effect */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br rounded-full blur-2xl opacity-30 animate-pulse",
                  config.bgColor
                )}
              />
              <div
                className={cn(
                  "relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br",
                  config.bgColor
                )}
              >
                <Icon className={cn("h-8 w-8", config.iconColor)} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-xl mb-2">
            {title || config.title}
          </h3>

          {/* Message */}
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            {message || config.message}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry} variant="default" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Erneut versuchen
              </Button>
            )}
            
            {variant === "credits" && (
              <Link href="/app/credits">
                <Button className="gap-2 bg-gradient-to-r from-[#ffb606] to-[#442e66]">
                  <Sparkles className="h-4 w-4" />
                  Credits aufladen
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Inline error message for smaller contexts
 */
export function InlineError({
  message = "Ein Fehler ist aufgetreten",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20",
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
      <p className="text-sm text-muted-foreground flex-1">{message}</p>
      {onRetry && (
        <Button size="sm" variant="ghost" onClick={onRetry} className="gap-1">
          <RotateCcw className="h-3 w-3" />
          Retry
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
