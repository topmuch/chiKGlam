'use client';

import { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { useStore } from '@/store/use-store';

const COOKIE_CONSENT_KEY = 'chicglam_cookie_consent';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const navigateTo = useStore((s) => s.navigateTo);

  useEffect(() => {
    // Check if user already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show after a small delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setVisible(false);
  };

  const handleCustomize = () => {
    setVisible(false);
    navigateTo('privacy');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom duration-500">
      {/* Backdrop on mobile */}
      <div className="fixed inset-0 bg-black/20 md:hidden" onClick={handleDecline} />

      <div className="relative md:max-w-3xl md:mx-auto md:mb-4 md:mx-8 bg-white border border-border rounded-t-xl md:rounded-xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleDecline}
          className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fermer"
        >
          <X className="size-4" />
        </button>

        <div className="p-4 md:p-6">
          <div className="flex items-start gap-3 md:gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center mt-0.5">
              <Shield className="size-5 text-foreground" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-sm md:text-base text-foreground">
                🍪 Nous respectons votre vie privée
              </h3>
              <p className="mt-1.5 text-xs md:text-sm text-muted-foreground leading-relaxed">
                Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et afficher du contenu personnalisé. En cliquant sur &quot;Tout accepter&quot;, vous consentez à notre utilisation des cookies.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-foreground text-background text-xs md:text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              Tout accepter
            </button>
            <button
              onClick={handleCustomize}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full border border-border text-foreground text-xs md:text-sm font-medium hover:bg-muted transition-colors"
            >
              Personnaliser
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full text-muted-foreground text-xs md:text-sm font-medium hover:text-foreground transition-colors"
            >
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
