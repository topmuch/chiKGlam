'use client';

import { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, getProductsByCategory } from '@/data/products';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/use-store';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string | null;
}

export default function MegaMenu({ isOpen, onClose, activeCategory }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigateTo = useStore((state) => state.navigateTo);

  const category = categories.find(
    (c) => c.name.toLowerCase() === activeCategory?.toLowerCase() ||
      c.slug.toLowerCase() === activeCategory?.toLowerCase()
  );

  const featuredProducts = activeCategory
    ? getProductsByCategory(activeCategory).filter(
        (p) => p.isBestseller || p.isTrending || p.isNew
      ).slice(0, 3)
    : [];

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleCategoryClick = (slug: string) => {
    navigateTo('category', { category: slug });
    onClose();
  };

  const handleSubcategoryClick = (categorySlug: string, subcategorySlug: string) => {
    navigateTo('category', { category: categorySlug, subcategory: subcategorySlug });
    onClose();
  };

  const handleProductClick = (productId: string) => {
    const product = featuredProducts.find((p) => p.id === productId);
    if (product) {
      navigateTo('product', { product });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && category && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          className="absolute left-0 right-0 top-full z-40 bg-white shadow-lg rounded-b-xl border-t border-border"
        >
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Subcategories */}
              <div>
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground mb-3">
                  {category.name}
                </h3>
                <ul className="space-y-1">
                  {category.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <button
                        onClick={() => handleSubcategoryClick(category.slug, sub.slug)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded-md hover:bg-secondary w-full text-left"
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <button
                  onClick={() => handleCategoryClick(category.slug)}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  Voir tout {category.name} →
                </button>
              </div>

              {/* Column 2: Featured Products */}
              <div>
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground mb-3">
                  Mis en avant
                </h3>
                {featuredProducts.length > 0 ? (
                  <div className="space-y-3">
                    {featuredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                          <p className="text-xs font-semibold text-foreground">
                            {product.price.toFixed(2)}€
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun produit en vedette</p>
                )}
              </div>

              {/* Column 3: Promotional Banner */}
              <div className="hidden md:block">
                <div className="rounded-xl overflow-hidden bg-secondary h-full relative">
                  <div className="flex flex-col justify-center items-center h-full p-6 text-center">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {category.name}
                    </p>
                    <h4 className="font-heading font-bold text-lg text-foreground mb-2">
                      Nouveautés
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Découvrir les dernières {category.name.toLowerCase()}
                    </p>
                    <button
                      onClick={() => handleCategoryClick(category.slug)}
                      className="text-xs font-semibold uppercase tracking-wider bg-luxury text-luxury-foreground px-4 py-2 rounded-full hover:bg-luxury/90 transition-colors"
                    >
                      Acheter Maintenant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
