'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/shared/ScrollReveal';
import ProductCard from '@/components/shared/ProductCard';
import { getTrendingProducts } from '@/data/products';
import { useStore } from '@/store/use-store';
import type { Product } from '@/types';

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const { navigateTo } = useStore();

  useEffect(() => {
    const data = getTrendingProducts?.() || [];
    setProducts(data.slice(0, 4));
  }, []);

  return (
    <section className="py-12 md:py-16 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Nouveautés</h2>
              <p className="mt-1 text-gray-500">Découvrez nos dernières arrivées</p>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 font-medium text-sm"
              style={{ borderColor: '#bc8752', color: '#bc8752' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#bc8752';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#bc8752';
              }}
              onClick={() => navigateTo('category', { slug: 'all', name: 'Tous les produits' })}
            >
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </ScrollReveal>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, idx) => (
              <ScrollReveal key={product.id || idx} delay={idx * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-lg">Aucun produit disponible pour le moment</p>
          </div>
        )}
      </div>
    </section>
  );
}
