'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useBanners } from '@/lib/use-banners';
import { useStore } from '@/store/use-store';

const PRIMARY = '#bc8752';
const BG_TERTIARY = '#FAF7F2';

interface OfferBannerSectionProps {
  categorySlug?: string | null;
  size?: 'large' | 'medium';
}

export default function OfferBannerSection({ categorySlug, size = 'large' }: OfferBannerSectionProps) {
  const { banners: offerBanners } = useBanners('offer');
  const navigateTo = useStore((s) => s.navigateTo);

  // Filter banners matching the current category (or show all if no category)
  const relevantBanners = categorySlug
    ? offerBanners.filter(
        (b) =>
          !b.link ||
          b.link.toLowerCase() === categorySlug.toLowerCase() ||
          b.link.toLowerCase() === 'boutique'
      )
    : offerBanners;

  if (relevantBanners.length === 0) return null;

  const banner = relevantBanners[0];
  const isLarge = size === 'large';

  const handleBannerClick = () => {
    if (banner.link) {
      navigateTo('category', { category: banner.link });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative w-full overflow-hidden cursor-pointer"
      style={{
        backgroundColor: BG_TERTIARY,
        height: isLarge ? undefined : '180px',
      }}
      onClick={handleBannerClick}
    >
      <div
        className={isLarge ? 'h-[220px] sm:h-[280px] md:h-[320px]' : 'h-[180px] sm:h-[200px]'}
      >
        {banner.image && (
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.05) 100%)',
          }}
        />
        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={isLarge ? 'max-w-lg' : 'max-w-md'}>
            {banner.subtitle && (
              <p
                className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold mb-1.5"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {banner.subtitle}
              </p>
            )}
            <h2
              className={`font-bold text-white leading-tight tracking-tight mb-3 ${isLarge ? 'text-lg sm:text-2xl md:text-3xl lg:text-4xl' : 'text-base sm:text-lg md:text-xl'}`}
            >
              {banner.title}
            </h2>
            {banner.cta && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-5 py-2.5 transition-colors duration-300"
                style={{ backgroundColor: PRIMARY, color: '#000' }}
              >
                {banner.cta}
                <ArrowRight size={14} />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
