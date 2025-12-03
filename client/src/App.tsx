import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
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
const Playbooks = lazy(() => import("./pages/Playbooks"));
const Library = lazy(() => import("./pages/Library"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component - Houston branded
function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background animate-in fade-in duration-300">
      {/* Houston Logo Pulse */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B9D] to-[#C44FE2] rounded-full blur-2xl opacity-30 animate-pulse" />
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B9D]/20 to-[#C44FE2]/20 border border-[#FF6B9D]/30">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF6B9D]" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">
        Houston startet...
      </p>
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
      <Route path="/app/playbooks" component={Playbooks} />
      <Route path="/app/library" component={Library} />
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
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <OfflineIndicator />
          <InstallPrompt />
          <Suspense fallback={<PageLoader />}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
