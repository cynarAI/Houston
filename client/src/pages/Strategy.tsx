import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Compass, Save, Edit, Sparkles, Download } from "lucide-react";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { handleMutationError, ErrorMessages } from "@/lib/errorHandling";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { celebrations } from "@/lib/celebrations";

export default function Strategy() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: workspaces, isLoading: workspacesLoading, isError: workspacesError, refetch: refetchWorkspaces } = trpc.workspaces.list.useQuery();
  const { data: strategy, isLoading: strategyLoading, isError: strategyError, refetch } = trpc.strategy.getByWorkspace.useQuery(
    { workspaceId: workspaces?.[0]?.id || 0 },
    { enabled: !!workspaces?.[0]?.id }
  );
  
  // Combined states
  const isLoading = workspacesLoading || (workspaces?.[0]?.id && strategyLoading);
  const hasError = workspacesError || strategyError;

  const saveStrategyMutation = trpc.strategy.createOrUpdate.useMutation();
  const exportPDFMutation = trpc.export.exportStrategyPDF.useMutation();

  const [formData, setFormData] = useState({
    positioning: strategy?.positioning || "",
    personas: strategy?.personas || "",
    coreMessages: strategy?.coreMessages || "",
    channels: strategy?.channels || "",
    contentPillars: strategy?.contentPillars || "",

  });

  const handleSave = async () => {
    if (!workspaces?.[0]?.id) return;

    const isFirstStrategy = !strategy?.positioning;
    
    try {
      await saveStrategyMutation.mutateAsync({
        workspaceId: workspaces[0].id,
        ...formData,
      });
      toast.success(strategy ? "Strategie erfolgreich aktualisiert!" : "Strategie erfolgreich erstellt!");
      setIsEditing(false);
      refetch();
      
      // Celebrate first strategy
      if (isFirstStrategy) {
        celebrations.firstStrategy();
      }
    } catch (error) {
      handleMutationError(error, ErrorMessages.strategySave);
    }
  };

  const handleEdit = () => {
    setFormData({
      positioning: strategy?.positioning || "",
      personas: strategy?.personas || "",
      coreMessages: strategy?.coreMessages || "",
      channels: strategy?.channels || "",
      contentPillars: strategy?.contentPillars || "",
  
    });
    setIsEditing(true);
  };

  const handleExportPDF = async () => {
    try {
      toast.info("Generiere PDF...");
      const result = await exportPDFMutation.mutateAsync();
      
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
      
      // Track PDF export
      trackEvent(AnalyticsEvents.PDF_EXPORTED, { type: "strategy" });
      
      toast.success("PDF erfolgreich heruntergeladen!");
    } catch (error) {
      handleMutationError(error, ErrorMessages.pdfExport);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Lade deine Strategie..." fullPage />
      </DashboardLayout>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <ErrorState
            title="Strategie konnte nicht geladen werden"
            message="Es gab ein Problem beim Laden deiner Strategie. Bitte versuche es erneut."
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
        <div className="flex items-center justify-between">
          {/* Title & Description */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketing-Strategie</h1>
            <p className="text-muted-foreground text-base">
              Definiere deine Positionierung, Zielgruppen und Kernbotschaften.
            </p>
          </div>
          
          {/* Actions */}
          {!isEditing && strategy && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Bearbeiten
              </Button>
            </div>
          )}
        </div>

        {/* Strategy Form/Display */}
        {isEditing || !strategy ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Positionierung & Unique Value Proposition</CardTitle>
                <CardDescription>
                  Was macht dein Angebot einzigartig und wie positionierst du dich am Markt?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="positioning">Positionierung</Label>
                  <Textarea
                    id="positioning"
                    placeholder="z.B. Wir sind die führende Lösung für KMUs im DACH-Raum..."
                    value={formData.positioning}
                    onChange={(e) => setFormData({ ...formData, positioning: e.target.value })}
                    rows={4}
                  />
                </div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zielgruppen & Personas</CardTitle>
                <CardDescription>
                  Wer sind deine idealen Kunden? Beschreibe ihre Eigenschaften, Bedürfnisse und Pain Points.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="personas"
                  placeholder="z.B. Persona 1: Marketing-Manager in KMUs (25-45 Jahre), sucht nach effizienten Lösungen..."
                  value={formData.personas}
                  onChange={(e) => setFormData({ ...formData, personas: e.target.value })}
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kernbotschaften</CardTitle>
                <CardDescription>
                  Welche 3-5 Hauptbotschaften möchtest du kommunizieren?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="coreMessages"
                  placeholder="z.B. 1. Wir machen Marketing einfach und messbar. 2. Datenbasierte Entscheidungen..."
                  value={formData.coreMessages}
                  onChange={(e) => setFormData({ ...formData, coreMessages: e.target.value })}
                  rows={5}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketingkanäle</CardTitle>
                <CardDescription>
                  Welche Kanäle nutzt du, um deine Zielgruppe zu erreichen?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="channels"
                  placeholder="z.B. LinkedIn, Google Ads, E-Mail-Marketing, Content Marketing, SEO..."
                  value={formData.channels}
                  onChange={(e) => setFormData({ ...formData, channels: e.target.value })}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content-Säulen</CardTitle>
                <CardDescription>
                  Welche Themen und Content-Formate sind zentral für deine Strategie?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="contentPillars"
                  placeholder="z.B. 1. Thought Leadership (Blog-Posts, LinkedIn-Artikel), 2. Case Studies, 3. How-to-Guides..."
                  value={formData.contentPillars}
                  onChange={(e) => setFormData({ ...formData, contentPillars: e.target.value })}
                  rows={5}
                />
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Strategie speichern
              </Button>
              {strategy && (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Abbrechen
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Positionierung & Unique Value Proposition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {strategy.positioning && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Positionierung</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {strategy.positioning}
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>

            {strategy.personas && (
              <Card>
                <CardHeader>
                  <CardTitle>Zielgruppen & Personas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {strategy.personas}
                  </p>
                </CardContent>
              </Card>
            )}

            {strategy.coreMessages && (
              <Card>
                <CardHeader>
                  <CardTitle>Kernbotschaften</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {strategy.coreMessages}
                  </p>
                </CardContent>
              </Card>
            )}

            {strategy.channels && (
              <Card>
                <CardHeader>
                  <CardTitle>Marketingkanäle</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {strategy.channels}
                  </p>
                </CardContent>
              </Card>
            )}

            {strategy.contentPillars && (
              <Card>
                <CardHeader>
                  <CardTitle>Content-Säulen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {strategy.contentPillars}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {!strategy && !isEditing && (
          <Card className="glass border-white/10">
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-indigo)] to-[var(--color-gradient-purple)] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-gradient-indigo)] to-[var(--color-gradient-purple)]">
                    <Compass className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-2">
                Definiere deine <span className="gradient-text">Marketing-Strategie</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Erstelle eine klare Roadmap für deinen Marketing-Erfolg mit Houstons Unterstützung.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => setIsEditing(true)} className="btn-gradient">
                  <Edit className="mr-2 h-4 w-4" />
                  Strategie erstellen
                </Button>
                <Button variant="outline" className="glass hover:bg-white/10">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Houston um Hilfe fragen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
