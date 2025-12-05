import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Sparkles,
  Rocket,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import { Streamdown } from "streamdown";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { celebrations } from "@/lib/celebrations";

// LocalStorage key for persistence
const ONBOARDING_STORAGE_KEY = "houston-onboarding-progress";

// Common options for pills
const INDUSTRY_OPTIONS = [
  "E-Commerce",
  "Coaching/Beratung",
  "Agentur",
  "Lokales Business",
  "SaaS/Software",
  "Content Creator",
];
const GOAL_OPTIONS = [
  "Mehr Leads",
  "Bekanntheit steigern",
  "Produkt-Launch",
  "Kundenbindung",
  "Social Media Wachstum",
];

export default function Onboarding() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  const togglePill = (field: keyof typeof formData, value: string) => {
    const current = formData[field] as string;
    // Simple toggle logic: if same value clicked, clear it. If new value, set it.
    // For text inputs that support multiple values (like comma separated), this logic would be different,
    // but for simplicity and clarity in onboarding, we treat these as single-select shortcuts for the input.
    if (current === value) {
      updateFormData(field as string, "");
    } else {
      updateFormData(field as string, value);
    }
  };

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.step && parsed.step <= 2) setStep(parsed.step);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (step <= 2) {
      localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({ step, formData }),
      );
    }
  }, [step, formData]);

  // Clear storage on completion
  const clearProgress = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  // Generated data
  const [summary, setSummary] = useState("");
  const [smartGoals, setSmartGoals] = useState<any[]>([]);
  const [editingGoalIndex, setEditingGoalIndex] = useState<number | null>(null);

  const updateGoal = (index: number, field: string, value: string) => {
    const newGoals = [...smartGoals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setSmartGoals(newGoals);
  };

  const { data: workspaces } = trpc.workspaces.list.useQuery();
  const createWorkspaceMutation = trpc.workspaces.create.useMutation();
  const generateSummaryMutation = trpc.onboarding.generateSummary.useMutation();
  const generateGoalsMutation =
    trpc.onboarding.generateSmartGoals.useMutation();
  const completeOnboardingMutation =
    trpc.onboarding.completeOnboarding.useMutation();

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Smooth step transition with animation
  const transitionToStep = (newStep: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(newStep);
      setIsTransitioning(false);
    }, 150);
  };

  const handleNext = async () => {
    // Track step completion
    if (step === 1) {
      trackEvent(AnalyticsEvents.ONBOARDING_STARTED);
    }
    trackEvent(AnalyticsEvents.ONBOARDING_STEP_COMPLETED, {
      step,
      step_name: getStepName(step),
    });

    if (step === 2) {
      // Generate summary after questions
      setLoading(true);
      try {
        const result = await generateSummaryMutation.mutateAsync({
          ...formData,
          language: "de",
        });
        setSummary(result.summary);
        transitionToStep(3);
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
        transitionToStep(4);
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
        const durationSeconds = Math.round(
          (Date.now() - onboardingStartTime.current) / 1000,
        );
        trackEvent(AnalyticsEvents.ONBOARDING_COMPLETED, {
          duration_seconds: durationSeconds,
        });

        // Clear saved progress
        clearProgress();

        // Transition to completion step
        transitionToStep(5);

        // Celebrate with confetti!
        setTimeout(() => {
          celebrations.onboardingCompleted();
        }, 300);
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
      } finally {
        setLoading(false);
      }
    } else {
      transitionToStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) transitionToStep(step - 1);
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
      5: "complete",
    };
    return names[s] || "unknown";
  };

  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) {
      return (
        formData.industry &&
        formData.companySize &&
        formData.targetAudience &&
        formData.mainGoals
      );
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
            <div
              className={`text-center space-y-6 py-8 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0 animate-in fade-in slide-in-from-right-4"}`}
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] rounded-full blur-2xl opacity-30 animate-pulse" />
                <Brain className="relative h-20 w-20 text-[#FF6B9D] mx-auto animate-in zoom-in duration-500" />
              </div>
              <div
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: "150ms" }}
              >
                <CardTitle className="text-2xl md:text-3xl mb-4">
                  Hey! 👋 Ich bin Houston.
                </CardTitle>
                <CardDescription className="text-base md:text-lg max-w-xl mx-auto">
                  Dein persönlicher KI Marketing-Coach. Beantworte ein paar
                  Fragen und ich erstelle dir eine maßgeschneiderte Roadmap.
                </CardDescription>
              </div>
              <div
                className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: "300ms" }}
              >
                <Button
                  size="lg"
                  variant="gradient"
                  onClick={handleNext}
                  className="text-lg px-8 py-6"
                >
                  Los geht's
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {step === 2 && (
            <div
              className={`space-y-6 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0 animate-in fade-in slide-in-from-right-4"}`}
            >
              <div className="animate-in fade-in duration-300">
                <CardTitle className="mb-2">
                  Erzähl mir von deinem Business
                </CardTitle>
                <CardDescription>
                  Diese Informationen helfen mir, dir die besten Empfehlungen zu
                  geben.
                </CardDescription>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="industry">
                    In welcher Branche bist du tätig? *
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2 mt-1">
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <Badge
                        key={opt}
                        variant={
                          formData.industry === opt ? "default" : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/90 transition-colors"
                        onClick={() => togglePill("industry", opt)}
                      >
                        {opt}
                      </Badge>
                    ))}
                  </div>
                  <Input
                    id="industry"
                    placeholder="Oder eigene Eingabe..."
                    value={formData.industry}
                    onChange={(e) => updateFormData("industry", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="companySize">
                    Wie groß ist dein Unternehmen? *
                  </Label>
                  <Input
                    id="companySize"
                    placeholder="z.B. 1-5 Mitarbeiter, 10-50 Mitarbeiter..."
                    value={formData.companySize}
                    onChange={(e) =>
                      updateFormData("companySize", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">
                    Wer ist deine Zielgruppe? *
                  </Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="z.B. KMU-Inhaber, Tech-Startups, B2C-Konsumenten..."
                    value={formData.targetAudience}
                    onChange={(e) =>
                      updateFormData("targetAudience", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="products">
                    Was sind deine wichtigsten Angebote/Produkte?
                  </Label>
                  <Textarea
                    id="products"
                    placeholder="z.B. Online-Kurse, SaaS-Produkt, Beratungsdienstleistungen..."
                    value={formData.products}
                    onChange={(e) => updateFormData("products", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="marketingChannels">
                    Welche Marketingkanäle nutzt du bereits?
                  </Label>
                  <Input
                    id="marketingChannels"
                    placeholder="z.B. Social Media, SEO, E-Mail-Marketing..."
                    value={formData.marketingChannels}
                    onChange={(e) =>
                      updateFormData("marketingChannels", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyBudget">
                    Wie viel Budget hast du pro Monat für Marketing?
                  </Label>
                  <Input
                    id="monthlyBudget"
                    placeholder="z.B. 500€, 2000€, 10.000€..."
                    value={formData.monthlyBudget}
                    onChange={(e) =>
                      updateFormData("monthlyBudget", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">
                    Was sind deine größten Marketing-Herausforderungen?
                  </Label>
                  <Textarea
                    id="challenges"
                    placeholder="z.B. Zeitmangel, fehlende Strategie, zu wenig Leads..."
                    value={formData.challenges}
                    onChange={(e) =>
                      updateFormData("challenges", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="mainGoals">
                    Was sind deine 1-3 wichtigsten Ziele? *
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2 mt-1">
                    {GOAL_OPTIONS.map((opt) => (
                      <Badge
                        key={opt}
                        variant={
                          formData.mainGoals.includes(opt)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/90 transition-colors"
                        onClick={() => {
                          // Multi-select logic for goals
                          const current = formData.mainGoals;
                          if (current.includes(opt)) {
                            // Remove
                            updateFormData(
                              "mainGoals",
                              current
                                .replace(opt, "")
                                .replace(", ,", ",")
                                .replace(/^, /, "")
                                .replace(/, $/, ""),
                            );
                          } else {
                            // Add
                            updateFormData(
                              "mainGoals",
                              current ? `${current}, ${opt}` : opt,
                            );
                          }
                        }}
                      >
                        {opt}
                      </Badge>
                    ))}
                  </div>
                  <Textarea
                    id="mainGoals"
                    placeholder="z.B. Mehr Leads generieren, Marke stärken, Umsatz steigern..."
                    value={formData.mainGoals}
                    onChange={(e) =>
                      updateFormData("mainGoals", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || loading}
                >
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
            <div
              className={`space-y-6 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0 animate-in fade-in slide-in-from-right-4"}`}
            >
              <div className="animate-in fade-in duration-300">
                <CardTitle className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#FF6B9D]" />
                  Dein Business in Kurzform
                </CardTitle>
                <CardDescription>
                  Basierend auf deinen Antworten habe ich folgende
                  Zusammenfassung erstellt:
                </CardDescription>
              </div>

              <Card
                className="bg-muted/50 border-[#FF6B9D]/20 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: "150ms" }}
              >
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
            <div
              className={`space-y-6 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0 animate-in fade-in slide-in-from-right-4"}`}
            >
              <div className="animate-in fade-in duration-300">
                <CardTitle className="mb-2 flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-[#FF6B9D]" />
                  Deine SMART-Ziele
                </CardTitle>
                <CardDescription>
                  Ich habe dir konkrete, messbare Ziele vorgeschlagen:
                </CardDescription>
                {/* SMART Explanation for users who don't know the framework */}
                <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground">
                  <strong className="text-foreground">Was ist SMART?</strong>{" "}
                  Ein bewährtes Framework für Zielsetzung:
                  <span className="text-[#FF6B9D]"> S</span>pezifisch,
                  <span className="text-[#FF6B9D]"> M</span>essbar,
                  <span className="text-[#FF6B9D]"> A</span>ttraktiv/Erreichbar,
                  <span className="text-[#FF6B9D]"> R</span>elevant,
                  <span className="text-[#FF6B9D]"> T</span>erminiert
                </div>
              </div>

              <div className="space-y-4">
                {smartGoals.map((goal, index) => (
                  <Card
                    key={index}
                    className={`border-border/50 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 ${editingGoalIndex === index ? "ring-2 ring-[#FF6B9D]/50 border-[#FF6B9D]" : "hover:border-[#FF6B9D]/30"}`}
                    style={{ animationDelay: `${150 + index * 100}ms` }}
                  >
                    <CardHeader className="relative">
                      <div className="absolute top-4 right-4 flex gap-2">
                        {editingGoalIndex === index ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingGoalIndex(null)}
                            className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Speichern
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingGoalIndex(index)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {editingGoalIndex === index ? (
                        <div className="space-y-3 pr-12">
                          <div>
                            <Label
                              htmlFor={`goal-title-${index}`}
                              className="text-xs text-muted-foreground"
                            >
                              Titel
                            </Label>
                            <Input
                              id={`goal-title-${index}`}
                              value={goal.title}
                              onChange={(e) =>
                                updateGoal(index, "title", e.target.value)
                              }
                              className="font-bold text-lg"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`goal-desc-${index}`}
                              className="text-xs text-muted-foreground"
                            >
                              Beschreibung
                            </Label>
                            <Textarea
                              id={`goal-desc-${index}`}
                              value={goal.description}
                              onChange={(e) =>
                                updateGoal(index, "description", e.target.value)
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <CardTitle className="text-lg flex items-center gap-2 pr-10">
                            <Badge className="bg-gradient-to-r from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] text-white border-0 shrink-0">
                              {index + 1}
                            </Badge>
                            {goal.title}
                          </CardTitle>
                          <CardDescription className="pr-10">
                            {goal.description}
                          </CardDescription>
                        </>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {editingGoalIndex === index ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <Label
                              htmlFor={`goal-s-${index}`}
                              className="text-xs"
                            >
                              Spezifisch
                            </Label>
                            <Input
                              id={`goal-s-${index}`}
                              value={goal.specific}
                              onChange={(e) =>
                                updateGoal(index, "specific", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label
                              htmlFor={`goal-m-${index}`}
                              className="text-xs"
                            >
                              Messbar
                            </Label>
                            <Input
                              id={`goal-m-${index}`}
                              value={goal.measurable}
                              onChange={(e) =>
                                updateGoal(index, "measurable", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label
                              htmlFor={`goal-a-${index}`}
                              className="text-xs"
                            >
                              Attraktiv
                            </Label>
                            <Input
                              id={`goal-a-${index}`}
                              value={goal.achievable}
                              onChange={(e) =>
                                updateGoal(index, "achievable", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label
                              htmlFor={`goal-r-${index}`}
                              className="text-xs"
                            >
                              Relevant
                            </Label>
                            <Input
                              id={`goal-r-${index}`}
                              value={goal.relevant}
                              onChange={(e) =>
                                updateGoal(index, "relevant", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <Label
                              htmlFor={`goal-t-${index}`}
                              className="text-xs"
                            >
                              Terminiert
                            </Label>
                            <Input
                              id={`goal-t-${index}`}
                              value={goal.timeBound}
                              onChange={(e) =>
                                updateGoal(index, "timeBound", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
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
            <div
              className={`text-center space-y-8 py-8 transition-all duration-300 ${isTransitioning ? "opacity-0" : "opacity-100 animate-in fade-in"}`}
            >
              <div className="relative inline-block animate-in zoom-in duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-2xl opacity-40 animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
              </div>
              <div
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: "200ms" }}
              >
                <CardTitle className="text-2xl md:text-3xl mb-4">
                  Perfekt! Du bist startklar. 🚀
                </CardTitle>
                <CardDescription className="text-base md:text-lg max-w-xl mx-auto">
                  Deine Ziele sind gespeichert und dein Dashboard ist bereit.
                  Lass uns dein Marketing auf das nächste Level bringen!
                </CardDescription>
              </div>
              <div
                className="flex flex-col sm:flex-row justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: "400ms" }}
              >
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
        </CardContent>
      </Card>
    </div>
  );
}
