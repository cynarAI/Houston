import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  contextPanel?: ReactNode;
  showContextPanel?: boolean;
}

/**
 * MainLayout - 3-Column Space-Theme Layout
 * 
 * Desktop: Sidebar (fixed) + Main Content (flex) + Context Panel (fixed, optional)
 * Tablet: Icon Sidebar + Main Content + Context Drawer
 * Mobile: Bottom Nav + Full-Width Main
 * 
 * Design: Mission Control Center for Marketing
 */
export function MainLayout({ 
  children, 
  contextPanel, 
  showContextPanel = false 
}: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-space)] starfield">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Context Panel (Right) - Desktop Only */}
      {showContextPanel && contextPanel && (
        <aside className="hidden xl:block w-80 border-l border-[var(--border-subtle)] bg-[var(--bg-card)]/50 backdrop-blur-xl overflow-y-auto">
          <div className="p-6 space-y-6">
            {contextPanel}
          </div>
        </aside>
      )}
    </div>
  );
}
