'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, RotateCcw, ShieldCheck, Star, Clock, Sparkles, Gift,
  Instagram, Facebook, ChevronLeft, ChevronRight, X, Zap,
  Award, Heart,
} from 'lucide-react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { NewArrivals } from '@/components/home/NewArrivals';
import { CustomerFeedback } from '@/components/home/CustomerFeedback';
import { PromoDualBanner } from '@/components/home/PromoDualBanner';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { useStore } from '@/store/use-store';

// ─── Color Constant ─────────────────────────────────────────
const GLAM = '#bc8752';
const GLAM_DARK = '#a06e3f';

// ─── 1. Marquee Banner Component (#bc8752) ─────────────────
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
    <div className="w-full py-3 overflow-hidden" style={{ backgroundColor: GLAM }}>
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

// ─── 2. Flash Sale Countdown Banner ────────────────────────
function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 47, seconds: 32 });
  const navigateTo = useStore((s) => s.navigateTo);

  useEffect(() => {
    // Set end time to 6 hours from now (persists across renders)
    const endTime = Date.now() + 6 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      const diff = Math.max(0, endTime - Date.now());
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="w-full py-3 md:py-4" style={{ backgroundColor: GLAM_DARK }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-white text-sm md:text-base">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
            <Zap className="size-4 md:size-5 fill-yellow-300 text-yellow-300" />
            <span>Offre Flash</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-white/70" />
            <span className="text-white/70 hidden sm:inline">Se termine dans</span>
            <div className="flex items-center gap-1.5 font-mono font-bold">
              <span className="bg-black/30 rounded px-2 py-0.5 text-sm">{pad(timeLeft.hours)}</span>
              <span className="text-white/50">:</span>
              <span className="bg-black/30 rounded px-2 py-0.5 text-sm">{pad(timeLeft.minutes)}</span>
              <span className="text-white/50">:</span>
              <span className="bg-black/30 rounded px-2 py-0.5 text-sm">{pad(timeLeft.seconds)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Code :</span>
            <span className="bg-white text-black font-bold px-3 py-0.5 rounded text-sm tracking-wider">GLAM15</span>
            <button
              onClick={() => navigateTo('category', { category: 'makeup' })}
              className="ml-1 text-xs md:text-sm font-bold underline underline-offset-2 hover:no-underline transition-all"
            >
              Voir les offres →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. Promo Strip Banner (between sections) ──────────────
function PromoStrip({ text, code }: { text: string; code?: string }) {
  return (
    <div className="w-full py-3 md:py-4 text-center" style={{ backgroundColor: GLAM }}>
      <p className="text-white font-semibold text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2 flex-wrap px-4">
        <Sparkles className="size-4 fill-white text-white" />
        <span>{text}</span>
        {code && (
          <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs md:text-sm font-bold tracking-widest ml-1">
            {code}
          </span>
        )}
      </p>
    </div>
  );
}

// ─── 4. Trust Bar (icons #bc8752) ──────────────────────────
function TrustBar() {
  const items = [
    { icon: Truck, label: 'Livraison Gratuite', sublabel: "Dès 50€ d'achat" },
    { icon: RotateCcw, label: 'Retours Gratuits', sublabel: 'Politique de retour 30 jours' },
    { icon: ShieldCheck, label: 'Paiement Sécurisé', sublabel: '100% protégé' },
    { icon: Award, label: 'Trustpilot 4,8/5', sublabel: '+10 000 clientes satisfaites' },
  ];

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 md:py-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center text-center gap-1.5">
                <Icon className="size-6 md:size-7" style={{ color: GLAM }} strokeWidth={1.5} />
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

// ─── 5. Category Promo Banners Carousel ────────────────────
function CategoryPromoCarousel() {
  const [current, setCurrent] = useState(0);
  const navigateTo = useStore((s) => s.navigateTo);

  const slides = [
    {
      title: 'Collection Makeup',
      subtitle: 'Maquillage professionnel pour sublimer votre beauté naturelle',
      cta: 'Découvrir',
      link: 'makeup',
      image: '/images/categories/glamshop-makeup-banner.jpg',
      badge: 'Nouveautés',
    },
    {
      title: 'Lingerie Africaine',
      subtitle: "L'élégance africaine au feminin — pagnes & ensembles exclusifs",
      cta: 'Explorer',
      link: 'lingerie',
      image: '/images/categories/glamshop-lingerie-banner.webp',
      badge: 'Exclusivités',
    },
    {
      title: 'Accessoires Beauté',
      subtitle: 'Les indispensables pour parfaire votre routine beauté',
      cta: 'Voir tout',
      link: 'accessoires',
      image: '/images/categories/glamshop-accessoires-banner.jpg',
      badge: 'Tendances',
    },
  ];

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative rounded-xl overflow-hidden cursor-pointer group" style={{ minHeight: '220px' }}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={current}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div
              className="relative z-10 p-6 md:p-10 lg:p-14 flex flex-col justify-center min-h-[220px] md:min-h-[280px]"
              onClick={() => navigateTo('category', { category: slide.link })}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider text-white mb-3" style={{ backgroundColor: GLAM }}>
                    {slide.badge}
                  </span>
                  <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-md max-w-lg">
                    {slide.title}
                  </h3>
                  <p className="mt-2 text-sm md:text-base text-white/80 max-w-md">
                    {slide.subtitle}
                  </p>
                  <button
                    className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-colors shadow-lg hover:opacity-90"
                    style={{ backgroundColor: GLAM }}
                  >
                    {slide.cta}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─── 6. Featured Brands Section ────────────────────────────
function FeaturedBrands() {
  const brands = [
    { name: 'ChicGlam by Eva', tagline: 'Notre marque signature' },
    { name: 'Miss Glam', tagline: 'Palettes & Fards' },
    { name: 'Diongue Beauty', tagline: 'Maquillage professionnel' },
    { name: 'Flawless Finish', tagline: 'Base & Correcteur' },
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: GLAM }}>
              NOS MARQUES
            </h2>
            <p className="mt-2 text-muted-foreground text-sm md:text-base">
              Découvrez les marques que nous aimons
            </p>
            <div className="mt-3 h-1 w-16 rounded-full mx-auto" style={{ backgroundColor: GLAM }} />
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {brands.map((brand, index) => (
            <ScrollReveal key={brand.name} delay={index * 0.1}>
              <motion.div
                className="relative bg-[#F7F7F7] rounded-xl p-6 md:p-8 text-center cursor-pointer group hover:shadow-lg transition-all duration-300 border border-transparent hover:border-border"
                whileHover={{ y: -4 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${GLAM}15` }}>
                  <Sparkles className="size-7" style={{ color: GLAM }} />
                </div>
                <h3 className="font-heading text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{brand.tagline}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. Gift Ideas Section ─────────────────────────────────
function GiftIdeas() {
  const navigateTo = useStore((s) => s.navigateTo);

  const ideas = [
    {
      title: 'Coffret Maquillage',
      subtitle: 'Tout pour un look complet',
      emoji: '💄',
      link: 'makeup',
    },
    {
      title: 'Coffret Soin',
      subtitle: 'Hydratation & éclat',
      emoji: '✨',
      link: 'makeup',
    },
    {
      title: 'Coffret Lingerie',
      subtitle: "L'élégance en cadeau",
      emoji: '🎀',
      link: 'lingerie',
    },
    {
      title: 'Kit Accessoires',
      subtitle: 'Les essentiels beauté',
      emoji: '🎁',
      link: 'accessoires',
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="size-5" style={{ color: GLAM }} />
                <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: GLAM }}>
                  IDÉES CADEAUX
                </h2>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">
                Des coffrets pensés pour faire plaisir
              </p>
            </div>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {ideas.map((idea, index) => (
            <ScrollReveal key={idea.title} delay={index * 0.1}>
              <motion.div
                className="relative rounded-xl overflow-hidden cursor-pointer group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('category', { category: idea.link })}
              >
                <div className="bg-white border border-border p-5 md:p-6 text-center h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="text-4xl md:text-5xl mb-3">{idea.emoji}</div>
                  <h3 className="font-heading text-sm md:text-base font-bold text-foreground">{idea.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{idea.subtitle}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: GLAM }}>
                    Découvrir
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 8. Social Media Banner ───────────────────────────────
function SocialBanner() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl p-8 md:p-12 text-center" style={{ backgroundColor: '#1a1a1a' }}>
          <Heart className="size-6 mx-auto mb-3 text-white/60" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-tight">
            Suivez-nous sur les réseaux
          </h2>
          <p className="mt-2 text-sm text-white/60 max-w-md mx-auto">
            Rejoignez notre communauté beauté et ne manquez aucune tendance
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="size-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
              aria-label="TikTok"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 10.86 4.46V13a8.28 8.28 0 0 0 5.58 2.16v-3.44a4.85 4.85 0 0 1-1-.1V6.69h1z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 9. Newsletter Banner (#bc8752) ───────────────────────
function NewsletterBanner() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-white rounded-xl p-8 md:p-14 text-center" style={{ backgroundColor: GLAM }}>
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
            <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-white font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg" style={{ color: GLAM }}>
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

// ─── 10. Promo Code Popup ──────────────────────────────────
function PromoCodePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds, only once per session
    const shown = sessionStorage.getItem('glamshop-promo-shown');
    if (!shown) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('glamshop-promo-shown', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          {/* Popup */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Top accent */}
            <div className="p-8 text-center text-white" style={{ backgroundColor: GLAM }}>
              <div className="text-4xl mb-3">💡</div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold">
                -15% sur votre 1ère commande
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Inscrivez-vous et recevez votre code promo exclusif
              </p>
            </div>

            {/* Bottom */}
            <div className="p-6 text-center">
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Votre adresse e-mail"
                  className="w-full px-5 py-3 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all"
                  style={{ focusRingColor: GLAM }}
                />
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 rounded-full text-white font-semibold text-sm transition-colors shadow-lg hover:opacity-90"
                  style={{ backgroundColor: GLAM }}
                >
                  Obtenir mon code GLAM15
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                En vous inscrivant, vous acceptez notre politique de confidentialité.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Glamshop Home Page ────────────────────────────────────
export function GlamshopHomePage() {
  return (
    <main className="min-h-screen" style={{ background: '#F7F7F7' }}>
      {/* 1. Hero Slider */}
      <HeroSlider />
      {/* 2. Marquee Banner (#bc8752) */}
      <MarqueeBanner />
      {/* 3. Flash Sale Countdown */}
      <FlashSaleBanner />
      {/* 4. Trust Bar */}
      <TrustBar />
      {/* 5. Categories */}
      <CategoriesGrid />
      {/* 6. Promo Strip */}
      <PromoStrip text="Livraison gratuite dès 100€ d'achat" code="LIVRAISON100" />
      {/* 7. Cosmétiques by Eva (4 products only) */}
      <NewArrivals />
      {/* 8. Category Promo Carousel */}
      <CategoryPromoCarousel />
      {/* 9. Promo Strip */}
      <PromoStrip text="Retours gratuits sous 15 jours — Satisfait ou remboursé" />
      {/* 10. Featured Brands */}
      <FeaturedBrands />
      {/* 11. Promotional Dual Banner (Offres Exclusives) */}
      <PromoDualBanner />
      {/* 12. Gift Ideas */}
      <GiftIdeas />
      {/* 13. Customer Feedback */}
      <CustomerFeedback />
      {/* 14. Social Media */}
      <SocialBanner />
      {/* 15. Newsletter */}
      <NewsletterBanner />
      {/* 16. Promo Code Popup */}
      <PromoCodePopup />
    </main>
  );
}

export default GlamshopHomePage;
