import { Menu, Bell } from "lucide-react";
import { CreditIndicator } from "@/components/CreditIndicator";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useLocation } from "wouter";
import { navItems } from "./FloatingSidebar";

interface FloatingHeaderProps {
  onMenuClick: () => void;
}

export function FloatingHeader({ onMenuClick }: FloatingHeaderProps) {
  const [location] = useLocation();

  // Find current page title
  const currentItem =
    navItems.find((item) => item.path === location) ||
    navItems.find(
      (item) =>
        location.startsWith(item.path) && item.path !== "/app/dashboard",
    );

  const isPersonalView = currentItem?.path === "/app/dashboard";
  const title = isPersonalView
    ? "Für dich"
    : currentItem
      ? currentItem.labelDe || currentItem.label
      : "Für dich";

  return (
    <header className="px-4 md:px-8 py-4">
      <div className="flex items-center justify-between gap-4 rounded-[20px] px-4 md:px-6 py-3">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl border border-border/70 bg-background/40 active:scale-95 transition-all"
            aria-label="Navigation öffnen"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Heute
            </span>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="scale-95 md:scale-100 origin-right">
            <CreditIndicator />
          </div>
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
}
