'use client';

import { Truck, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { TrendingProducts } from '@/components/home/TrendingProducts';
import { OffersBanner } from '@/components/home/OffersBanner';
import { NewArrivals } from '@/components/home/NewArrivals';
import { CustomerFeedback } from '@/components/home/CustomerFeedback';
import { PromoDualBanner } from '@/components/home/PromoDualBanner';
import { useTemplate } from '@/hooks/use-template';

function TrustBar() {
  const items = [
    { icon: Truck, label: 'Livraison Gratuite', sublabel: 'Dès 50€ d\'achat' },
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
                <Icon className="size-6 md:size-7 text-foreground" strokeWidth={1.5} />
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

function NewsletterBanner() {
  const { isGold } = useTemplate();
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-background rounded-xl p-8 md:p-14 text-center ${isGold ? 'bg-[#bc8752]' : 'bg-foreground'}`}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Star className="size-5 fill-background text-background" />
            <Star className="size-5 fill-background text-background" />
            <Star className="size-5 fill-background text-background" />
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-bold tracking-tight">
            Join Our Beauty Community
          </h2>
          <p className="mt-3 text-base md:text-lg text-background/70 max-w-lg mx-auto">
            Soyez la première informée des nouveautés, offres exclusives et conseils beauté
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Entrez votre adresse e-mail"
              className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-background placeholder:text-background/40 focus:outline-none focus:border-white/50 transition-colors text-sm"
            />
            <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-white text-foreground font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg">
              S'abonner
            </button>
          </div>
          <p className="mt-4 text-xs text-background/40">
            En vous abonnant, vous acceptez notre Politique de Confidentialité et consentez à recevoir nos communications.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: '#F7F7F7' }}>
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Shop by Category (with enlarged images) */}
      <CategoriesGrid />

      {/* 4. Trending Products */}
      <TrendingProducts />

      {/* 5. Offers Banner (dispersed - shows one at a time, rotates) */}
      <OffersBanner />

      {/* 6. New Arrivals */}
      <NewArrivals />

      {/* 6.5 Promotional Dual Banner */}
      <PromoDualBanner />

      {/* 7. Customer Feedback (auto-scrolling) */}
      <CustomerFeedback />

      {/* 8. Newsletter / Beauty Community Banner */}
      <NewsletterBanner />
    </main>
  );
}
