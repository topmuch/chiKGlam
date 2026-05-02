'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as LinkIcon, X } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[90] p-4"
        >
          <div className="mx-auto max-w-5xl rounded-xl bg-white px-6 py-5 shadow-2xl border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <LinkIcon className="h-4 w-4 text-[#bc8752]" />
                  <h4 className="text-sm font-semibold text-gray-900">🛍️ Cookies & Confidentialité</h4>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site, personnaliser
                  le contenu et analyser notre trafic. En continuant votre navigation, vous acceptez
                  notre{' '}
                  <Link href="#" className="text-[#bc8752] underline hover:text-[#a07040]">
                    politique de cookies
                  </Link>
                  .
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleDecline}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Refuser
                </button>
                <button
                  onClick={handleAccept}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: '#bc8752' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a07040')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bc8752')}
                >
                  Accepter tous
                </button>
              </div>
              <button
                onClick={handleDecline}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 sm:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
