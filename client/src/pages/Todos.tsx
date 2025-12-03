import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { CheckSquare, Plus, Trash2, Sparkles, Filter, ArrowUpDown, Loader2 } from "lucide-react";
import ViewSwitcher, { ViewType } from "@/components/ViewSwitcher";
import TableView from "@/components/views/TableView";
import TimelineView from "@/components/views/TimelineView";
import { toast } from "sonner";
import type { Todo } from "@shared/types";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { handleMutationError, ErrorMessages } from "@/lib/errorHandling";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { celebrations, checkTaskMilestone } from "@/lib/celebrations";

// Lazy load heavy view components (BoardView uses @dnd-kit, CalendarView uses react-day-picker)
const BoardView = lazy(() => import("@/components/views/BoardView"));
const CalendarView = lazy(() => import("@/components/views/CalendarView"));

// Loading fallback for lazy-loaded views
function ViewLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function Todos() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created");
  const [currentView, setCurrentView] = useState<ViewType>("board");

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("todos-view");
    if (savedView) {
      setCurrentView(savedView as ViewType);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    localStorage.setItem("todos-view", view);
  };
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: undefined as Date | undefined,
  });

  const { data: workspaces, isLoading: workspacesLoading, isError: workspacesError, refetch: refetchWorkspaces } = trpc.workspaces.list.useQuery();
  const { data: todosData, isLoading: todosLoading, isError: todosError, refetch } = trpc.todos.listByWorkspace.useQuery(
    { workspaceId: workspaces?.[0]?.id || 0 },
    { enabled: !!workspaces?.[0]?.id }
  );
  
  // Combined states
  const isLoading = workspacesLoading || (workspaces?.[0]?.id && todosLoading);
  const hasError = workspacesError || todosError;

  // Filter and sort todos
  const todos = useMemo(() => {
    if (!todosData) return [];
    let filtered = todosData;
    if (filterStatus !== "all") {
      filtered = todosData.filter((t: Todo) => t.status === filterStatus);
    }
    const sorted = [...filtered].sort((a: Todo, b: Todo) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return (priorityOrder[a.priority as keyof typeof priorityOrder] || 1) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 1);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted;
  }, [todosData, filterStatus, sortBy]);

  const createTodoMutation = trpc.todos.create.useMutation();
  const updateTodoMutation = trpc.todos.update.useMutation();
  const deleteTodoMutation = trpc.todos.delete.useMutation();

  const handleCreate = async () => {
    if (!workspaces?.[0]?.id || !formData.title) return;

    const isFirstTodo = !todosData || todosData.length === 0;
    
    try {
      await createTodoMutation.mutateAsync({
        workspaceId: workspaces[0].id,
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        dueDate: formData.dueDate,
      });
      
      // Track todo creation
      trackEvent(AnalyticsEvents.TODO_CREATED, { priority: formData.priority, has_due_date: !!formData.dueDate });
      
      toast.success("To-do erfolgreich erstellt!");
      setIsCreateDialogOpen(false);
      setFormData({ title: "", description: "", priority: "medium", dueDate: undefined });
      refetch();
      
      // Celebrate first todo
      if (isFirstTodo) {
        celebrations.firstTodo();
      }
    } catch (error) {
      handleMutationError(error, ErrorMessages.todoCreate);
    }
  };

  const handleToggle = async (id: number, status: string) => {
    const isCompletingTask = status !== "done";
    const currentCompletedCount = todosData?.filter((t: Todo) => t.status === "done").length || 0;
    
    try {
      await updateTodoMutation.mutateAsync({
        id,
        status: status === "done" ? "todo" : "done",
      });
      refetch();
      
      // Celebrate task completion milestones and track analytics
      if (isCompletingTask) {
        trackEvent(AnalyticsEvents.TODO_COMPLETED, { todo_id: id });
        checkTaskMilestone(currentCompletedCount + 1);
        
        // Check if all tasks are done
        const openTasksAfter = (todosData?.filter((t: Todo) => t.status !== "done" && t.id !== id).length || 0);
        if (openTasksAfter === 0 && (todosData?.length || 0) > 1) {
          setTimeout(() => {
            celebrations.allTasksCompleted();
          }, 500);
        }
      }
    } catch (error) {
      handleMutationError(error, ErrorMessages.todoUpdate);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Möchtest du dieses To-do wirklich löschen?")) return;

    try {
      await deleteTodoMutation.mutateAsync({ id });
      
      // Track todo deletion
      trackEvent(AnalyticsEvents.TODO_DELETED, { todo_id: id });
      
      toast.success("To-do erfolgreich gelöscht!");
      refetch();
    } catch (error) {
      handleMutationError(error, ErrorMessages.todoDelete);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Hoch";
      case "medium":
        return "Mittel";
      case "low":
        return "Niedrig";
      default:
        return priority;
    }
  };

  const openTodos = todos?.filter((t) => t.status !== "done") || [];
  const completedTodos = todos?.filter((t) => t.status === "done") || [];

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Lade deine To-dos..." fullPage />
      </DashboardLayout>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <ErrorState
            title="To-dos konnten nicht geladen werden"
            message="Es gab ein Problem beim Laden deiner Aufgaben. Bitte versuche es erneut."
            onRetry={() => {
              refetchWorkspaces();
              refetch();
            }}
            fullPage
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="space-y-6">
          {/* Title & Description */}
          <PageHeader
            title="To-dos"
            description="Verwalte deine Marketing-Aufgaben und behalte den Überblick."
            className="mb-0"
          />
          
          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* View Switcher - Left */}
            <ViewSwitcher currentView={currentView} onViewChange={handleViewChange} />
            
            {/* Filters & Actions - Right */}
            <div className="flex items-center gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="todo">Zu erledigen</SelectItem>
                  <SelectItem value="in_progress">In Arbeit</SelectItem>
                  <SelectItem value="done">Erledigt</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sortierung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Neueste zuerst</SelectItem>
                  <SelectItem value="title">Titel A-Z</SelectItem>
                  <SelectItem value="priority">Priorität</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neues To-do
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neues To-do erstellen</DialogTitle>
                <DialogDescription>
                  Füge eine neue Aufgabe zu deiner Liste hinzu.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Titel *</Label>
                  <Input
                    id="title"
                    placeholder="z.B. Social Media Post erstellen"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    placeholder="Details zur Aufgabe..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priorität</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Niedrig</SelectItem>
                      <SelectItem value="medium">Mittel</SelectItem>
                      <SelectItem value="high">Hoch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Fälligkeitsdatum</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ""}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                  />
                </div>
                <Button onClick={handleCreate} className="w-full" disabled={!formData.title}>
                  To-do erstellen
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{openTodos.length}</div>
              <p className="text-xs text-muted-foreground">Offen</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{completedTodos.length}</div>
              <p className="text-xs text-muted-foreground">Erledigt</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{todos?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Gesamt</p>
            </CardContent>
          </Card>
        </div>

        {/* Todos Views */}
        {currentView === "table" && (
          <TableView items={todos || []} type="tasks" onDelete={handleDelete} />
        )}
        {currentView === "board" && (
          <Suspense fallback={<ViewLoader />}>
            <BoardView items={todos || []} type="tasks" />
          </Suspense>
        )}
        {currentView === "timeline" && (
          <TimelineView items={todos || []} type="tasks" />
        )}
        {currentView === "calendar" && (
          <Suspense fallback={<ViewLoader />}>
            <CalendarView items={todos || []} type="tasks" />
          </Suspense>
        )}

        {/* Original Kanban View (hidden) */}
        {false && (<div className="grid md:grid-cols-2 gap-6">
          {/* Open Todos */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Offen ({openTodos.length})
            </h2>
            {openTodos.length > 0 ? (
              <div className="space-y-3">
                {openTodos.map((todo: Todo) => (
                  <Card key={todo.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={todo.status === "done"}
                          onCheckedChange={() => handleToggle(todo.id, todo.status)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm">{todo.title}</h3>
                            <Badge variant={getPriorityColor(todo.priority)} className="text-xs">
                              {getPriorityLabel(todo.priority)}
                            </Badge>
                          </div>
                          {todo.description && (
                            <p className="text-xs text-muted-foreground mb-2">{todo.description}</p>
                          )}
                          {todo.dueDate && (
                            <p className="text-xs text-muted-foreground">
                              Fällig: {new Date(todo.dueDate).toLocaleDateString("de-DE")}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(todo.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <GlassCard variant="elevated">
                <GlassCardContent className="py-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-purple)] to-[var(--color-gradient-indigo)] rounded-full blur-xl opacity-20 animate-pulse"></div>
                      <GradientIcon icon={CheckSquare} gradient="purple-indigo" size="xl" className="relative" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Alle Aufgaben erledigt! 🎉</h3>
                  <p className="text-sm text-muted-foreground">Super Arbeit! Erstelle neue Aufgaben, um produktiv zu bleiben.</p>
                </GlassCardContent>
              </GlassCard>
            )}
          </div>

          {/* Completed Todos */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-muted-foreground" />
              Erledigt ({completedTodos.length})
            </h2>
            {completedTodos.length > 0 ? (
              <div className="space-y-3">
                {completedTodos.map((todo: Todo) => (
                  <Card key={todo.id} className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={todo.status === "done"}
                          onCheckedChange={() => handleToggle(todo.id, todo.status)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm line-through">{todo.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {getPriorityLabel(todo.priority)}
                            </Badge>
                          </div>
                          {todo.description && (
                            <p className="text-xs text-muted-foreground mb-2 line-through">
                              {todo.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(todo.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <GlassCard variant="default">
                <GlassCardContent className="py-12 text-center">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Noch keine erledigten Aufgaben</p>
                </GlassCardContent>
              </GlassCard>
            )}
          </div>
        </div>)}
      </div>
    </DashboardLayout>
  );
}
