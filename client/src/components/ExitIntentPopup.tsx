import { useState, useEffect } from 'react';
import { X, Rocket, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if popup was already shown in this session
    const shown = sessionStorage.getItem('exitIntentShown');
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of page (not sides/bottom)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaim = () => {
    // Redirect to signup with discount code
    window.location.href = '/app/dashboard?discount=SAVE20';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="relative glass-card max-w-lg w-full p-8 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={32} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('landing.exitIntent.title', 'Warte! Nicht so schnell...')}
          </h2>
          <p className="text-white/80 text-lg mb-6">
            {t(
              'landing.exitIntent.subtitle',
              'Erhalte 20% Rabatt auf Houston Pro für deine ersten 3 Monate!'
            )}
          </p>

          {/* Discount Badge */}
          <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-2xl mb-6">
            20% RABATT
          </div>

          <p className="text-white/70 text-sm mb-8">
            {t(
              'landing.exitIntent.description',
              'Spare €29,40 in den ersten 3 Monaten. Nur €39,20/Monat statt €49/Monat. Angebot endet in 24 Stunden!'
            )}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleClaim}
              className="btn-gradient px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <Rocket size={20} />
              {t('landing.exitIntent.cta', 'Rabatt sichern')}
            </button>
            <button
              onClick={handleClose}
              className="px-8 py-4 rounded-full font-semibold text-lg border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
            >
              {t('landing.exitIntent.decline', 'Nein, danke')}
            </button>
          </div>

          {/* Trust Badge */}
          <p className="text-white/50 text-xs mt-6">
            ✓ {t('landing.exitIntent.trust', 'Keine Kreditkarte erforderlich')} • ✓{' '}
            {t('landing.exitIntent.cancel', 'Jederzeit kündbar')}
          </p>
        </div>
      </div>
    </div>
  );
}
