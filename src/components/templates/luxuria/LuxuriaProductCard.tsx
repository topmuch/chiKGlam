'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface LuxuriaProductCardProps {
  product: Product;
  className?: string;
}

export function LuxuriaProductCard({ product, className }: LuxuriaProductCardProps) {
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
        'group cursor-pointer bg-white overflow-hidden flex flex-col',
        className
      )}
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#F4F2ED] overflow-hidden">
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
            <span className="inline-block bg-[#cc3333] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              Sale
            </span>
          )}
          {isSoldOut && (
            <span className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              Sold Out
            </span>
          )}
          {isNew && !isSoldOut && !isOnSale && (
            <span className="inline-block bg-[#663130] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              New
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
            className="bg-white text-black text-xs font-semibold uppercase tracking-wider px-6 py-2.5 hover:bg-[#663130] hover:text-white transition-colors duration-200"
          >
            Quick View
          </button>
          {!isSoldOut && (
            <button
              onClick={handleAddToCart}
              className="bg-white text-black text-xs font-semibold uppercase tracking-wider px-6 py-2.5 hover:bg-[#663130] hover:text-white transition-colors duration-200"
            >
              Select Options
            </button>
          )}
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category Label */}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#999999] mb-1.5">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="text-[15px] font-medium text-black leading-snug line-clamp-2 mb-2">
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
                    ? 'text-[#663130] fill-[#663130]'
                    : i === fullStars && hasHalfStar
                      ? 'text-[#663130] fill-[#663130]'
                      : 'text-[#E8E4DE] fill-[#E8E4DE]'
                }
              />
            ))}
          </div>
          <span className="text-[11px] text-[#999999]">
            Rated {product.rating} out of 5
          </span>
        </div>

        {/* Spacer to push price to bottom */}
        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-black">
            €{product.price.toFixed(2)}
          </span>
          {isOnSale && (
            <>
              <span className="text-sm text-[#999999] line-through">
                €{product.originalPrice!.toFixed(2)}
              </span>
              <span className="text-[11px] font-bold text-[#cc3333] bg-[#FBEADE] px-2 py-0.5">
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
          className="w-full bg-[#663130] text-white text-xs font-semibold uppercase tracking-wider py-3 hover:bg-[#4d2524] transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      )}
      {isSoldOut && (
        <div className="w-full bg-[#E8E4DE] text-[#999999] text-xs font-semibold uppercase tracking-wider py-3 flex items-center justify-center gap-2">
          Sold Out
        </div>
      )}
    </motion.div>
  );
}

export default LuxuriaProductCard;
