'use client';

import { useEffect, useState, useCallback } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function MaintenancePage({ message, endTime }: { message: string; endTime?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    if (!endTime) return null;
    const target = new Date(endTime).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) return null;

    return {
      total: diff,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [endTime]);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    if (!endTime) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (!remaining) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, calculateTimeLeft]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse" style={{ background: 'radial-gradient(circle, #bc8752, transparent)', animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-8 animate-pulse" style={{ background: 'radial-gradient(circle, #bc8752, transparent)', animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #bc8752, transparent)' }} />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Logo / Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'rgba(188,135,82,0.15)', border: '2px solid rgba(188,135,82,0.3)' }}>
            <svg className="w-10 h-10" style={{ color: '#bc8752' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
            ChicGlam<span style={{ color: '#bc8752' }}>byEva</span>
          </h1>
          <div className="w-16 h-0.5 mx-auto mt-4" style={{ background: '#bc8752' }} />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: 'rgba(188,135,82,0.15)', color: '#bc8752', border: '1px solid rgba(188,135,82,0.2)' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#bc8752' }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#bc8752' }} />
          </span>
          Maintenance en cours
        </div>

        {/* Message */}
        <p className="text-lg sm:text-xl text-white/70 mb-10 leading-relaxed max-w-lg mx-auto">
          {message || 'Nous effectuons une mise à jour pour améliorer votre expérience. Revenez bientôt !'}
        </p>

        {/* Countdown Timer */}
        {mounted && endTime && timeLeft && (
          <div className="mb-10">
            <p className="text-sm uppercase tracking-widest mb-5 font-medium" style={{ color: '#bc8752' }}>
              Retour estimé dans
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {[
                { value: timeLeft.days, label: 'Jours' },
                { value: timeLeft.hours, label: 'Heures' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Secondes' },
              ].map((item, index) => (
                <div key={item.label} className="flex items-center gap-3 sm:gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-white transition-transform"
                      style={{
                        background: 'rgba(188,135,82,0.12)',
                        border: '1px solid rgba(188,135,82,0.25)',
                        boxShadow: '0 0 30px rgba(188,135,82,0.08)',
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <span className="text-xs sm:text-sm text-white/50 mt-2 uppercase tracking-wider font-medium">
                      {item.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <span className="text-xl sm:text-2xl font-bold mb-5" style={{ color: '#bc8752' }}>
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-6 mx-auto max-w-md">
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(188,135,82,0.15)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    background: 'linear-gradient(90deg, #bc8752, #d4a574)',
                    width: `${Math.max(0, 100 - (timeLeft.total / (new Date(endTime).getTime() - (Date.now() - 60000)) * 100))}%`,
                    boxShadow: '0 0 10px rgba(188,135,82,0.4)',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* No countdown — just maintenance message */}
        {mounted && !endTime && (
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl" style={{ background: 'rgba(188,135,82,0.1)', border: '1px solid rgba(188,135,82,0.2)' }}>
              <svg className="w-5 h-5 animate-spin" style={{ color: '#bc8752' }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-white/60 text-sm">Mise à jour en cours, merci de patienter...</span>
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="pt-8 border-t" style={{ borderColor: 'rgba(188,135,82,0.15)' }}>
          <p className="text-white/40 text-sm">
            Une question ? Contactez-nous à{' '}
            <a href="mailto:contact@chicglambyeva.com" className="underline transition-colors" style={{ color: '#bc8752' }}>
              contact@chicglambyeva.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
