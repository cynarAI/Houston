import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { CheckSquare, Plus, Target, Edit, Trash2, Sparkles, Filter, ArrowUpDown, Download } from "lucide-react";
import ViewSwitcher, { ViewType } from "@/components/ViewSwitcher";
import TableView from "@/components/views/TableView";
import BoardView from "@/components/views/BoardView";
import TimelineView from "@/components/views/TimelineView";
import CalendarView from "@/components/views/CalendarView";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Goals() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
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

  const { data: workspaces } = trpc.workspaces.list.useQuery();
  const { data: goalsData, refetch } = trpc.goals.listByWorkspace.useQuery(
    { workspaceId: workspaces?.[0]?.id || 0 },
    { enabled: !!workspaces?.[0]?.id }
  );

  // Filter and sort goals
  const goals = useMemo(() => {
    if (!goalsData) return [];
    
    // Filter
    let filtered = goalsData;
    if (filterStatus !== "all") {
      filtered = goalsData.filter((g: any) => g.status === filterStatus);
    }
    
    // Sort
    const sorted = [...filtered].sort((a: any, b: any) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "progress":
          return (b.progress || 0) - (a.progress || 0);
        case "created":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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

    try {
      await createGoalMutation.mutateAsync({
        workspaceId: workspaces[0].id,
        ...formData,
      });
      toast.success("Ziel erfolgreich erstellt!");
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Fehler beim Erstellen des Ziels");
    }
  };

  const handleUpdate = async () => {
    if (!editingGoal) return;

    try {
      await updateGoalMutation.mutateAsync({
        id: editingGoal.id,
        ...formData,
      });
      toast.success("Ziel erfolgreich aktualisiert!");
      setEditingGoal(null);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Fehler beim Aktualisieren des Ziels");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Möchtest du dieses Ziel wirklich löschen?")) return;

    try {
      await deleteGoalMutation.mutateAsync({ id });
      toast.success("Ziel erfolgreich gelöscht!");
      refetch();
    } catch (error) {
      toast.error("Fehler beim Löschen des Ziels");
    }
  };

  const handleEdit = (goal: any) => {
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
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("PDF erfolgreich heruntergeladen!");
    } catch (error) {
      toast.error("Fehler beim Exportieren des PDFs");
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="space-y-6">
          {/* Title & Description */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Ziele & Fortschritt</h1>
            <p className="text-muted-foreground text-base">
              Verfolge deine SMART-Ziele und messe deinen Erfolg.
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* View Switcher - Left */}
            <ViewSwitcher currentView={currentView} onViewChange={handleViewChange} />
            
            {/* Filters & Actions - Right */}
            <div className="flex items-center gap-3">
              {/* Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Newest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Export PDF */}
              <Button variant="outline" onClick={handleExportPDF} disabled={!goals || goals.length === 0}>
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    placeholder="Detaillierte Beschreibung des Ziels..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="specific">Spezifisch</Label>
                  <Textarea
                    id="specific"
                    placeholder="Was genau soll erreicht werden?"
                    value={formData.specific}
                    onChange={(e) => setFormData({ ...formData, specific: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="measurable">Messbar</Label>
                  <Textarea
                    id="measurable"
                    placeholder="Wie wird der Erfolg gemessen?"
                    value={formData.measurable}
                    onChange={(e) => setFormData({ ...formData, measurable: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="achievable">Erreichbar</Label>
                  <Textarea
                    id="achievable"
                    placeholder="Warum ist das Ziel erreichbar?"
                    value={formData.achievable}
                    onChange={(e) => setFormData({ ...formData, achievable: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="relevant">Relevant</Label>
                  <Textarea
                    id="relevant"
                    placeholder="Warum ist das Ziel wichtig?"
                    value={formData.relevant}
                    onChange={(e) => setFormData({ ...formData, relevant: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="timeBound">Zeitgebunden</Label>
                  <Textarea
                    id="timeBound"
                    placeholder="Bis wann soll es erreicht werden?"
                    value={formData.timeBound}
                    onChange={(e) => setFormData({ ...formData, timeBound: e.target.value })}
                    rows={2}
                  />
                </div>
                <Button onClick={handleCreate} className="w-full" disabled={!formData.title}>
                  Ziel erstellen
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        {/* Goals Views */}
        {currentView === "table" && (
          <TableView items={goals || []} type="goals" onEdit={handleEdit} onDelete={(id) => deleteGoalMutation.mutate({ id })} />
        )}
        {currentView === "board" && (
          <BoardView items={goals || []} type="goals" />
        )}
        {currentView === "timeline" && (
          <TimelineView items={goals || []} type="goals" />
        )}
        {currentView === "calendar" && (
          <CalendarView items={goals || []} type="goals" />
        )}

        {/* Original Card View (hidden) */}
        {false && goals && goals.length > 0 ? (
          <div className="grid gap-6">
            {goals.map((goal: any, index: number) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Ziel {index + 1}</Badge>
                        <Badge variant="outline">
                          <Target className="h-3 w-3 mr-1" />
                          SMART
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{goal.title}</CardTitle>
                      {goal.description && (
                        <CardDescription className="mt-2">{goal.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={editingGoal?.id === goal.id} onOpenChange={(open) => !open && resetForm()}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Ziel bearbeiten</DialogTitle>
                            <DialogDescription>
                              Aktualisiere dein SMART-Ziel.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="edit-title">Titel *</Label>
                              <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-description">Beschreibung</Label>
                              <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-specific">Spezifisch</Label>
                              <Textarea
                                id="edit-specific"
                                value={formData.specific}
                                onChange={(e) => setFormData({ ...formData, specific: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-measurable">Messbar</Label>
                              <Textarea
                                id="edit-measurable"
                                value={formData.measurable}
                                onChange={(e) => setFormData({ ...formData, measurable: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-achievable">Erreichbar</Label>
                              <Textarea
                                id="edit-achievable"
                                value={formData.achievable}
                                onChange={(e) => setFormData({ ...formData, achievable: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-relevant">Relevant</Label>
                              <Textarea
                                id="edit-relevant"
                                value={formData.relevant}
                                onChange={(e) => setFormData({ ...formData, relevant: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-timeBound">Zeitgebunden</Label>
                              <Textarea
                                id="edit-timeBound"
                                value={formData.timeBound}
                                onChange={(e) => setFormData({ ...formData, timeBound: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <Button onClick={handleUpdate} className="w-full" disabled={!formData.title}>
                              Änderungen speichern
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goal.specific && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Spezifisch</h4>
                      <p className="text-sm text-muted-foreground">{goal.specific}</p>
                    </div>
                  )}
                  {goal.measurable && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Messbar</h4>
                      <p className="text-sm text-muted-foreground">{goal.measurable}</p>
                    </div>
                  )}
                  {goal.achievable && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Erreichbar</h4>
                      <p className="text-sm text-muted-foreground">{goal.achievable}</p>
                    </div>
                  )}
                  {goal.relevant && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Relevant</h4>
                      <p className="text-sm text-muted-foreground">{goal.relevant}</p>
                    </div>
                  )}
                  {goal.timeBound && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Zeitgebunden</h4>
                      <p className="text-sm text-muted-foreground">{goal.timeBound}</p>
                    </div>
                  )}
                  
                  {/* Progress Placeholder */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Fortschritt</span>
                      <span className="text-sm text-muted-foreground">0%</span>
                    </div>
                    <Progress value={0} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass border-white/10">
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)]">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-2">
                Create your first <span className="gradient-text">SMART goal</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Set specific, measurable, achievable, relevant, and time-bound goals with Houston's help.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Goal
                </Button>
                <Button variant="outline" className="glass hover:bg-white/10">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ask Houston for help
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
