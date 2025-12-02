import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Settings as SettingsIcon, User, Bell, CreditCard, Shield, Sparkles } from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

export default function Settings() {
  const { user } = useAuth();
  const { data: creditBalance } = trpc.credits.getBalance.useQuery();

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

        {/* Account Section */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground">Deine persönlichen Informationen</p>
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
              <p className="text-sm text-muted-foreground">Verwalte deine Benachrichtigungseinstellungen</p>
            </div>
          </div>
          <Separator className="my-4 bg-white/10" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">E-Mail-Benachrichtigungen</p>
                <p className="text-sm text-muted-foreground">Erhalte Updates zu deinen Goals und Todos</p>
              </div>
              <Button variant="outline" size="sm">
                Aktivieren
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing-Tipps</p>
                <p className="text-sm text-muted-foreground">Wöchentliche Marketing-Insights von Houston</p>
              </div>
              <Button variant="outline" size="sm">
                Aktivieren
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
              <p className="text-sm text-muted-foreground">Verwalte deine Houston Credits</p>
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
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Credits kaufen
                </Button>
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-200">
                💡 Kaufe Credit Packs (Orbit Pack, Galaxy Pack) oder Mission Boosters für mehr Flexibilität.
              </p>
            </div>
            <Separator className="my-2 bg-white/10" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lifetime Credits verwendet</p>
                <p className="text-sm text-muted-foreground">{user?.lifetimeCreditsUsed || 0} Credits</p>
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
              <h2 className="text-xl font-semibold">Datenschutz & Sicherheit</h2>
              <p className="text-sm text-muted-foreground">Verwalte deine Datenschutzeinstellungen</p>
            </div>
          </div>
          <Separator className="my-4 bg-white/10" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daten exportieren</p>
                <p className="text-sm text-muted-foreground">Lade alle deine Houston-Daten herunter</p>
              </div>
              <Button variant="outline" size="sm">
                Exportieren
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Account löschen</p>
                <p className="text-sm text-muted-foreground">Lösche deinen Account permanent</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-400 border-red-400/50 hover:bg-red-500/10">
                Löschen
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
