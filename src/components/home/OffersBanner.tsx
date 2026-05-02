'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { useStore } from '@/store/use-store';
import { offerBanners } from '@/data/products';

export default function OffersBanner() {
  const [banners, setBanners] = useState<any[]>([]);
  const { navigateTo } = useStore();

  useEffect(() => {
    fetch('/api/banners?type=offer')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setBanners(data);
        else if (offerBanners) setBanners(offerBanners);
      })
      .catch(() => {
        if (offerBanners) setBanners(offerBanners);
      });
  }, []);

  if (banners.length === 0) return null;

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
                style={{
                  background: banner.backgroundColor || 'linear-gradient(135deg, #bc8752, #d4a574)',
                }}
                onClick={() => {
                  if (banner.link) {
                    navigateTo('category', {
                      slug: banner.link.slug || 'all',
                      name: banner.link.name || 'Boutique',
                    });
                  }
                }}
              >
                <div className="relative h-[200px] sm:h-[250px] md:h-[280px]">
                  {banner.image && (
                    <Image
                      src={banner.image}
                      alt={banner.title || ''}
                      fill
                      className="object-cover mix-blend-overlay"
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
                    {banner.badge && (
                      <span
                        className="mb-2 inline-block w-fit rounded-full px-3 py-1 text-xs font-bold text-white"
                        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                      >
                        {banner.badge}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white sm:text-2xl md:text-3xl mb-2">
                      {banner.title || 'Offre spéciale'}
                    </h3>
                    {banner.description && (
                      <p className="text-sm text-white/80 mb-4 max-w-xs">
                        {banner.description}
                      </p>
                    )}
                    {banner.cta && (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-white underline underline-offset-4">
                        {banner.cta}
                        <span className="text-lg">→</span>
                      </span>
                    )}
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
