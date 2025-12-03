import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Brain, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Streamdown } from "streamdown";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

export default function Onboarding() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const onboardingStartTime = useRef(Date.now());

  // Form data
  const [formData, setFormData] = useState({
    industry: "",
    companySize: "",
    targetAudience: "",
    products: "",
    marketingChannels: "",
    monthlyBudget: "",
    challenges: "",
    mainGoals: "",
  });

  // Generated data
  const [summary, setSummary] = useState("");
  const [smartGoals, setSmartGoals] = useState<any[]>([]);

  const { data: workspaces } = trpc.workspaces.list.useQuery();
  const createWorkspaceMutation = trpc.workspaces.create.useMutation();
  const generateSummaryMutation = trpc.onboarding.generateSummary.useMutation();
  const generateGoalsMutation = trpc.onboarding.generateSmartGoals.useMutation();
  const completeOnboardingMutation = trpc.onboarding.completeOnboarding.useMutation();

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    // Track step completion
    if (step === 1) {
      trackEvent(AnalyticsEvents.ONBOARDING_STARTED);
    }
    trackEvent(AnalyticsEvents.ONBOARDING_STEP_COMPLETED, { step, step_name: getStepName(step) });
    
    if (step === 2) {
      // Generate summary after questions
      setLoading(true);
      try {
        const result = await generateSummaryMutation.mutateAsync({
          ...formData,
          language: "de",
        });
        setSummary(result.summary);
        setStep(3);
      } catch (error) {
        console.error("Failed to generate summary:", error);
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      // Generate SMART goals
      setLoading(true);
      try {
        const result = await generateGoalsMutation.mutateAsync({
          ...formData,
          language: "de",
        });
        setSmartGoals(result.goals);
        setStep(4);
      } catch (error) {
        console.error("Failed to generate goals:", error);
      } finally {
        setLoading(false);
      }
    } else if (step === 4) {
      // Complete onboarding
      setLoading(true);
      try {
        let workspaceId = workspaces?.[0]?.id;
        
        // Create workspace if none exists
        if (!workspaceId) {
          const result = await createWorkspaceMutation.mutateAsync({
            name: `${user?.name || "Mein"} Workspace`,
          });
          workspaceId = result.id;
        }

        await completeOnboardingMutation.mutateAsync({
          workspaceId,
          ...formData,
          goals: smartGoals,
        });

        // Track onboarding completion
        const durationSeconds = Math.round((Date.now() - onboardingStartTime.current) / 1000);
        trackEvent(AnalyticsEvents.ONBOARDING_COMPLETED, { duration_seconds: durationSeconds });

        setStep(5);
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const getStepName = (s: number) => {
    const names: Record<number, string> = {
      1: "welcome",
      2: "questions",
      3: "summary",
      4: "goals",
      5: "complete"
    };
    return names[s] || "unknown";
  };

  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) {
      return formData.industry && formData.companySize && formData.targetAudience && formData.mainGoals;
    }
    if (step === 3) return summary;
    if (step === 4) return smartGoals.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              Onboarding
            </Badge>
            <span className="text-sm text-muted-foreground">
              Schritt {step} von {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center space-y-6 py-8">
              <Brain className="h-16 w-16 text-[var(--color-gradient-pink)] mx-auto" />
              <div>
                <CardTitle className="text-2xl mb-4">
                  Hey! Willkommen bei Houston, deinem AI Marketing Assistant.
                </CardTitle>
                <CardDescription className="text-base">
                  Ich helfe dir, dein Marketing klarer, leichter und datenbasierter zu machen.
                  Beantworte ein paar Fragen zu deinem Business und ich erstelle dir eine maßgeschneiderte Roadmap.
                </CardDescription>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleNext}>
                  Los geht's
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <CardTitle className="mb-2">Erzähl mir von deinem Business</CardTitle>
                <CardDescription>
                  Diese Informationen helfen mir, dir die besten Empfehlungen zu geben.
                </CardDescription>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="industry">In welcher Branche bist du tätig? *</Label>
                  <Input
                    id="industry"
                    placeholder="z.B. E-Commerce, B2B SaaS, Beratung..."
                    value={formData.industry}
                    onChange={(e) => updateFormData("industry", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="companySize">Wie groß ist dein Unternehmen? *</Label>
                  <Input
                    id="companySize"
                    placeholder="z.B. 1-5 Mitarbeiter, 10-50 Mitarbeiter..."
                    value={formData.companySize}
                    onChange={(e) => updateFormData("companySize", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Wer ist deine Zielgruppe? *</Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="z.B. KMU-Inhaber, Tech-Startups, B2C-Konsumenten..."
                    value={formData.targetAudience}
                    onChange={(e) => updateFormData("targetAudience", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="products">Was sind deine wichtigsten Angebote/Produkte?</Label>
                  <Textarea
                    id="products"
                    placeholder="z.B. Online-Kurse, SaaS-Produkt, Beratungsdienstleistungen..."
                    value={formData.products}
                    onChange={(e) => updateFormData("products", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="marketingChannels">Welche Marketingkanäle nutzt du bereits?</Label>
                  <Input
                    id="marketingChannels"
                    placeholder="z.B. Social Media, SEO, E-Mail-Marketing..."
                    value={formData.marketingChannels}
                    onChange={(e) => updateFormData("marketingChannels", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyBudget">Wie viel Budget hast du pro Monat für Marketing?</Label>
                  <Input
                    id="monthlyBudget"
                    placeholder="z.B. 500€, 2000€, 10.000€..."
                    value={formData.monthlyBudget}
                    onChange={(e) => updateFormData("monthlyBudget", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">Was sind deine größten Marketing-Herausforderungen?</Label>
                  <Textarea
                    id="challenges"
                    placeholder="z.B. Zeitmangel, fehlende Strategie, zu wenig Leads..."
                    value={formData.challenges}
                    onChange={(e) => updateFormData("challenges", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="mainGoals">Was sind deine 1-3 wichtigsten Ziele? *</Label>
                  <Textarea
                    id="mainGoals"
                    placeholder="z.B. Mehr Leads generieren, Marke stärken, Umsatz steigern..."
                    value={formData.mainGoals}
                    onChange={(e) => updateFormData("mainGoals", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button onClick={handleNext} disabled={!canProceed() || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generiere Zusammenfassung...
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

          {/* Step 3: Summary */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <CardTitle className="mb-2">Dein Business in Kurzform</CardTitle>
                <CardDescription>
                  Basierend auf deinen Antworten habe ich folgende Zusammenfassung erstellt:
                </CardDescription>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <Streamdown>{summary}</Streamdown>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button onClick={handleNext} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generiere SMART-Ziele...
                    </>
                  ) : (
                    <>
                      Passt! Weiter
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: SMART Goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <CardTitle className="mb-2">Deine SMART-Ziele</CardTitle>
                <CardDescription>
                  Ich habe dir konkrete, messbare Ziele vorgeschlagen:
                </CardDescription>
              </div>

              <div className="space-y-4">
                {smartGoals.map((goal, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Badge variant="secondary">{index + 1}</Badge>
                        {goal.title}
                      </CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <strong>Spezifisch:</strong> {goal.specific}
                      </div>
                      <div>
                        <strong>Messbar:</strong> {goal.measurable}
                      </div>
                      <div>
                        <strong>Erreichbar:</strong> {goal.achievable}
                      </div>
                      <div>
                        <strong>Relevant:</strong> {goal.relevant}
                      </div>
                      <div>
                        <strong>Zeitgebunden:</strong> {goal.timeBound}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button onClick={handleNext} disabled={loading}>
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

          {/* Step 5: Complete */}
          {step === 5 && (
            <div className="text-center space-y-6 py-8">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
              <div>
                <CardTitle className="text-2xl mb-4">
                  Lass uns loslegen – ich habe dir im Dashboard eine erste Roadmap vorbereitet.
                </CardTitle>
                <CardDescription className="text-base">
                  Deine Ziele und nächsten Schritte warten auf dich. Viel Erfolg bei deiner Marketing-Mission! 🚀
                </CardDescription>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={() => setLocation("/app/dashboard")}>
                  Zum Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
