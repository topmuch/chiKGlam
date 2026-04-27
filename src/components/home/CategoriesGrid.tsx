'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { categories } from '@/data/products';
import { useTemplate } from '@/hooks/use-template';
import { useStore } from '@/store/use-store';

export function CategoriesGrid() {
  const navigateTo = useStore((s) => s.navigateTo);
  const { isGold } = useTemplate();

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-14">
            <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${isGold ? 'text-[#bc8752]' : 'text-foreground'}`}>
              DÉCOUVREZ
            </h2>
            <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
              Découvrez nos collections
            </p>
          </div>
        </ScrollReveal>

        {/* Responsive grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {categories.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 0.1}>
              <motion.div
                className="relative overflow-hidden cursor-pointer group rounded-xl"
                whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigateTo('category', { category: category.slug })}
              >
                {/* Category card with responsive height */}
                <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Strong gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 md:p-6 text-white">
                    <h3 className="font-heading text-base sm:text-lg md:text-2xl lg:text-3xl font-bold drop-shadow-lg leading-tight">
                      {category.name}
                    </h3>
                    <span className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-semibold text-white/90 group-hover:text-white transition-colors drop-shadow-sm flex items-center gap-1">
                      Acheter
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
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
