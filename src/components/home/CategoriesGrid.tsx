'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { useStore } from '@/store/use-store';

interface CategoryData {
  id?: string;
  slug: string;
  name: string;
  image?: string;
  productCount?: number;
}

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const { navigateTo } = useStore();

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          // Fallback
          setCategories([
            { slug: 'maquillage', name: 'Maquillage', productCount: 42 },
            { slug: 'soin-visage', name: 'Soin Visage', productCount: 38 },
            { slug: 'soin-corps', name: 'Soin Corps', productCount: 25 },
            { slug: 'parfums', name: 'Parfums', productCount: 18 },
            { slug: 'accessoires', name: 'Accessoires', productCount: 15 },
            { slug: 'cheveux', name: 'Cheveux', productCount: 22 },
            { slug: 'ongles', name: 'Ongles', productCount: 12 },
            { slug: 'wellness', name: 'Bien-être', productCount: 10 },
          ]);
        }
      })
      .catch(() => {
        setCategories([
          { slug: 'maquillage', name: 'Maquillage', productCount: 42 },
          { slug: 'soin-visage', name: 'Soin Visage', productCount: 38 },
          { slug: 'soin-corps', name: 'Soin Corps', productCount: 25 },
          { slug: 'parfums', name: 'Parfums', productCount: 18 },
          { slug: 'accessoires', name: 'Accessoires', productCount: 15 },
          { slug: 'cheveux', name: 'Cheveux', productCount: 22 },
          { slug: 'ongles', name: 'Ongles', productCount: 12 },
          { slug: 'wellness', name: 'Bien-être', productCount: 10 },
        ]);
      });
  }, []);

  const handleCategoryClick = (cat: CategoryData) => {
    navigateTo('category', { slug: cat.slug, name: cat.name });
  };

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Nos Catégories</h2>
            <p className="mt-2 text-gray-500">Explorez notre sélection de produits beauté</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, idx) => (
            <ScrollReveal key={category.slug} delay={idx * 0.05}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card
                  className="cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow duration-300"
                  onClick={() => handleCategoryClick(category)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div
                            className="h-full w-full flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, ${
                                ['#f5e6d3', '#e8d5c4', '#d4c4b0', '#c9b8a5', '#bfae98', '#b5a68c', '#ab9e80', '#a19674'][idx % 8]
                              }, #fff)`,
                            }}
                          >
                            <span className="text-xl font-bold text-gray-700">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-sm font-semibold text-white md:text-base">
                          {category.name}
                        </h3>
                        {category.productCount && (
                          <p className="text-xs text-white/70">{category.productCount} articles</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
