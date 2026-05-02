'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { heroSlides } from '@/data/products';
import { useStore } from '@/store/use-store';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>(heroSlides || []);
  const { navigateTo } = useStore();

  useEffect(() => {
    fetch('/api/banners?type=hero')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setSlides(data);
      })
      .catch(() => {
        // fallback to heroSlides
      });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {slides[currentSlide]?.image ? (
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title || 'Slide'}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: slides[currentSlide]?.backgroundColor || '#bc8752' }}
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="max-w-lg"
                >
                  {slides[currentSlide]?.subtitle && (
                    <p
                      className="mb-2 text-sm font-medium uppercase tracking-widest"
                      style={{ color: '#bc8752' }}
                    >
                      {slides[currentSlide].subtitle}
                    </p>
                  )}
                  <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                    {slides[currentSlide]?.title || 'Bienvenue'}
                  </h1>
                  {slides[currentSlide]?.description && (
                    <p className="mb-6 text-base text-white/80 sm:text-lg max-w-md">
                      {slides[currentSlide].description}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Button
                      className="text-white font-semibold px-6 py-5"
                      style={{ backgroundColor: '#bc8752' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a07040')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bc8752')}
                      onClick={() => {
                        const link = slides[currentSlide]?.link;
                        if (link) navigateTo('category', { slug: link.slug, name: link.name });
                      }}
                      size="lg"
                    >
                      Découvrir
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-8 bg-[#bc8752]'
                  : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
