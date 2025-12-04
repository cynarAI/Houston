import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  MessageSquare,
  Target,
  CheckSquare,
  BookOpen,
  Settings,
  LogOut,
  Sparkles,
  HelpCircle,
  Moon,
  Sun,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { cn } from "@/lib/utils";

export const navItems = [
  {
    icon: MessageSquare,
    label: "Houston",
    labelDe: "Houston",
    path: "/app/chats",
    primary: true,
  },
  {
    icon: LayoutDashboard,
    label: "Today",
    labelDe: "Heute",
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

export function FloatingSidebar({ className }: { className?: string }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || "de";
  const { theme, toggleTheme } = useTheme();

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

  return (
    <aside
      className={cn(
        "hidden md:flex w-64 rounded-[24px] border border-border/70 bg-[hsl(var(--background))] dark:bg-white/5 z-50 h-full animate-in slide-in-from-left-4 duration-500 fade-in relative overflow-hidden",
        className,
      )}
    >
      {/* Gradient aurora accents */}
      <div
        className="absolute inset-x-4 -top-12 h-28 rounded-[32px] bg-[radial-gradient(circle_at_top,#1c2055_0%,#1a1e3f_45%,transparent_80%)] opacity-70 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-8 -top-6 h-24 rounded-[32px] bg-[linear-gradient(140deg,#6c2ae7_0%,#a646ff_45%,rgba(255,255,255,0))] opacity-60 blur-[70px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col">
        {/* 1. LOGO AREA */}
        <div className="p-6 pb-6">
          <div className="flex items-center gap-3 px-2">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#111638] via-[#2a3170] to-[#4a3ba8] text-white shadow-[0_8px_18px_rgba(17,22,56,0.35)]">
              <Sparkles className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]" />
            </div>
            <div>
              <span className="text-[1.75rem] font-semibold tracking-tight text-[#101225]">
                Houston
              </span>
            </div>
          </div>
        </div>

        {/* 2. NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              location === item.path ||
              (item.path === "/app/chats" && location.startsWith("/app/chats"));
            const displayLabel =
              currentLanguage === "de" ? item.labelDe : item.label;

            if (item.primary) {
              return (
                <div key={item.path} className="pb-4">
                  <Button
                    onClick={() => setLocation(item.path)}
                    variant="gradient-purple"
                    size="lg"
                    className="w-full group"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Frag Houston
                    <ChevronRight className="w-4 h-4 ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors duration-200
                ${
                  isActive
                    ? "bg-primary/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }
              `}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span>{displayLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. USER PROFILE & SETTINGS */}
        <div className="p-4 mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border/70 bg-background/60 dark:bg-white/5 transition-all duration-200">
                <Avatar className="h-10 w-10 border border-border/60 dark:border-white/10">
                  <AvatarFallback className="bg-gradient-to-br from-[#1E3A8A] to-[#6D28D9] text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">
                    {user?.name || "Captain"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <Settings className="w-4 h-4 text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="right"
              className="w-60 mb-2 ml-2 rounded-2xl border border-border/70 bg-background/90 backdrop-blur-2xl"
            >
              <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setLocation("/app/settings")}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Einstellungen</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setLocation("/app/credits")}
                className="cursor-pointer"
              >
                <Sparkles className="mr-2 h-4 w-4 text-[#FF6B9D]" />
                <span>Credits verwalten</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Quick Settings */}
              <div className="p-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={toggleTheme}
                >
                  {theme === "light" ? (
                    <Moon className="w-3 h-3 mr-2" />
                  ) : (
                    <Sun className="w-3 h-3 mr-2" />
                  )}
                  {theme === "light" ? "Dark" : "Light"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={toggleLanguage}
                >
                  <Globe className="w-3 h-3 mr-2" />
                  {currentLanguage === "de" ? "EN" : "DE"}
                </Button>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Abmelden</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
