import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Target, CheckSquare, MessageSquare, Sparkles, CalendarClock } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface ReturnReminderProps {
  openTodosCount: number;
  activeGoalsCount: number;
  lastChatDate?: Date | null;
  lastVisit?: Date | null;
  className?: string;
}

type ReminderType = "tasks" | "goals" | "chat" | "weekly" | "welcome-back";

interface ReminderConfig {
  type: ReminderType;
  icon: React.ElementType;
  message: string;
  cta: string;
  link: string;
  gradient: string;
}

export function ReturnReminder({
  openTodosCount,
  activeGoalsCount,
  lastChatDate,
  lastVisit,
  className,
}: ReturnReminderProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissedUntil, setDismissedUntil] = useState<number | null>(null);

  // Check if reminder was dismissed recently
  useEffect(() => {
    const dismissedTime = localStorage.getItem("return-reminder-dismissed");
    if (dismissedTime) {
      const dismissedDate = parseInt(dismissedTime, 10);
      const now = Date.now();
      // Dismiss for 24 hours
      if (now - dismissedDate < 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
        setDismissedUntil(dismissedDate + 24 * 60 * 60 * 1000);
      }
    }
  }, []);

  // Determine which reminder to show based on user state
  const reminderConfig = useMemo((): ReminderConfig | null => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const isMonday = dayOfWeek === 1;
    
    // Calculate days since last visit
    const daysSinceLastVisit = lastVisit 
      ? Math.floor((now.getTime() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    // Calculate days since last chat
    const daysSinceLastChat = lastChatDate
      ? Math.floor((now.getTime() - new Date(lastChatDate).getTime()) / (1000 * 60 * 60 * 24))
      : 7; // Default to 7 days if no chat

    // Welcome back message after inactivity
    if (daysSinceLastVisit >= 3) {
      return {
        type: "welcome-back",
        icon: Sparkles,
        message: `Willkommen zurück! Houston hat auf dich gewartet. ${openTodosCount > 0 ? `Du hast noch ${openTodosCount} offene Aufgaben.` : "Zeit für neue Marketing-Ideen!"}`,
        cta: openTodosCount > 0 ? "Aufgaben ansehen" : "Mit Houston chatten",
        link: openTodosCount > 0 ? "/app/todos" : "/app/chats",
        gradient: "from-[#FF6B9D] to-[#8B5CF6]",
      };
    }

    // Monday motivation
    if (isMonday && openTodosCount > 0) {
      return {
        type: "weekly",
        icon: CalendarClock,
        message: `Neue Woche, neue Chancen! Du hast ${openTodosCount} Aufgaben für diese Woche.`,
        cta: "Woche planen",
        link: "/app/todos",
        gradient: "from-[#3B82F6] to-[#8B5CF6]",
      };
    }

    // Open tasks reminder
    if (openTodosCount >= 3) {
      return {
        type: "tasks",
        icon: CheckSquare,
        message: `Du hast ${openTodosCount} offene Aufgaben – heute an deiner Mission weiterarbeiten?`,
        cta: "Aufgaben ansehen",
        link: "/app/todos",
        gradient: "from-[#10B981] to-[#3B82F6]",
      };
    }

    // Goals reminder
    if (activeGoalsCount > 0 && openTodosCount < 3) {
      return {
        type: "goals",
        icon: Target,
        message: `Du hast ${activeGoalsCount} aktive ${activeGoalsCount === 1 ? "Ziel" : "Ziele"}. Wie kommst du voran?`,
        cta: "Fortschritt prüfen",
        link: "/app/goals",
        gradient: "from-[#8B5CF6] to-[#EC4899]",
      };
    }

    // Chat reminder if no recent activity
    if (daysSinceLastChat >= 2) {
      return {
        type: "chat",
        icon: MessageSquare,
        message: "Houston wartet auf dich! Was beschäftigt dich gerade im Marketing?",
        cta: "Chat starten",
        link: "/app/chats",
        gradient: "from-[#EC4899] to-[#F97316]",
      };
    }

    return null;
  }, [openTodosCount, activeGoalsCount, lastChatDate, lastVisit]);

  const handleDismiss = () => {
    const now = Date.now();
    localStorage.setItem("return-reminder-dismissed", now.toString());
    setIsDismissed(true);
    setDismissedUntil(now + 24 * 60 * 60 * 1000);
  };

  // Don't show if dismissed or no reminder needed
  if (isDismissed || !reminderConfig) {
    return null;
  }

  const Icon = reminderConfig.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-white/10 backdrop-blur-xl",
        "bg-gradient-to-r",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
      }}
    >
      {/* Background gradient overlay */}
      <div 
        className={cn(
          "absolute inset-0 opacity-10 bg-gradient-to-r",
          reminderConfig.gradient
        )} 
      />
      
      {/* Content */}
      <div className="relative flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br flex-shrink-0",
            reminderConfig.gradient
          )}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm font-medium truncate">
            {reminderConfig.message}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href={reminderConfig.link}>
            <Button 
              size="sm" 
              className={cn(
                "bg-gradient-to-r text-white border-none hover:opacity-90",
                reminderConfig.gradient
              )}
            >
              {reminderConfig.cta}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
