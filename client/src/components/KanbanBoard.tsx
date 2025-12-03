import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, TrendingUp } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  status: "active" | "in_progress" | "completed";
  deadline?: string;
  progress?: number;
}

interface KanbanBoardProps {
  goals: Goal[];
  onStatusChange: (
    goalId: number,
    newStatus: "active" | "in_progress" | "completed",
  ) => void;
}

function SortableGoalCard({ goal }: { goal: Goal }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3"
    >
      <Card className="glass border-white/10 backdrop-blur-xl hover:border-white/20 transition-all cursor-move">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <h4 className="font-semibold text-sm">{goal.title}</h4>
            </div>
          </div>

          {goal.deadline && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Calendar className="h-3 w-3" />
              {new Date(goal.deadline).toLocaleDateString()}
            </div>
          )}

          {goal.progress !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {goal.progress}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function KanbanBoard({ goals, onStatusChange }: KanbanBoardProps) {
  const [activeGoals] = useState(goals.filter((g) => g.status === "active"));
  const [inProgressGoals] = useState(
    goals.filter((g) => g.status === "in_progress"),
  );
  const [completedGoals] = useState(
    goals.filter((g) => g.status === "completed"),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Implement drag-and-drop logic here
    // This is a simplified version - you'll need to implement the full logic
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Backlog Column */}
        <div>
          <Card className="glass border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                Backlog
                <Badge variant="secondary" className="ml-auto">
                  {activeGoals.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext
                items={activeGoals.map((g) => g.id)}
                strategy={verticalListSortingStrategy}
              >
                {activeGoals.map((goal) => (
                  <SortableGoalCard key={goal.id} goal={goal} />
                ))}
              </SortableContext>
            </CardContent>
          </Card>
        </div>

        {/* In Progress Column */}
        <div>
          <Card className="glass border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                In Progress
                <Badge variant="secondary" className="ml-auto">
                  {inProgressGoals.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext
                items={inProgressGoals.map((g) => g.id)}
                strategy={verticalListSortingStrategy}
              >
                {inProgressGoals.map((goal) => (
                  <SortableGoalCard key={goal.id} goal={goal} />
                ))}
              </SortableContext>
            </CardContent>
          </Card>
        </div>

        {/* Completed Column */}
        <div>
          <Card className="glass border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                Completed
                <Badge variant="secondary" className="ml-auto">
                  {completedGoals.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext
                items={completedGoals.map((g) => g.id)}
                strategy={verticalListSortingStrategy}
              >
                {completedGoals.map((goal) => (
                  <SortableGoalCard key={goal.id} goal={goal} />
                ))}
              </SortableContext>
            </CardContent>
          </Card>
        </div>
      </div>
    </DndContext>
  );
}
