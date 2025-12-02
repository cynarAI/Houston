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
import { ArrowRight, ArrowLeft, Check, Rocket, Target, Users, Building2 } from "lucide-react";
import { useLocation } from "wouter";

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingWizard({ open, onClose }: OnboardingWizardProps) {
  const { i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
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
  const utils = trpc.useUtils();

  const lang = i18n.language === "de" ? "de" : "en";

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

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

    if (step === 1) {
      data.companyName = companyName;
      data.industry = industry;
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
      setLocation("/app/dashboard");
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] glass border-white/20 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
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

              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">
                    {lang === "de" ? "Unternehmensname" : "Company Name"}
                  </Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={lang === "de" ? "z.B. Acme GmbH" : "e.g. Acme Inc."}
                  />
                </div>

                <div>
                  <Label htmlFor="industry">
                    {lang === "de" ? "Branche" : "Industry"}
                  </Label>
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder={lang === "de" ? "z.B. E-Commerce, SaaS, Beratung" : "e.g. E-Commerce, SaaS, Consulting"}
                  />
                </div>

                <div>
                  <Label htmlFor="companySize">
                    {lang === "de" ? "Unternehmensgröße" : "Company Size"}
                  </Label>
                  <Select value={companySize} onValueChange={(v: any) => setCompanySize(v)}>
                    <SelectTrigger id="companySize">
                      <SelectValue placeholder={lang === "de" ? "Wähle eine Größe" : "Select a size"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 {lang === "de" ? "Mitarbeiter" : "employees"}</SelectItem>
                      <SelectItem value="11-50">11-50 {lang === "de" ? "Mitarbeiter" : "employees"}</SelectItem>
                      <SelectItem value="51-200">51-200 {lang === "de" ? "Mitarbeiter" : "employees"}</SelectItem>
                      <SelectItem value="201-1000">201-1000 {lang === "de" ? "Mitarbeiter" : "employees"}</SelectItem>
                      <SelectItem value="1000+">1000+ {lang === "de" ? "Mitarbeiter" : "employees"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website">
                    {lang === "de" ? "Website (optional)" : "Website (optional)"}
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                  />
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

              <div className="space-y-4">
                <div>
                  <Label htmlFor="primaryGoal">
                    {lang === "de" ? "Hauptziel" : "Primary Goal"}
                  </Label>
                  <Select value={primaryGoal} onValueChange={(v: any) => setPrimaryGoal(v)}>
                    <SelectTrigger id="primaryGoal">
                      <SelectValue placeholder={lang === "de" ? "Wähle dein Hauptziel" : "Select your primary goal"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brand_awareness">
                        {lang === "de" ? "Markenbekanntheit steigern" : "Increase Brand Awareness"}
                      </SelectItem>
                      <SelectItem value="lead_generation">
                        {lang === "de" ? "Leads generieren" : "Generate Leads"}
                      </SelectItem>
                      <SelectItem value="sales_conversion">
                        {lang === "de" ? "Verkäufe steigern" : "Increase Sales"}
                      </SelectItem>
                      <SelectItem value="customer_retention">
                        {lang === "de" ? "Kunden binden" : "Retain Customers"}
                      </SelectItem>
                      <SelectItem value="market_expansion">
                        {lang === "de" ? "Markt erweitern" : "Expand Market"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>
                    {lang === "de" ? "Weitere Ziele (optional)" : "Additional Goals (optional)"}
                  </Label>
                  <div className="space-y-2 mt-2">
                    {["brand_awareness", "lead_generation", "sales_conversion", "customer_retention", "market_expansion"]
                      .filter(g => g !== primaryGoal)
                      .map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox
                            id={goal}
                            checked={secondaryGoals.includes(goal)}
                            onCheckedChange={() => toggleSecondaryGoal(goal)}
                          />
                          <label htmlFor={goal} className="text-sm cursor-pointer">
                            {goal === "brand_awareness" && (lang === "de" ? "Markenbekanntheit" : "Brand Awareness")}
                            {goal === "lead_generation" && (lang === "de" ? "Lead-Generierung" : "Lead Generation")}
                            {goal === "sales_conversion" && (lang === "de" ? "Verkaufsabschlüsse" : "Sales Conversion")}
                            {goal === "customer_retention" && (lang === "de" ? "Kundenbindung" : "Customer Retention")}
                            {goal === "market_expansion" && (lang === "de" ? "Markterweiterung" : "Market Expansion")}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="monthlyBudget">
                    {lang === "de" ? "Monatliches Marketing-Budget" : "Monthly Marketing Budget"}
                  </Label>
                  <Select value={monthlyBudget} onValueChange={(v: any) => setMonthlyBudget(v)}>
                    <SelectTrigger id="monthlyBudget">
                      <SelectValue placeholder={lang === "de" ? "Wähle dein Budget" : "Select your budget"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1000">&lt; €1,000</SelectItem>
                      <SelectItem value="1000-5000">€1,000 - €5,000</SelectItem>
                      <SelectItem value="5000-10000">€5,000 - €10,000</SelectItem>
                      <SelectItem value="10000-50000">€10,000 - €50,000</SelectItem>
                      <SelectItem value="50000+">€50,000+</SelectItem>
                    </SelectContent>
                  </Select>
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

              <div className="space-y-4">
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
                  />
                </div>

                <div>
                  <Label>
                    {lang === "de" ? "Bevorzugte Marketing-Kanäle" : "Preferred Marketing Channels"}
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["LinkedIn", "Facebook", "Instagram", "Google Ads", "Email", "SEO", "Content Marketing", "Events"].map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox
                          id={`channel-${channel}`}
                          checked={channels.includes(channel)}
                          onCheckedChange={() => toggleChannel(channel)}
                        />
                        <label htmlFor={`channel-${channel}`} className="text-sm cursor-pointer">
                          {channel}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>
                    {lang === "de" ? "Aktuelle Herausforderungen" : "Current Challenges"}
                  </Label>
                  <div className="space-y-2 mt-2">
                    {[
                      lang === "de" ? "Budget-Limitierungen" : "Budget limitations",
                      lang === "de" ? "Fehlende Ressourcen" : "Lack of resources",
                      lang === "de" ? "Unklare Strategie" : "Unclear strategy",
                      lang === "de" ? "Geringe Conversion-Rate" : "Low conversion rate",
                      lang === "de" ? "Schwache Online-Präsenz" : "Weak online presence",
                    ].map((challenge) => (
                      <div key={challenge} className="flex items-center space-x-2">
                        <Checkbox
                          id={`challenge-${challenge}`}
                          checked={currentChallenges.includes(challenge)}
                          onCheckedChange={() => toggleChallenge(challenge)}
                        />
                        <label htmlFor={`challenge-${challenge}`} className="text-sm cursor-pointer">
                          {challenge}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
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
              disabled={isLoading}
              className="bg-gradient-to-r from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] hover:opacity-90"
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
