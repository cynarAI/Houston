import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { SpaceBackground } from "@/components/SpaceBackground";
import { useTheme } from "@/contexts/ThemeContext";
import { getLoginUrl } from "@/const";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Menu,
  MessageCircle,
  Moon,
  Shield,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";

const workflowIcons = [MessageCircle, Lightbulb, Zap, TrendingUp];

export default function Landing() {
  const { isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme, switchable } = useTheme();
  const [, setLocation] = useLocation();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/app/dashboard");
    }
  }, [loading, isAuthenticated, setLocation]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navItems = [
    { href: "#features", label: t("landing.nav.features") },
    { href: "#stories", label: t("landing.nav.stories") },
    { href: "#pricing", label: t("landing.nav.pricing") },
    { href: "#faq", label: t("landing.nav.faq") },
  ];

  const featureCards = useMemo(
    () => [
      {
        icon: Target,
        title: t("landing.benefits.benefit1.title"),
        description: t("landing.benefits.benefit1.description"),
      },
      {
        icon: Sparkles,
        title: t("landing.benefits.benefit2.title"),
        description: t("landing.benefits.benefit2.description"),
      },
      {
        icon: Zap,
        title: t("landing.benefits.benefit3.title"),
        description: t("landing.benefits.benefit3.description"),
      },
    ],
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
        image: "/images/landing-hero-1.png",
        title: t("landing.forWhom.persona1.title"),
        description: t("landing.forWhom.persona1.description"),
        highlight: t("landing.storyHighlights.persona1"),
      },
      {
        image: "/images/landing-usecase-1.png",
        title: t("landing.forWhom.persona2.title"),
        description: t("landing.forWhom.persona2.description"),
        highlight: t("landing.storyHighlights.persona2"),
      },
      {
        image: "/images/landing-usecase-3.png",
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
        image: "/screenshot-dashboard.png",
        title: t("landing.screenshots.dashboard.title"),
        description: t("landing.screenshots.dashboard.description"),
        alt: t("landing.screenshots.dashboard.alt"),
      },
      {
        image: "/screenshot-goals.png",
        title: t("landing.screenshots.goals.title"),
        description: t("landing.screenshots.goals.description"),
        alt: t("landing.screenshots.goals.alt"),
      },
      {
        image: "/screenshot-chat.png",
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

  const heroImages = [
    "/images/landing-hero-1.png",
    "/images/landing-hero-2.png",
    "/images/landing-usecase-2.png",
  ];
  const trustLabels = t("landing.trustline.labels", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <ExitIntentPopup />
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(147,197,253,0.25),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,7,100,0.45),_transparent_65%)]" />
        <SpaceBackground />
      </div>

      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <nav
          className="container-premium mx-auto"
          aria-label={t("landing.nav.features")}
        >
          <div className="flex items-center justify-between h-16">
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
              className="md:hidden p-2 rounded-lg border border-border"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/60 py-4 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-base text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div className="flex gap-2">
                {["de", "en"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      changeLanguage(lang);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 px-3 py-2 rounded border ${
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
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-border py-2"
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
                <Link
                  href="/app/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="gradient" className="w-full">
                    {t("landing.nav.dashboard")}
                  </Button>
                </Link>
              ) : (
                <a
                  href={getLoginUrl()}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="gradient" className="w-full">
                    {t("landing.hero.cta.start")}
                  </Button>
                </a>
              )}
            </div>
          )}
        </nav>
      </header>

      <main className="relative z-10">
        <section className="container-premium mx-auto py-16 md:py-24" id="hero">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                {t("landing.hero.badge")}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {t("landing.hero.title.part1")}{" "}
                {t("landing.hero.title.highlight")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
                {t("landing.hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link href="/app/dashboard">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      {t("landing.hero.cta.dashboard")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      {t("landing.hero.cta.start")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                )}
                <a
                  href="#stories"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("landing.hero.cta.learn")}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-10 grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {t("landing.hero.trustBadges.noCard")}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  {t("landing.hero.trustBadges.freeCredits")}
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-sky-500" />
                  {t("landing.hero.trustBadges.cancelAnytime")}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-40 bg-gradient-to-br from-primary/40 via-purple-400/40 to-sky-400/40" />
              <div className="relative grid grid-cols-2 gap-4">
                {heroImages.map((src, index) => (
                  <div
                    key={src}
                    className={`rounded-2xl overflow-hidden border border-border/60 bg-card shadow-lg shadow-primary/10 ${
                      index === 0 ? "col-span-2" : ""
                    }`}
                  >
                    <img
                      src={src}
                      alt="Houston use case"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
                <div className="col-span-2 rounded-2xl border border-border bg-card/80 p-6">
                  <p className="text-sm text-muted-foreground mb-4 font-medium">
                    {t("landing.trustline.title")}
                  </p>
                  <img
                    src="/screenshot-dashboard.png"
                    alt="Houston dashboard"
                    className="w-full rounded-xl border border-border"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card/60 border-y border-border/60 py-10">
          <div className="container-premium mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground text-center mb-4">
              {t("landing.trustline.caption")}
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              {trustLabels.map((label) => (
                <span key={label} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          className="container-premium mx-auto py-16 md:py-24"
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold text-primary mb-3">
              {t("landing.howItWorks.title.highlight")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("landing.benefits.title.part1")}{" "}
              {t("landing.benefits.title.highlight")}
            </h2>
            <p className="text-muted-foreground">
              {t("landing.benefits.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm shadow-primary/5"
              >
                <card.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid md:grid-cols-4 gap-4">
            {workflowSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-border bg-background/80 p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {step.step}
                  </div>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="stories"
          className="bg-muted/20 py-16 md:py-24 border-y border-border/60"
        >
          <div className="container-premium mx-auto">
            <div className="max-w-2xl mb-12">
              <p className="text-sm font-semibold text-primary mb-2">
                {t("landing.storySection.label")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("landing.storySection.title.part1")}{" "}
                {t("landing.storySection.title.highlight")}
              </h2>
              <p className="text-muted-foreground">
                {t("landing.storySection.subtitle")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {personaStories.map((story) => (
                <div
                  key={story.title}
                  className="rounded-3xl overflow-hidden border border-border bg-card shadow-primary/10"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
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

        <section
          id="screens"
          className="container-premium mx-auto py-16 md:py-24"
        >
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold text-primary mb-3">
              {t("landing.screenshots.title.part1")}{" "}
              {t("landing.screenshots.title.highlight")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("landing.screenshots.sectionTitle")}
            </h2>
            <p className="text-muted-foreground">
              {t("landing.screenshots.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {screenshotCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-border bg-card/80 overflow-hidden shadow-lg shadow-primary/10 flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-b-[2.5rem]" />
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
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

        <section className="container-premium mx-auto py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
            <div className="rounded-3xl border border-border bg-card/80 p-8">
              <h2 className="text-2xl font-bold mb-3">
                {t("landing.testimonials.title.part1")}{" "}
                {t("landing.testimonials.title.highlight")}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t("landing.testimonials.subtitle")}
              </p>
              <div className="space-y-8">
                {[1, 2, 3].map((num) => (
                  <figure key={num}>
                    <blockquote className="text-lg leading-relaxed text-foreground/90">
                      “
                      {t(
                        `landing.testimonials.testimonial${num}.quote` as const,
                      )}
                      ”
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
            <div className="rounded-3xl border border-border bg-background/70 p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border/70 p-5 bg-card/60"
                  >
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-2xl border border-dashed border-primary/40 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  {t("landing.trust.security")}
                </p>
                <p className="text-2xl font-semibold mb-4">
                  {t("landing.trust.uptime")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("landing.trust.gdpr")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="bg-card/60 py-16 md:py-24 border-y border-border/60"
        >
          <div className="container-premium mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("landing.pricing.title.part1")}{" "}
                {t("landing.pricing.title.highlight")}
              </h2>
              <p className="text-muted-foreground">
                {t("landing.pricing.subtitle")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(["starter", "solo", "team"] as const).map((planKey) => (
                <div
                  key={planKey}
                  className={`rounded-3xl border bg-background/80 p-8 flex flex-col gap-6 ${
                    planKey === "solo"
                      ? "border-primary/40 shadow-primary/20 shadow-xl"
                      : "border-border"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                      {t(`landing.pricing.${planKey}.name` as const)}
                    </p>
                    <p className="text-4xl font-bold mt-2">
                      {t(`landing.pricing.${planKey}.price` as const)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(`landing.pricing.${planKey}.description` as const)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-primary/30 p-4">
                    <p className="text-lg font-semibold">
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
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {t(
                          `landing.pricing.${planKey}.feature${featureIndex}` as const,
                        )}
                      </li>
                    ))}
                  </ul>
                  <a href={getLoginUrl()}>
                    <Button
                      variant={planKey === "solo" ? "gradient" : "outline"}
                      className="w-full"
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

        <section id="faq" className="container-premium mx-auto py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("landing.faq.title.part1")} {t("landing.faq.title.highlight")}
            </h2>
            <p className="text-muted-foreground">{t("landing.faq.subtitle")}</p>
          </div>
          <div className="space-y-4">
            {faqKeys.map((key) => (
              <details
                key={key}
                className="rounded-2xl border border-border bg-card/80 p-6 group"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-lg font-semibold pr-4">
                    {t(`landing.faq.${key}.question` as const)}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-muted-foreground">
                  {t(`landing.faq.${key}.answer` as const)}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="container-premium mx-auto py-16 md:py-24">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-purple-600/10 to-sky-500/10 p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("landing.cta.final.title")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("landing.cta.final.subtitle")}
            </p>
            <a href={getLoginUrl()}>
              <Button variant="gradient" size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                {t("landing.cta.final.button")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-12">
        <div className="container-premium mx-auto grid md:grid-cols-4 gap-8 text-sm">
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
                <a href="#features" className="hover:text-foreground">
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
                className="px-4 py-2 rounded-lg border border-border bg-background"
              />
              <Button variant="gradient" type="submit">
                {t("landing.newsletter.cta")}
              </Button>
            </form>
          </div>
        </div>
        <div className="container-premium mx-auto mt-10 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
          <p>© 2024 Houston by AIstronaut. {t("landing.footer.rights")}</p>
          <div className="flex gap-6">
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
