'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { useTemplate } from '@/hooks/use-template';

const feedbackImages = [
  '/images/feedbacks/feedback-1.jpg',
  '/images/feedbacks/feedback-2.jpg',
  '/images/feedbacks/feedback-3.jpg',
  '/images/feedbacks/feedback-4.jpg',
  '/images/feedbacks/feedback-5.jpg',
  '/images/feedbacks/feedback-6.jpg',
  '/images/feedbacks/feedback-7.jpg',
  '/images/feedbacks/feedback-8.jpg',
  '/images/feedbacks/feedback-9.jpg',
];

export function CustomerFeedback() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isGold, isGlamshop } = useTemplate();
  const [isPaused, setIsPaused] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const scroll = useCallback(
    (direction: 'left' | 'right') => {
      const container = scrollRef.current;
      if (!container) return;
      const cardWidth = 388 + 16; // image width + gap
      container.scrollBy({
        left: direction === 'left' ? -cardWidth * 2 : cardWidth * 2,
        behavior: 'smooth',
      });
    },
    []
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const speed = 30; // pixels per second — slower for images

    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!isPaused) {
        container.scrollLeft += speed * delta;

        // Reset for infinite loop
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = container.scrollLeft - container.scrollWidth / 2;
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused]);

  return (
    <section className={`py-12 md:py-20 ${isGold || isGlamshop ? 'bg-[#bc8752]' : 'bg-neutral-950'}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Notre Feedback Client
            </h2>
            <p className="mt-3 text-white/60 text-base md:text-lg max-w-lg mx-auto">
              Ils nous font confiance — découvrez leurs retours
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel container */}
        <div className="relative group">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Scrollable strip */}
          <div
            ref={scrollRef}
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Original set */}
              {feedbackImages.map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[250px] sm:w-[300px] md:w-[388px] rounded-xl overflow-hidden shadow-lg"
                >
                  <img
                    src={img}
                    alt={`Feedback client ${i + 1}`}
                    className="w-full h-[250px] sm:h-[300px] md:h-[389px] object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Duplicate for infinite scroll */}
              {feedbackImages.map((img, i) => (
                <div
                  key={`dup-${i}`}
                  className="flex-shrink-0 w-[250px] sm:w-[300px] md:w-[388px] rounded-xl overflow-hidden shadow-lg"
                >
                  <img
                    src={img}
                    alt={`Feedback client ${i + 1}`}
                    className="w-full h-[250px] sm:h-[300px] md:h-[389px] object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
