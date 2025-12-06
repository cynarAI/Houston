import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { SpaceBackground } from "@/components/SpaceBackground";
import { useTheme } from "@/contexts/ThemeContext";
import { getLoginUrl } from "@/const";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  CheckCircle2,
  Lightbulb,
  Menu,
  MessageCircle,
  Mic,
  Moon,
  Play,
  Shield,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";

type PersonaKey = "solo" | "agency" | "local";

const workflowIcons = [MessageCircle, Lightbulb, Zap, TrendingUp];
const toArray = <T,>(value: unknown): T[] =>
  Array.isArray(value) ? value : [];
const toRecord = <T extends object>(value: unknown): Partial<T> =>
  value && typeof value === "object" ? (value as Partial<T>) : {};

export default function Landing() {
  const { isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme, switchable } = useTheme();
  const [, setLocation] = useLocation();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaKey>("solo");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [demoConversation, setDemoConversation] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/app/dashboard");
    }
  }, [loading, isAuthenticated, setLocation]);

  useEffect(() => {
    const demo = toRecord<
      Record<PersonaKey, { role: "user" | "ai"; text: string }[]>
    >(
      t("landing.hero.demo", {
        returnObjects: true,
      }),
    );
    if (demo?.[selectedPersona]) {
      setDemoConversation(demo[selectedPersona]);
    } else {
      setDemoConversation([]);
    }
  }, [selectedPersona, t]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navItems = [
    { href: "#how", label: t("landing.nav.howItWorks") },
    { href: "#outcomes", label: t("landing.nav.features") },
    { href: "#personas", label: t("landing.nav.personas") },
    { href: "#credits", label: t("landing.nav.credits") },
    { href: "#pricing", label: t("landing.nav.pricing") },
    { href: "#faq", label: t("landing.nav.faq") },
  ];

  const personaCards = useMemo(() => {
    const raw = toRecord<
      Record<
        PersonaKey,
        { label: string; headline: string; payoff: string; proof: string }
      >
    >(t("landing.hero.personas", { returnObjects: true }));
    return raw as Record<
      PersonaKey,
      { label: string; headline: string; payoff: string; proof: string }
    >;
  }, [t]);

  const promptGallery = useMemo(
    () =>
      toArray<{ label: string; prompt: string; persona: PersonaKey }>(
        t("landing.hero.prompts.items", {
          returnObjects: true,
        }),
      ),
    [t],
  );

  const dailyFocus = useMemo(
    () =>
      toArray<string>(
        t("landing.hero.dailyFocus.items", { returnObjects: true }),
      ),
    [t],
  );

  const outcomes = useMemo(
    () =>
      toArray<{ title: string; description: string; icon: string }>(
        t("landing.outcomes.cards", {
          returnObjects: true,
        }),
      ),
    [t],
  );

  const workflowSteps = useMemo(
    () =>
      [1, 2, 3, 4].map((index) => ({
        title: t(`landing.howItWorks.step${index}.title` as const),
        description: t(`landing.howItWorks.step${index}.description` as const),
        icon: workflowIcons[index - 1],
        step: `0${index}`,
      })),
    [t],
  );

  const personaStories = useMemo(
    () => [
      {
        image: "/images/new/feature-goals.png",
        title: t("landing.forWhom.persona1.title"),
        description: t("landing.forWhom.persona1.description"),
        highlight: t("landing.storyHighlights.persona1"),
      },
      {
        image: "/images/new/feature-chat.png",
        title: t("landing.forWhom.persona2.title"),
        description: t("landing.forWhom.persona2.description"),
        highlight: t("landing.storyHighlights.persona2"),
      },
      {
        image: "/images/new/feature-analytics.png",
        title: t("landing.forWhom.persona3.title"),
        description: t("landing.forWhom.persona3.description"),
        highlight: t("landing.storyHighlights.persona3"),
      },
    ],
    [t],
  );

  const screenshotCards = useMemo(
    () => [
      {
        image: "/images/new/feature-goals.png",
        title: t("landing.screenshots.dashboard.title"),
        description: t("landing.screenshots.dashboard.description"),
        alt: t("landing.screenshots.dashboard.alt"),
      },
      {
        image: "/images/new/feature-analytics.png",
        title: t("landing.screenshots.goals.title"),
        description: t("landing.screenshots.goals.description"),
        alt: t("landing.screenshots.goals.alt"),
      },
      {
        image: "/images/new/feature-chat.png",
        title: t("landing.screenshots.chat.title"),
        description: t("landing.screenshots.chat.description"),
        alt: t("landing.screenshots.chat.alt"),
      },
    ],
    [t],
  );

  const stats = useMemo(
    () => [
      { value: "10K+", label: t("landing.stats.activeUsers") },
      { value: "50K+", label: t("landing.stats.marketingGoals") },
      { value: "95%", label: t("landing.stats.successRate") },
      { value: "24/7", label: t("landing.stats.aiSupport") },
    ],
    [t],
  );

  const faqKeys = [
    "whatIs",
    "vsChatGPT",
    "credits",
    "whoIsItFor",
    "security",
    "cancel",
    "technical",
  ] as const;

  const trustLabels = toArray<string>(
    t("landing.trustline.labels", {
      returnObjects: true,
    }),
  );

  const handlePrompt = (prompt: string, persona: PersonaKey) => {
    setSelectedPersona(persona);
    const demo = toRecord<
      Record<PersonaKey, { role: "user" | "ai"; text: string }[]>
    >(
      t("landing.hero.demo", {
        returnObjects: true,
      }),
    );
    if (demo?.[persona]) {
      setDemoConversation([{ role: "user", text: prompt }, ...demo[persona]]);
    } else {
      setDemoConversation([{ role: "user", text: prompt }]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <ExitIntentPopup />
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(147,197,253,0.18),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,7,100,0.45),_transparent_65%)]" />
        <SpaceBackground />
      </div>

      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <nav
          className="container-premium mx-auto"
          aria-label={t("landing.nav.features")}
        >
          <div className="flex items-center justify-between h-16 px-4 md:px-0">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-lg">Houston</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                by AIstronaut
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div
                className="flex gap-1"
                role="group"
                aria-label="Language switcher"
              >
                {["de", "en"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    aria-pressed={i18n.language === lang}
                    className={`px-2 py-1 rounded text-xs uppercase tracking-wide transition-colors ${
                      i18n.language === lang
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {switchable && (
                <button
                  onClick={() => toggleTheme?.()}
                  className="p-2 rounded-full border border-border hover:border-foreground transition-colors"
                  aria-label={t("landing.nav.themeToggle")}
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </button>
              )}

              {isAuthenticated ? (
                <Link href="/app/dashboard">
                  <Button variant="gradient" size="sm">
                    {t("landing.nav.dashboard")}
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button variant="gradient" size="sm">
                    {t("landing.hero.cta.start")}
                  </Button>
                </a>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg border border-border min-h-[44px] min-w-[44px]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/60 py-4 px-4 space-y-4 mobile-menu">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-base text-muted-foreground hover:text-foreground py-2 mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div className="flex gap-2 pt-4">
                {["de", "en"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      changeLanguage(lang);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 px-3 py-2 rounded border min-h-[44px] ${
                      i18n.language === lang
                        ? "border-foreground text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {switchable && (
                <button
                  onClick={() => {
                    toggleTheme?.();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-border py-2 min-h-[44px]"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>{t("landing.nav.themeToggle")}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>{t("landing.nav.themeToggle")}</span>
                    </>
                  )}
                </button>
              )}

              {isAuthenticated ? (
                <Link href="/app/dashboard" className="block">
                  <Button variant="gradient" className="w-full cta-button">
                    {t("landing.nav.dashboard")}
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()} className="block">
                  <Button variant="gradient" className="w-full cta-button">
                    {t("landing.hero.cta.start")}
                  </Button>
                </a>
              )}
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="landing-hero container-premium mx-auto pt-12 pb-16 md:pt-20 md:pb-24 px-4 md:px-0">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 md:p-10 shadow-2xl shadow-primary/10">
            <div className="absolute inset-0 pointer-events-none gradient-aurora" />
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 relative">
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {t("landing.hero.badge")}
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.25em] text-primary/80">
                    {t("landing.hero.tagline")}
                  </p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary">
                    {t("landing.hero.title")}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                    {t("landing.hero.subtitle")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a href={getLoginUrl()}>
                    <Button variant="gradient" size="lg" className="cta-button">
                      <Sparkles className="mr-2 h-5 w-5" />
                      {t("landing.hero.cta.start")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                  <a href="#how">
                    <Button
                      variant="outline"
                      size="lg"
                      className="min-h-[44px]"
                    >
                      {t("landing.hero.cta.learn")}
                    </Button>
                  </a>
                  <button
                    onClick={() => setVoiceEnabled((v) => !v)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                      voiceEnabled
                        ? "border-primary text-primary bg-primary/10"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                    {voiceEnabled
                      ? t("landing.hero.voice.on")
                      : t("landing.hero.voice.off")}
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t("landing.hero.personaLabel")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(personaCards) as PersonaKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPersona(key)}
                        className={`rounded-full px-4 py-2 border text-sm transition-all ${
                          selectedPersona === key
                            ? "border-primary bg-primary/10 text-foreground shadow-sm shadow-primary/20"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {personaCards[key]?.label}
                      </button>
                    ))}
                  </div>
                  {personaCards[selectedPersona] && (
                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 md:p-5 space-y-2">
                      <p className="text-primary text-sm font-semibold">
                        {personaCards[selectedPersona].headline}
                      </p>
                      <p className="text-base text-foreground font-medium">
                        {personaCards[selectedPersona].payoff}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {personaCards[selectedPersona].proof}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {trustLabels.map((label, index) => (
                    <div
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 bg-background/60"
                    >
                      <Shield className="h-4 w-4 text-primary" />
                      <span>{label}</span>
                      {index === 0 && (
                        <BadgeCheck className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-border bg-background/80 backdrop-blur shadow-xl shadow-primary/10 p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {t("landing.hero.demoTitle")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("landing.hero.demoSubtitle")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Brain className="h-4 w-4 text-primary" />
                      <span>{t("landing.hero.demoRealtime")}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
                      {demoConversation.map((turn, idx) => (
                        <div
                          key={`${turn.role}-${idx}-${turn.text.slice(0, 6)}`}
                          className={`flex ${
                            turn.role === "ai" ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
                              turn.role === "ai"
                                ? "bg-secondary/70 border border-border text-foreground"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {turn.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-muted-foreground">
                        {t("landing.hero.prompts.title")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {promptGallery.map((item) => (
                          <button
                            key={item.prompt}
                            onClick={() =>
                              handlePrompt(item.prompt, item.persona)
                            }
                            className="text-left rounded-2xl border border-border/70 px-3 py-2 text-sm bg-card/70 hover:border-primary/50 hover:shadow-primary/10 transition-all"
                          >
                            <span className="block text-foreground">
                              {item.label}
                            </span>
                            <span className="block text-muted-foreground text-xs">
                              {item.prompt}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-card/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      {t("landing.hero.dailyFocus.title")}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t("landing.hero.dailyFocus.subtitle")}
                    </p>
                    <ul className="space-y-2 text-sm">
                      {dailyFocus.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-foreground"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-sky-500/5 p-4 shadow-inner shadow-primary/10">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">
                      {t("landing.hero.liveValue.title")}
                    </p>
                    <p className="text-lg font-semibold mb-4">
                      {t("landing.hero.liveValue.headline")}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-primary" />
                        <span>{t("landing.hero.liveValue.point1")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-primary" />
                        <span>{t("landing.hero.liveValue.point2")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span>{t("landing.hero.liveValue.point3")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how"
          className="bg-muted/20 py-12 md:py-20 border-y border-border/60"
        >
          <div className="container-premium mx-auto px-4 md:px-0">
            <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
              <p className="text-sm font-semibold text-primary mb-3">
                {t("landing.howItWorks.label")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("landing.howItWorks.title")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                {t("landing.howItWorks.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {workflowSteps.map((step) => (
                <div
                  key={step.title}
                  className="relative rounded-3xl border border-border bg-card/80 p-6 md:p-8 hover:shadow-lg hover:shadow-primary/10 transition-all"
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {step.step}
                    </span>
                  </div>
                  <div className="mb-4 p-3 rounded-2xl bg-primary/10 w-fit">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section
          id="outcomes"
          className="container-premium mx-auto py-12 md:py-20 px-4 md:px-0"
        >
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold text-primary mb-3">
              {t("landing.outcomes.label")}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              {t("landing.outcomes.title")}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t("landing.outcomes.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {outcomes.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-border bg-card/80 p-6 md:p-8 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="mb-4 p-3 rounded-2xl bg-primary/10 w-fit">
                  {card.icon === "sparkles" && (
                    <Sparkles className="h-6 w-6 text-primary" />
                  )}
                  {card.icon === "target" && (
                    <Target className="h-6 w-6 text-primary" />
                  )}
                  {card.icon === "zap" && (
                    <Zap className="h-6 w-6 text-primary" />
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3">
                  {card.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Personas */}
        <section id="personas" className="py-12 md:py-20">
          <div className="container-premium mx-auto px-4 md:px-0">
            <div className="max-w-2xl mb-12">
              <p className="text-sm font-semibold text-primary mb-2">
                {t("landing.storySection.label")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("landing.storySection.title.part1")}{" "}
                {t("landing.storySection.title.highlight")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                {t("landing.storySection.subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personaStories.map((story) => (
                <div
                  key={story.title}
                  className="story-card rounded-3xl overflow-hidden border border-border bg-card shadow-primary/10 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted/30">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="400"
                      height="300"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                      {t("landing.storySection.impact")}
                    </p>
                    <p className="text-sm font-semibold text-primary mb-4">
                      {story.highlight}
                    </p>
                    <h3 className="text-xl font-semibold mb-2">
                      {story.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {story.description}
                    </p>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t("landing.storySection.tagline")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section
          id="screens"
          className="container-premium mx-auto py-12 md:py-20 px-4 md:px-0"
        >
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-14">
            <p className="text-sm font-semibold text-primary mb-3">
              {t("landing.screenshots.title.part1")}{" "}
              {t("landing.screenshots.title.highlight")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("landing.screenshots.sectionTitle")}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t("landing.screenshots.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {screenshotCards.map((card) => (
              <div
                key={card.title}
                className="screenshot-card rounded-3xl border border-border bg-card/80 overflow-hidden shadow-lg shadow-primary/10 flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-b-[2.5rem]" />
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    width="400"
                    height="300"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 text-xs uppercase tracking-[0.4em] bg-background/70 backdrop-blur rounded-full border border-white/20 text-muted-foreground">
                    {t("landing.screenshots.label")}
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Credits explained */}
        <section
          id="credits"
          className="bg-muted/15 py-12 md:py-20 border-y border-border/60"
        >
          <div className="container-premium mx-auto px-4 md:px-0">
            <div className="max-w-2xl mx-auto text-center mb-12 md:mb-14">
              <p className="text-sm font-semibold text-primary mb-3">
                {t("landing.creditsExplained.label")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {t("landing.creditsExplained.title")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                {t("landing.creditsExplained.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8">
              <div className="rounded-3xl border border-border bg-card/80 p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("landing.creditsExplained.whatAreCredits.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("landing.creditsExplained.whatAreCredits.description")}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-dashed border-primary/30 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("landing.creditsExplained.costs.chat")}
                    </p>
                    <p className="text-lg font-semibold">
                      {t("landing.creditsExplained.costs.chatCost")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-primary/30 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("landing.creditsExplained.costs.deepAnalysis")}
                    </p>
                    <p className="text-lg font-semibold">
                      {t("landing.creditsExplained.costs.deepAnalysisCost")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-primary/30 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("landing.creditsExplained.costs.aiInsights")}
                    </p>
                    <p className="text-lg font-semibold">
                      {t("landing.creditsExplained.costs.aiInsightsCost")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-primary/30 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("landing.creditsExplained.costs.strategyAnalysis")}
                    </p>
                    <p className="text-lg font-semibold">
                      {t("landing.creditsExplained.costs.strategyAnalysisCost")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-sky-500/10 p-6 md:p-8 shadow-xl shadow-primary/20">
                <h3 className="text-xl font-semibold mb-2">
                  {t("landing.creditsExplained.whatCanYouDo.title")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("landing.creditsExplained.whatCanYouDo.subtitle")}
                </p>
                <ul className="space-y-3 text-sm">
                  {[
                    "deepAnalysis",
                    "aiInsights",
                    "strategyAnalysis",
                    "pdfExports",
                  ].map((key) => (
                    <li
                      key={key}
                      className="flex items-start gap-2 text-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      {t(
                        `landing.creditsExplained.whatCanYouDo.examples.${key}` as const,
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="bg-card/60 py-12 md:py-20 border-y border-border/60"
        >
          <div className="container-premium mx-auto px-4 md:px-0">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("landing.pricing.title.part1")}{" "}
                {t("landing.pricing.title.highlight")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                {t("landing.pricing.subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["starter", "solo", "team"] as const).map((planKey) => (
                <div
                  key={planKey}
                  className={`pricing-card rounded-3xl border bg-background/80 p-6 md:p-8 flex flex-col gap-6 ${
                    planKey === "solo"
                      ? "border-primary/40 shadow-primary/20 shadow-xl"
                      : "border-border"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                      {t(`landing.pricing.${planKey}.name` as const)}
                    </p>
                    <p className="price text-3xl md:text-4xl font-bold mt-2">
                      {t(`landing.pricing.${planKey}.price` as const)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(`landing.pricing.${planKey}.description` as const)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-primary/30 p-4">
                    <p className="text-base md:text-lg font-semibold">
                      {t(`landing.pricing.${planKey}.credits` as const)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(`landing.pricing.${planKey}.creditsNote` as const)}
                    </p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {[1, 2, 3].map((featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {t(
                          `landing.pricing.${planKey}.feature${featureIndex}` as const,
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>
                      {t("landing.pricing.trustSignals.cancelAnytime")}
                    </span>
                  </div>
                  <a href={getLoginUrl()} className="mt-auto">
                    <Button
                      variant={planKey === "solo" ? "gradient" : "outline"}
                      className="w-full cta-button"
                    >
                      {t(`landing.pricing.${planKey}.cta` as const)}
                    </Button>
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center text-sm text-muted-foreground">
              <p>
                {t("landing.pricing.boosters.title")}{" "}
                {t("landing.pricing.boosters.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="container-premium mx-auto py-12 md:py-20 px-4 md:px-0"
        >
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("landing.faq.title.part1")} {t("landing.faq.title.highlight")}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t("landing.faq.subtitle")}
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqKeys.map((key) => (
              <details
                key={key}
                className="rounded-2xl border border-border bg-card/80 p-4 md:p-6 group"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-base md:text-lg font-semibold pr-4">
                    {t(`landing.faq.${key}.question` as const)}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {t(`landing.faq.${key}.answer` as const)}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="container-premium mx-auto py-12 md:py-20 px-4 md:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-12">
            <div className="rounded-3xl border border-border bg-card/80 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {t("landing.testimonials.title.part1")}{" "}
                {t("landing.testimonials.title.highlight")}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t("landing.testimonials.subtitle")}
              </p>
              <div className="space-y-8">
                {[1, 2, 3].map((num) => (
                  <figure key={num} className="testimonial">
                    <blockquote className="testimonial-quote text-base md:text-lg leading-relaxed text-foreground/90">
                      "
                      {t(
                        `landing.testimonials.testimonial${num}.quote` as const,
                      )}
                      "
                    </blockquote>
                    <figcaption className="mt-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {t(
                          `landing.testimonials.testimonial${num}.name` as const,
                        )}
                      </span>
                      {" – "}
                      {t(
                        `landing.testimonials.testimonial${num}.role` as const,
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-background/70 p-6 md:p-8">
              <div className="stats-grid grid grid-cols-2 gap-4 md:gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="stat-card rounded-2xl border border-border/70 p-4 md:p-5 bg-card/60"
                  >
                    <div className="stat-value text-2xl md:text-3xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 md:mt-10 rounded-2xl border border-dashed border-primary/40 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  {t("landing.trust.security")}
                </p>
                <p className="text-xl md:text-2xl font-semibold mb-4">
                  {t("landing.trust.uptime")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("landing.trust.gdpr")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container-premium mx-auto py-12 md:py-20 px-4 md:px-0">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-purple-600/10 to-sky-500/10 p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              {t("landing.cta.final.title")}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              {t("landing.cta.final.subtitle")}
            </p>
            <a href={getLoginUrl()}>
              <Button variant="gradient" size="lg" className="cta-button">
                <Sparkles className="mr-2 h-5 w-5" />
                {t("landing.cta.final.button")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 md:py-12">
        <div className="container-premium mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm px-4 md:px-0">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">Houston</span>
            </div>
            <p className="text-muted-foreground">
              {t("landing.footer.tagline")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">
              {t("landing.footer.product")}
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#outcomes" className="hover:text-foreground">
                  {t("landing.footer.features")}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground">
                  {t("landing.footer.pricing")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">
              {t("landing.footer.company")}
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  {t("landing.footer.about")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  {t("landing.footer.blog")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  {t("landing.footer.contact")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">
              {t("landing.newsletter.title")}
            </h4>
            <p className="text-muted-foreground mb-4">
              {t("landing.newsletter.subtitle")}
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={t("landing.newsletter.placeholder")}
                className="px-4 py-2 rounded-lg border border-border bg-background min-h-[44px]"
              />
              <Button variant="gradient" type="submit" className="min-h-[44px]">
                {t("landing.newsletter.cta")}
              </Button>
            </form>
          </div>
        </div>
        <div className="container-premium mx-auto mt-10 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-4 px-4 md:px-0">
          <p>© 2024 Houston by AIstronaut. {t("landing.footer.rights")}</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <a href="#" className="hover:text-foreground">
              {t("landing.footer.privacy")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("landing.footer.terms")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("landing.footer.cookies")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
