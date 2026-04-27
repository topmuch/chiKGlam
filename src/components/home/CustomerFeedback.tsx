'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { useTemplate } from '@/hooks/use-template';

const testimonials = [
  {
    id: 1,
    name: 'Aminata D.',
    location: 'Paris, France',
    rating: 5,
    text: "Les produits sont incroyables ! Ma peau n'a jamais été aussi éclatante. Je recommande vivement CHIC GLAM BY EVA à toutes les femmes.",
    image: '/images/testimonials/client-1.png',
    product: 'SK-II Facial Treatment Essence',
  },
  {
    id: 2,
    name: 'Fatou S.',
    location: 'Lyon, France',
    rating: 5,
    text: "Qualité exceptionnelle et livraison rapide. Le maquillage Charlotte Tilbury est exactement ce que je cherchais. Merci !",
    image: '/images/testimonials/client-2.png',
    product: 'Charlotte Tilbury Flawless Filter',
  },
  {
    id: 3,
    name: 'Marie-Claire K.',
    location: 'Marseille, France',
    rating: 5,
    text: "J'adore la lingerie ! Des pièces élégantes et confortables. Le service client est au top, très réactif et professionnel.",
    image: '/images/testimonials/client-3.png',
    product: 'Ensemble Lingerie Luxe',
  },
  {
    id: 4,
    name: 'Sophie L.',
    location: 'Bordeaux, France',
    rating: 4,
    text: "Mes accessoires préférés sont ici. Les bijoux sont magnifiques et le rapport qualité-prix est excellent !",
    image: '/images/testimonials/client-4.png',
    product: 'Collier Or Rose',
  },
  {
    id: 5,
    name: 'Isabelle M.',
    location: 'Toulouse, France',
    rating: 5,
    text: "La carte cadeau était le cadeau parfait pour ma sœur. L'emballage est luxueux et elle a adoré ! Je referai ça sans hésiter.",
    image: '/images/testimonials/client-5.png',
    product: 'Carte Cadeau Beauté',
  },
  {
    id: 6,
    name: 'Nadia B.',
    location: 'Nice, France',
    rating: 5,
    text: "Depuis que j'ai découvert ce site, je ne vais plus ailleurs. Les soins sont authentiques et les prix sont très compétitifs.",
    image: '/images/testimonials/client-6.png',
    product: 'La Mer Moisturizing Cream',
  },
];

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <div className="flex-shrink-0 w-[320px] sm:w-[350px] md:w-[380px] mx-2">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-6 h-full flex flex-col">
        {/* Quote icon */}
        <Quote className="size-8 text-white/15 mb-3 flex-shrink-0" />

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3 flex-shrink-0">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < testimonial.rating
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-white/20 fill-white/20'
              }
            />
          ))}
        </div>

        {/* Text */}
        <p className="text-sm text-white/75 leading-relaxed flex-grow mb-4">
          &ldquo;{testimonial.text}&rdquo;
        </p>

        {/* Bottom: avatar + info */}
        <div className="flex items-center gap-3 pt-3 border-t border-white/10">
          {/* Avatar */}
          <div className="size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {testimonial.image ? (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-lg font-bold text-white/60">
                {testimonial.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-grow">
            <p className="text-sm font-semibold text-white truncate">{testimonial.name}</p>
            <p className="text-xs text-white/50 truncate">{testimonial.location}</p>
          </div>
          {/* Product badge */}
          <div className="hidden md:block">
            <span className="text-[10px] font-medium text-white/40 bg-white/5 px-2 py-1 rounded-full whitespace-nowrap">
              {testimonial.product}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomerFeedback() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isGold } = useTemplate();
  const [isPaused, setIsPaused] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const speed = 40; // pixels per second

    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!isPaused) {
        container.scrollLeft += speed * delta;

        // Reset to start for infinite loop
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
    <section className={`py-12 md:py-20 ${isGold ? 'bg-[#bc8752]' : 'bg-neutral-950'}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-14">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Ce que disent nos clientes
            </h2>
            <p className="mt-3 text-white/50 text-base md:text-lg max-w-lg mx-auto">
              Plus de 10 000 clientes satisfaites
            </p>
            <div className="mt-4 flex items-center justify-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="ml-2 text-sm font-semibold text-white/70">4.8/5</span>
              <span className="text-sm text-white/40 ml-1">sur Trustpilot</span>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Auto-scrolling testimonial strip */}
      <div
        ref={scrollRef}
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <motion.div
          className="flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Original set */}
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
          {/* Duplicate set for infinite scroll */}
          {testimonials.map((testimonial) => (
            <TestimonialCard key={`dup-${testimonial.id}`} testimonial={testimonial} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
