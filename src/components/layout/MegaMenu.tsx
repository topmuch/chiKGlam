'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '@/data/products';
import { useStore } from '@/store/use-store';

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { navigateTo, selectedCategory } = useStore();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveCategory(null);
    }, 200);
  };

  const handleNavigate = (category: any) => {
    navigateTo('category', { slug: category.slug, name: category.name });
    setIsOpen(false);
  };

  const handleSubcategory = (cat: any, sub: any) => {
    navigateTo('category', { slug: cat.slug, name: sub.name || cat.name, subcategory: sub.slug });
    setIsOpen(false);
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#bc8752] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        Nos Catégories
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2"
          >
            <div className="w-[700px] rounded-xl bg-white p-6 shadow-2xl border border-gray-100">
              <div className="grid grid-cols-4 gap-6">
                {categories.map((category: any) => (
                  <div key={category.id || category.slug}>
                    <button
                      onClick={() => handleNavigate(category)}
                      className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900 hover:text-[#bc8752] transition-colors"
                    >
                      {category.image && (
                        <div className="h-8 w-8 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <span className="truncate">{category.name}</span>
                    </button>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <ul className="space-y-2">
                        {category.subcategories.slice(0, 5).map((sub: any, idx: number) => (
                          <li key={idx}>
                            <button
                              onClick={() => handleSubcategory(category, sub)}
                              className="text-sm text-gray-500 hover:text-[#bc8752] transition-colors"
                            >
                              {sub.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">💡</span>
                  <span className="text-xs text-gray-500">
                    Livraison gratuite dès 50€ d&apos;achats
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigateTo('category', { slug: 'all', name: 'Tous les produits' });
                  }}
                  className="text-xs font-medium text-[#bc8752] hover:text-[#a07040] transition-colors"
                >
                  Voir tout le catalogue →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
