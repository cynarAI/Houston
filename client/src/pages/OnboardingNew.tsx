import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Brain,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
  Rocket,
  Globe,
  Zap,
  Target,
  AlertCircle,
} from "lucide-react";
import { useLocation } from "wouter";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { celebrations } from "@/lib/celebrations";

// LocalStorage key for persistence
const ONBOARDING_STORAGE_KEY = "houston-onboarding-ai-first";

export default function OnboardingNew() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const onboardingStartTime = useRef(Date.now());

  // Form data - AI First approach
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [scannedData, setScannedData] = useState<any>(null);
  const [manualMode, setManualMode] = useState(false);

  // Manual fallback data
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    targetAudience: "",
    mainGoals: "",
  });

  const [smartGoals, setSmartGoals] = useState<any[]>([]);

  const { data: workspaces } = trpc.workspaces.list.useQuery();
  const createWorkspaceMutation = trpc.workspaces.create.useMutation();
  const scanWebsiteMutation = trpc.onboarding.scanWebsite.useMutation();
  const generateGoalsMutation =
    trpc.onboarding.generateSmartGoals.useMutation();
  const completeOnboardingMutation =
    trpc.onboarding.completeOnboarding.useMutation();

  const totalSteps = 4;

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.websiteUrl) setWebsiteUrl(parsed.websiteUrl);
        if (parsed.scannedData) setScannedData(parsed.scannedData);
        if (parsed.step && parsed.step <= totalSteps) setStep(parsed.step);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (step <= totalSteps) {
      localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({ step, websiteUrl, scannedData }),
      );
    }
  }, [step, websiteUrl, scannedData]);

  const clearProgress = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  const handleScanWebsite = async () => {
    setError("");
    setLoading(true);

    try {
      // Normalize URL
      let url = websiteUrl.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      trackEvent(AnalyticsEvents.ONBOARDING_STARTED);

      const result = await scanWebsiteMutation.mutateAsync({
        url,
        language: "de",
      });

      setScannedData(result);
      setStep(2);

      trackEvent(AnalyticsEvents.ONBOARDING_STEP_COMPLETED, {
        step: 1,
        step_name: "website_scan",
        method: "ai_scan",
      });
    } catch (err: any) {
      console.error("Website scan failed:", err);
      setError(
        "Website konnte nicht analysiert werden. Bitte gib deine Daten manuell ein.",
      );
      // Don't auto-switch to manual mode, let user decide
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = () => {
    setManualMode(true);
    setStep(2);
    trackEvent(AnalyticsEvents.ONBOARDING_STEP_COMPLETED, {
      step: 1,
      step_name: "website_scan",
      method: "manual_entry",
    });
  };

  const handleConfirmData = async () => {
    setLoading(true);
    setError("");

    try {
      // Prepare data for goal generation
      const dataForGoals = manualMode
        ? {
            industry: formData.industry,
            companySize: formData.companySize,
            targetAudience: formData.targetAudience,
            products: "",
            marketingChannels: "",
            monthlyBudget: "",
            challenges: "",
            mainGoals: formData.mainGoals,
            language: "de" as const,
          }
        : {
            industry: scannedData.industry || scannedData.customIndustry || "",
            companySize: scannedData.companySize || "",
            targetAudience: scannedData.targetAudience?.demographics || "",
            products: "",
            marketingChannels: "",
            monthlyBudget: "",
            challenges: scannedData.targetAudience?.painPoints || "",
            mainGoals: "",
            language: "de" as const,
          };

      const result = await generateGoalsMutation.mutateAsync(dataForGoals);
      setSmartGoals(result.goals);
      setStep(3);

      trackEvent(AnalyticsEvents.ONBOARDING_STEP_COMPLETED, {
        step: 2,
        step_name: "confirm_data",
      });
    } catch (err) {
      console.error("Failed to generate goals:", err);
      setError(
        "Ziele konnten nicht generiert werden. Bitte versuche es erneut.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");

    try {
      let workspaceId = workspaces?.[0]?.id;

      if (!workspaceId) {
        const result = await createWorkspaceMutation.mutateAsync({
          name: `${user?.name || "Mein"} Workspace`,
        });
        workspaceId = result.id;
      }

      await completeOnboardingMutation.mutateAsync({
        workspaceId,
        industry: manualMode ? formData.industry : scannedData?.industry || "",
        companySize: manualMode
          ? formData.companySize
          : scannedData?.companySize || "",
        targetAudience: manualMode
          ? formData.targetAudience
          : scannedData?.targetAudience?.demographics || "",
        products: "",
        marketingChannels: "",
        monthlyBudget: "",
        challenges: scannedData?.targetAudience?.painPoints || "",
        mainGoals: manualMode ? formData.mainGoals : "",
        goals: smartGoals,
      });

      const durationSeconds = Math.round(
        (Date.now() - onboardingStartTime.current) / 1000,
      );
      trackEvent(AnalyticsEvents.ONBOARDING_COMPLETED, {
        duration_seconds: durationSeconds,
      });

      clearProgress();
      setStep(4);

      setTimeout(() => {
        celebrations.onboardingCompleted();
      }, 300);
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      setError("Onboarding konnte nicht abgeschlossen werden.");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const canProceedStep1 = () => {
    return websiteUrl.trim().length > 3;
  };

  const canProceedStep2 = () => {
    if (manualMode) {
      return (
        formData.companyName &&
        formData.industry &&
        formData.companySize &&
        formData.targetAudience &&
        formData.mainGoals
      );
    }
    return scannedData !== null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-gradient-to-r from-[#FF6B9D] via-[#C44FE2] to-[#00D4FF] transition-all duration-500"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Counter */}
      <div className="fixed top-4 right-4 z-40">
        <Badge variant="secondary" className="text-sm">
          <Sparkles className="h-3 w-3 mr-1" />
          Schritt {step} / {totalSteps}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
        {/* Step 1: Website URL Input */}
        {step === 1 && (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] rounded-full blur-3xl opacity-30 animate-pulse" />
              <Brain className="relative h-24 w-24 text-[#FF6B9D] mx-auto" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
                Hey! 👋 Ich bin Houston.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
                Dein persönlicher KI Marketing-Coach. Gib mir einfach deine
                Website und ich analysiere automatisch dein Business.
              </p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-3">
                <Label htmlFor="website" className="text-left block text-base">
                  <Globe className="inline h-4 w-4 mr-2" />
                  Deine Website oder Domain
                </Label>
                <div className="relative">
                  <Input
                    id="website"
                    type="text"
                    placeholder="z.B. meinbusiness.de"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canProceedStep1() && !loading) {
                        handleScanWebsite();
                      }
                    }}
                    className="text-lg h-14 pr-12"
                    autoFocus
                  />
                  <Zap className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Ich analysiere deine Website automatisch und erkenne Branche,
                  Zielgruppe und mehr.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  size="lg"
                  variant="gradient"
                  onClick={handleScanWebsite}
                  disabled={!canProceedStep1() || loading}
                  className="w-full text-lg h-14"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analysiere Website...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Website analysieren
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      oder
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleManualEntry}
                  className="w-full"
                >
                  Daten manuell eingeben
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>100% DSGVO-konform</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Keine Speicherung</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review & Confirm Data */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                {manualMode
                  ? "Erzähl mir von deinem Business"
                  : "Das habe ich erkannt"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {manualMode
                  ? "Fülle die wichtigsten Informationen aus"
                  : "Prüfe die Informationen und korrigiere bei Bedarf"}
              </p>
            </div>

            <div className="space-y-6 bg-card/50 backdrop-blur border border-border rounded-3xl p-6 md:p-8">
              {manualMode ? (
                <>
                  <div>
                    <Label htmlFor="companyName">Firmenname *</Label>
                    <Input
                      id="companyName"
                      placeholder="z.B. Meine Firma GmbH"
                      value={formData.companyName}
                      onChange={(e) =>
                        updateFormData("companyName", e.target.value)
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry">Branche *</Label>
                    <Input
                      id="industry"
                      placeholder="z.B. E-Commerce, Coaching, SaaS..."
                      value={formData.industry}
                      onChange={(e) =>
                        updateFormData("industry", e.target.value)
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companySize">Unternehmensgröße *</Label>
                    <Input
                      id="companySize"
                      placeholder="z.B. 1-10 Mitarbeiter"
                      value={formData.companySize}
                      onChange={(e) =>
                        updateFormData("companySize", e.target.value)
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Zielgruppe *</Label>
                    <Textarea
                      id="targetAudience"
                      placeholder="z.B. KMU-Inhaber, Tech-Startups..."
                      value={formData.targetAudience}
                      onChange={(e) =>
                        updateFormData("targetAudience", e.target.value)
                      }
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mainGoals">Hauptziele *</Label>
                    <Textarea
                      id="mainGoals"
                      placeholder="z.B. Mehr Leads, Marke stärken..."
                      value={formData.mainGoals}
                      onChange={(e) =>
                        updateFormData("mainGoals", e.target.value)
                      }
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-4">
                    <div className="flex justify-between items-start p-4 rounded-xl bg-muted/50">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Firmenname
                        </p>
                        <p className="font-semibold">
                          {scannedData?.companyName || "Nicht erkannt"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-start p-4 rounded-xl bg-muted/50">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Branche
                        </p>
                        <p className="font-semibold">
                          {scannedData?.industry === "Other"
                            ? scannedData?.customIndustry
                            : scannedData?.industry || "Nicht erkannt"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-start p-4 rounded-xl bg-muted/50">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Unternehmensgröße
                        </p>
                        <p className="font-semibold">
                          {scannedData?.companySize || "Nicht erkannt"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-start p-4 rounded-xl bg-muted/50">
                      <div className="w-full">
                        <p className="text-sm text-muted-foreground mb-1">
                          Zielgruppe
                        </p>
                        <p className="font-semibold">
                          {scannedData?.targetAudience?.demographics ||
                            "Nicht erkannt"}
                        </p>
                      </div>
                    </div>

                    {scannedData?.targetAudience?.painPoints && (
                      <div className="flex justify-between items-start p-4 rounded-xl bg-muted/50">
                        <div className="w-full">
                          <p className="text-sm text-muted-foreground mb-1">
                            Erkannte Herausforderungen
                          </p>
                          <p className="font-semibold">
                            {scannedData.targetAudience.painPoints}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p>
                      Diese Informationen wurden automatisch von deiner Website
                      analysiert. Du kannst sie später jederzeit anpassen.
                    </p>
                  </div>
                </>
              )}

              {error && (
                <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
                disabled={loading}
              >
                Zurück
              </Button>
              <Button
                variant="gradient"
                onClick={handleConfirmData}
                disabled={!canProceedStep2() || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generiere Ziele...
                  </>
                ) : (
                  <>
                    Weiter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: SMART Goals */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Deine SMART-Ziele
              </h2>
              <p className="text-lg text-muted-foreground">
                Basierend auf deinem Business habe ich diese Ziele für dich
                erstellt
              </p>
            </div>

            <div className="space-y-4">
              {smartGoals.map((goal, index) => (
                <div
                  key={index}
                  className="bg-card/50 backdrop-blur border border-border rounded-2xl p-6 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <Badge className="bg-gradient-to-r from-[#FF6B9D] via-[#C44FE2] to-[#8B5CF6] text-white border-0 shrink-0">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {goal.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {goal.description}
                      </p>
                      <div className="grid gap-2 text-sm">
                        <div className="flex gap-2">
                          <span className="text-primary font-semibold min-w-[100px]">
                            Spezifisch:
                          </span>
                          <span>{goal.specific}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-primary font-semibold min-w-[100px]">
                            Messbar:
                          </span>
                          <span>{goal.measurable}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-primary font-semibold min-w-[100px]">
                            Erreichbar:
                          </span>
                          <span>{goal.achievable}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-primary font-semibold min-w-[100px]">
                            Relevant:
                          </span>
                          <span>{goal.relevant}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-primary font-semibold min-w-[100px]">
                            Zeitgebunden:
                          </span>
                          <span>{goal.timeBound}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1"
                disabled={loading}
              >
                Zurück
              </Button>
              <Button
                variant="gradient"
                onClick={handleComplete}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichere...
                  </>
                ) : (
                  <>
                    Ziele annehmen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-3xl opacity-40 animate-pulse" />
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-16 w-16 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Perfekt! Du bist startklar. 🚀
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
                Deine Ziele sind gespeichert und dein Dashboard ist bereit. Lass
                uns dein Marketing auf das nächste Level bringen!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                size="lg"
                variant="gradient"
                onClick={() =>
                  setLocation(
                    "/app/chats?prompt=Hey Houston! Ich bin gerade durch das Onboarding gekommen. Was sollte ich als erstes tun?",
                  )
                }
                className="text-lg px-8"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Mit Houston starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/app/dashboard")}
              >
                Zum Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
