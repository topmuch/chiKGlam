'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/use-cart-store';

export function AddToCartNotification() {
  const lastAdded = useCartStore((s) => s.lastAdded);
  const clearLastAdded = useCartStore((s) => s.clearLastAdded);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const getTotal = useCartStore((s) => s.getTotal);

  const handleClose = useCallback(() => {
    clearLastAdded();
  }, [clearLastAdded]);

  const handleViewBasket = useCallback(() => {
    clearLastAdded();
    setCartOpen(true);
  }, [clearLastAdded, setCartOpen]);

  const handleContinueShopping = useCallback(() => {
    clearLastAdded();
  }, [clearLastAdded]);

  // Auto-close after 5 seconds
  useEffect(() => {
    if (!lastAdded) return;
    const timer = setTimeout(() => {
      clearLastAdded();
    }, 5000);
    return () => clearTimeout(timer);
  }, [lastAdded, clearLastAdded]);

  // Close on Escape
  useEffect(() => {
    if (!lastAdded) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearLastAdded();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [lastAdded, clearLastAdded]);

  const isOpen = !!lastAdded;
  const itemCount = getItemCount();
  const total = getTotal();

  if (!isOpen || !lastAdded) return null;

  const product = lastAdded.product;
  const quantity = lastAdded.quantity;
  const itemTotal = product.price * quantity;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-green-100 flex items-center justify-center">
                    <ShoppingBag className="size-4 text-green-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wide">
                    Ajouté au Panier
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  aria-label="Fermer"
                >
                  <X className="size-4 text-gray-500" />
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 mx-6" />

              {/* Product info */}
              <div className="px-6 py-4 flex gap-4">
                {/* Product image */}
                <div className="size-20 sm:size-24 rounded-lg overflow-hidden bg-[#F7F7F7] flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-1.5"
                  />
                </div>

                {/* Product details */}
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                    {product.brand}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Quantité : {quantity}
                  </p>
                  <p className="text-base font-bold text-foreground mt-1">
                    {itemTotal.toFixed(2)}€
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 mx-6" />

              {/* Subtotal */}
              <div className="px-6 py-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Sous-total ({itemCount} article{itemCount !== 1 ? 's' : ''} dans votre panier)
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {total.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="px-6 pb-6 pt-4 space-y-2.5">
                <button
                  onClick={handleViewBasket}
                  className="w-full py-3 bg-foreground text-background text-sm font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
                >
                  VOIR VOTRE PANIER
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full py-3 bg-white text-foreground text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  CONTINUER MES ACHATS
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
