'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { useStore } from '@/store/use-store';
import { Sparkles, Gem, Droplets, Flame, Palette, Crown } from 'lucide-react';

const brands = [
  { name: 'La Mer', icon: Gem },
  { name: 'Charlotte Tilbury', icon: Sparkles },
  { name: 'Olaplex', icon: Droplets },
  { name: 'Drunk Elephant', icon: Flame },
  { name: 'Fenty Beauty', icon: Palette },
  { name: 'Tom Ford', icon: Crown },
  { name: 'SK-II', icon: Droplets },
  { name: 'Tatcha', icon: Sparkles },
  { name: 'Glossier', icon: Palette },
  { name: 'Jo Malone', icon: Gem },
  { name: 'Dyson', icon: Flame },
  { name: 'Aesop', icon: Crown },
];

export function BrandSpotlight() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigateTo = useStore((s) => s.navigateTo);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Nos Marques
              </h2>
              <div className="mt-2 h-1 w-16 bg-foreground rounded-full" />
              <p className="mt-3 text-muted-foreground text-base">
                Découvrez les marques de beauté de confiance
              </p>
            </div>

            {/* Scroll arrows - desktop only */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-foreground hover:text-background transition-colors"
                aria-label="Scroll brands left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-foreground hover:text-background transition-colors"
                aria-label="Scroll brands right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Horizontal scrollable brand strip */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {brands.map((brand, index) => {
            const IconComponent = brand.icon;
            return (
              <ScrollReveal key={brand.name} delay={index * 0.05}>
                <motion.div
                  className="flex-shrink-0 snap-start cursor-pointer"
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigateTo('category', { category: 'skincare' })}
                >
                  <div className="flex flex-col items-center justify-center gap-2.5 bg-card border border-border rounded-xl px-6 py-5 md:px-8 md:py-6 min-w-[130px] md:min-w-[155px] hover:border-foreground/20 transition-colors">
                    <IconComponent className="size-5 md:size-6 text-muted-foreground" strokeWidth={1.5} />
                    <span className="font-heading text-xs md:text-sm font-semibold text-foreground text-center whitespace-nowrap">
                      {brand.name}
                    </span>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
