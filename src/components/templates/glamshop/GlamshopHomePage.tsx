'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, RotateCcw, ShieldCheck, Star, Clock, Sparkles,
  Instagram, Facebook, ChevronLeft, ChevronRight, X, Zap,
  Heart, Droplets, Shield, Leaf, Sparkle, ArrowRight, Gem,
  Wand2, RefreshCw, Eye,
} from 'lucide-react';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { products, getProductsByCategory } from '@/data/products';
import { NewArrivals } from '@/components/home/NewArrivals';
import { CustomerFeedback } from '@/components/home/CustomerFeedback';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { useStore } from '@/store/use-store';

// ─── Color Constant ─────────────────────────────────────────
const GLAM = '#bc8752';
const GLAM_DARK = '#a06e3f';

// ─── 0. Glamshop Hero (amiy-inspired 3-column) ────────────
function GlamshopHero() {
  const navigateTo = useStore((s) => s.navigateTo);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: '#FAF5EF' }} />
      {/* Subtle gold radial glow in center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(188,135,82,0.08) 0%, transparent 100%)',
        }}
      />

      {/* Content — 3-column grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 min-h-screen items-start w-full">
        {/* ── Left Column: Gloss Product ── */}
        <motion.div
          className="flex items-start justify-center px-6 md:px-8 lg:px-12 pt-16 md:pt-24 lg:pt-32"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <div className="relative">
            {/* Decorative ring */}
            <div
              className="absolute -inset-8 md:-inset-12 rounded-full opacity-[0.06]"
              style={{ border: `3px solid ${GLAM}` }}
            />
            {/* Glow behind product */}
            <div
              className="absolute -inset-6 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: GLAM }}
            />
            <img
              src="/images/products/glamshop-hero-gloss.png"
              alt="Gloss à lèvres CHIC GLAM BY EVA"
              className="relative h-[60vh] sm:h-[65vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh] w-auto object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* ── Center Column: Text Content ── */}
        <motion.div
          className="flex flex-col items-center justify-center text-center px-6 md:px-10 py-12 md:py-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        >
          {/* Tag */}
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-6 md:mb-8"
            style={{ color: GLAM, border: `1.5px solid ${GLAM}40`, backgroundColor: `${GLAM}08` }}
          >
            <Gem className="size-3.5" />
            Cosmétiques Premium
          </span>

          {/* Title */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-foreground max-w-xl">
            Cosmétiques
            <br />
            <span style={{ color: GLAM }}>by Eva</span>
          </h1>

          {/* Description */}
          <p className="mt-5 md:mt-6 text-base md:text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-md">
            Sublimez votre beauté naturelle avec notre collection exclusive de cosmétiques de qualité premium.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigateTo('category', { category: 'makeup' })}
            className="mt-8 md:mt-10 inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full text-white font-bold text-base md:text-lg uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: GLAM }}
          >
            Découvrir
            <ArrowRight className="size-5" />
          </button>

          {/* Decorative petals / sparkles */}
          <div className="mt-8 flex items-center gap-3 opacity-40">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GLAM }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GLAM }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GLAM }} />
          </div>
        </motion.div>

        {/* ── Right Column: Mascara Product ── */}
        <motion.div
          className="flex items-start justify-center px-6 md:px-8 lg:px-12 pt-16 md:pt-24 lg:pt-32"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
        >
          <div className="relative">
            {/* Decorative ring */}
            <div
              className="absolute -inset-8 md:-inset-12 rounded-full opacity-[0.06]"
              style={{ border: `3px solid ${GLAM}` }}
            />
            {/* Glow behind product */}
            <div
              className="absolute -inset-6 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: GLAM }}
            />
            <img
              src="/images/products/glamshop-hero-mascara.png"
              alt="Mascara Bleu Saphir CHIC GLAM BY EVA"
              className="relative h-[60vh] sm:h-[65vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh] w-auto object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade to match page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #F7F7F7)' }} />
    </section>
  );
}

// ─── 1. Marquee Banner Component (#bc8752) ─────────────────
function MarqueeBanner() {
  const items = ['Makeup', 'Lingerie africaine', 'Accessoires de beautes', 'Maquillages'];
  const content = items.map((item, i) => (
    <span
      key={i}
      className="inline-flex items-center text-white font-semibold text-base md:text-lg uppercase tracking-widest mx-6 shrink-0"
    >
      <span className="mx-4 text-white/40">✦</span>
      {item}
    </span>
  ));

  return (
    <div className="w-full py-4 md:py-5 overflow-hidden" style={{ backgroundColor: GLAM }}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .glamshop-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
      <div className="flex glamshop-marquee whitespace-nowrap">
        {/* Duplicate for seamless loop */}
        {content}
        {content}
        {content}
        {content}
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
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
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
    { icon: Star, label: 'Trustpilot 4,8/5', sublabel: '+10 000 clientes satisfaites' },
  ];

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 md:py-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center text-center gap-1.5">
                <Icon className="size-10 md:size-12" style={{ color: GLAM }} strokeWidth={1.5} />
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
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
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

// ─── 6. Product Split Section — Base Fixatrice ────────────
function ProductSplitSection() {
  const navigateTo = useStore((s) => s.navigateTo);
  const primerProduct = products.find(p => p.id === 'mk-015');

  const features = [
    { icon: Droplets, text: 'Base fixatrice hydratante' },
    { icon: Shield, text: 'Resserre les pores & matifie' },
    { icon: Sparkle, text: 'Effet glow naturel' },
    { icon: Leaf, text: 'Couvrance légère longue tenue' },
  ];

  return (
    <section className="py-12 md:py-20 lg:py-24">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left — Large Image */}
            <motion.div
              className="relative flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="absolute -inset-4 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: GLAM }} />
                <img
                  src="/images/products/glamshop-primer-hydratant.png"
                  alt="Base fixatrice hydratante CHIC GLAM BY EVA"
                  className="relative w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Right — Text Content */}
            <motion.div
              className="flex flex-col justify-center text-center lg:text-left"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            >
              <span
                className="inline-block self-center lg:self-start px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest mb-6 text-white"
                style={{ backgroundColor: GLAM }}
              >
                ⭐ Best-seller
              </span>

              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
                Base Fixatrice
                <span className="block mt-1" style={{ color: GLAM }}>Hydratante</span>
              </h2>

              <p className="mt-6 text-lg md:text-xl lg:text-2xl leading-relaxed text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Ce primer est une base fixatrice hydratante, un apprêt maquillage qui resserre les pores, matifie et hydrate la peau pour un effet glow. Avec sa couvrance légère, il prépare la peau pour un maquillage longue tenue.
              </p>

              {/* Feature badges */}
              <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                {features.map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${GLAM}15` }}
                      >
                        <Icon className="size-5" style={{ color: GLAM }} />
                      </div>
                      <span className="text-sm md:text-base font-medium text-foreground">{feat.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA → Navigate to product page */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => primerProduct && navigateTo('product', { product: primerProduct })}
                  className="px-8 py-4 rounded-full text-base md:text-lg font-bold text-white shadow-lg hover:opacity-90 transition-all hover:shadow-xl"
                  style={{ backgroundColor: GLAM }}
                >
                  Voir le produit →
                </button>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─── 6b. Accessoires Product Grid (4 products) ────────────
function AccessoiresGrid() {
  const navigateTo = useStore((s) => s.navigateTo);
  const accessoiresProducts = getProductsByCategory('Accessoires');

  return (
    <section className="py-12 md:py-20 lg:py-24">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal>
          {/* Section header */}
          <div className="text-center mb-10 md:mb-14">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest mb-4 text-white"
              style={{ backgroundColor: GLAM }}
            >
              ✨ Accessoires
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Nos <span style={{ color: GLAM }}>Accessoires</span> Beauté
            </h2>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
              Les indispensables pour parfaire votre routine maquillage
            </p>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {accessoiresProducts.map((product, i) => (
              <motion.div
                key={product.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => navigateTo('product', { product })}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 md:p-6 group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: GLAM }}>
                          Nouveau
                        </span>
                      )}
                      {product.isBestseller && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-black/70">
                          Best-seller
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3 md:p-4 text-center">
                    <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 group-hover:underline">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                    <p className="mt-2 text-base md:text-lg font-bold" style={{ color: GLAM }}>
                      {product.price}€
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─── 7. Social Media Banner ───────────────────────────────
function SocialBanner() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
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

// ─── 7. Newsletter Banner (#bc8752) ───────────────────────
function NewsletterBanner() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
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

// ─── 8. Promo Code Popup ──────────────────────────────────
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
                  className="w-full px-5 py-3 rounded-full border border-border text-sm focus:outline-none transition-all"
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
    <main id="glamshop-root" className="min-h-screen" style={{ background: '#F7F7F7' }}>
      {/* Glamshop-wide override: force shared components to 1920px */}
      <style>{`
        #glamshop-root .max-w-\[1440px\] {
          max-width: 1920px !important;
          padding-left: 2.5rem !important;
          padding-right: 2.5rem !important;
        }
        @media (min-width: 1024px) {
          #glamshop-root .lg\:px-8 {
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }
        }
      `}</style>
      {/* 0. Hero — amiy-inspired 3-column */}
      <GlamshopHero />
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
      {/* 7b. Product Split Section — Base Fixatrice */}
      <ProductSplitSection />
      {/* 7c. Accessoires Grid (4 products) */}
      <AccessoiresGrid />
      {/* 8. Category Promo Carousel */}
      <CategoryPromoCarousel />
      {/* 9. Promo Strip */}
      <PromoStrip text="Retours gratuits sous 15 jours — Satisfait ou remboursé" />
      {/* 11. Customer Feedback */}
      <CustomerFeedback />
      {/* 12. Social Media */}
      <SocialBanner />
      {/* 13. Newsletter */}
      <NewsletterBanner />
      {/* 14. Promo Code Popup */}
      <PromoCodePopup />
    </main>
  );
}

export default GlamshopHomePage;
