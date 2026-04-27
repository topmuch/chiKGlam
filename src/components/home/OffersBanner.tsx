'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { useStore } from '@/store/use-store';
import { getProductsByCategory } from '@/data/products';
import type { Product } from '@/types';

interface BannerSlide {
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  tag: string;
}

const SLIDES: BannerSlide[] = [
  {
    title: "Collection Makeup",
    subtitle: "Découvrez notre sélection de maquillage haut de gamme",
    cta: "Voir la Collection",
    link: 'makeup',
    tag: 'Nouveautés Maquillage',
  },
  {
    title: "Accessoires Beauté",
    subtitle: "Les indispensables pour sublimer votre routine beauté",
    cta: "Découvrir",
    link: 'accessoires',
    tag: 'Tendances Accessoires',
  },
];

// Deterministic shuffle based on category to keep images stable across renders
function pickProducts(products: Product[], count: number, seed: number): Product[] {
  if (!products || products.length === 0) return [];
  const shuffled = [...products];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed + i * 7) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function ProductCollage({ products, slideIndex }: { products: Product[]; slideIndex: number }) {
  if (products.length === 0) return null;

  // Desktop: show 5 images in an asymmetric grid
  // Mobile: show 3 images
  const desktopProducts = products.slice(0, 5);
  const mobileProducts = products.slice(0, 3);

  return (
    <>
      {/* Mobile: 3 images in a row */}
      <div className="flex lg:hidden h-full">
        {mobileProducts.map((product, i) => (
          <div key={`${slideIndex}-${i}`} className="flex-1 relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Desktop: asymmetric mosaic grid */}
      <div className="hidden lg:grid grid-cols-12 grid-rows-2 gap-1 h-full absolute inset-0">
        {/* Large left image - spans 2 rows */}
        <div className="col-span-5 row-span-2 relative overflow-hidden">
          <img
            src={desktopProducts[0]?.image}
            alt={desktopProducts[0]?.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Top right - 2 images */}
        <div className="col-span-4 relative overflow-hidden">
          <img
            src={desktopProducts[1]?.image}
            alt={desktopProducts[1]?.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="col-span-3 relative overflow-hidden">
          <img
            src={desktopProducts[2]?.image}
            alt={desktopProducts[2]?.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Bottom right - 2 images */}
        <div className="col-span-3 relative overflow-hidden">
          <img
            src={desktopProducts[3]?.image}
            alt={desktopProducts[3]?.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="col-span-4 relative overflow-hidden">
          <img
            src={desktopProducts[4]?.image}
            alt={desktopProducts[4]?.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
}

export function OffersBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigateTo = useStore((s) => s.navigateTo);

  // Use static data directly — no API dependency for product images
  const makeupProducts = getProductsByCategory('Makeup');
  const accessoiresProducts = getProductsByCategory('Accessoires');

  // Pick products for each slide
  const slideProducts = [
    pickProducts(makeupProducts, 5, 42),
    pickProducts(accessoiresProducts, 5, 73),
  ];

  const hasProducts = slideProducts[0].length > 0 || slideProducts[1].length > 0;

  const nextSlide = useCallback(() => {
    setCurrentSlide((s) => (s + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Don't render if no products available yet
  if (!hasProducts) return null;

  const safeIndex = Math.min(currentSlide, SLIDES.length - 1);
  const slide = SLIDES[safeIndex];
  const products = slideProducts[safeIndex];

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative rounded-xl overflow-hidden cursor-pointer group bg-[#1a1a1a]" style={{ minHeight: '300px' }}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={safeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                {/* Product collage background */}
                <ProductCollage products={products} slideIndex={safeIndex} />

                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Subtle decorative elements */}
                <div className="absolute top-6 right-6 w-24 h-24 border-2 border-white/10 rounded-full hidden lg:block" />
                <div className="absolute bottom-6 right-10 w-16 h-16 border border-white/10 rounded-full hidden lg:block" />
                <div className="absolute top-10 right-10 w-3 h-3 bg-white/20 rounded-full hidden lg:block" />
              </motion.div>
            </AnimatePresence>

            {/* Content overlay */}
            <div
              className="relative z-10 p-8 md:p-12 min-h-[300px] md:min-h-[380px] flex flex-col justify-center"
              onClick={() => navigateTo('category', { category: slide.link })}
            >
              {/* Decorative tag */}
              <div className="inline-flex items-center gap-1.5 mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">
                  {slide.tag}
                </span>
              </div>

              <AnimatePresence mode="popLayout">
                <motion.div
                  key={safeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white drop-shadow-md max-w-xl">
                    {slide.title}
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-white/80 drop-shadow-sm max-w-xs">
                    {slide.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              <motion.button
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors duration-300 w-fit shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('category', { category: slide.link })}
              >
                {slide.cta}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === safeIndex
                      ? 'w-6 bg-white'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
