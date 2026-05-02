'use client';

import { useEffect, useRef } from 'react';
import { Truck, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { NewArrivals } from '@/components/home/NewArrivals';
import { CustomerFeedback } from '@/components/home/CustomerFeedback';
import { PromoDualBanner } from '@/components/home/PromoDualBanner';

// ─── Marquee Banner Component (#bc8752) ─────────────────────
function MarqueeBanner() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    let scrollPos = 0;
    const speed = 0.8;
    const animate = () => {
      scrollPos += speed;
      if (scrollPos >= el.scrollWidth / 2) scrollPos = 0;
      el.scrollLeft = scrollPos;
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const items = ['Makeup', 'Lingerie africaine', 'Accessoires de beautes', 'Maquillages'];

  return (
    <div className="w-full py-3 overflow-hidden" style={{ backgroundColor: '#bc8752' }}>
      <div
        ref={marqueeRef}
        className="flex whitespace-nowrap"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {[...items, ...items, ...items, ...items, ...items, ...items].map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center text-white font-semibold text-sm uppercase tracking-widest mx-4"
          >
            <span className="mx-3 text-white/40">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Trust Bar (icons #bc8752) ────────────────────────────
function TrustBar() {
  const items = [
    { icon: Truck, label: 'Livraison Gratuite', sublabel: "Dès 50€ d'achat" },
    { icon: RotateCcw, label: 'Retours Gratuits', sublabel: 'Politique de retour 30 jours' },
    { icon: ShieldCheck, label: 'Paiement Sécurisé', sublabel: '100% protégé' },
    { icon: Star, label: 'Avis Excellents', sublabel: '4,8/5 de plus de 10 000 clientes' },
  ];

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 md:py-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center text-center gap-1.5">
                <Icon className="size-6 md:size-7" style={{ color: '#bc8752' }} strokeWidth={1.5} />
                <span className="text-sm md:text-base font-semibold text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.sublabel}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Newsletter Banner (#bc8752) ──────────────────────────
function NewsletterBanner() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-white rounded-xl p-8 md:p-14 text-center" style={{ backgroundColor: '#bc8752' }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Star className="size-5 fill-white text-white" />
            <Star className="size-5 fill-white text-white" />
            <Star className="size-5 fill-white text-white" />
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-bold tracking-tight">
            Rejoignez Notre Beauté Communauté
          </h2>
          <p className="mt-3 text-base md:text-lg text-white/70 max-w-lg mx-auto">
            Soyez la première informée des nouveautés, offres exclusives et conseils beauté
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Entrez votre adresse e-mail"
              className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors text-sm"
            />
            <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-white font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg" style={{ color: '#bc8752' }}>
              S&apos;abonner
            </button>
          </div>
          <p className="mt-4 text-xs text-white/40">
            En vous abonnant, vous acceptez notre Politique de Confidentialité et consentez à recevoir nos communications.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Glamshop Home Page (NO TrendingProducts, Cosmétiques=4) ──
export function GlamshopHomePage() {
  return (
    <main className="min-h-screen" style={{ background: '#F7F7F7' }}>
      {/* 1. Hero Slider */}
      <HeroSlider />
      {/* 2. Marquee Banner (#bc8752) */}
      <MarqueeBanner />
      {/* 3. Trust Bar */}
      <TrustBar />
      {/* 4. Categories (images same size as products) */}
      <CategoriesGrid />
      {/* NO TrendingProducts — removed per user request */}
      {/* 5. Cosmétiques by Eva (4 products only) */}
      <NewArrivals />
      {/* 6. Promotional Dual Banner */}
      <PromoDualBanner />
      {/* 7. Customer Feedback */}
      <CustomerFeedback />
      {/* 8. Newsletter */}
      <NewsletterBanner />
    </main>
  );
}

export default GlamshopHomePage;
