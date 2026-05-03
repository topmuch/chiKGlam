'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Mail,
} from 'lucide-react';
import {
  categories,
  getTrendingProducts,
  getNewArrivals,
  getBestsellers,
  reviews,
  heroSlides,
  offerBanners,
} from '@/data/products';
import { useStore } from '@/store/use-store';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { LuxuriaProductCard } from './LuxuriaProductCard';

// ─── Pre-compute data ──────────────────────────────────────
const trendingProducts = getTrendingProducts().slice(0, 4);
const newArrivalProducts = getNewArrivals().slice(0, 8);
const bestsellerProducts = getBestsellers().slice(0, 8);

const promoCards = getTrendingProducts().slice(0, 4);

const hashtagTags = [
  '#FondDeTeint',
  '#Poudre',
  '#Highlighter',
  '#Palette',
  '#Eyeliner',
  '#Mascara',
  '#Lipstick',
  '#Gloss',
  '#Cils',
  '#Pinceaux',
];

// ─── Section Wrapper ──────────────────────────────────────
function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

// ─── Amiy-style Section Heading ───────────────────────────
function AmiySectionHeading({
  label,
  title,
  className = '',
}: {
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-heading text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#999999] mb-2">
        {label}
      </p>
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-black tracking-tight">
        {title}
      </h2>
    </div>
  );
}

// ─── Section 1: Hero Slider ───────────────────────────────
function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigateTo = useStore((s) => s.navigateTo);

  const nextSlide = useCallback(() => {
    setCurrentSlide((s) => (s + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const safeSlide = Math.min(currentSlide, heroSlides.length - 1);

  return (
    <div className="relative w-full h-[420px] sm:h-[520px] md:h-[620px] lg:h-[700px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={safeSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <Image
            src={heroSlides[safeSlide].image}
            alt={heroSlides[safeSlide].title}
            fill
            unoptimized
            className="object-cover"
            priority={safeSlide === 0}
          />
          {/* Dark gradient overlay from left and bottom */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={safeSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                  {heroSlides[safeSlide].title}
                </h1>
                <p className="mt-4 text-sm sm:text-base md:text-lg text-white/80 max-w-md leading-relaxed">
                  {heroSlides[safeSlide].subtitle}
                </p>
                <button
                  onClick={() =>
                    navigateTo('category', { category: heroSlides[safeSlide].link })
                  }
                  className="mt-8 bg-[#663130] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-8 py-3 hover:bg-[#4d2524] transition-colors duration-300"
                >
                  {heroSlides[safeSlide].cta}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {heroSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center bg-white/90 text-black hover:bg-white transition-colors duration-200 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center bg-white/90 text-black hover:bg-white transition-colors duration-200 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {heroSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 transition-all duration-300 ${
                index === safeSlide
                  ? 'w-6 bg-white'
                  : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section 2: Shop Essentials / Featured Products ──────
function FeaturedProductsSection() {
  const navigateTo = useStore((s) => s.navigateTo);

  return (
    <Section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-14">
        <AmiySectionHeading label="Shop Essentials" title="Featured Products" />
        <button
          onClick={() => navigateTo('category', { category: 'boutique' })}
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-black hover:text-[#663130] transition-colors duration-200"
        >
          Shop Now
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {trendingProducts.map((product, index) => (
          <ScrollReveal key={product.id} delay={index * 0.08}>
            <LuxuriaProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

// ─── Section 3: Premium Quality Makeup Promo Banner ──────
function PromoBannerLeft() {
  const navigateTo = useStore((s) => s.navigateTo);
  const banner = offerBanners[0];

  return (
    <Section className="!py-0">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px] md:min-h-[500px]">
          {/* Left — Image */}
          <div className="relative bg-[#F4F2ED] aspect-[4/5] md:aspect-auto">
            <Image
              src={banner?.image || '/images/products/makeup/fond-de-teint-allcover.png'}
              alt="Premium Quality Makeup"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Right — Content */}
          <div className="flex flex-col justify-center bg-[#F4F2ED] p-8 md:p-12 lg:p-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#999999] mb-3">
              Best Price
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-black leading-tight tracking-tight">
              Premium Quality<br />Makeup Collection
            </h2>
            <p className="mt-4 text-sm text-[#666666] max-w-md leading-relaxed">
              {banner?.subtitle ||
                'Discover our curated selection of premium cosmetics designed for every skin tone and type. Formulated with care for flawless results.'}
            </p>
            <button
              onClick={() => navigateTo('category', { category: banner?.link || 'makeup' })}
              className="mt-8 self-start bg-black text-white text-xs font-semibold uppercase tracking-wider px-8 py-3 hover:bg-[#663130] transition-colors duration-300"
            >
              Explore More
            </button>
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}

// ─── Section 4: Redefine Your Beauty Promo Banner ────────
function PromoBannerRight() {
  const navigateTo = useStore((s) => s.navigateTo);
  const banner = offerBanners[1];

  return (
    <Section className="!py-0">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px] md:min-h-[500px]">
          {/* Left — Content */}
          <div className="flex flex-col justify-center bg-[#F4F2ED] p-8 md:p-12 lg:p-16 order-2 md:order-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#999999] mb-3">
              New Collection
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-black leading-tight tracking-tight">
              Redefine Your<br />Beauty Routine
            </h2>
            <p className="mt-4 text-sm text-[#666666] max-w-md leading-relaxed">
              {banner?.subtitle ||
                'Elevate your everyday look with our latest collection of handcrafted beauty essentials. Made with love and premium ingredients.'}
            </p>
            <button
              onClick={() => navigateTo('category', { category: banner?.link || 'lingerie' })}
              className="mt-8 self-start bg-black text-white text-xs font-semibold uppercase tracking-wider px-8 py-3 hover:bg-[#663130] transition-colors duration-300"
            >
              Explore More
            </button>
          </div>

          {/* Right — Image */}
          <div className="relative bg-[#F4F2ED] aspect-[4/5] md:aspect-auto order-1 md:order-2">
            <Image
              src={banner?.image || '/images/products/lingerie/kit-nuisette.png'}
              alt="Redefine Your Beauty"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}

// ─── Section 5: Dermatologist Tested ─────────────────────
function DermatologistTestedSection() {
  return (
    <Section className="bg-[#F9F7F4]">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#999999] mb-3">
            Trusted Quality
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-black leading-tight tracking-tight">
            Dermatologist Tested<br />Cosmetics Products
          </h2>
          <p className="mt-4 text-sm text-[#666666] max-w-lg mx-auto leading-relaxed">
            Every product in our collection has been carefully tested and approved by dermatologists. We prioritize safety, quality, and efficacy to deliver beauty products you can trust for your daily routine.
          </p>
          <button className="mt-8 bg-[#663130] text-white text-xs font-semibold uppercase tracking-wider px-8 py-3 hover:bg-[#4d2524] transition-colors duration-300">
            Explore More
          </button>
        </div>
      </ScrollReveal>
    </Section>
  );
}

// ─── Section 6: Hashtag Tags ─────────────────────────────
function HashtagTagsSection() {
  return (
    <div className="py-8 border-y border-[#E8E4DE] bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex gap-6 md:gap-8 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {hashtagTags.map((tag) => (
            <span
              key={tag}
              className="flex-shrink-0 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-[#999999] hover:text-[#663130] transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section 7: Shop By Category Products ────────────────
function ShopByCategorySection() {
  const navigateTo = useStore((s) => s.navigateTo);

  return (
    <Section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-14">
        <AmiySectionHeading label="Beauty Essentials" title="Shop By Category" />
        <button
          onClick={() => navigateTo('category', { category: 'boutique' })}
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-black hover:text-[#663130] transition-colors duration-200"
        >
          View All
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {newArrivalProducts.map((product, index) => (
          <ScrollReveal key={product.id} delay={index * 0.06}>
            <LuxuriaProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

// ─── Section 8: Long Lasting Makeup Promo Cards ──────────
function LongLastingPromoCards() {
  const navigateTo = useStore((s) => s.navigateTo);

  return (
    <Section className="bg-[#F4F2ED]">
      <ScrollReveal>
        <AmiySectionHeading
          label="Featured"
          title="Long Lasting Makeup"
          className="mb-10 md:mb-14"
        />
      </ScrollReveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {promoCards.map((product, index) => (
          <ScrollReveal key={product.id} delay={index * 0.08}>
            <motion.div
              className="group bg-white overflow-hidden cursor-pointer"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigateTo('product', { product })}
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-[#F9F7F4] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col items-start">
                <h3 className="text-sm font-medium text-black line-clamp-1 mb-2">
                  {product.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-black hover:text-[#663130] transition-colors duration-200">
                  Shop Now
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

// ─── Section 9: Top Rated Products ───────────────────────
function TopRatedSection() {
  const navigateTo = useStore((s) => s.navigateTo);
  const [showAll, setShowAll] = useState(false);
  const displayedProducts = showAll ? bestsellerProducts : bestsellerProducts.slice(0, 4);

  return (
    <Section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-14">
        <AmiySectionHeading label="Top Rated" title="Shop By Ratings" />
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-black hover:text-[#663130] transition-colors duration-200"
        >
          {showAll ? 'Show Less' : 'View All'}
          <ArrowRight size={14} className={!showAll ? '' : 'rotate-180'} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {displayedProducts.map((product, index) => (
          <ScrollReveal key={product.id} delay={index * 0.06}>
            <LuxuriaProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

// ─── Section 10: Newsletter ──────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#F4F2ED]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#999999] mb-3">
              Newsletter
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-black tracking-tight">
              Stay in the Loop
            </h2>
            <p className="mt-3 text-sm text-[#666666] max-w-md mx-auto leading-relaxed">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and beauty tips.
            </p>

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              >
                <div className="relative w-full">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E4DE] text-black text-sm placeholder:text-[#999999] focus:outline-none focus:border-[#663130] transition-colors duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#663130] text-white text-xs font-semibold uppercase tracking-wider px-8 py-3 hover:bg-[#4d2524] transition-colors duration-300 flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-black font-semibold text-sm">
                  Thank you for subscribing!
                </p>
                <p className="text-[#666666] text-xs mt-1">
                  You&apos;ll receive our latest updates soon.
                </p>
              </motion.div>
            )}

            <p className="mt-4 text-[11px] text-[#999999]">
              By subscribing, you agree to receive our communications. You can unsubscribe at any time.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─── Main Component ──────────────────────────────────────
export function LuxuriaHomePage() {
  return (
    <div className="bg-white">
      {/* Section 1: Hero Slider */}
      <HeroSlider />

      {/* Section 2: Shop Essentials / Featured Products */}
      <FeaturedProductsSection />

      {/* Section 3: Premium Quality Makeup Promo Banner */}
      <PromoBannerLeft />

      {/* Section 4: Redefine Your Beauty Promo Banner */}
      <PromoBannerRight />

      {/* Section 5: Dermatologist Tested */}
      <DermatologistTestedSection />

      {/* Section 6: Hashtag Tags */}
      <HashtagTagsSection />

      {/* Section 7: Shop By Category Products */}
      <ShopByCategorySection />

      {/* Section 8: Long Lasting Makeup Promo Cards */}
      <LongLastingPromoCards />

      {/* Section 9: Top Rated Products */}
      <TopRatedSection />

      {/* Section 10: Newsletter */}
      <NewsletterSection />
    </div>
  );
}

export default LuxuriaHomePage;
