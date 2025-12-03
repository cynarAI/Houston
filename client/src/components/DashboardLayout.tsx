import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLoginUrl } from "@/const";
import {
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Target,
  CheckSquare,
  Settings,
  Globe,
  Moon,
  Sun,
  HelpCircle,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { OnboardingWizard } from "./OnboardingWizard";
import { trpc } from "@/lib/trpc";
import { CreditIndicator } from "./CreditIndicator";
import { NotificationCenter } from "./NotificationCenter";

// ===========================================
// SPACE BACKGROUND COMPONENT
// ===========================================
function SpaceBackground() {
  const { theme } = useTheme();
  const [shootingStars, setShootingStars] = useState<
    Array<{ id: number; x: number; y: number; angle: number }>
  >([]);

  // Generate static stars (memoized) - fewer stars for cleaner look
  const stars = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5, // Slightly smaller
      opacity: Math.random() * 0.4 + 0.1, // More subtle opacity
      twinkleDelay: Math.random() * 5,
      twinkleDuration: Math.random() * 3 + 2,
    }));
  }, []);

  // Shooting stars effect (dark mode only) - rarer and more subtle
  useEffect(() => {
    if (theme === "light") return;

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
      // Much rarer: 15 to 30 seconds
      const delay = Math.random() * 15000 + 15000;
      return setTimeout(() => {
        createShootingStar();
        scheduleNext();
      }, delay);
    };

    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [theme]);

  // Light theme - Ultra subtle, clean with minimal space elements
  if (theme === "light") {
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Augenfreundlicher Light Mode: Warme, gedämpfte Töne statt reines Weiß */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100/90 via-slate-50/95 to-slate-100/90" />
        {/* Very subtle gradients */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#FF6B9D]/[0.02] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-[#C44FE2]/[0.02] to-transparent" />
        {/* Minimal stars for light mode - very subtle */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {stars.slice(0, 15).map((star) => (
            <circle
              key={star.id}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r={star.size * 0.5}
              fill="#8B5CF6"
              opacity={star.opacity * 0.3}
            />
          ))}
        </svg>
      </div>
    );
  }

  // Dark theme with stars
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a18] to-[#050510]" />

      {/* Nebula accents - Optimized opacity for dark mode */}
      <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-[#FF6B9D]/5 via-[#C44FE2]/3 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-[#00D4FF]/4 via-[#C44FE2]/2 to-transparent blur-3xl" />

      {/* Stars */}
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
            key={star.id}
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

      {/* Shooting Stars - Only in dark mode */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-shooting-star opacity-40"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            transform: `rotate(${star.angle}deg)`,
          }}
        >
          <div className="w-20 h-[1px] bg-gradient-to-r from-white via-white/50 to-transparent rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ===========================================
// NAVIGATION ITEMS - Only 4 essential items
// ===========================================
const navItems = [
  {
    icon: MessageSquare,
    label: "Houston",
    labelDe: "Houston",
    path: "/app/chats",
    primary: true,
  },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    labelDe: "Dashboard",
    path: "/app/dashboard",
  },
  {
    icon: CheckSquare,
    label: "Tasks",
    labelDe: "Aufgaben",
    path: "/app/todos",
  },
  { icon: Target, label: "Goals", labelDe: "Ziele", path: "/app/goals" },
  {
    icon: BookOpen,
    label: "Library",
    labelDe: "Bibliothek",
    path: "/app/library",
  },
];

// ===========================================
// MAIN LAYOUT COMPONENT - TOP BAR DESIGN
// ===========================================
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user, logout } = useAuth();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || "de";
  const { theme, toggleTheme, switchable } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

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

  const toggleLanguage = () => {
    const newLang = currentLanguage === "de" ? "en" : "de";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/";
    }
  };

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
    <div className="min-h-screen flex flex-col">
      {/* Space Background */}
      <SpaceBackground />

      {/* ========== TOP NAVIGATION BAR ========== */}
      {/* Mobile-first: Smaller height on mobile, larger on desktop */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 dark:border-white/10 bg-background/95 dark:bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl">
        <div className="flex h-14 md:h-14 items-center gap-3 md:gap-6 px-3 md:px-6 max-w-screen-2xl mx-auto">
          {/* Logo */}
          <button
            onClick={() => setLocation("/app/dashboard")}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-150 shrink-0"
          >
            <Sparkles className="w-5 h-5 text-[#FF6B9D]" />
            <span className="font-semibold gradient-text-aistronaut hidden sm:inline">
              Houston
            </span>
          </button>

          {/* Desktop Navigation - Left-aligned (Steve Jobs: Clear hierarchy) */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive =
                location === item.path ||
                (item.path === "/app/chats" &&
                  location.startsWith("/app/chats"));
              const displayLabel =
                currentLanguage === "de" ? item.labelDe : item.label;

              return (
                <button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                    ${
                      isActive
                        ? item.primary
                          ? "bg-gradient-to-r from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] text-white"
                          : "bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground"
                        : "text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50"
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{displayLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Spacer - pushes right actions to the end */}
          <div className="flex-1" />

          {/* Right Side Actions - Minimal, Essential Only (Steve Jobs: Focus) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Credits - Essential */}
            <div className="hidden sm:block">
              <CreditIndicator />
            </div>

            {/* Notifications - Essential */}
            <NotificationCenter />

            {/* Theme Toggle - Essential - Touch-optimized */}
            {switchable && toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-accent dark:hover:bg-accent transition-colors duration-150 text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground active:scale-95 touch-manipulation"
                aria-label={theme === "light" ? "Dark mode" : "Light mode"}
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Mobile: Menu Button - Touch-optimized (min 44x44px) */}
            <button
              className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-accent dark:hover:bg-accent rounded-lg transition-colors duration-150 active:scale-95 touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* User Menu - Clean, Simple (Steve Jobs: Simplicity) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg hover:bg-accent/50 dark:hover:bg-accent/50 transition-colors duration-150 p-1 pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-8 w-8 border border-border/50 dark:border-white/20">
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] text-white">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3 w-3 text-muted-foreground dark:text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setLocation("/app/settings")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>
                    {currentLanguage === "de" ? "Einstellungen" : "Settings"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocation("/app/credits")}
                  className="cursor-pointer"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Credits</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    window.open(
                      "mailto:support@aistronaut.io?subject=Houston%20Support",
                      "_blank",
                    )
                  }
                  className="cursor-pointer"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>
                    {currentLanguage === "de"
                      ? "Hilfe & Support"
                      : "Help & Support"}
                  </span>
                </DropdownMenuItem>
                {/* Mobile-only language toggle */}
                <DropdownMenuItem
                  onClick={toggleLanguage}
                  className="cursor-pointer sm:hidden"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  <span>
                    {currentLanguage === "de" ? "English" : "Deutsch"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>
                    {currentLanguage === "de" ? "Abmelden" : "Sign out"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation Dropdown - Simple, Clean, Touch-optimized */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 dark:border-white/10 bg-background/95 dark:bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col p-2 gap-1">
              {navItems.map((item) => {
                const isActive = location === item.path;
                const displayLabel =
                  currentLanguage === "de" ? item.labelDe : item.label;

                return (
                  <button
                    key={item.path}
                    onClick={() => setLocation(item.path)}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors duration-150 text-left touch-manipulation active:scale-[0.98]
                      ${
                        isActive
                          ? item.primary
                            ? "bg-gradient-to-r from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] text-white"
                            : "bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground"
                          : "text-muted-foreground dark:text-muted-foreground active:bg-accent/50 dark:active:bg-accent/50"
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{displayLabel}</span>
                  </button>
                );
              })}

              {/* Mobile Credits */}
              <div className="px-4 py-3 border-t border-border/50 dark:border-white/10 mt-2">
                <CreditIndicator />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 relative z-10">
        <div className="mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">{children}</div>
      </main>

      {/* Onboarding Wizard */}
      <OnboardingWizard
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}
