import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { OnboardingWizard } from "./OnboardingWizard";
import { trpc } from "@/lib/trpc";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FloatingSidebar } from "@/components/layout/FloatingSidebar";
import { FloatingHeader } from "@/components/layout/FloatingHeader";

// ===========================================
// SPACE BACKGROUND COMPONENT
// ===========================================
function SpaceBackground() {
  const { theme } = useTheme();
  const [shootingStars, setShootingStars] = useState<
    Array<{ id: number; x: number; y: number; angle: number }>
  >([]);

  // Generate static stars (memoized) - mehr Sterne für subtile Galaxie
  const stars = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.3, // Verschiedene Größen
      opacity: Math.random() * 0.6 + 0.2, // Sichtbarer aber subtil
      twinkleDelay: Math.random() * 5,
      twinkleDuration: Math.random() * 3 + 2,
    }));
  }, []);

  // Shooting stars effect (dark mode only) - rarer and more subtle
  useEffect(() => {
    if (theme === "light") {
      // Clear shooting stars when switching to light mode
      setShootingStars([]);
      return;
    }

    const createShootingStar = () => {
      const newStar = {
        id: Date.now(),
        x: Math.random() * 60 + 10,
        y: Math.random() * 25,
        angle: Math.random() * 25 + 15,
      };

      setShootingStars((prev) => [...prev, newStar]);

      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, 2000);
    };

    const scheduleNext = () => {
      // Häufigere Sternschnuppen: 5 to 15 seconds
      const delay = Math.random() * 10000 + 5000;
      return setTimeout(() => {
        createShootingStar();
        scheduleNext();
      }, delay);
    };

    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [theme]);

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* LIGHT MODE BACKDROP */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          theme === "light" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f7fb] via-[#fdfefe] to-[#e7ecf4]" />
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-[#FF6B9D]/[0.08] via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-to-tr from-[#8B5CF6]/[0.08] via-transparent to-transparent blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-30">
          {stars.slice(0, 20).map((star) => (
            <circle
              key={`light-${star.id}`}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r={Math.max(0.4, star.size * 0.4)}
              fill="#C4B5FD"
              opacity={star.opacity * 0.4}
            />
          ))}
        </svg>
      </div>

      {/* DARK MODE BACKDROP */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]" />
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-[#FF6B9D]/10 via-[#C44FE2]/8 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-[#1E40AF]/8 via-[#6D28D9]/6 to-transparent blur-3xl" />

        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {stars.map((star) => (
            <circle
              key={`dark-${star.id}`}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r={star.size}
              fill="white"
              opacity={star.opacity}
              filter={star.size > 1.2 ? "url(#starGlow)" : undefined}
              className="animate-twinkle"
              style={{
                animationDelay: `${star.twinkleDelay}s`,
                animationDuration: `${star.twinkleDuration}s`,
              }}
            />
          ))}
        </svg>

        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="absolute animate-shooting-star opacity-70"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: `rotate(${star.angle}deg)`,
            }}
          >
            <div className="w-32 h-[1.5px] bg-gradient-to-r from-white via-white/70 to-transparent rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================================
// MAIN LAYOUT COMPONENT - FLOATING ISLAND DESIGN
// ===========================================
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuth();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || "de";
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  // Check onboarding status
  const { data: onboardingStatus } =
    trpc.onboarding.getUserOnboardingStatus.useQuery(undefined, {
      enabled: !!user,
    });

  useEffect(() => {
    if (user && onboardingStatus && !onboardingStatus.completed) {
      setShowOnboarding(true);
    }
  }, [user, onboardingStatus]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <SpaceBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B9D]/20 via-[#C44FE2]/20 via-[#8B5CF6]/20 to-[#00D4FF]/20 border border-[#FF6B9D]/30">
              <Sparkles className="h-8 w-8 text-[#FF6B9D] animate-pulse" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Houston startet...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpaceBackground />
        <div className="relative z-10 flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-[#FF6B9D]" />
              <span className="text-2xl font-bold gradient-text-aistronaut">
                Houston
              </span>
            </div>
            <h1 className="text-xl font-semibold text-center">
              {currentLanguage === "de"
                ? "Anmeldung erforderlich"
                : "Login required"}
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              {currentLanguage === "de"
                ? "Für den Zugriff auf Houston ist eine Anmeldung erforderlich."
                : "Login is required to access Houston."}
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            variant="gradient"
            className="w-full"
          >
            {currentLanguage === "de" ? "Anmelden" : "Login"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[hsl(var(--background))] dark:bg-[#0a0a0f] transition-colors duration-500">
      {/* Space Background */}
      <SpaceBackground />

      {/* Floating Island Layout - Symmetrisches Spacing */}
      <div
        className={`flex h-screen w-full px-6 py-6 gap-6 relative z-10 transition-colors duration-500 ${
          isLightTheme ? "bg-[#e2e5ea]" : "bg-transparent"
        }`}
      >
        {/* Desktop Sidebar - Floating Glass Island */}
        <FloatingSidebar />

        {/* Main Content - Floating Island */}
        <main
          className={`flex-1 relative rounded-3xl border overflow-hidden transition-all duration-500 ${
            isLightTheme
              ? "bg-[#f3f4f8] border-border/70"
              : "bg-white/5 dark:bg-[#1a1a2e]/40 border-white/10"
          }`}
        >
          <div
            className={`h-full overflow-y-auto scroll-smooth flex flex-col ${
              isLightTheme ? "bg-[#f3f4f8]" : "bg-white/5 dark:bg-[#1a1a2e]/40"
            }`}
          >
            {/* Floating Header with translucent backdrop */}
            <div
              className={`sticky top-0 z-30 border-b transition-colors duration-500 ${
                isLightTheme
                  ? "bg-[rgba(210,214,226,0.55)] backdrop-blur-[90px] border-white/50"
                  : "bg-[#0f172a]/70 border-white/10"
              }`}
            >
              <FloatingHeader onMenuClick={() => setMobileMenuOpen(true)} />
            </div>

            {/* Scrollable Content Area - Symmetrisches Padding */}
            <div className="flex-1 pt-6 pb-6 md:pb-8 relative bg-[#f3f5fb] dark:bg-white/5">
              <div className="max-w-7xl mx-auto h-full px-6 pr-8">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Menu Sheet - Touch Optimized */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 border-r border-white/10 bg-transparent shadow-2xl touch-manipulation"
        >
          <div className="h-full w-full backdrop-blur-xl bg-background/80">
            {/* Sidebar ohne Margin/Radius für Full-Height Mobile View */}
            <FloatingSidebar className="flex w-full h-full border-none rounded-none !bg-transparent shadow-none" />
          </div>
        </SheetContent>
      </Sheet>

      {/* Onboarding Wizard */}
      <OnboardingWizard
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}
