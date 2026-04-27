'use client';

import { ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { ProductCard } from '@/components/shared/ProductCard';
import { useTrendingProducts } from '@/hooks/use-products';
import { getTrendingProducts } from '@/data/products';
import { useTemplate } from '@/hooks/use-template';
import { useStore } from '@/store/use-store';

export function TrendingProducts() {
  const { data: liveProducts, isLoading, isError, isFetching, refetch } = useTrendingProducts();
  const fallbackProducts = getTrendingProducts();
  const products = (liveProducts && liveProducts.length > 0 ? liveProducts : fallbackProducts).slice(0, 8);
  const isLive = !isError && liveProducts && liveProducts.length > 0;
  const navigateTo = useStore((s) => s.navigateTo);
  const { isGold } = useTemplate();

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-heading text-3xl md:text-4xl font-bold tracking-tight ${isGold ? 'text-[#bc8752]' : 'text-foreground'}`}>
                  TENDANCES DU MOMENT
                </h2>
                {isLive && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-semibold uppercase tracking-wider border border-green-200">
                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              {/* Underline accent */}
              <div className={`mt-2 h-1 w-16 rounded-full ${isGold ? 'bg-[#bc8752]' : 'bg-foreground'}`} />
              <p className="mt-3 text-muted-foreground text-base">
                Les plus aimés par nos clientes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted"
                disabled={isFetching}
                aria-label="Refresh products"
              >
                <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                {isFetching ? 'Synchronisation...' : 'Synchronisation'}
              </button>
              <button
                onClick={() => navigateTo('category', { category: 'boutique' })}
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
              >
                Voir Tout
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {isLoading && !liveProducts ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <span className="ml-3 text-sm text-muted-foreground">Chargement des tendances...</span>
          </div>
        ) : (
          /* Grid: responsive */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.05}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="sm:hidden mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted"
            disabled={isFetching}
          >
            <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Synchronisation...' : 'Synchronisation'}
          </button>
          <button
            onClick={() => navigateTo('category', { category: 'boutique' })}
            className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
          >
            Voir Tout
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
