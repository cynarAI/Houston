import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Copy, Check, Users, Gift, TrendingUp, Share2, Twitter, Facebook, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Referrals() {
  const { user } = useAuth();
  const { data: referralData, isLoading: codeLoading } = trpc.referrals.getMyReferralCode.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.referrals.getMyStats.useQuery();
  const { data: referralList, isLoading: listLoading } = trpc.referrals.getMyReferrals.useQuery();
  
  const [copied, setCopied] = useState(false);
  
  const referralCode = referralData?.code || "";
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Empfehlungs-Link in die Zwischenablage kopiert!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(`Tritt Houston AI Coach bei und erhalte 25 kostenlose Credits! 🚀`);
    const url = encodeURIComponent(referralLink);
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent("Tritt Houston AI Coach bei")}&body=${text}%0A%0A${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Empfehlungsprogramm</h1>
          <p className="text-muted-foreground">
            Lade Freunde ein und erhalte 25 Credits für jede Anmeldung. Deine Freunde bekommen auch 25 Credits!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gesamt-Empfehlungen</p>
                  <p className="text-3xl font-bold">{stats?.totalReferrals || 0}</p>
                </div>
                <Users className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Abgeschlossen</p>
                  <p className="text-3xl font-bold text-green-500">{stats?.completedReferrals || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ausstehend</p>
                  <p className="text-3xl font-bold text-orange-500">{stats?.pendingReferrals || 0}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verdiente Credits</p>
                  <p className="text-3xl font-bold text-primary">{stats?.totalCreditsEarned || 0}</p>
                </div>
                <Gift className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Card */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Dein Empfehlungs-Link
            </CardTitle>
            <CardDescription>Teile diesen Link mit Freunden, um Credits zu verdienen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Copy Link */}
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-secondary rounded-lg font-mono text-sm truncate">
                {referralLink}
              </div>
              <Button onClick={handleCopy} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Kopiert!" : "Kopieren"}
              </Button>
            </div>

            {/* Share Buttons */}
            <div>
              <p className="text-sm font-medium mb-3">Teilen über</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleShare("twitter")}
                  className="flex-1 gap-2"
                >
                  <Twitter className="h-5 w-5" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleShare("facebook")}
                  className="flex-1 gap-2"
                >
                  <Facebook className="h-5 w-5" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleShare("email")}
                  className="flex-1 gap-2"
                >
                  <Mail className="h-5 w-5" />
                  E-Mail
                </Button>
              </div>
            </div>

            {/* How it Works */}
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">So funktioniert's</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Teile deinen einzigartigen Empfehlungs-Link mit Freunden</li>
                <li>2. Sie melden sich über deinen Link an und erhalten 25 Credits</li>
                <li>3. Du erhältst 25 Credits, sobald sie sich registriert haben</li>
                <li>4. Ihr könnt beide Houston AI Coach nutzen! 🚀</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Referral List */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Empfehlungs-Historie</CardTitle>
            <CardDescription>Verfolge deine Empfehlungen und Belohnungen</CardDescription>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <div className="text-center py-8 text-muted-foreground">Lädt...</div>
            ) : referralList && referralList.length > 0 ? (
              <div className="space-y-3">
                {referralList.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {referral.refereeName || "Anmeldung ausstehend"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(referral.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">+{referral.bonusCredits} Credits</p>
                        <p className="text-xs text-muted-foreground">
                          {referral.status === "rewarded" ? `Erhalten ${formatDate(referral.rewardedAt)}` : "Ausstehend"}
                        </p>
                      </div>
                      <Badge
                        variant={referral.status === "rewarded" ? "default" : "secondary"}
                        className={
                          referral.status === "rewarded"
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                        }
                      >
                        {referral.status === "rewarded" ? "Erhalten" : "Ausstehend"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                <p className="text-muted-foreground">Noch keine Empfehlungen</p>
                <p className="text-sm text-muted-foreground">
                  Teile deinen Empfehlungs-Link, um Credits zu verdienen!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
