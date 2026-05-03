'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  X,
  ShieldCheck,
  RotateCcw,
  Truck,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';

// ─── Amiy Design Tokens ───────────────────────────────────
const C = {
  primary: '#663130',
  primaryHover: '#7a3a38',
  tertiaryBg: '#F4F2ED',
  quaternaryBg: '#FBEADE',
  sectionBg: '#F9F7F4',
  border: '#E8E4DE',
  textLight: '#666666',
  textMuted: '#999999',
  white: '#FFFFFF',
  textDark: '#1a1a1a',
};

export function LuxuriaCartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const navigateTo = useStore((s) => s.navigateTo);

  const itemCount = getItemCount();
  const subtotal = getTotal();
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  // ── Empty Cart State ──────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: C.tertiaryBg }}
          >
            <ShoppingBag className="size-10" style={{ color: C.primary }} />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3" style={{ color: C.textDark }}>
            Votre panier est vide
          </h1>
          <p className="mb-8 text-base max-w-md mx-auto" style={{ color: C.textLight }}>
            Découvrez nos collections et ajoutez vos produits préférés à votre panier.
          </p>
          <Button
            onClick={() => navigateTo('home')}
            className="text-white rounded-sm px-10 py-6 text-base font-medium uppercase tracking-wider transition-all duration-300"
            style={{ backgroundColor: C.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.primary)}
          >
            Continuer vos achats
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Cart with Items ───────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.white }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-sm mb-8"
          style={{ color: C.textMuted }}
        >
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity duration-300"
            style={{ color: C.textLight }}
          >
            <ChevronRight className="size-4 rotate-180" />
            Accueil
          </button>
          <span>/</span>
          <span className="font-medium" style={{ color: C.textDark }}>
            Panier
          </span>
        </motion.nav>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-10"
        >
          <h1
            className="font-heading text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: C.textDark }}
          >
            VOTRE PANIER
          </h1>
          <p className="text-sm mt-1" style={{ color: C.textMuted }}>
            {itemCount} {itemCount > 1 ? 'articles' : 'article'} dans votre panier
          </p>
        </motion.div>

        {/* Main Grid: ~65% left / ~35% right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* ── Cart Items (Left ~65%) ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-0"
            >
              {/* Column Headers (desktop) */}
              <div
                className="hidden sm:grid sm:grid-cols-[1fr_100px_120px_100px_40px] gap-4 pb-4 text-xs font-medium uppercase tracking-wider"
                style={{ color: C.textMuted, borderBottom: `1px solid ${C.border}` }}
              >
                <span>Produit</span>
                <span className="text-center">Prix</span>
                <span className="text-center">Quantité</span>
                <span className="text-right">Total</span>
                <span />
              </div>

              {/* Items */}
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + index * 0.05 }}
                  className="py-6"
                  style={{ borderBottom: `1px solid ${C.border}` }}
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden space-y-4">
                    <div className="flex gap-4">
                      {/* Product Image 80x80 */}
                      <div
                        className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: C.tertiaryBg }}
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[11px] uppercase tracking-widest font-medium mb-0.5"
                          style={{ color: C.primary }}
                        >
                          {item.product.brand}
                        </p>
                        <p className="text-sm font-medium truncate" style={{ color: C.textDark }}>
                          {item.product.name}
                        </p>
                        <p className="text-sm mt-0.5" style={{ color: C.textLight }}>
                          {item.product.price.toFixed(2)}&euro;
                        </p>
                      </div>
                      {/* Remove Button (X) */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="w-8 h-8 flex items-center justify-center self-start transition-opacity hover:opacity-70"
                        aria-label="Supprimer"
                      >
                        <X className="size-4" style={{ color: C.textMuted }} />
                      </button>
                    </div>
                    {/* Mobile Quantity + Total */}
                    <div className="flex items-center justify-between pl-[96px]">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center transition-colors duration-200"
                          style={{ backgroundColor: C.tertiaryBg }}
                        >
                          <Minus className="size-3.5" style={{ color: C.primary }} />
                        </button>
                        <span
                          className="w-10 text-center text-sm font-medium"
                          style={{ color: C.textDark }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center transition-colors duration-200"
                          style={{ backgroundColor: C.tertiaryBg }}
                        >
                          <Plus className="size-3.5" style={{ color: C.primary }} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: C.textDark }}>
                        {(item.product.price * item.quantity).toFixed(2)}&euro;
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr_100px_120px_100px_40px] gap-4 items-center">
                    {/* Product */}
                    <div className="flex items-center gap-4">
                      <div
                        className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: C.tertiaryBg }}
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-[11px] uppercase tracking-widest font-medium mb-0.5"
                          style={{ color: C.primary }}
                        >
                          {item.product.brand}
                        </p>
                        <p className="text-sm font-medium truncate" style={{ color: C.textDark }}>
                          {item.product.name}
                        </p>
                      </div>
                    </div>
                    {/* Unit Price */}
                    <p className="text-sm text-center" style={{ color: C.textLight }}>
                      {item.product.price.toFixed(2)}&euro;
                    </p>
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center transition-colors duration-200"
                        style={{ backgroundColor: C.tertiaryBg }}
                      >
                        <Minus className="size-3.5" style={{ color: C.primary }} />
                      </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-10 text-center text-sm font-medium bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
                          style={{ color: C.textDark }}
                        />
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center transition-colors duration-200"
                        style={{ backgroundColor: C.tertiaryBg }}
                      >
                        <Plus className="size-3.5" style={{ color: C.primary }} />
                      </button>
                    </div>
                    {/* Line Total */}
                    <p className="text-sm font-semibold text-right" style={{ color: C.textDark }}>
                      {(item.product.price * item.quantity).toFixed(2)}&euro;
                    </p>
                    {/* Remove (X) */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="w-8 h-8 flex items-center justify-center ml-auto transition-opacity hover:opacity-70"
                      aria-label="Supprimer"
                    >
                      <X className="size-4" style={{ color: C.textMuted }} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Continue Shopping Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-8"
            >
              <button
                onClick={() => navigateTo('home')}
                className="inline-flex items-center gap-2 text-sm font-medium transition-opacity duration-300 hover:opacity-70"
                style={{ color: C.primary }}
              >
                <ArrowRight className="size-4 rotate-180" />
                Continuer vos achats
              </button>
            </motion.div>
          </div>

          {/* ── Order Summary Sidebar (Right ~35%) ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="rounded-sm p-6 sm:p-8 lg:sticky lg:top-28"
              style={{ backgroundColor: C.tertiaryBg }}
            >
              <h3 className="font-heading text-lg font-semibold mb-6" style={{ color: C.textDark }}>
                Résumé de la commande
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.textLight }}>Sous-total</span>
                  <span className="font-medium" style={{ color: C.textDark }}>
                    {subtotal.toFixed(2)}&euro;
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.textLight }}>Livraison</span>
                  <span
                    className="font-medium"
                    style={{ color: shipping === 0 ? C.primary : C.textDark }}
                  >
                    {shipping === 0 ? 'GRATUITE' : `${shipping.toFixed(2)}€`}
                  </span>
                </div>

                {shipping > 0 && (
                  <p
                    className="text-xs rounded-sm px-3 py-2"
                    style={{
                      color: C.textLight,
                      backgroundColor: C.white,
                    }}
                  >
                    Livraison gratuite dès 50€ d&apos;achats. Il vous manque{' '}
                    <span className="font-medium" style={{ color: C.primary }}>
                      {(50 - subtotal).toFixed(2)}&euro;
                    </span>
                    .
                  </p>
                )}

                <Separator style={{ backgroundColor: C.border }} className="my-4" />

                <div className="flex justify-between items-baseline">
                  <span className="font-heading font-bold text-lg" style={{ color: C.textDark }}>
                    Total
                  </span>
                  <span className="font-heading font-bold text-xl" style={{ color: C.textDark }}>
                    {total.toFixed(2)}&euro;
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={() => navigateTo('checkout')}
                className="w-full text-white rounded-sm py-6 text-sm font-semibold uppercase tracking-widest mt-8 transition-all duration-300 shadow-sm"
                style={{ backgroundColor: C.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.primaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.primary)}
              >
                Procéder au paiement
              </Button>

              {/* Continue Shopping Link */}
              <button
                onClick={() => navigateTo('home')}
                className="w-full text-center text-sm mt-3 transition-opacity hover:opacity-70"
                style={{ color: C.textMuted }}
              >
                Continuer les achats
              </button>

              {/* Trust Badges */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-xs" style={{ color: C.textLight }}>
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: C.white }}
                  >
                    <Truck className="size-4" style={{ color: C.primary }} />
                  </div>
                  <span>Livraison gratuite dès 50€</span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: C.textLight }}>
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: C.white }}
                  >
                    <RotateCcw className="size-4" style={{ color: C.primary }} />
                  </div>
                  <span>Retours sous 15 jours</span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: C.textLight }}>
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: C.white }}
                  >
                    <ShieldCheck className="size-4" style={{ color: C.primary }} />
                  </div>
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LuxuriaCartPage;
