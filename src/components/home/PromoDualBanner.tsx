'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { useTemplate } from '@/hooks/use-template';
import { useStore } from '@/store/use-store';
import { useBanners, type BannerData } from '@/lib/use-banners';
import { useProducts } from '@/hooks/use-products';
import type { Product } from '@/types';

function getDiscountPercent(price: number, originalPrice?: number | null): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function isPromoDateValid(banner: BannerData): boolean {
  const now = new Date();
  if (banner.promoStartDate) {
    const start = new Date(banner.promoStartDate);
    if (now < start) return false;
  }
  if (banner.promoEndDate) {
    const end = new Date(banner.promoEndDate);
    if (now > end) return false;
  }
  return true;
}

export function PromoDualBanner() {
  const navigateTo = useStore((s) => s.navigateTo);
  const { banners, loading } = useBanners('promo');
  const { isGold } = useTemplate();

  // Fetch Accessoires products from DB
  const { data: accessoiresData } = useProducts({ category: 'Accessoires', sort: 'newest', limit: 2 });

  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [productsFetched, setProductsFetched] = useState(false);

  // Use the first active promo banner from DB, or fallback to static image
  const promoBanner = banners.length > 0 ? banners[0] : null;

  // Check date range validity
  const isDateValid = promoBanner ? isPromoDateValid(promoBanner) : true;

  // Parse promoProductIds from the banner
  const promoProductIds: string[] = (() => {
    if (!promoBanner?.promoProductIds) return [];
    try {
      const parsed = JSON.parse(promoBanner.promoProductIds);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return [];
  })();

  // Fetch promo products by ID if promoProductIds are set
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      if (promoProductIds.length === 0) {
        if (!cancelled) setProductsFetched(true);
        return;
      }
      try {
        const results = await Promise.allSettled(
          promoProductIds.map(async (id) => {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            if (data.product) return data.product as Product;
            return null;
          })
        );
        const fetched = results
          .filter((r): r is PromiseFulfilledResult<Product | null> => r.status === 'fulfilled')
          .map((r) => r.value)
          .filter((p): p is Product => p !== null);
        if (!cancelled) setPromoProducts(fetched);
      } catch (e) {
        console.error('Failed to fetch promo products:', e);
      }
      if (!cancelled) setProductsFetched(true);
    };

    if (!productsFetched) {
      loadProducts();
    }
    return () => { cancelled = true; };
  }, [promoProductIds, productsFetched]);

  // Determine which products to display
  const displayProducts = (() => {
    // If we have fetched promo products from the banner, use those
    if (promoProductIds.length > 0) {
      return promoProducts.length > 0 ? promoProducts : null;
    }
    // Live: use Accessoires products from DB
    if (accessoiresData && accessoiresData.length > 0) {
      return accessoiresData;
    }
    // Fallback: show nothing (no static fake products)
    return null;
  })();

  // Don't render if:
  // - still loading products and we have promoProductIds to fetch
  // - outside promo date range
  // - no products to display
  if (promoProductIds.length > 0 && !productsFetched) return null;
  if (!isDateValid) return null;
  // Don't render if no products available
  if (displayProducts === null || displayProducts.length === 0) return null;

  const promoTitle = promoBanner?.title || 'Offres';
  const promoSubtitle = promoBanner?.subtitle || 'Exclusives';
  const promoDescription = promoBanner?.subtitle || 'Découvrez nos produits sélectionnés à prix réduit pour une durée limitée.';

  return (
    <section className="py-8 md:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative rounded-xl overflow-hidden bg-white shadow-sm border border-border">
            <div className="flex flex-col lg:flex-row">
              {/* Left: TikTok video embed with text above */}
              <div className="w-full lg:w-[45%] flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                {/* Speech bubble "SPOTLIGHT ON:" */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-block relative mb-4">
                    <div className="bg-foreground text-background px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md">
                      Spotlight On
                    </div>
                    <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-foreground transform rotate-45 shadow-md" />
                  </div>
                </motion.div>

                <motion.h2
                  className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight max-w-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {promoTitle}
                  <br />
                  <span className="text-muted-foreground">{promoSubtitle}</span>
                </motion.h2>

                <motion.p
                  className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xs mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {promoDescription}
                </motion.p>

                {/* TikTok Video Embed */}
                <motion.div
                  className="relative w-full rounded-xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <iframe
                    src="https://www.tiktok.com/embed/v2/7163707114903342341"
                    allowFullScreen
                    allow="encrypted-media"
                    className="w-full min-h-[400px] md:min-h-[480px] border-0"
                    style={{ maxHeight: '600px' }}
                    title="Chic & Glamour by Eva - TikTok"
                  />
                </motion.div>
              </div>

              {/* Right: Two product cards side by side */}
              <div className="w-full lg:w-[55%] p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 h-full">
                  {displayProducts.map((product, index) => {
                    const discount = getDiscountPercent(product.price, product.originalPrice);
                    return (
                      <motion.div
                        key={product.id}
                        className="flex flex-col h-full bg-white rounded-lg border border-border/60 p-3 sm:p-4 hover:shadow-md transition-shadow duration-300 group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                      >
                        {/* Product image */}
                        <div className="relative flex-shrink-0 aspect-square bg-[#F7F7F7] rounded-md overflow-hidden mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Discount badge */}
                          {discount > 0 && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded">
                              -{discount}%
                            </div>
                          )}
                        </div>

                        {/* Product info */}
                        <div className="flex-1 flex flex-col">
                          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
                            {product.brand}
                          </p>
                          <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug line-clamp-2 mb-2">
                            {product.name}
                          </h3>

                          {/* Price section */}
                          <div className="mt-auto flex items-end justify-between gap-2">
                            <div>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <p className="text-xs text-muted-foreground line-through mb-0.5">
                                  {product.originalPrice.toFixed(2)}€
                                </p>
                              )}
                              <p className="text-base sm:text-lg font-bold text-foreground">
                                {product.price.toFixed(2)}€
                              </p>
                            </div>

                            {/* ACHETER button */}
                            <button
                              onClick={() => navigateTo('product', { product })}
                              className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded transition-colors ${isGold ? 'bg-[#bc8752] text-white hover:bg-[#bc8752]/90' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                            >
                              ACHETER
                            </button>
                          </div>

                          {/* Savings text */}
                          {discount > 0 && (
                            <p className="text-[10px] sm:text-xs text-red-500 font-semibold mt-1.5">
                              Économisez -{discount}%
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
