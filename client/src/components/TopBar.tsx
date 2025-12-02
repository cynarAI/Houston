import { Globe, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

/**
 * TopBar - Space-Theme Top Navigation
 * 
 * Features:
 * - Logo + Tagline ("AIstronaut Marketing Coach – Houston")
 * - Language Toggle (DE/EN)
 * - Model Indicator ("Houston AI")
 * 
 * Design: Mission Control Header
 */
export function TopBar() {
  const [language, setLanguage] = useState<"DE" | "EN">("DE");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "DE" ? "EN" : "DE"));
    // TODO: Implement language switching logic
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Left: Logo + Tagline */}
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-[var(--accent-primary)]" />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold gradient-text leading-none">
              AIstronaut Marketing Coach – Houston
            </h1>
            <p className="text-xs text-[var(--text-muted)] leading-none mt-1">
              Dein Mission Control für KI-Marketing
            </p>
          </div>
        </div>

        {/* Right: Language Toggle + Model Indicator */}
        <div className="flex items-center gap-4">
          {/* Model Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            <span className="text-xs font-medium text-[var(--text-main)]">
              Houston AI
            </span>
          </div>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 hover:bg-[var(--bg-card)]"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">{language}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
