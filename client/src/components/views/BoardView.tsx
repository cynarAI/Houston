import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BoardViewProps {
  items: any[];
  type: "goals" | "tasks";
  onStatusChange?: (id: number, newStatus: string) => void;
}

function SortableItem({ item, type, getPriorityColor }: { item: any; type: string; getPriorityColor: (priority: string) => string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="hover:shadow-lg transition-shadow cursor-move">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-medium">{item.title}</h4>
            {item.priority && (
              <Badge variant="outline" className={getPriorityColor(item.priority)}>
                {item.priority}
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
          )}
          {type === "goals" && item.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function BoardView({ items, type, onStatusChange }: BoardViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !onStatusChange) return;

    const activeItem = items.find(i => i.id === active.id);
    const overColumn = columns.find(col => 
      col.items.some(item => item.id === over.id) || col.id === over.id
    );

    if (activeItem && overColumn && activeItem.status !== overColumn.id) {
      onStatusChange(activeItem.id, overColumn.id);
    }
  };
  const columns =
    type === "goals"
      ? [
          { id: "active", title: "Active", items: items.filter((i) => i.status === "active") },
          { id: "paused", title: "Paused", items: items.filter((i) => i.status === "paused") },
          { id: "completed", title: "Completed", items: items.filter((i) => i.status === "completed") },
        ]
      : [
          { id: "todo", title: "To Do", items: items.filter((i) => i.status === "todo") },
          { id: "in_progress", title: "In Progress", items: items.filter((i) => i.status === "in_progress") },
          { id: "done", title: "Done", items: items.filter((i) => i.status === "done") },
        ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{column.title}</h3>
            <Badge variant="secondary">{column.items.length}</Badge>
          </div>

          <div className="space-y-3">
            {column.items.length === 0 ? (
              <Card className="bg-base-5/30 border-dashed">
                <CardContent className="pt-6 text-center text-muted-foreground text-sm">
                  No items
                </CardContent>
              </Card>
            ) : (
              column.items.map((item) => (
                <Card
                  key={item.id}
                  className="bg-base-0/50 backdrop-blur-xl border-base-20 hover:border-accent-blue/50 transition-all cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>

                    {type === "goals" && item.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} />
                      </div>
                    )}

                    {type === "tasks" && (
                      <div className="flex items-center gap-2">
                        {item.priority && (
                          <Badge variant="outline" className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        )}
                        {item.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
