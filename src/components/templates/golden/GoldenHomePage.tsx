'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  Calendar,
  Clock,
} from 'lucide-react';
import {
  categories,
  getTrendingProducts,
  getBestsellers,
  getProductsByCategory,
  reviews,
  heroSlides,
  offerBanners,
} from '@/data/products';
import { useStore } from '@/store/use-store';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { GoldenProductCard } from './GoldenProductCard';

// ─── Design Tokens ───────────────────────────────────────
const PRIMARY = '#bc8752';
const TERTIARY = '#FAF7F2';
const QUATERNARY = '#F5EDE3';
const BORDER = '#E8E2DA';
const SECTION_BG = '#F9F6F2';
const TEXT_LIGHT = '#555555';
const TEXT_MUTED = '#999999';

// ─── Pre-compute data ─────────────────────────────────────
const trendingProducts = getTrendingProducts().slice(0, 4);
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
  style,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`} style={style}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

// ─── Section 1: Hero Slider ───────────────────────────────
function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

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
          {/* Gradient overlay */}
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
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
                >
                  {heroSlides[safeSlide].title}
                </h1>
                <p
                  className="mt-4 text-sm sm:text-base md:text-lg max-w-md leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {heroSlides[safeSlide].subtitle}
                </p>
                <button
                  className="mt-8 text-xs sm:text-sm font-semibold uppercase tracking-wider px-8 py-3 transition-colors duration-300"
                  style={{ backgroundColor: PRIMARY, color: '#000000' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a67747')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
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

// ─── Section 2: Featured Products ─────────────────────────
function FeaturedProductsSection() {
  return (
    <Section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-14">
        <div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight"
            style={{ color: PRIMARY }}
          >
            PRODUITS PHARES
          </h2>
        </div>
        <button
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
          style={{ color: '#000000' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = PRIMARY)}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
        >
          Découvrir
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {trendingProducts.map((product, index) => (
          <ScrollReveal key={product.id} delay={index * 0.08}>
            <GoldenProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

// ─── Section 3: Promo Banner Left ─────────────────────────
function PromoBannerLeft() {
  const banner = offerBanners[0];

  return (
    <Section className="!py-0">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px] md:min-h-[500px]">
          {/* Left — Image */}
          <div className="relative aspect-[4/5] md:aspect-auto" style={{ backgroundColor: TERTIARY }}>
            <Image
              src={banner?.image || '/images/products/makeup/fond-de-teint-allcover.png'}
              alt="Premium Quality Makeup"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Right — Content */}
          <div
            className="flex flex-col justify-center p-8 md:p-12 lg:p-16"
            style={{ backgroundColor: TERTIARY }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: TEXT_MUTED }}
            >
              Meilleur Prix
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight tracking-tight"
              style={{ color: PRIMARY }}
            >
              COLLECTION MAQUILLAGE<br />HAUTE QUALITÉ
            </h2>
            <p
              className="mt-4 text-sm max-w-md leading-relaxed"
              style={{ color: TEXT_LIGHT }}
            >
              {banner?.subtitle ||
                'Découvrez notre sélection de cosmétiques premium conçus pour sublimer chaque carnation. Formulés avec soin pour un résultat impeccable.'}
            </p>
            <button
              className="mt-8 self-start text-xs font-semibold uppercase tracking-wider px-8 py-3 transition-colors duration-300"
              style={{ backgroundColor: PRIMARY, color: '#000000' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a67747')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
            >
              Découvrir
            </button>
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}

// ─── Section 4: Promo Banner Right ────────────────────────
function PromoBannerRight() {
  const banner = offerBanners[1];

  return (
    <Section className="!py-0">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px] md:min-h-[500px]">
          {/* Left — Content */}
          <div
            className="flex flex-col justify-center p-8 md:p-12 lg:p-16 order-2 md:order-1"
            style={{ backgroundColor: TERTIARY }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: TEXT_MUTED }}
            >
              Nouvelle Collection
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight tracking-tight"
              style={{ color: PRIMARY }}
            >
              RÉINVENTEZ VOTRE<br />ROUTINE BEAUTÉ
            </h2>
            <p
              className="mt-4 text-sm max-w-md leading-relaxed"
              style={{ color: TEXT_LIGHT }}
            >
              {banner?.subtitle ||
                'Sublimez votre quotidien avec notre dernière collection de produits beauté artisanaux. Fabriqués avec amour et des ingrédients premium.'}
            </p>
            <button
              className="mt-8 self-start text-xs font-semibold uppercase tracking-wider px-8 py-3 transition-colors duration-300"
              style={{ backgroundColor: PRIMARY, color: '#000000' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a67747')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
            >
              Découvrir
            </button>
          </div>

          {/* Right — Image */}
          <div
            className="relative aspect-[4/5] md:aspect-auto order-1 md:order-2"
            style={{ backgroundColor: TERTIARY }}
          >
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

// ─── Section 5: Dermatologist Tested ──────────────────────
function DermatologistTestedSection() {
  return (
    <Section style={{ backgroundColor: SECTION_BG }}>
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight tracking-tight"
            style={{ color: PRIMARY }}
          >
            PRODUITS COSMÉTIQUES<br />TESTÉS PAR DES DERMATOLOGUES
          </h2>
          <p
            className="mt-4 text-sm max-w-lg mx-auto leading-relaxed"
            style={{ color: TEXT_LIGHT }}
          >
            Chaque produit de notre collection a été minutieusement testé et approuvé par des dermatologues. Nous privilégions la sécurité, la qualité et l'efficacité pour vous offrir des produits beauté dignes de confiance au quotidien.
          </p>
          <button
            className="mt-8 text-white text-xs font-semibold uppercase tracking-wider px-8 py-3 transition-colors duration-300"
            style={{ backgroundColor: PRIMARY }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a67747')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
          >
            Découvrir
          </button>
        </div>
      </ScrollReveal>
    </Section>
  );
}

// ─── Section 6: Hashtag Tags ─────────────────────────────
function HashtagTagsSection() {
  return (
    <div className="py-8 overflow-hidden" style={{ borderBottom: `1px solid ${BORDER}`, borderTop: `1px solid ${BORDER}`, backgroundColor: '#ffffff' }}>
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
              className="flex-shrink-0 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200 cursor-pointer whitespace-nowrap"
              style={{ color: TEXT_MUTED }}
              onMouseEnter={(e) => (e.currentTarget.style.color = PRIMARY)}
              onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_MUTED)}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section 7: Shop By Category ─────────────────────────
function ShopByCategorySection() {
  const navigateTo = useStore((s) => s.navigateTo);

  return (
    <Section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-14">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight"
          style={{ color: PRIMARY }}
        >
          PAR CATÉGORIE
        </h2>
        <button
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
          style={{ color: '#000000' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = PRIMARY)}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
        >
          Tout voir
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category, index) => {
          const productCount = getProductsByCategory(category.name).length;
          return (
            <ScrollReveal key={category.id} delay={index * 0.08}>
              <motion.div
                className="group cursor-pointer overflow-hidden"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigateTo('category', { category: category.slug })}
              >
                {/* Category Image */}
                <div
                  className="relative aspect-square overflow-hidden"
                  style={{ backgroundColor: SECTION_BG }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Category Info */}
                <div className="pt-3 text-center">
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider"
                    style={{ color: PRIMARY }}
                  >
                    {category.name}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>
                    {productCount} {productCount === 1 ? 'produit' : 'produits'}
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>
    </Section>
  );
}

// ─── Section 8: Long Lasting Promo Cards ─────────────────
function LongLastingPromoCards() {
  const navigateTo = useStore((s) => s.navigateTo);

  return (
    <Section style={{ backgroundColor: TERTIARY }}>
      <ScrollReveal>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-10 md:mb-14"
          style={{ color: PRIMARY }}
        >
          MAQUILLAGE LONGUE TENUE
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {promoCards.map((product, index) => (
          <ScrollReveal key={product.id} delay={index * 0.08}>
            <motion.div
              className="group overflow-hidden cursor-pointer"
              style={{ backgroundColor: '#ffffff' }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigateTo('product', { product })}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
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
                <h3 className="text-sm font-medium line-clamp-1 mb-2" style={{ color: '#000000' }}>
                  {product.name}
                </h3>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200"
                  style={{ color: '#000000' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = PRIMARY)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
                >
                  Découvrir
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

// ─── Section 9: Top Rated Products ────────────────────────
function TopRatedSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedProducts = showAll ? bestsellerProducts : bestsellerProducts.slice(0, 4);

  return (
    <Section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-14">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight"
          style={{ color: PRIMARY }}
        >
          LES MIEUX NOTÉS
        </h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
          style={{ color: '#000000' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = PRIMARY)}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
        >
          {showAll ? 'Voir moins' : 'Tout voir'}
          <ArrowRight size={14} className={!showAll ? '' : 'rotate-180'} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {displayedProducts.map((product, index) => (
          <ScrollReveal key={product.id} delay={index * 0.06}>
            <GoldenProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

// ─── Section 10: Testimonials ──────────────────────────────
function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: PRIMARY }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-center mb-10 md:mb-14"
            style={{ color: '#000000' }}
          >
            CE QUE NOS CLIENTS DISENT
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ScrollReveal key={review.id} delay={index * 0.1}>
              <div
                className="p-6 rounded-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < review.rating ? '#000000' : 'transparent'}
                      stroke="#000000"
                      strokeWidth={1.5}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: '#000000' }}
                >
                  &ldquo;{review.content}&rdquo;
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center justify-between">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: '#000000' }}
                  >
                    {review.author}
                  </p>
                  {review.verified && (
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: 'rgba(0, 0, 0, 0.6)' }}
                    >
                      Vérifié
                    </span>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 11: Actus Beautés (Blog Posts) ──────────────
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime?: string;
  createdAt?: string;
  publishedAt?: string;
  product?: { image?: string } | null;
}

function ActusSection() {
  const navigateTo = useStore((s) => s.navigateTo);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog?published=true&limit=6');
        if (res.ok) {
          const data = await res.json();
          const postsList = Array.isArray(data) ? data : data.posts ?? [];
          setPosts(postsList);
        }
      } catch {
        // silently fail — loading state handles empty display
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Section style={{ backgroundColor: SECTION_BG }}>
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-14">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight"
            style={{ color: PRIMARY }}
          >
            ACTUS BEAUTÉS
          </h2>
          <button
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
            style={{ color: '#000000' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = PRIMARY)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
            onClick={() => navigateTo('blog')}
          >
            Voir tous les articles
            <ArrowRight size={14} />
          </button>
        </div>
      </ScrollReveal>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div
                className="aspect-[4/3] rounded-md mb-3"
                style={{ backgroundColor: BORDER }}
              />
              <div className="h-3 w-16 rounded mb-2" style={{ backgroundColor: BORDER }} />
              <div className="h-4 w-full rounded mb-1" style={{ backgroundColor: BORDER }} />
              <div className="h-3 w-2/3 rounded" style={{ backgroundColor: BORDER }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-12">
          <p
            className="text-sm font-medium"
            style={{ color: TEXT_MUTED }}
          >
            Bientôt des articles beautés !
          </p>
        </div>
      )}

      {/* Blog Post Grid */}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {posts.map((post, index) => {
            const coverSrc = post.coverImage || post.product?.image || '/images/placeholder.jpg';
            return (
              <ScrollReveal key={post.id} delay={index * 0.08}>
                <motion.article
                  className="group cursor-pointer overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigateTo('blog-post', { slug: post.slug })}
                >
                  {/* Cover Image */}
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-md"
                    style={{ backgroundColor: QUATERNARY }}
                  >
                    <Image
                      src={coverSrc}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Category Badge */}
                    {post.category && (
                      <span
                        className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: 'rgba(188, 135, 82, 0.92)',
                          color: '#ffffff',
                        }}
                      >
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-3">
                    <h3
                      className="text-xs sm:text-sm font-semibold uppercase tracking-wider line-clamp-1 mb-1.5"
                      style={{ color: PRIMARY }}
                    >
                      {post.title}
                    </h3>
                    <p
                      className="text-xs leading-relaxed line-clamp-2 mb-2"
                      style={{ color: TEXT_LIGHT }}
                    >
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      {post.readTime && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-medium"
                          style={{ color: TEXT_MUTED }}
                        >
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                      )}
                      {post.createdAt && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-medium"
                          style={{ color: TEXT_MUTED }}
                        >
                          <Calendar size={12} />
                          {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </Section>
  );
}

// ─── Main Component ──────────────────────────────────────
export function GoldenHomePage() {
  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Section 1: Hero Slider */}
      <HeroSlider />

      {/* Section 2: Featured Products */}
      <FeaturedProductsSection />

      {/* Section 3: Premium Quality Makeup Promo Banner */}
      <PromoBannerLeft />

      {/* Section 4: Redefine Your Beauty Promo Banner */}
      <PromoBannerRight />

      {/* Section 5: Dermatologist Tested */}
      <DermatologistTestedSection />

      {/* Section 6: Hashtag Tags */}
      <HashtagTagsSection />

      {/* Section 7: Shop By Category */}
      <ShopByCategorySection />

      {/* Section 8: Long Lasting Makeup Promo Cards */}
      <LongLastingPromoCards />

      {/* Section 9: Top Rated Products */}
      <TopRatedSection />

      {/* Section 10: Testimonials */}
      <TestimonialsSection />

      {/* Section 11: Actus Beautés */}
      <ActusSection />
    </div>
  );
}

export default GoldenHomePage;
