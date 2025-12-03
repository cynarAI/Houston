import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  CheckSquare,
  Plus,
  Target,
  Edit,
  Trash2,
  Sparkles,
  Filter,
  ArrowUpDown,
  Download,
  Loader2,
} from "lucide-react";
import ViewSwitcher, { ViewType } from "@/components/ViewSwitcher";
import TableView from "@/components/views/TableView";
import TimelineView from "@/components/views/TimelineView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Goal } from "@shared/types";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { handleMutationError, ErrorMessages } from "@/lib/errorHandling";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { celebrations } from "@/lib/celebrations";

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

export default function Goals() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created");
  const [currentView, setCurrentView] = useState<ViewType>("table");

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("goals-view");
    if (savedView) {
      setCurrentView(savedView as ViewType);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    localStorage.setItem("goals-view", view);
  };

  const {
    data: workspaces,
    isLoading: workspacesLoading,
    isError: workspacesError,
    refetch: refetchWorkspaces,
  } = trpc.workspaces.list.useQuery();
  const {
    data: goalsData,
    isLoading: goalsLoading,
    isError: goalsError,
    refetch,
  } = trpc.goals.listByWorkspace.useQuery(
    { workspaceId: workspaces?.[0]?.id || 0 },
    { enabled: !!workspaces?.[0]?.id },
  );

  // Combined states
  const isLoading = workspacesLoading || (workspaces?.[0]?.id && goalsLoading);
  const hasError = workspacesError || goalsError;

  // Filter and sort goals
  const goals = useMemo(() => {
    if (!goalsData) return [];

    // Filter
    let filtered = goalsData;
    if (filterStatus !== "all") {
      filtered = goalsData.filter((g: Goal) => g.status === filterStatus);
    }

    // Sort
    const sorted = [...filtered].sort((a: Goal, b: Goal) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "progress":
          return (b.progress || 0) - (a.progress || 0);
        case "created":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return sorted;
  }, [goalsData, filterStatus, sortBy]);

  const createGoalMutation = trpc.goals.create.useMutation();
  const updateGoalMutation = trpc.goals.update.useMutation();
  const deleteGoalMutation = trpc.goals.delete.useMutation();
  const exportPDFMutation = trpc.export.exportGoalsPDF.useMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timeBound: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      specific: "",
      measurable: "",
      achievable: "",
      relevant: "",
      timeBound: "",
    });
    setEditingGoal(null);
  };

  const handleCreate = async () => {
    if (!workspaces?.[0]?.id || !formData.title) return;

    const isFirstGoal = !goalsData || goalsData.length === 0;

    try {
      await createGoalMutation.mutateAsync({
        workspaceId: workspaces[0].id,
        ...formData,
      });

      // Track goal creation
      const isFirstGoal = !goalsData || goalsData.length === 0;
      const hasSmartFields = !!(
        formData.specific ||
        formData.measurable ||
        formData.achievable ||
        formData.relevant ||
        formData.timeBound
      );
      trackEvent(AnalyticsEvents.GOAL_CREATED, {
        is_first_goal: isFirstGoal,
        has_smart_fields: hasSmartFields,
      });

      toast.success("Ziel erfolgreich erstellt!");
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();

      // Celebrate first goal
      if (isFirstGoal) {
        celebrations.firstGoal();
      }
    } catch (error) {
      handleMutationError(error, ErrorMessages.goalCreate);
    }
  };

  const handleUpdate = async () => {
    if (!editingGoal) return;

    try {
      await updateGoalMutation.mutateAsync({
        id: editingGoal.id,
        ...formData,
      });

      // Track goal update
      trackEvent(AnalyticsEvents.GOAL_UPDATED, { goal_id: editingGoal.id });

      toast.success("Ziel erfolgreich aktualisiert!");
      setEditingGoal(null);
      resetForm();
      refetch();
    } catch (error) {
      handleMutationError(error, ErrorMessages.goalUpdate);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Möchtest du dieses Ziel wirklich löschen?")) return;

    try {
      await deleteGoalMutation.mutateAsync({ id });

      // Track goal deletion
      trackEvent(AnalyticsEvents.GOAL_DELETED, { goal_id: id });

      toast.success("Ziel erfolgreich gelöscht!");
      refetch();
    } catch (error) {
      handleMutationError(error, ErrorMessages.goalDelete);
    }
  };

  const handleEdit = (goal: Goal) => {
    setFormData({
      title: goal.title || "",
      description: goal.description || "",
      specific: goal.specific || "",
      measurable: goal.measurable || "",
      achievable: goal.achievable || "",
      relevant: goal.relevant || "",
      timeBound: goal.timeBound || "",
    });
    setEditingGoal(goal);
  };

  const handleExportPDF = async () => {
    try {
      toast.info("Generiere PDF...");
      const result = await exportPDFMutation.mutateAsync({});

      // Convert base64 to blob and download
      const byteCharacters = atob(result.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Track PDF export
      trackEvent(AnalyticsEvents.PDF_EXPORTED, { type: "goals" });

      toast.success("PDF erfolgreich heruntergeladen!");
    } catch (error) {
      handleMutationError(error, ErrorMessages.pdfExport);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Lade deine Ziele..." fullPage />
      </DashboardLayout>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <ErrorState
            title="Ziele konnten nicht geladen werden"
            message="Es gab ein Problem beim Laden deiner Ziele. Bitte versuche es erneut."
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
            title="Ziele & Fortschritt"
            description="Verfolge deine SMART-Ziele und messe deinen Erfolg."
            className="mb-0"
          />

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* View Switcher - Left */}
            <ViewSwitcher
              currentView={currentView}
              onViewChange={handleViewChange}
            />

            {/* Filters & Actions - Right */}
            <div className="flex items-center gap-3">
              {/* Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="completed">Abgeschlossen</SelectItem>
                  <SelectItem value="archived">Archiviert</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sortierung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Neueste zuerst</SelectItem>
                  <SelectItem value="title">Titel A-Z</SelectItem>
                  <SelectItem value="progress">Fortschritt</SelectItem>
                </SelectContent>
              </Select>

              {/* Export PDF */}
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={!goals || goals.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neues Ziel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Neues Ziel erstellen</DialogTitle>
              <DialogDescription>
                Erstelle ein SMART-Ziel für deine Marketing-Mission.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  placeholder="z.B. 100 neue Leads generieren"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  placeholder="Detaillierte Beschreibung des Ziels..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="specific">Spezifisch</Label>
                <Textarea
                  id="specific"
                  placeholder="Was genau soll erreicht werden?"
                  value={formData.specific}
                  onChange={(e) =>
                    setFormData({ ...formData, specific: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="measurable">Messbar</Label>
                <Textarea
                  id="measurable"
                  placeholder="Wie wird der Erfolg gemessen?"
                  value={formData.measurable}
                  onChange={(e) =>
                    setFormData({ ...formData, measurable: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="achievable">Erreichbar</Label>
                <Textarea
                  id="achievable"
                  placeholder="Warum ist das Ziel erreichbar?"
                  value={formData.achievable}
                  onChange={(e) =>
                    setFormData({ ...formData, achievable: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="relevant">Relevant</Label>
                <Textarea
                  id="relevant"
                  placeholder="Warum ist das Ziel wichtig?"
                  value={formData.relevant}
                  onChange={(e) =>
                    setFormData({ ...formData, relevant: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="timeBound">Zeitgebunden</Label>
                <Textarea
                  id="timeBound"
                  placeholder="Bis wann soll es erreicht werden?"
                  value={formData.timeBound}
                  onChange={(e) =>
                    setFormData({ ...formData, timeBound: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <Button
                onClick={handleCreate}
                className="w-full"
                disabled={!formData.title}
              >
                Ziel erstellen
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Goals Views */}
        {currentView === "table" && (
          <TableView
            items={goals || []}
            type="goals"
            onEdit={handleEdit}
            onDelete={(id) => deleteGoalMutation.mutate({ id })}
          />
        )}
        {currentView === "board" && (
          <Suspense fallback={<ViewLoader />}>
            <BoardView items={goals || []} type="goals" />
          </Suspense>
        )}
        {currentView === "timeline" && (
          <TimelineView items={goals || []} type="goals" />
        )}
        {currentView === "calendar" && (
          <Suspense fallback={<ViewLoader />}>
            <CalendarView items={goals || []} type="goals" />
          </Suspense>
        )}
      </div>
    </DashboardLayout>
  );
}
