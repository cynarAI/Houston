import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { LayoutDashboard, LogOut, PanelLeft, Users, Sparkles, MessageSquare, Target, CheckSquare, Compass, Settings, Globe, Moon, Sun, TrendingUp, Gift, BookOpen } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import { useTranslation } from 'react-i18next';
import { OnboardingWizard } from './OnboardingWizard';
import { trpc } from '@/lib/trpc';
import { CreditIndicator } from './CreditIndicator';
import { NotificationCenter } from './NotificationCenter';

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", labelDe: "Dashboard", path: "/app/dashboard" },
  { icon: MessageSquare, label: "Chats", labelDe: "Chats", path: "/app/chats" },
  { icon: BookOpen, label: "Playbooks", labelDe: "Playbooks", path: "/app/playbooks" },
  { icon: Target, label: "Goals", labelDe: "Ziele", path: "/app/goals" },
  { icon: CheckSquare, label: "To-dos", labelDe: "To-dos", path: "/app/todos" },
  { icon: Compass, label: "Strategy", labelDe: "Strategie", path: "/app/strategy" },
  { icon: Gift, label: "Referrals", labelDe: "Empfehlungen", path: "/app/referrals" },
  { icon: Settings, label: "Settings", labelDe: "Einstellungen", path: "/app/settings" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user, logout } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  // Always render SidebarProvider to maintain consistent hook order
  // The inner DashboardLayoutContent handles loading/auth states
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent 
        setSidebarWidth={setSidebarWidth}
        loading={loading}
        user={user}
        logout={logout}
      >
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
  loading: boolean;
  user: ReturnType<typeof useAuth>['user'];
  logout: ReturnType<typeof useAuth>['logout'];
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
  loading,
  user,
  logout,
}: DashboardLayoutContentProps) {
  // logout is now passed as prop from parent - no duplicate useAuth() call
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  const { theme, toggleTheme, switchable } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Check onboarding status
  const { data: onboardingStatus } = trpc.onboarding.getUserOnboardingStatus.useQuery(
    undefined,
    { enabled: !!user }
  );

  useEffect(() => {
    if (user && onboardingStatus && !onboardingStatus.completed) {
      setShowOnboarding(true);
    }
  }, [user, onboardingStatus]);
  
  const toggleLanguage = () => {
    const newLang = currentLanguage === 'de' ? 'en' : 'de';
    i18n.changeLanguage(newLang);
  };
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(item => item.path === location);
  const activeMenuLabel = activeMenuItem 
    ? (currentLanguage === 'de' ? activeMenuItem.labelDe : activeMenuItem.label) 
    : (currentLanguage === 'de' ? "Menü" : "Menu");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  const skipLinkText = currentLanguage === 'de' ? 'Zum Hauptinhalt springen' : 'Skip to main content';
  const navLabel = currentLanguage === 'de' ? 'Hauptnavigation' : 'Main navigation';

  // Handle loading and no-user states AFTER all hooks
  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              Anmeldung erforderlich
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Für den Zugriff auf das Dashboard ist eine Anmeldung erforderlich.
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all"
          >
            Anmelden
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Skip Link für Keyboard-Navigation */}
      <a href="#main-content" className="skip-link">
        {skipLinkText}
      </a>

      {/* Static Background Gradient (no animated stars in Dashboard) */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]"></div>
      </div>
      
      <nav className="relative z-10" ref={sidebarRef} aria-label={navLabel}>
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="border-b border-white/10">
            <div className="flex flex-col gap-3 p-4">
              {/* Logo + Toggle */}
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={toggleSidebar}
                  className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                  aria-label="Toggle navigation"
                >
                  <PanelLeft className="h-4 w-4 text-muted-foreground" />
                </button>
                {!isCollapsed && (
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#00D4FF] shrink-0" />
                      <span className="font-semibold tracking-tight truncate gradient-text-aistronaut">
                        Houston
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-7">by AIstronaut</span>
                  </div>
                )}
              </div>
              
              {/* Notification Center + Language Toggle + Theme Toggle (only when expanded) */}
              {!isCollapsed && (
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <NotificationCenter />
                    <button
                      onClick={toggleLanguage}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                      aria-label={currentLanguage === 'de' ? 'Sprache wechseln, aktuell Deutsch' : 'Switch language, currently English'}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="font-medium">{currentLanguage.toUpperCase()}</span>
                    </button>
                    {switchable && toggleTheme && (
                      <button
                        onClick={toggleTheme}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        aria-label={
                          theme === "light" 
                            ? (currentLanguage === 'de' ? 'Dunkles Design aktivieren' : 'Switch to dark theme')
                            : (currentLanguage === 'de' ? 'Helles Design aktivieren' : 'Switch to light theme')
                        }
                      >
                        {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            <SidebarMenu className="px-2 py-1">
              {menuItems.map(item => {
                const isActive = location === item.path;
                const displayLabel = currentLanguage === 'de' ? item.labelDe : item.label;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setLocation(item.path)}
                      tooltip={displayLabel}
                      className={`h-10 transition-all font-normal`}
                    >
                      <item.icon
                        className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                      />
                      <span>{displayLabel}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3 space-y-3">
            {/* Credit Indicator */}
            <div className="px-1">
              <CreditIndicator />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Abmelden</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
          aria-hidden="true"
        />
      </nav>

      <SidebarInset>
        {isMobile && (
          <header 
            role="banner" 
            className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40"
          >
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <span className="tracking-tight text-foreground">
                    {activeMenuLabel}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <CreditIndicator />
            </div>
          </header>
        )}
        <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
      
      {/* Onboarding Wizard */}
      <OnboardingWizard 
        open={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </>
  );
}
