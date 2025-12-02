import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineViewProps {
  items: any[];
  type: "goals" | "tasks";
}

export default function TimelineView({ items, type }: TimelineViewProps) {
  // Sort items by deadline/dueDate
  const sortedItems = [...items].sort((a, b) => {
    const aDate = type === "goals" ? a.deadline : a.dueDate;
    const bDate = type === "goals" ? b.deadline : b.dueDate;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "in_progress":
        return "bg-accent-blue";
      case "completed":
      case "done":
        return "bg-green-500";
      case "paused":
      case "todo":
        return "bg-base-40";
      default:
        return "bg-base-40";
    }
  };

  const getDaysUntilDeadline = (date: string | null) => {
    if (!date) return null;
    const deadline = new Date(date);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4">
      {sortedItems.length === 0 ? (
        <Card className="bg-base-5/30 border-dashed">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No items with deadlines
          </CardContent>
        </Card>
      ) : (
        sortedItems.map((item) => {
          const deadline = type === "goals" ? item.deadline : item.dueDate;
          const daysUntil = getDaysUntilDeadline(deadline);

          return (
            <Card key={item.id} className="bg-base-0/50 backdrop-blur-xl border-base-20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>

                  <div className="text-right space-y-1">
                    {deadline ? (
                      <>
                        <div className="text-sm font-medium">
                          {new Date(deadline).toLocaleDateString()}
                        </div>
                        {daysUntil !== null && (
                          <div
                            className={`text-xs ${
                              daysUntil < 0
                                ? "text-red-500"
                                : daysUntil < 7
                                  ? "text-yellow-500"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {daysUntil < 0
                              ? `${Math.abs(daysUntil)} days overdue`
                              : daysUntil === 0
                                ? "Due today"
                                : `${daysUntil} days left`}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">No deadline</div>
                    )}
                  </div>
                </div>

                {/* Timeline bar */}
                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-base-10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(item.status)} transition-all`}
                      style={{
                        width:
                          type === "goals" && item.progress !== undefined
                            ? `${item.progress}%`
                            : item.status === "done" || item.status === "completed"
                              ? "100%"
                              : item.status === "in_progress" || item.status === "active"
                                ? "50%"
                                : "10%",
                      }}
                    />
                  </div>
                  {type === "goals" && item.progress !== undefined && (
                    <div className="text-xs text-muted-foreground">{item.progress}% complete</div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
