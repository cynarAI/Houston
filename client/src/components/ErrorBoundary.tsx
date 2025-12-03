import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            {/* Icon with Space-Theme Glow */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
                <AlertTriangle className="h-10 w-10 text-red-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-center">
              Houston, wir haben ein Problem!
            </h2>
            
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Ein unerwarteter Fehler ist aufgetreten. Bitte lade die Seite neu oder kehre zum Dashboard zurück.
            </p>

            {/* Error Details (collapsible in production) */}
            {this.state.error?.stack && (
              <details className="w-full mb-6">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
                  Technische Details anzeigen
                </summary>
                <div className="p-4 w-full rounded-lg bg-muted/50 border border-white/10 overflow-auto max-h-48">
                  <pre className="text-xs text-muted-foreground whitespace-break-spaces font-mono">
                    {this.state.error?.stack}
                  </pre>
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium",
                  "bg-gradient-to-r from-[#ffb606] to-[#442e66] text-white",
                  "hover:opacity-90 transition-all hover:scale-105",
                  "shadow-lg hover:shadow-xl"
                )}
              >
                <RotateCcw size={16} />
                Seite neu laden
              </button>
              
              <button
                onClick={() => window.location.href = "/app/dashboard"}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium",
                  "bg-white/5 border border-white/20 text-foreground",
                  "hover:bg-white/10 transition-all"
                )}
              >
                <Home size={16} />
                Zum Dashboard
              </button>
            </div>

            {/* Support hint */}
            <p className="text-xs text-muted-foreground mt-8 text-center">
              Wenn das Problem weiterhin besteht, kontaktiere bitte unseren Support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
