import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Sparkles,
  Download,
  Trash2,
  Loader2,
  Building,
  Plus,
} from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Settings() {
  const { user, logout } = useAuth();
  const { data: creditBalance } = trpc.credits.getBalance.useQuery();
  const { data: workspaces } = trpc.workspaces.list.useQuery();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const createWorkspaceMutation = trpc.workspaces.create.useMutation();

  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [marketingTips, setMarketingTips] = useState(false);

  const handleCreateWorkspace = async () => {
    try {
      await createWorkspaceMutation.mutateAsync({ name: newWorkspaceName });
      setShowNewWorkspaceDialog(false);
      setNewWorkspaceName("");
      // Refetch logic handled by trpc invalidation usually, or manually:
      // refetchWorkspaces();
    } catch (error) {
      console.error("Failed to create workspace", error);
    }
  };

  const exportDataMutation = trpc.account.exportAllData.useMutation();
  const deleteAccountMutation = trpc.account.deleteAccount.useMutation();

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const result = await exportDataMutation.mutateAsync();
      // Create and download JSON file
      const blob = new Blob([result.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountMutation.mutateAsync();
      // Clear local storage and redirect to home
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Delete failed:", error);
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Einstellungen
          </h1>
          <p className="text-muted-foreground mt-2">
            Verwalte deine Account-Einstellungen und Präferenzen.
          </p>
        </div>

        {/* Workspaces Section (New Phase 3 Feature) */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Building className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Workspaces</h2>
              <p className="text-sm text-muted-foreground">
                Verwalte deine Projekte und Kunden
              </p>
            </div>
          </div>
          <Separator className="my-4 bg-white/10" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Deine Workspaces</p>
                <p className="text-sm text-muted-foreground">
                  Du nutzt den {(user as any)?.plan || "Free"} Plan.
                </p>
                {(user as any)?.plan === "Team" ||
                (user as any)?.plan === "team" ? (
                  <p className="text-xs text-green-400 mt-1">
                    ✓ Unbegrenzte Workspaces im Team Plan enthalten
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Upgrade auf Team Plan für unbegrenzte Workspaces
                  </p>
                )}
              </div>
              <Dialog
                open={showNewWorkspaceDialog}
                onOpenChange={setShowNewWorkspaceDialog}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Neu erstellen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neuen Workspace erstellen</DialogTitle>
                    <DialogDescription>
                      Erstelle einen separaten Bereich für ein neues Projekt
                      oder einen Kunden.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="workspace-name">Name</Label>
                      <Input
                        id="workspace-name"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        placeholder="z.B. Kunde XY oder Projekt Alpha"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewWorkspaceDialog(false)}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      onClick={handleCreateWorkspace}
                      disabled={
                        !newWorkspaceName || createWorkspaceMutation.isPending
                      }
                    >
                      {createWorkspaceMutation.isPending
                        ? "Erstelle..."
                        : "Erstellen"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {workspaces?.map((ws: any) => (
                <div
                  key={ws.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                      {ws.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium">{ws.name}</span>
                    {ws.isDefault && (
                      <Badge variant="secondary" className="text-[10px]">
                        Standard
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Verwalten
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Account Section */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground">
                Deine persönlichen Informationen
              </p>
            </div>
          </div>
          <Separator className="my-4 bg-white/10" />
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={user?.name || ""}
                className="bg-background/50"
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                className="bg-background/50"
                disabled
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Account-Daten werden über Manus OAuth verwaltet.
            </p>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Benachrichtigungen</h2>
              <p className="text-sm text-muted-foreground">
                Verwalte deine Benachrichtigungseinstellungen
              </p>
            </div>
          </div>
          <Separator className="my-4 bg-white/10" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">E-Mail-Benachrichtigungen</p>
                <p className="text-sm text-muted-foreground">
                  Erhalte Updates zu deinen Goals und Todos
                </p>
              </div>
              <Button
                variant={emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={
                  emailNotifications ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                {emailNotifications ? "Aktiviert ✓" : "Aktivieren"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing-Tipps</p>
                <p className="text-sm text-muted-foreground">
                  Wöchentliche Marketing-Insights von Houston
                </p>
              </div>
              <Button
                variant={marketingTips ? "default" : "outline"}
                size="sm"
                onClick={() => setMarketingTips(!marketingTips)}
                className={
                  marketingTips ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                {marketingTips ? "Aktiviert ✓" : "Aktivieren"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Credits & Subscription Section */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <CreditCard className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Credits & Abonnement</h2>
              <p className="text-sm text-muted-foreground">
                Verwalte deine Houston Credits
              </p>
            </div>
          </div>
          <Separator className="my-4 bg-white/10" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Aktuelles Guthaben</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-base">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {creditBalance || 0} Credits
                  </Badge>
                  {creditBalance !== undefined && creditBalance < 10 && (
                    <Badge variant="destructive" className="text-xs">
                      Niedrig
                    </Badge>
                  )}
                </div>
              </div>
              <Link href="/app/credits">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Credits kaufen
                </Button>
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-200">
                💡 Kaufe Credit Packs (Orbit Pack, Galaxy Pack) oder Mission
                Boosters für mehr Flexibilität.
              </p>
            </div>
            <Separator className="my-2 bg-white/10" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lifetime Credits verwendet</p>
                <p className="text-sm text-muted-foreground">
                  {(user as any)?.lifetimeCreditsUsed || 0} Credits
                </p>
              </div>
              <Link href="/app/credits">
                <Button variant="ghost" size="sm">
                  Details anzeigen
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Privacy & Security Section */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Shield className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Datenschutz & Sicherheit
              </h2>
              <p className="text-sm text-muted-foreground">
                Verwalte deine Datenschutzeinstellungen (DSGVO Art. 17 & 20)
              </p>
            </div>
          </div>
          <Separator className="my-4 bg-white/10" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daten exportieren</p>
                <p className="text-sm text-muted-foreground">
                  Lade alle deine Houston-Daten als JSON herunter
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exportiere...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Exportieren
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Account löschen</p>
                <p className="text-sm text-muted-foreground">
                  Lösche deinen Account und alle Daten permanent
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-400 border-red-400/50 hover:bg-red-500/10"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Löschen
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">
              Account wirklich löschen?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Diese Aktion kann nicht rückgängig gemacht werden. Es werden
                permanent gelöscht:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Dein Profil (Name, E-Mail)</li>
                <li>Alle Workspaces und deren Daten</li>
                <li>Alle Goals, Todos und Strategien</li>
                <li>Dein gesamter Chat-Verlauf</li>
                <li>Alle Credit-Transaktionen</li>
              </ul>
              <p className="mt-4 font-medium">
                Empfehlung: Exportiere zuerst deine Daten!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Lösche...
                </>
              ) : (
                "Account permanent löschen"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
