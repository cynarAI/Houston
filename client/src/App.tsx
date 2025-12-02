import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense, useState } from "react";
import { Loader2 } from "lucide-react";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { InstallPrompt } from "./components/InstallPrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";

// Lazy load all pages for better performance
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Chats = lazy(() => import("./pages/Chats"));
const Goals = lazy(() => import("./pages/Goals"));
const Todos = lazy(() => import("./pages/Todos"));
const Strategy = lazy(() => import("./pages/Strategy"));
const Settings = lazy(() => import("./pages/Settings"));
const Credits = lazy(() => import("./pages/Credits"));
const Referrals = lazy(() => import("./pages/Referrals"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path="/app/dashboard" component={Dashboard} />
      <Route path="/app/onboarding" component={Onboarding} />
      <Route path="/app/chats" component={Chats} />
      <Route path="/app/goals" component={Goals} />
      <Route path="/app/todos" component={Todos} />
      <Route path="/app/strategy" component={Strategy} />
      <Route path="/app/settings" component={Settings} />
      <Route path="/app/credits" component={Credits} />
      <Route path="/app/referrals" component={Referrals} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  useKeyboardShortcuts({
    onShowHelp: () => setShowShortcutsModal(true),
  });

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <OfflineIndicator />
          <InstallPrompt />
          <KeyboardShortcutsModal 
            open={showShortcutsModal} 
            onOpenChange={setShowShortcutsModal} 
          />
          <Suspense fallback={<PageLoader />}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
