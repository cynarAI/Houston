import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 glass-card border-l border-white/15 z-50 transform transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close mobile menu"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-6 space-y-4" aria-label="Mobile navigation">
          <Link href="#features">
            <a
              className="block py-3 px-4 text-lg text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={onClose}
            >
              {t('landing.nav.features')}
            </a>
          </Link>
          <Link href="#pricing">
            <a
              className="block py-3 px-4 text-lg text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={onClose}
            >
              {t('landing.nav.pricing')}
            </a>
          </Link>

          {/* Language Switcher */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2 px-4">
              {t('landing.nav.language')}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  changeLanguage('de');
                  onClose();
                }}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  i18n.language === 'de'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10'
                }`}
                aria-label="Switch to German"
              >
                DE
              </button>
              <button
                onClick={() => {
                  changeLanguage('en');
                  onClose();
                }}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  i18n.language === 'en'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-6">
            <Link href="/app">
              <a onClick={onClose}>
                <Button className="btn-gradient w-full" aria-label="Go to Dashboard">
                  {t('landing.nav.dashboard')}
                </Button>
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
