import { LayoutGrid, List, Calendar, GanttChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewType = "table" | "board" | "timeline" | "calendar";

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewSwitcher({
  currentView,
  onViewChange,
}: ViewSwitcherProps) {
  const views: { type: ViewType; icon: React.ReactNode; label: string }[] = [
    { type: "table", icon: <List className="h-4 w-4" />, label: "Table" },
    { type: "board", icon: <LayoutGrid className="h-4 w-4" />, label: "Board" },
    {
      type: "timeline",
      icon: <GanttChart className="h-4 w-4" />,
      label: "Timeline",
    },
    {
      type: "calendar",
      icon: <Calendar className="h-4 w-4" />,
      label: "Calendar",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 bg-base-10 rounded-lg p-1 w-full sm:w-auto">
      {views.map((view) => (
        <Button
          key={view.type}
          variant={currentView === view.type ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(view.type)}
          className="gap-2"
        >
          {view.icon}
          <span className="hidden sm:inline">{view.label}</span>
        </Button>
      ))}
    </div>
  );
}
