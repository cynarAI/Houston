import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Rocket, 
  Target, 
  Users, 
  Building2, 
  Store, 
  ShoppingBag, 
  GraduationCap, 
  Laptop, 
  Briefcase, 
  Video,
  Megaphone,
  DollarSign,
  BarChart3,
  HeartHandshake,
  Globe2,
  Sparkles
} from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
}

interface SelectionCardProps {
  selected: boolean;
  onClick: () => void;
  icon: any;
  title: string;
  description?: string;
}

const SelectionCard = ({ selected, onClick, icon: Icon, title, description }: SelectionCardProps) => (
  <div
    onClick={onClick}
    className={cn(
      "cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 h-full",
      selected
        ? "border-[var(--color-gradient-pink)] bg-[var(--color-gradient-pink)]/10"
        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
    )}
  >
    <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", selected ? "text-[var(--color-gradient-pink)]" : "text-muted-foreground")} />
    <div>
      <div className={cn("font-semibold text-sm", selected ? "text-foreground" : "text-foreground/90")}>{title}</div>
      {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
    </div>
  </div>
);

export function OnboardingWizard({ open, onClose }: OnboardingWizardProps) {
  const { i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [companySize, setCompanySize] = useState<"1-10" | "11-50" | "51-200" | "201-1000" | "1000+" | "">("");
  const [website, setWebsite] = useState("");

  const [primaryGoal, setPrimaryGoal] = useState<"brand_awareness" | "lead_generation" | "sales_conversion" | "customer_retention" | "market_expansion" | "">("");
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<"<1000" | "1000-5000" | "5000-10000" | "10000-50000" | "50000+" | "">("");

  const [demographics, setDemographics] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [channels, setChannels] = useState<string[]>([]);
  const [currentChallenges, setCurrentChallenges] = useState<string[]>([]);

  const saveDataMutation = trpc.onboarding.saveUserOnboardingData.useMutation();
  const skipMutation = trpc.onboarding.skipUserOnboarding.useMutation();
  const scanWebsiteMutation = trpc.onboarding.scanWebsite.useMutation();
  const utils = trpc.useUtils();

  const lang = i18n.language === "de" ? "de" : "en";

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleAnalyzeWebsite = async () => {
    if (!website) return;
    
    setIsLoading(true);
    try {
      const result = await scanWebsiteMutation.mutateAsync({
        url: website,
        language: lang,
      });

      if (result.companyName) setCompanyName(result.companyName);
      if (result.companySize) setCompanySize(result.companySize as any);
      if (result.industry) {
        if (["Coaching", "Local Business", "E-Commerce", "Agency", "SaaS", "Creator"].includes(result.industry)) {
          setIndustry(result.industry);
        } else {
          setIndustry("Other");
          setCustomIndustry(result.customIndustry || result.industry);
        }
      }
      if (result.targetAudience) {
        if (result.targetAudience.demographics) setDemographics(result.targetAudience.demographics);
        if (result.targetAudience.painPoints) setPainPoints(result.targetAudience.painPoints);
      }
    } catch (error) {
      console.error("Failed to analyze website:", error);
      // We could show a toast here, but for now just fail silently/log
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      // Save current step data
      await saveCurrentStep();
      setStep(step + 1);
    } else {
      // Final step - complete onboarding
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await skipMutation.mutateAsync();
      await utils.onboarding.getUserOnboardingStatus.invalidate();
      onClose();
      setLocation("/app/dashboard");
    } catch (error) {
      console.error("Skip onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentStep = async () => {
    const data: any = {};
    const finalIndustry = industry === "Other" ? customIndustry : industry;

    if (step === 1) {
      data.companyName = companyName;
      data.industry = finalIndustry;
      data.companySize = companySize;
      data.website = website;
    } else if (step === 2) {
      data.primaryGoal = primaryGoal;
      data.secondaryGoals = secondaryGoals;
      data.monthlyBudget = monthlyBudget;
    } else if (step === 3) {
      data.targetAudience = {
        demographics,
        painPoints,
        channels,
      };
      data.currentChallenges = currentChallenges;
    }

    await saveDataMutation.mutateAsync(data);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await saveDataMutation.mutateAsync({
        targetAudience: {
          demographics,
          painPoints,
          channels,
        },
        currentChallenges,
        completed: true,
      });
      await utils.onboarding.getUserOnboardingStatus.invalidate();
      onClose();
      // Navigate directly to chat with a personalized welcome prompt
      // Houston will greet them and suggest first steps based on their profile
      const finalIndustry = industry === "Other" ? customIndustry : industry;
      const welcomePrompt = `Hey Houston! Ich bin ${companyName ? `von ${companyName}` : 'neu hier'} (${finalIndustry}) und hab gerade mein Profil ausgefüllt. Was ist der beste erste Schritt für mein Marketing?`;
      setLocation(`/app/chats?prompt=${encodeURIComponent(welcomePrompt)}`);
    } catch (error) {
      console.error("Complete onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSecondaryGoal = (goal: string) => {
    if (secondaryGoals.includes(goal)) {
      setSecondaryGoals(secondaryGoals.filter(g => g !== goal));
    } else {
      setSecondaryGoals([...secondaryGoals, goal]);
    }
  };

  const toggleChannel = (channel: string) => {
    if (channels.includes(channel)) {
      setChannels(channels.filter(c => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const toggleChallenge = (challenge: string) => {
    if (currentChallenges.includes(challenge)) {
      setCurrentChallenges(currentChallenges.filter(c => c !== challenge));
    } else {
      setCurrentChallenges([...currentChallenges, challenge]);
    }
  };

  const industries = [
    { id: "Coaching", icon: GraduationCap, label_de: "Coach / Berater", label_en: "Coach / Consultant" },
    { id: "Local Business", icon: Store, label_de: "Lokales Geschäft", label_en: "Local Business" },
    { id: "E-Commerce", icon: ShoppingBag, label_de: "Online Shop", label_en: "E-Commerce" },
    { id: "Agency", icon: Briefcase, label_de: "Agentur", label_en: "Agency" },
    { id: "SaaS", icon: Laptop, label_de: "Software / SaaS", label_en: "Software / SaaS" },
    { id: "Creator", icon: Video, label_de: "Content Creator", label_en: "Content Creator" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] glass border-white/20 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="h-6 w-6 text-[var(--color-gradient-pink)]" />
            {lang === "de" ? "Willkommen bei Houston!" : "Welcome to Houston!"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {lang === "de" 
              ? "Lass uns dein Marketing-Profil erstellen, damit Houston dich optimal unterstützen kann." 
              : "Let's create your marketing profile so Houston can support you optimally."}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{lang === "de" ? `Schritt ${step} von ${totalSteps}` : `Step ${step} of ${totalSteps}`}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="py-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-[var(--color-gradient-orange)]" />
                <div>
                  <h3 className="text-xl font-semibold">
                    {lang === "de" ? "Über dein Unternehmen" : "About Your Company"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "de" ? "Erzähl uns mehr über dein Business" : "Tell us more about your business"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">
                    {lang === "de" ? "In welcher Branche bist du tätig?" : "What is your industry?"}
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {industries.map((ind) => (
                      <SelectionCard
                        key={ind.id}
                        selected={industry === ind.id}
                        onClick={() => setIndustry(ind.id)}
                        icon={ind.icon}
                        title={lang === "de" ? ind.label_de : ind.label_en}
                      />
                    ))}
                    <SelectionCard
                      selected={industry === "Other"}
                      onClick={() => setIndustry("Other")}
                      icon={Target}
                      title={lang === "de" ? "Andere" : "Other"}
                    />
                  </div>
                  {industry === "Other" && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                      <Input
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        placeholder={lang === "de" ? "Bitte spezifizieren..." : "Please specify..."}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">
                    {lang === "de" ? "Unternehmensname" : "Company Name"}
                  </Label>
                  <Input
                    id="companyName"
                      className="mt-1.5"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={lang === "de" ? "z.B. Acme GmbH" : "e.g. Acme Inc."}
                  />
                </div>
                <div>
                  <Label htmlFor="website">
                    {lang === "de" ? "Website (optional)" : "Website (optional)"}
                  </Label>
                    <div className="flex gap-2 mt-1.5">
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                  />
                      {website && (
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          onClick={handleAnalyzeWebsite}
                          disabled={isLoading}
                          className="shrink-0 bg-[var(--color-gradient-purple)]/10 text-[var(--color-gradient-purple)] hover:bg-[var(--color-gradient-purple)]/20 border border-[var(--color-gradient-purple)]/20"
                          title={lang === "de" ? "Automatisch ausfüllen" : "Auto-fill from website"}
                        >
                          {isLoading ? (
                            <Rocket className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">
                    {lang === "de" ? "Unternehmensgröße" : "Company Size"}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {["1-10", "11-50", "51-200", "201-1000", "1000+"].map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={companySize === size ? "default" : "outline"}
                        onClick={() => setCompanySize(size as any)}
                        className={cn(
                          companySize === size 
                            ? "bg-[var(--color-gradient-orange)] hover:bg-[var(--color-gradient-orange)]/90" 
                            : "border-white/10 hover:bg-white/5"
                        )}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-[var(--color-gradient-purple)]" />
                <div>
                  <h3 className="text-xl font-semibold">
                    {lang === "de" ? "Deine Marketing-Ziele" : "Your Marketing Goals"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "de" ? "Was möchtest du erreichen?" : "What do you want to achieve?"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">
                    {lang === "de" ? "Was ist dein Hauptziel?" : "What is your primary goal?"}
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SelectionCard
                      selected={primaryGoal === "brand_awareness"}
                      onClick={() => setPrimaryGoal("brand_awareness")}
                      icon={Megaphone}
                      title={lang === "de" ? "Bekanntheit steigern" : "Increase Brand Awareness"}
                      description={lang === "de" ? "Mehr Sichtbarkeit für deine Marke" : "More visibility for your brand"}
                    />
                    <SelectionCard
                      selected={primaryGoal === "lead_generation"}
                      onClick={() => setPrimaryGoal("lead_generation")}
                      icon={Users}
                      title={lang === "de" ? "Leads generieren" : "Generate Leads"}
                      description={lang === "de" ? "Mehr potenzielle Kunden gewinnen" : "Get more potential customers"}
                    />
                    <SelectionCard
                      selected={primaryGoal === "sales_conversion"}
                      onClick={() => setPrimaryGoal("sales_conversion")}
                      icon={DollarSign}
                      title={lang === "de" ? "Umsatz steigern" : "Increase Sales"}
                      description={lang === "de" ? "Mehr Verkäufe & Abschlüsse" : "More sales & deals"}
                    />
                    <SelectionCard
                      selected={primaryGoal === "customer_retention"}
                      onClick={() => setPrimaryGoal("customer_retention")}
                      icon={HeartHandshake}
                      title={lang === "de" ? "Kunden binden" : "Retain Customers"}
                      description={lang === "de" ? "Bestandskunden glücklich machen" : "Make existing customers happy"}
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">
                    {lang === "de" ? "Monatliches Marketing-Budget" : "Monthly Marketing Budget"}
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {["<1000", "1000-5000", "5000-10000", "10000-50000", "50000+"].map((budget) => (
                      <Button
                        key={budget}
                        type="button"
                        variant={monthlyBudget === budget ? "default" : "outline"}
                        onClick={() => setMonthlyBudget(budget as any)}
                        className={cn(
                          "w-full",
                          monthlyBudget === budget 
                            ? "bg-[var(--color-gradient-purple)] hover:bg-[var(--color-gradient-purple)]/90" 
                            : "border-white/10 hover:bg-white/5"
                        )}
                      >
                        {budget === "<1000" ? "< €1k" : budget === "50000+" ? "> €50k" : `€${budget.replace('-', 'k-')}k`}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-[var(--color-gradient-blue)]" />
                <div>
                  <h3 className="text-xl font-semibold">
                    {lang === "de" ? "Deine Zielgruppe" : "Your Target Audience"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "de" ? "Wen möchtest du erreichen?" : "Who do you want to reach?"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="demographics">
                    {lang === "de" ? "Demografie & Zielgruppe" : "Demographics & Target Audience"}
                  </Label>
                  <Textarea
                    id="demographics"
                    value={demographics}
                    onChange={(e) => setDemographics(e.target.value)}
                    placeholder={lang === "de" 
                      ? "z.B. B2B Entscheider, 35-55 Jahre, DACH-Region" 
                      : "e.g. B2B decision makers, 35-55 years, DACH region"}
                    rows={3}
                    className="bg-white/5 border-white/10 mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="painPoints">
                    {lang === "de" ? "Pain Points deiner Zielgruppe" : "Target Audience Pain Points"}
                  </Label>
                  <Textarea
                    id="painPoints"
                    value={painPoints}
                    onChange={(e) => setPainPoints(e.target.value)}
                    placeholder={lang === "de" 
                      ? "z.B. Zeitdruck, hohe Kosten, fehlende Expertise" 
                      : "e.g. Time pressure, high costs, lack of expertise"}
                    rows={3}
                    className="bg-white/5 border-white/10 mt-1.5"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">
                    {lang === "de" ? "Bevorzugte Marketing-Kanäle" : "Preferred Marketing Channels"}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {["LinkedIn", "Facebook", "Instagram", "TikTok", "Google Ads", "Email", "SEO", "Content", "Events"].map((channel) => (
                      <Button
                        key={channel}
                        type="button"
                        size="sm"
                        variant={channels.includes(channel) ? "secondary" : "outline"}
                        onClick={() => toggleChannel(channel)}
                        className={cn(
                          channels.includes(channel)
                            ? "bg-[var(--color-gradient-blue)] text-white hover:bg-[var(--color-gradient-blue)]/80 border-transparent"
                            : "border-white/10 hover:bg-white/5 text-muted-foreground"
                        )}
                      >
                          {channel}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">
                    {lang === "de" ? "Aktuelle Herausforderungen" : "Current Challenges"}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      lang === "de" ? "Budget-Limitierungen" : "Budget limitations",
                      lang === "de" ? "Fehlende Ressourcen" : "Lack of resources",
                      lang === "de" ? "Unklare Strategie" : "Unclear strategy",
                      lang === "de" ? "Geringe Conversion" : "Low conversion",
                      lang === "de" ? "Wenig Sichtbarkeit" : "Low visibility",
                    ].map((challenge) => (
                      <Button
                        key={challenge}
                        type="button"
                        size="sm"
                        variant={currentChallenges.includes(challenge) ? "secondary" : "outline"}
                        onClick={() => toggleChallenge(challenge)}
                        className={cn(
                          currentChallenges.includes(challenge)
                            ? "bg-red-500/20 text-white border-red-500/50 hover:bg-red-500/30"
                            : "border-white/10 hover:bg-white/5 text-muted-foreground"
                        )}
                      >
                          {challenge}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isLoading}
          >
            {lang === "de" ? "Überspringen" : "Skip"}
          </Button>

          <div className="flex gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {lang === "de" ? "Zurück" : "Back"}
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isLoading || (step === 1 && !industry) || (step === 2 && !primaryGoal)}
              className="bg-gradient-to-r from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] hover:opacity-90 text-white border-0"
            >
              {step === totalSteps ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {lang === "de" ? "Fertig" : "Complete"}
                </>
              ) : (
                <>
                  {lang === "de" ? "Weiter" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
