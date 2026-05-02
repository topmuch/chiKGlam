'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { useStore } from '@/store/use-store';
import { ArrowRight, Sparkles, Truck, Gift } from 'lucide-react';

export default function PromoDualBanner() {
  const { navigateTo } = useStore();

  const banners = [
    {
      title: 'Maquillage',
      subtitle: 'Nouvelle collection',
      description: 'Découvrez les dernières tendances beauté',
      gradient: 'linear-gradient(135deg, #bc8752, #d4a574)',
      icon: Sparkles,
      link: { slug: 'maquillage', name: 'Maquillage' },
    },
    {
      title: 'Soin Visage',
      subtitle: 'Routine idéale',
      description: 'Prenez soin de votre peau chaque jour',
      gradient: 'linear-gradient(135deg, #a07040, #c49a6c)',
      icon: Gift,
      link: { slug: 'soin-visage', name: 'Soin Visage' },
    },
  ];

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {banners.map((banner, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1} direction={idx % 2 === 0 ? 'left' : 'right'}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="relative overflow-hidden rounded-xl cursor-pointer"
                style={{ background: banner.gradient }}
                onClick={() => navigateTo('category', banner.link)}
              >
                <div className="relative h-[200px] sm:h-[240px] md:h-[280px] p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <banner.icon className="h-5 w-5 text-white/80" />
                      <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                        {banner.subtitle}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white sm:text-3xl mb-1">{banner.title}</h3>
                    <p className="text-sm text-white/70">{banner.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium text-sm">
                    <span>Explorer</span>
                    <ArrowRight className="h-4 w-4" />
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
