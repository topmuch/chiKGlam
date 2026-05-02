'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

// ─── Design Tokens ───────────────────────────────────────
const PRIMARY = '#bc8752';
const BORDER = '#E8E2DA';
const TERTIARY = '#FAF7F2';
const TEXT_MUTED = '#999999';
const TEXT_LIGHT = '#555555';

interface GoldenProductCardProps {
  product: Product;
  className?: string;
}

export function GoldenProductCard({ product, className }: GoldenProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const navigateTo = useStore((s) => s.navigateTo);
  const [isHovered, setIsHovered] = useState(false);

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const isSoldOut = !product.inStock;
  const isNew = product.isNew;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSoldOut) {
      addItem(product, 1);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('product', { product });
  };

  const handleProductClick = () => {
    navigateTo('product', { product });
  };

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;

  return (
    <motion.div
      className={cn(
        'group cursor-pointer overflow-hidden flex flex-col border',
        className
      )}
      style={{ borderColor: BORDER, backgroundColor: '#ffffff' }}
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: TERTIARY }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges — top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOnSale && (
            <span
              className="inline-block text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1"
              style={{ backgroundColor: '#cc3333' }}
            >
              Promo
            </span>
          )}
          {isSoldOut && (
            <span
              className="inline-block text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1"
              style={{ backgroundColor: '#000000' }}
            >
              Rupture
            </span>
          )}
          {isNew && !isSoldOut && !isOnSale && (
            <span
              className="inline-block text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1"
              style={{ backgroundColor: PRIMARY }}
            >
              Nouveau
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleQuickView}
            className="bg-white text-black text-xs font-semibold uppercase tracking-wider px-6 py-2.5 transition-colors duration-200 hover:text-white"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            Aperçu rapide
          </button>
          {!isSoldOut && (
            <button
              onClick={handleAddToCart}
              className="bg-white text-black text-xs font-semibold uppercase tracking-wider px-6 py-2.5 transition-colors duration-200 hover:text-white"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              Choisir les options
            </button>
          )}
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category Label */}
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
          style={{ color: TEXT_MUTED }}
        >
          {product.category}
        </p>

        {/* Product Name */}
        <h3
          className="text-[15px] font-medium leading-snug line-clamp-2 mb-2"
          style={{ color: '#000000' }}
        >
          {product.name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < fullStars
                    ? 'fill-current'
                    : i === fullStars && hasHalfStar
                      ? 'fill-current'
                      : 'fill-none'
                }
                style={{
                  color: i < fullStars || (i === fullStars && hasHalfStar) ? PRIMARY : BORDER,
                }}
              />
            ))}
          </div>
          <span className="text-[11px]" style={{ color: TEXT_MUTED }}>
            Note {product.rating}/5
          </span>
        </div>

        {/* Spacer to push price to bottom */}
        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold" style={{ color: '#000000' }}>
            €{product.price.toFixed(2)}
          </span>
          {isOnSale && (
            <>
              <span className="text-sm line-through" style={{ color: TEXT_MUTED }}>
                €{product.originalPrice!.toFixed(2)}
              </span>
              <span
                className="text-[11px] font-bold px-2 py-0.5"
                style={{ color: '#cc3333', backgroundColor: '#FBEADE' }}
              >
                -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      {!isSoldOut && (
        <button
          onClick={handleAddToCart}
          className="w-full text-xs font-semibold uppercase tracking-wider py-3 flex items-center justify-center gap-2 transition-colors duration-200"
          style={{ backgroundColor: PRIMARY, color: '#000000' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a67747')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
        >
          <ShoppingBag size={14} />
          Ajouter au panier
        </button>
      )}
      {isSoldOut && (
        <div
          className="w-full text-xs font-semibold uppercase tracking-wider py-3 flex items-center justify-center gap-2"
          style={{ backgroundColor: BORDER, color: TEXT_MUTED }}
        >
          Rupture
        </div>
      )}
    </motion.div>
  );
}

export default GoldenProductCard;
