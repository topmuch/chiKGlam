'use client';

import { ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { ProductCard } from '@/components/shared/ProductCard';
import { getNewArrivals } from '@/data/products';
import { useStore } from '@/store/use-store';

export function NewArrivals() {
  const products = getNewArrivals().slice(0, 4); // Only 4 products
  const navigateTo = useStore((s) => s.navigateTo);

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight" style={{ color: '#bc8752' }}>
                COSMÉTIQUES BY EVA
              </h2>
              <div className="mt-2 h-1 w-16 rounded-full" style={{ backgroundColor: '#bc8752' }} />
              <p className="mt-3 text-muted-foreground text-base">
                Notre sélection maquillage choisie pour vous
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => navigateTo('category', { category: 'makeup' })}
                className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-colors"
                style={{ color: '#bc8752' }}
              >
                Voir Tout
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.05}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        <div className="sm:hidden mt-8 flex items-center justify-center">
          <button
            onClick={() => navigateTo('category', { category: 'makeup' })}
            className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-colors"
            style={{ color: '#bc8752' }}
          >
            Voir Tout
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
