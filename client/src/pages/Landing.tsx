import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Brain, Target, TrendingUp, Zap, ArrowRight, Sparkles, Star, Menu, X } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useState } from "react";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { SpaceBackground } from "@/components/SpaceBackground";

export default function Home() {
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
      <header className="relative z-50 border-b border-white/10 backdrop-blur-md bg-[#0a0a0f]/80">
        <nav className="container-premium mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="w-6 h-6 text-[#00D4FF]" />
              <span className="gradient-text-aistronaut">Houston</span>
              <span className="text-xs text-white/60">by AIstronaut</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/80 hover:text-white transition-colors">
                {t('landing.nav.features')}
              </a>
              <a href="#screenshots" className="text-sm text-white/80 hover:text-white transition-colors">
                Screenshots
              </a>
              <a href="#pricing" className="text-sm text-white/80 hover:text-white transition-colors">
                {t('landing.nav.pricing')}
              </a>
              <a href="#faq" className="text-sm text-white/80 hover:text-white transition-colors">
                FAQ
              </a>
              <a href="#testimonials" className="text-sm text-white/80 hover:text-white transition-colors">
                Testimonials
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Language Switcher & Auth */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => changeLanguage('de')}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    i18n.language === 'de'
                      ? 'bg-white/10 text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  DE
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    i18n.language === 'en'
                      ? 'bg-white/10 text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {isAuthenticated ? (
                <Link href="/app/dashboard">
                  <span className="btn-gradient inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold text-white cursor-pointer shadow-[0_0_20px_rgba(255,182,6,0.4)] hover:shadow-[0_0_40px_rgba(255,182,6,0.6)] hover:scale-110 transition-all duration-300 animate-pulse-subtle border border-[#ffb606]/30">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t('landing.nav.dashboard')}
                  </span>
                </Link>
              ) : (
                <a href={getLoginUrl()} className="btn-gradient inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-white cursor-pointer hover:shadow-[0_0_30px_rgba(192,111,255,0.5)] hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started Free
                </a>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-lg border-b border-white/10 animate-fade-in">
              <div className="container-premium mx-auto py-6 space-y-4">
                {/* Navigation Links */}
                <a
                  href="#features"
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('landing.nav.features')}
                </a>
                <a
                  href="#screenshots"
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Screenshots
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
                  FAQ
                </a>
                <a
                  href="#testimonials"
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>

                {/* Language Switcher */}
                <div className="px-4 py-3 border-t border-white/10">
                  <p className="text-xs text-white/60 mb-2">Language</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        changeLanguage('de');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex-1 px-3 py-2 rounded-md text-sm transition-all ${
                        i18n.language === 'de'
                          ? 'bg-white/10 text-white'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      DE
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex-1 px-3 py-2 rounded-md text-sm transition-all ${
                        i18n.language === 'en'
                          ? 'bg-white/10 text-white'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                {/* Auth Button */}
                <div className="px-4">
                  {isAuthenticated ? (
                    <Link href="/app/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <span className="block w-full btn-gradient text-center px-4 py-3 rounded-lg font-medium cursor-pointer">
                        {t('landing.nav.dashboard')}
                      </span>
                    </Link>
                  ) : (
                    <a
                      href={getLoginUrl()}
                      className="block w-full btn-gradient text-center px-4 py-3 rounded-lg font-medium cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('landing.nav.login')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 md:pt-32 pb-12 md:pb-20 min-h-[85vh] flex items-center">
        <div className="container-premium mx-auto">
          <div className="max-w-5xl mx-auto text-center">
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none"></div>
            <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-aistronaut-cta backdrop-blur-sm mb-8 animate-glow">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">
                {t('landing.hero.badge')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in text-white">
              {t('landing.hero.title.part1')}{' '}
              <span className="gradient-text-aistronaut">
                {t('landing.hero.title.highlight')}
              </span>
              <br />
              {t('landing.hero.title.part2')}
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t('landing.hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {isAuthenticated ? (
                <Link href="/app/dashboard" className="btn-aistronaut group px-8 py-6 text-lg inline-flex items-center justify-center rounded-md font-medium">
                  {t('landing.hero.cta.dashboard')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <a href={getLoginUrl()} className="btn-aistronaut group px-8 py-6 text-lg inline-flex items-center justify-center rounded-md font-medium">
                  <Brain className="mr-2 w-5 h-5" />
                  {t('landing.hero.cta.start')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              )}
              <a href="#features" className="btn-outline inline-flex items-center justify-center px-8 py-6 text-lg rounded-md font-medium border-2 border-white/20 text-white hover:bg-white/10 transition-colors">
                {t('landing.hero.cta.learn')}
              </a>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 section-padding">
        <div className="container-premium mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-white">
              {t('landing.features.title.part1')}{' '}
              <span className="gradient-text-aistronaut">{t('landing.features.title.highlight')}</span>
            </h2>
            <p className="lead text-white/80 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-gradient-orange)] to-[var(--color-gradient-pink)] flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                {t('landing.features.feature1.title')}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {t('landing.features.feature1.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                {t('landing.features.feature2.title')}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {t('landing.features.feature2.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-gradient-purple)] to-[var(--color-gradient-orange)] flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                {t('landing.features.feature3.title')}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {t('landing.features.feature3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="relative z-10 section-padding">
        <div className="container-premium mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-white">
              Siehe <span className="gradient-text-aistronaut">Houston</span> in Aktion
            </h2>
            <p className="lead text-white/80 max-w-2xl mx-auto">
              Entdecke die Benutzeroberfläche und erlebe, wie Houston deine Marketing-Arbeit vereinfacht.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dashboard Screenshot */}
            <div className="glass-card p-4 group hover:scale-105 transition-transform duration-300">
              <img
                src="/screenshot-dashboard.png"
                alt="Houston Dashboard mit Stats und AI Insights"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">Dashboard & Insights</h3>
              <p className="text-white/70 text-sm">
                Behalte alle wichtigen Metriken im Blick und erhalte personalisierte AI-Empfehlungen.
              </p>
            </div>

            {/* Chat Screenshot */}
            <div className="glass-card p-4 group hover:scale-105 transition-transform duration-300">
              <img
                src="/screenshot-chat.png"
                alt="Houston AI Chat Interface"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">AI Chat Assistant</h3>
              <p className="text-white/70 text-sm">
                Stelle Fragen und erhalte sofort konkrete Marketing-Strategien und Handlungsempfehlungen.
              </p>
            </div>

            {/* Goals Screenshot */}
            <div className="glass-card p-4 group hover:scale-105 transition-transform duration-300">
              <img
                src="/screenshot-goals.png"
                alt="Houston Goals Management"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">SMART Goals Tracking</h3>
              <p className="text-white/70 text-sm">
                Erstelle und verfolge messbare Marketing-Ziele mit visuellen Progress Bars.
              </p>
            </div>

            {/* Strategy Screenshot */}
            <div className="glass-card p-4 group hover:scale-105 transition-transform duration-300">
              <img
                src="/screenshot-strategy.png"
                alt="Houston Strategy Planning"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">Strategy Planning</h3>
              <p className="text-white/70 text-sm">
                Definiere Brand Positioning, Customer Personas und Marketing-Kanäle an einem Ort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 section-padding">
        <div className="container-premium mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-white">
              {t('landing.pricing.title.part1')}{' '}
              <span className="gradient-text-aistronaut">{t('landing.pricing.title.highlight')}</span>
            </h2>
            <p className="lead text-white/80 max-w-2xl mx-auto">
              {t('landing.pricing.subtitle')}
            </p>
          </div>

          {/* Credit Packs Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Starter Pack - Free */}
            <div className="glass-card p-8 md:p-10 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-8 h-8 text-[var(--color-gradient-orange)]" />
                <h3 className="text-2xl font-bold text-white">Starter</h3>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-white mb-2">
                  Free
                </div>
                <p className="text-base text-white/80">
                  Perfect to get started
                </p>
              </div>
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[var(--color-gradient-orange)]/10 to-[var(--color-gradient-blue)]/10 border border-[var(--color-gradient-orange)]/20">
                <p className="text-2xl font-bold text-white mb-1">50 Credits</p>
                <p className="text-sm text-white/70">Free starter credits</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-gradient-orange)]/20 flex items-center justify-center mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-gradient-orange)]"></div>
                  </div>
                  <span className="text-sm text-white/90">
                    ~16 deep analyses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-gradient-orange)]/20 flex items-center justify-center mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-gradient-orange)]"></div>
                  </div>
                  <span className="text-sm text-white/90">
                    Unlimited basic chat
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-gradient-orange)]/20 flex items-center justify-center mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-gradient-orange)]"></div>
                  </div>
                  <span className="text-sm text-white/90">
                    No credit card required
                  </span>
                </li>
              </ul>
              <a href={getLoginUrl()} className="w-full btn-outline inline-flex items-center justify-center px-6 py-3 text-base rounded-md font-medium border-2 border-white/20 text-white hover:bg-white/10 transition-colors">
                Start Free
              </a>
            </div>

            {/* Orbit Pack - Popular */}
            <div className="glass-card p-8 md:p-10 relative overflow-hidden border-2 border-[#FF6B9D]/30 hover:scale-105 transition-transform duration-300 shadow-2xl shadow-[#FF6B9D]/20">
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#8B5CF6] text-white text-xs font-bold shadow-lg animate-pulse-subtle">
                Most Popular
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-[#FF6B9D]" />
                <h3 className="text-2xl font-bold text-white">Orbit Pack</h3>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold gradient-text-aistronaut mb-2">
                  €9.99
                </div>
                <p className="text-base text-white/80">
                  per month
                </p>
              </div>
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#FF6B9D]/10 to-[#8B5CF6]/10 border border-[#FF6B9D]/20">
                <p className="text-2xl font-bold text-white mb-1">100 Credits</p>
                <p className="text-sm text-white/70">Renews monthly</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B9D]/20 flex items-center justify-center mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B9D]"></div>
                  </div>
                  <span className="text-sm text-white/90">
                    ~33 deep analyses/month
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B9D]/20 flex items-center justify-center mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B9D]"></div>
                  </div>
                  <span className="text-sm text-white/90">
                    All AI features included
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B9D]/20 flex items-center justify-center mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B9D]"></div>
                  </div>
                  <span className="text-sm text-white/90">
                    Cancel anytime
                  </span>
                </li>
              </ul>
              <a href={getLoginUrl()} className="w-full btn-aistronaut inline-flex items-center justify-center px-6 py-3 text-base rounded-md font-medium">
                Get Orbit Pack
              </a>
            </div>

            {/* Galaxy Pack - Power Users */}
            <div className="glass-card p-8 md:p-10 hover:scale-105 transition-transform duration-300 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-[#00D4FF]" />
                <h3 className="text-2xl font-bold text-white">Galaxy Pack</h3>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-white mb-2">
                  €39.99
                </div>
                <p className="text-base text-white/80">
                  per month
                </p>
              </div>
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#8B5CF6]/10 border border-[#00D4FF]/20">
                <p className="text-2xl font-bold text-white mb-1">500 Credits</p>
                <p className="text-sm text-white/70">Renews monthly</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00D4FF]/20 flex items-center justify-center mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]"></div>
                  </div>
                  <span className="text-sm text-white/90">
                    ~166 deep analyses/month
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00D4FF]/20 flex items-center justify-center mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]"></div>
                  </div>
                  <span className="text-sm text-white/90">
                    Best for agencies & teams
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00D4FF]/20 flex items-center justify-center mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]"></div>
                  </div>
                  <span className="text-sm text-white/90">
                    Priority support
                  </span>
                </li>
              </ul>
              <a href={getLoginUrl()} className="w-full btn-outline inline-flex items-center justify-center px-6 py-3 text-base rounded-md font-medium border-2 border-white/20 text-white hover:bg-white/10 transition-colors">
                Get Galaxy Pack
              </a>
            </div>
          </div>

          {/* Mission Boosters Info */}
          <div className="mt-12 text-center">
            <p className="text-white/70 mb-4">Need more credits? Get <span className="text-[#FF6B9D] font-semibold">Mission Boosters</span> (one-time top-ups)</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-white font-semibold">50 Credits</span> <span className="text-white/60">€5.99</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-white font-semibold">150 Credits</span> <span className="text-white/60">€14.99</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-white font-semibold">300 Credits</span> <span className="text-white/60">€24.99</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 section-padding">
        <div className="container-premium mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-white">
              {t('landing.faq.title.part1')} <span className="gradient-text-aistronaut">{t('landing.faq.title.highlight')}</span>
            </h2>
            <p className="lead text-white/80">
              {t('landing.faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <details className="glass-card p-6 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-white">{t('landing.faq.whatIs.question')}</h3>
                <svg className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 leading-relaxed">
                {t('landing.faq.whatIs.answer')}
              </p>
            </details>

            {/* FAQ Item 2 */}
            <details className="glass-card p-6 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-white">{t('landing.faq.credits.question')}</h3>
                <svg className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 leading-relaxed">
                {t('landing.faq.credits.answer')}
              </p>
            </details>

            {/* FAQ Item 3 */}
            <details className="glass-card p-6 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-white">{t('landing.faq.security.question')}</h3>
                <svg className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 leading-relaxed">
                {t('landing.faq.security.answer')}
              </p>
            </details>

            {/* FAQ Item 4 */}
            <details className="glass-card p-6 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-white">{t('landing.faq.cancel.question')}</h3>
                <svg className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 leading-relaxed">
                {t('landing.faq.cancel.answer')}
              </p>
            </details>

            {/* FAQ Item 5 */}
            <details className="glass-card p-6 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-white">{t('landing.faq.strategies.question')}</h3>
                <svg className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 leading-relaxed">
                {t('landing.faq.strategies.answer')}
              </p>
            </details>

            {/* FAQ Item 6 */}
            <details className="glass-card p-6 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-white">{t('landing.faq.technical.question')}</h3>
                <svg className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 leading-relaxed">
                {t('landing.faq.technical.answer')}
              </p>
            </details>

            {/* FAQ Item 7 */}
            <details className="glass-card p-6 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-white">{t('landing.faq.creditUsage.question')}</h3>
                <svg className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 leading-relaxed">
                {t('landing.faq.creditUsage.answer')}
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Trust / Social Proof Section */}
      <section id="testimonials" className="relative z-10 section-padding bg-gradient-to-b from-transparent to-black/20">
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
              {t('landing.testimonials.title.part1')} <span className="gradient-text-aistronaut">{t('landing.testimonials.title.highlight')}</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg">
                  SM
                </div>
                <div>
                  <div className="font-bold text-white">{t('landing.testimonials.testimonial1.name')}</div>
                  <div className="text-sm text-white/60">{t('landing.testimonials.testimonial1.role')}</div>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed">
                "{t('landing.testimonials.testimonial1.quote')}"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg">
                  JD
                </div>
                <div>
                  <div className="font-bold text-white">{t('landing.testimonials.testimonial2.name')}</div>
                  <div className="text-sm text-white/60">{t('landing.testimonials.testimonial2.role')}</div>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed">
                "{t('landing.testimonials.testimonial2.quote')}"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#FF6B9D] flex items-center justify-center text-white font-bold text-lg">
                  LW
                </div>
                <div>
                  <div className="font-bold text-white">{t('landing.testimonials.testimonial3.name')}</div>
                  <div className="text-sm text-white/60">{t('landing.testimonials.testimonial3.role')}</div>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed">
                "{t('landing.testimonials.testimonial3.quote')}"
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
              <span className="text-sm text-white/80 font-medium">{t('landing.trust.security')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
              <span className="text-sm text-white/80 font-medium">{t('landing.trust.uptime')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                Your AI assistant for strategic marketing.
              </p>
              {/* Social Media Icons */}
              <div className="flex gap-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Roadmap</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Careers</a></li>
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
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF6B9D] to-[#8B5CF6] text-white font-medium hover:shadow-lg transition-shadow"
                >
                  {t('landing.newsletter.cta')}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">
                  © 2024 Houston by AIstronaut. All rights reserved.
                </span>
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Twinkle Animation */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
