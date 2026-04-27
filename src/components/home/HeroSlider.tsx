'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides as staticHeroSlides } from '@/data/products';
import { useStore } from '@/store/use-store';
import { useBanners, BannerData } from '@/lib/use-banners';

export function HeroSlider() {
  const { banners, loading } = useBanners('hero');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigateTo = useStore((s) => s.navigateTo);

  // Use DB banners if available, otherwise fall back to static
  const slides = useMemo(() => {
    if (loading) return [];
    if (banners.length > 0) {
      return banners.map((b: BannerData) => ({
        title: b.title,
        subtitle: b.subtitle,
        cta: b.cta,
        image: b.image,
        link: b.link,
      }));
    }
    return staticHeroSlides;
  }, [banners, loading]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((s) => (s + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length, nextSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleCTA = (link: string) => {
    navigateTo('category', { category: link });
  };

  // Don't render until loaded
  if (loading || slides.length === 0) {
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-muted animate-pulse" />
    );
  }

  const safeSlide = Math.min(currentSlide, slides.length - 1);

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group bg-black">
      <AnimatePresence>
        <motion.div
          key={safeSlide}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {/* Background image */}
          <img
            src={slides[safeSlide].image}
            alt={slides[safeSlide].title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/20" />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto">
            <motion.h1
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {slides[safeSlide].title}
            </motion.h1>
            <motion.p
              className="mt-4 text-base md:text-lg text-white/85 max-w-xl font-sans drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {slides[safeSlide].subtitle}
            </motion.p>
            {slides[safeSlide].cta && (
              <motion.button
                onClick={() => handleCTA(slides[safeSlide].link)}
                className="mt-8 bg-white text-black px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-white/90 transition-colors duration-300 hover:shadow-lg drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {slides[safeSlide].cta}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      {slides.length > 1 && (
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-foreground opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Right Arrow */}
      {slides.length > 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-foreground opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === safeSlide
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
