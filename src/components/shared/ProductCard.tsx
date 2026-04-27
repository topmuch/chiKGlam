'use client';

import Image from 'next/image';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, className, onQuickView }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const navigateTo = useStore((s) => s.navigateTo);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleProductClick = () => {
    navigateTo('product', { product });
  };

  return (
    <div
      onClick={handleProductClick}
      className={cn(
        'group cursor-pointer bg-card rounded-xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        className
      )}
    >
      {/* Image Container - Larger aspect ratio */}
      <div className="relative aspect-[3/4] md:aspect-[4/5] bg-muted product-image-zoom">
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge className="bg-red-500 text-white border-none text-[10px] font-bold px-2 py-0.5">
              -{discount}%
            </Badge>
          )}
          {product.isNew && (
            <Badge className="bg-foreground text-background border-none text-[10px] font-bold px-2 py-0.5">
              NEW
            </Badge>
          )}
          {product.isBestseller && (
            <Badge className="bg-amber-500 text-white border-none text-[10px] font-bold px-2 py-0.5">
              BESTSELLER
            </Badge>
          )}
        </div>

        {/* Hover Actions - always visible on lg, hover on mobile/sm/md */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 lg:opacity-100 lg:translate-y-0 transition-all duration-300">
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-lg h-9 text-xs font-medium shadow-lg"
          >
            <ShoppingCart className="size-3.5" />
            ACHETER
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
            size="sm"
            variant="secondary"
            className="rounded-lg h-9 w-9 p-0 shadow-lg"
          >
            <Eye className="size-3.5" />
          </Button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 size-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110"
        >
          <Heart className="size-4 text-foreground" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 md:p-5 space-y-2">
        {/* Brand name - more prominent */}
        <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-semibold truncate">
          {product.brand}
        </p>
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.round(product.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200 fill-gray-200'
                }
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price - bigger */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">
            {product.price.toFixed(2)}€
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice.toFixed(2)}€
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
