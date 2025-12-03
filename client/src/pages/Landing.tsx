import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Menu, 
  X,
  MessageCircle,
  CheckCircle2,
  Lightbulb,
  Rocket,
  Users,
  Building2,
  Store,
  CreditCard,
  Shield,
  Clock
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useState } from "react";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { SpaceBackground } from "@/components/SpaceBackground";

export default function Landing() {
  const { user, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Exit Intent Popup */}
      <ExitIntentPopup />
      
      {/* Immersive Space Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]"></div>
        <SpaceBackground />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 backdrop-blur-md bg-[#0a0a0f]/80 sticky top-0">
        <nav className="container-premium mx-auto" aria-label={t('landing.nav.features')}>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold" aria-label="Houston - zur Startseite">
              <Sparkles className="w-6 h-6 text-[#00D4FF]" aria-hidden="true" />
              <span className="gradient-text-aistronaut">Houston</span>
              <span className="text-xs text-white/60 hidden sm:inline">by AIstronaut</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#how-it-works" className="text-sm text-white/80 hover:text-white transition-colors">
                {t('landing.nav.howItWorks')}
              </a>
              <a href="#benefits" className="text-sm text-white/80 hover:text-white transition-colors">
                {t('landing.nav.features')}
              </a>
              <a href="#pricing" className="text-sm text-white/80 hover:text-white transition-colors">
                {t('landing.nav.pricing')}
              </a>
              <a href="#faq" className="text-sm text-white/80 hover:text-white transition-colors">
                {t('landing.nav.faq')}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6 text-white" aria-hidden="true" />
              )}
            </button>

            {/* Language Switcher & Auth */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex gap-1" role="group" aria-label="Sprachauswahl">
                <button
                  onClick={() => changeLanguage('de')}
                  aria-pressed={i18n.language === 'de'}
                  className={`px-2 py-1 rounded text-sm transition-all ${
                    i18n.language === 'de'
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  DE
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  aria-pressed={i18n.language === 'en'}
                  className={`px-2 py-1 rounded text-sm transition-all ${
                    i18n.language === 'en'
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {isAuthenticated ? (
                <Link href="/app/dashboard">
                  <Button variant="gradient" size="default">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('landing.nav.dashboard')}
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button variant="gradient" size="default">
                    {t('landing.hero.cta.start')}
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-lg border-b border-white/10">
              <div className="container-premium mx-auto py-6 space-y-4">
                <a
                  href="#how-it-works"
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('landing.nav.howItWorks')}
                </a>
                <a
                  href="#benefits"
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('landing.nav.features')}
                </a>
                <a
                  href="#pricing"
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('landing.nav.pricing')}
                </a>
                <a
                  href="#faq"
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('landing.nav.faq')}
                </a>

                {/* Language Switcher Mobile */}
                <div className="px-4 py-3 border-t border-white/10">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { changeLanguage('de'); setMobileMenuOpen(false); }}
                      className={`flex-1 px-3 py-2 rounded text-sm transition-all ${
                        i18n.language === 'de' ? 'bg-white/10 text-white' : 'text-white/80'
                      }`}
                    >
                      DE
                    </button>
                    <button
                      onClick={() => { changeLanguage('en'); setMobileMenuOpen(false); }}
                      className={`flex-1 px-3 py-2 rounded text-sm transition-all ${
                        i18n.language === 'en' ? 'bg-white/10 text-white' : 'text-white/80'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                {/* Auth Button Mobile */}
                <div className="px-4">
                  {isAuthenticated ? (
                    <Link href="/app/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="gradient" className="w-full">
                        {t('landing.nav.dashboard')}
                      </Button>
                    </Link>
                  ) : (
                    <a href={getLoginUrl()} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="gradient" className="w-full">
                        {t('landing.hero.cta.start')}
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative z-10 pt-16 md:pt-24 pb-16 md:pb-24 min-h-[80vh] flex items-center">
        <div className="container-premium mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B9D]/20 to-[#8B5CF6]/20 border border-[#FF6B9D]/30 backdrop-blur-sm mb-8 animate-glow">
              <Sparkles className="w-4 h-4 text-[#FF6B9D]" />
              <span className="text-sm text-white font-medium">
                {t('landing.hero.badge')}
              </span>
            </div>

            {/* Headline - Simple & Clear */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              {t('landing.hero.title.part1')},{' '}
              <span className="gradient-text-aistronaut">
                {t('landing.hero.title.highlight')}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>

            {/* Primary CTA - Single Focus */}
            <div className="flex flex-col items-center gap-4 mb-8">
              {isAuthenticated ? (
                <Link href="/app/dashboard">
                  <Button variant="gradient" size="lg" className="text-lg px-10 py-6 shadow-lg shadow-[#FF6B9D]/20">
                    {t('landing.hero.cta.dashboard')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button variant="gradient" size="lg" className="text-lg px-10 py-6 shadow-lg shadow-[#FF6B9D]/20">
                    {t('landing.hero.cta.start')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              )}
              {/* Secondary link - less prominent */}
              <a 
                href="#how-it-works" 
                className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
              >
                {t('landing.hero.cta.learn')}
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                {t('landing.hero.trustBadges.noCard')}
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                {t('landing.hero.trustBadges.freeCredits')}
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                {t('landing.hero.trustBadges.cancelAnytime')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section id="how-it-works" className="relative z-10 section-padding bg-gradient-to-b from-transparent to-black/20">
        <div className="container-premium mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('landing.howItWorks.title.part1')}{' '}
              <span className="gradient-text-aistronaut">{t('landing.howItWorks.title.highlight')}</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#8B5CF6] flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-bold text-[#FF6B9D] mb-2">01</div>
              <h3 className="text-xl font-bold text-white mb-2">{t('landing.howItWorks.step1.title')}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{t('landing.howItWorks.step1.description')}</p>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#00D4FF] flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-bold text-[#8B5CF6] mb-2">02</div>
              <h3 className="text-xl font-bold text-white mb-2">{t('landing.howItWorks.step2.title')}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{t('landing.howItWorks.step2.description')}</p>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#22C55E] flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-bold text-[#00D4FF] mb-2">03</div>
              <h3 className="text-xl font-bold text-white mb-2">{t('landing.howItWorks.step3.title')}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{t('landing.howItWorks.step3.description')}</p>
            </div>

            {/* Step 4 */}
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#22C55E] to-[#FF6B9D] flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-bold text-[#22C55E] mb-2">04</div>
              <h3 className="text-xl font-bold text-white mb-2">{t('landing.howItWorks.step4.title')}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{t('landing.howItWorks.step4.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BENEFITS SECTION ==================== */}
      <section id="benefits" className="relative z-10 section-padding">
        <div className="container-premium mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('landing.benefits.title.part1')}{' '}
              <span className="gradient-text-aistronaut">{t('landing.benefits.title.highlight')}</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {t('landing.benefits.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Benefit 1 */}
            <div className="glass-card p-8 group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#8B5CF6] flex items-center justify-center mb-6">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {t('landing.benefits.benefit1.title')}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {t('landing.benefits.benefit1.description')}
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="glass-card p-8 group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#00D4FF] flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {t('landing.benefits.benefit2.title')}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {t('landing.benefits.benefit2.description')}
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="glass-card p-8 group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#22C55E] flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {t('landing.benefits.benefit3.title')}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {t('landing.benefits.benefit3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOR WHOM SECTION ==================== */}
      <section id="for-whom" className="relative z-10 section-padding bg-gradient-to-b from-transparent to-black/20">
        <div className="container-premium mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('landing.forWhom.title.part1')}{' '}
              <span className="gradient-text-aistronaut">{t('landing.forWhom.title.highlight')}</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              {t('landing.forWhom.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Persona 1: Solo Coach */}
            <div className="glass-card p-8 group hover:scale-105 transition-transform duration-300 border-[#FF6B9D]/20 hover:border-[#FF6B9D]/40">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B9D]/20 to-[#FF6B9D]/5 border border-[#FF6B9D]/30 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#FF6B9D]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {t('landing.forWhom.persona1.title')}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {t('landing.forWhom.persona1.description')}
              </p>
            </div>

            {/* Persona 2: Small Agency */}
            <div className="glass-card p-8 group hover:scale-105 transition-transform duration-300 border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/5 border border-[#8B5CF6]/30 flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {t('landing.forWhom.persona2.title')}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {t('landing.forWhom.persona2.description')}
              </p>
            </div>

            {/* Persona 3: Local Business */}
            <div className="glass-card p-8 group hover:scale-105 transition-transform duration-300 border-[#00D4FF]/20 hover:border-[#00D4FF]/40">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D4FF]/20 to-[#00D4FF]/5 border border-[#00D4FF]/30 flex items-center justify-center mb-6">
                <Store className="w-7 h-7 text-[#00D4FF]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {t('landing.forWhom.persona3.title')}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {t('landing.forWhom.persona3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCREENSHOTS SECTION ==================== */}
      <section id="screenshots" className="relative z-10 section-padding">
        <div className="container-premium mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('landing.screenshots.title.part1')}{' '}
              <span className="gradient-text-aistronaut">{t('landing.screenshots.title.highlight')}</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {t('landing.screenshots.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Dashboard Screenshot */}
            <div className="glass-card p-4 group hover:scale-[1.02] transition-transform duration-300">
              <img
                src="/screenshot-dashboard.png"
                alt="Houston Dashboard"
                className="w-full h-auto rounded-lg shadow-2xl"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">{t('landing.screenshots.dashboard.title')}</h3>
              <p className="text-white/70 text-sm">{t('landing.screenshots.dashboard.description')}</p>
            </div>

            {/* Chat Screenshot */}
            <div className="glass-card p-4 group hover:scale-[1.02] transition-transform duration-300">
              <img
                src="/screenshot-chat.png"
                alt="Houston Chat"
                className="w-full h-auto rounded-lg shadow-2xl"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">{t('landing.screenshots.chat.title')}</h3>
              <p className="text-white/70 text-sm">{t('landing.screenshots.chat.description')}</p>
            </div>

            {/* Goals Screenshot */}
            <div className="glass-card p-4 group hover:scale-[1.02] transition-transform duration-300">
              <img
                src="/screenshot-goals.png"
                alt="Houston Goals"
                className="w-full h-auto rounded-lg shadow-2xl"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">{t('landing.screenshots.goals.title')}</h3>
              <p className="text-white/70 text-sm">{t('landing.screenshots.goals.description')}</p>
            </div>

            {/* Strategy Screenshot */}
            <div className="glass-card p-4 group hover:scale-[1.02] transition-transform duration-300">
              <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] flex items-center justify-center border border-white/10">
                <div className="text-center p-8">
                  <Target className="w-12 h-12 text-[#8B5CF6] mx-auto mb-4" />
                  <p className="text-white/60 text-sm">{t('landing.screenshots.strategy.title')}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">{t('landing.screenshots.strategy.title')}</h3>
              <p className="text-white/70 text-sm">{t('landing.screenshots.strategy.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CREDITS EXPLAINED SECTION ==================== */}
      <section id="credits-explained" className="relative z-10 section-padding bg-gradient-to-b from-transparent to-black/20">
        <div className="container-premium mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('landing.creditsExplained.title.part1')}{' '}
              <span className="gradient-text-aistronaut">{t('landing.creditsExplained.title.highlight')}</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {t('landing.creditsExplained.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* What are Credits */}
            <div className="glass-card p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#8B5CF6] flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('landing.creditsExplained.whatAreCredits.title')}</h3>
              <p className="text-white/70 leading-relaxed">{t('landing.creditsExplained.whatAreCredits.description')}</p>
            </div>

            {/* What can you do */}
            <div className="glass-card p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#00D4FF] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('landing.creditsExplained.whatCanYouDo.title')}</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  {t('landing.creditsExplained.whatCanYouDo.examples.deepAnalysis')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  {t('landing.creditsExplained.whatCanYouDo.examples.aiInsights')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  {t('landing.creditsExplained.whatCanYouDo.examples.strategyAnalysis')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  {t('landing.creditsExplained.whatCanYouDo.examples.pdfExports')}
                </li>
              </ul>
            </div>
          </div>

          {/* Cost Table */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="glass-card overflow-hidden">
              <div className="grid grid-cols-2 gap-px bg-white/10">
                <div className="bg-[#0a0a0f] p-4 font-semibold text-white">{t('landing.creditsExplained.costs.chat')}</div>
                <div className="bg-[#0a0a0f] p-4 text-green-400 font-semibold">{t('landing.creditsExplained.costs.chatCost')}</div>
                <div className="bg-[#0a0a0f] p-4 text-white/80">{t('landing.creditsExplained.costs.deepAnalysis')}</div>
                <div className="bg-[#0a0a0f] p-4 text-white/80">{t('landing.creditsExplained.costs.deepAnalysisCost')}</div>
                <div className="bg-[#0a0a0f] p-4 text-white/80">{t('landing.creditsExplained.costs.aiInsights')}</div>
                <div className="bg-[#0a0a0f] p-4 text-white/80">{t('landing.creditsExplained.costs.aiInsightsCost')}</div>
                <div className="bg-[#0a0a0f] p-4 text-white/80">{t('landing.creditsExplained.costs.strategyAnalysis')}</div>
                <div className="bg-[#0a0a0f] p-4 text-white/80">{t('landing.creditsExplained.costs.strategyAnalysisCost')}</div>
                <div className="bg-[#0a0a0f] p-4 text-white/80">{t('landing.creditsExplained.costs.pdfExport')}</div>
                <div className="bg-[#0a0a0f] p-4 text-white/80">{t('landing.creditsExplained.costs.pdfExportCost')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRICING SECTION ==================== */}
      <section id="pricing" className="relative z-10 section-padding">
        <div className="container-premium mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('landing.pricing.title.part1')}{' '}
              <span className="gradient-text-aistronaut">{t('landing.pricing.title.highlight')}</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-6">
              {t('landing.pricing.subtitle')}
            </p>
            {/* Trust signals */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                {t('landing.pricing.trustSignals.cancelAnytime')}
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                {t('landing.pricing.trustSignals.securePayment')}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                {t('landing.pricing.trustSignals.noHiddenCosts')}
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter - Free */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-8 h-8 text-[#FFD489]" />
                <h3 className="text-2xl font-bold text-white">{t('landing.pricing.starter.name')}</h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-white mb-1">{t('landing.pricing.starter.price')}</div>
                <p className="text-white/60">{t('landing.pricing.starter.description')}</p>
              </div>
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#FFD489]/10 to-[#8B5CF6]/10 border border-[#FFD489]/20">
                <p className="text-xl font-bold text-white mb-1">{t('landing.pricing.starter.credits')}</p>
                <p className="text-sm text-white/60">{t('landing.pricing.starter.creditsNote')}</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  {t('landing.pricing.starter.feature1')}
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  {t('landing.pricing.starter.feature2')}
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  {t('landing.pricing.starter.feature3')}
                </li>
              </ul>
              <a href={getLoginUrl()} className="block">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  {t('landing.pricing.starter.cta')}
                </Button>
              </a>
            </div>

            {/* Solo - Recommended */}
            <div className="glass-card p-8 relative border-2 border-[#FF6B9D]/30 hover:scale-105 transition-transform duration-300 shadow-2xl shadow-[#FF6B9D]/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#8B5CF6] text-white text-sm font-bold">
                {t('landing.pricing.solo.badge')}
              </div>
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-[#FF6B9D]" />
                <h3 className="text-2xl font-bold text-white">{t('landing.pricing.solo.name')}</h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold gradient-text-aistronaut mb-1">{t('landing.pricing.solo.price')}</div>
                <p className="text-white/60">{t('landing.pricing.solo.period')}</p>
              </div>
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#FF6B9D]/10 to-[#8B5CF6]/10 border border-[#FF6B9D]/20">
                <p className="text-xl font-bold text-white mb-1">{t('landing.pricing.solo.credits')}</p>
                <p className="text-sm text-white/60">{t('landing.pricing.solo.creditsNote')}</p>
              </div>
              <p className="text-sm text-white/60 mb-4 italic">{t('landing.pricing.solo.useCase')}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  {t('landing.pricing.solo.feature1')}
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  {t('landing.pricing.solo.feature2')}
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  {t('landing.pricing.solo.feature3')}
                </li>
              </ul>
              <a href={getLoginUrl()} className="block">
                <Button variant="gradient" className="w-full">
                  {t('landing.pricing.solo.cta')}
                </Button>
              </a>
            </div>

            {/* Team */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-[#00D4FF]" />
                <h3 className="text-2xl font-bold text-white">{t('landing.pricing.team.name')}</h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-white mb-1">{t('landing.pricing.team.price')}</div>
                <p className="text-white/60">{t('landing.pricing.team.period')}</p>
              </div>
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#8B5CF6]/10 border border-[#00D4FF]/20">
                <p className="text-xl font-bold text-white mb-1">{t('landing.pricing.team.credits')}</p>
                <p className="text-sm text-white/60">{t('landing.pricing.team.creditsNote')}</p>
              </div>
              <p className="text-sm text-white/60 mb-4 italic">{t('landing.pricing.team.useCase')}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  {t('landing.pricing.team.feature1')}
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  {t('landing.pricing.team.feature2')}
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  {t('landing.pricing.team.feature3')}
                </li>
              </ul>
              <a href={getLoginUrl()} className="block">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  {t('landing.pricing.team.cta')}
                </Button>
              </a>
            </div>
          </div>

          {/* Credit Boosters */}
          <div className="mt-12 text-center">
            <p className="text-white/70 mb-4">
              {t('landing.pricing.boosters.title')}{' '}
              <span className="text-[#FF6B9D] font-semibold">{t('landing.pricing.boosters.subtitle')}</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-white font-semibold">{t('landing.pricing.boosters.small')}</span>{' '}
                <span className="text-white/60">{t('landing.pricing.boosters.smallPrice')}</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-white font-semibold">{t('landing.pricing.boosters.medium')}</span>{' '}
                <span className="text-white/60">{t('landing.pricing.boosters.mediumPrice')}</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-[#00D4FF]/30">
                <span className="text-white font-semibold">{t('landing.pricing.boosters.large')}</span>{' '}
                <span className="text-white/60">{t('landing.pricing.boosters.largePrice')}</span>
                <span className="ml-2 text-xs text-[#00D4FF]">{t('landing.pricing.boosters.bestValue')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section id="faq" className="relative z-10 section-padding bg-gradient-to-b from-transparent to-black/20">
        <div className="container-premium mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('landing.faq.title.part1')}{' '}
              <span className="gradient-text-aistronaut">{t('landing.faq.title.highlight')}</span>
            </h2>
            <p className="text-lg text-white/70">
              {t('landing.faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ Items */}
            {['whatIs', 'vsChatGPT', 'credits', 'whoIsItFor', 'security', 'cancel', 'technical'].map((key) => (
              <details key={key} className="glass-card p-6 group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-white pr-4">{t(`landing.faq.${key}.question`)}</h3>
                  <svg className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-white/70 leading-relaxed">
                  {t(`landing.faq.${key}.answer`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section id="testimonials" className="relative z-10 section-padding">
        <div className="container-premium mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text-aistronaut mb-2">10K+</div>
              <div className="text-sm md:text-base text-white/60">{t('landing.stats.activeUsers')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text-aistronaut mb-2">50K+</div>
              <div className="text-sm md:text-base text-white/60">{t('landing.stats.marketingGoals')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text-aistronaut mb-2">95%</div>
              <div className="text-sm md:text-base text-white/60">{t('landing.stats.successRate')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text-aistronaut mb-2">24/7</div>
              <div className="text-sm md:text-base text-white/60">{t('landing.stats.aiSupport')}</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('landing.testimonials.title.part1')}{' '}
              <span className="gradient-text-aistronaut">{t('landing.testimonials.title.highlight')}</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((num) => (
              <div key={num} className="glass-card p-8 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg">
                    {t(`landing.testimonials.testimonial${num}.name`).split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-white">{t(`landing.testimonials.testimonial${num}.name`)}</div>
                    <div className="text-sm text-white/60">{t(`landing.testimonials.testimonial${num}.role`)}</div>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed italic">
                  "{t(`landing.testimonials.testimonial${num}.quote`)}"
                </p>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-white/80 font-medium">{t('landing.trust.security')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-white/80 font-medium">{t('landing.trust.uptime')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
              <CheckCircle2 className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-white/80 font-medium">{t('landing.trust.gdpr')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <section className="relative z-10 section-padding">
        <div className="container-premium mx-auto">
          <div className="max-w-3xl mx-auto text-center glass-card p-12 border-[#FF6B9D]/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('landing.cta.final.title')}
            </h2>
            <p className="text-lg text-white/70 mb-8">
              {t('landing.cta.final.subtitle')}
            </p>
            <a href={getLoginUrl()}>
              <Button variant="gradient" size="lg" className="text-lg px-10 py-6">
                <Rocket className="mr-2 w-5 h-5" />
                {t('landing.cta.final.button')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container-premium mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-[#00D4FF]" />
                <span className="text-xl font-bold gradient-text-aistronaut">Houston</span>
              </div>
              <p className="text-sm text-white/60 mb-6">
                {t('landing.footer.tagline')}
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t('landing.footer.product')}</h4>
              <ul className="space-y-3">
                <li><a href="#benefits" className="text-sm text-white/60 hover:text-white transition-colors">{t('landing.footer.features')}</a></li>
                <li><a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">{t('landing.footer.pricing')}</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('landing.footer.roadmap')}</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t('landing.footer.company')}</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('landing.footer.about')}</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('landing.footer.blog')}</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('landing.footer.contact')}</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t('landing.newsletter.title')}</h4>
              <p className="text-sm text-white/60 mb-4">{t('landing.newsletter.subtitle')}</p>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder={t('landing.newsletter.placeholder')}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
                <Button variant="gradient" type="submit">
                  {t('landing.newsletter.cta')}
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-white/60">
                © 2024 Houston by AIstronaut. {t('landing.footer.rights')}
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('landing.footer.privacy')}</a>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('landing.footer.terms')}</a>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('landing.footer.cookies')}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
