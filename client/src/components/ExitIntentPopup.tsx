import { useState, useEffect } from "react";
import { X, Sparkles, Gift, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getLoginUrl } from "@/const";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { i18n } = useTranslation();
  const isGerman = i18n.language === "de";

  useEffect(() => {
    // Check if popup was already shown in this session
    const shown = sessionStorage.getItem("exitIntentShown");
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of page (not sides/bottom)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaim = () => {
    // Redirect to signup
    window.location.href = getLoginUrl();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Popup */}
      <div
        className="relative glass-card max-w-lg w-full p-8 animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-popup-title"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          aria-label={isGerman ? "Schließen" : "Close"}
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] flex items-center justify-center shadow-lg shadow-[#FF6B9D]/30">
            <Gift size={32} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2
            id="exit-popup-title"
            className="text-2xl md:text-3xl font-bold text-white mb-4"
          >
            {isGerman
              ? "Warte! Nimm deine 50 kostenlosen Credits mit"
              : "Wait! Take your 50 free credits with you"}
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-6">
            {isGerman
              ? "Houston wartet darauf, dir bei deinem Marketing zu helfen. Starte jetzt kostenlos – keine Kreditkarte nötig."
              : "Houston is waiting to help you with your marketing. Start for free – no credit card required."}
          </p>

          {/* Value proposition */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <p className="text-white font-semibold mb-2">
              {isGerman
                ? "Mit 50 Starter-Credits kannst du:"
                : "With 50 starter credits you can:"}
            </p>
            <ul className="text-sm text-white/80 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6B9D] shrink-0" />
                {isGerman
                  ? "~16 Tiefenanalysen für dein Marketing durchführen"
                  : "Run ~16 deep analyses for your marketing"}
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6B9D] shrink-0" />
                {isGerman
                  ? "Unbegrenzt mit Houston chatten"
                  : "Chat unlimited with Houston"}
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6B9D] shrink-0" />
                {isGerman
                  ? "SMART-Ziele und Strategien entwickeln"
                  : "Develop SMART goals and strategies"}
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-[#FF6B9D] via-[#C44FE2] via-[#8B5CF6] to-[#00D4FF] px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#FF6B9D]/30 hover:scale-[1.02] transition-all text-white"
            >
              <Gift size={20} />
              {isGerman ? "Kostenlos starten" : "Start free now"}
              <ArrowRight size={20} />
            </button>
            <button
              onClick={handleClose}
              className="w-full px-8 py-3 rounded-xl font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isGerman
                ? "Nein danke, vielleicht später"
                : "No thanks, maybe later"}
            </button>
          </div>

          {/* Trust Badge */}
          <p className="text-white/50 text-xs mt-6">
            ✓{" "}
            {isGerman
              ? "Keine Kreditkarte erforderlich"
              : "No credit card required"}{" "}
            · ✓ {isGerman ? "Jederzeit kündbar" : "Cancel anytime"} · ✓{" "}
            {isGerman ? "Keine versteckten Kosten" : "No hidden fees"}
          </p>
        </div>
      </div>
    </div>
  );
}
