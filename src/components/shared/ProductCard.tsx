'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const {
    useStore,
    useCartStore,
  } = require('@/store/use-store');
  const navigateTo = useStore((s: any) => s.navigateTo);
  const addItem = useCartStore?.(undefined as any)?.addItem;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getBadge = () => {
    if (product.badge) return product.badge;
    if (product.isNew) return 'Nouveau';
    if (discount > 0) return 'Promo';
    return null;
  };

  const badge = getBadge();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (addItem) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/placeholder.jpg',
        quantity: 1,
      });
    }
  };

  const handleCardClick = () => {
    navigateTo?.('product', product);
  };

  return (
    <Card
      className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images?.[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {badge && (
          <Badge
            className="absolute top-3 left-3 z-10"
            style={
              badge === 'Promo'
                ? { backgroundColor: '#dc2626', color: 'white', border: 'none' }
                : badge === 'Nouveau'
                ? { backgroundColor: '#bc8752', color: 'white', border: 'none' }
                : { backgroundColor: '#bc8752', color: 'white', border: 'none' }
            }
          >
            {badge === 'Promo' ? `-${discount}%` : badge}
          </Badge>
        )}

        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4 bg-gradient-to-t from-black/30 to-transparent"
          >
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-white text-gray-700 hover:bg-white/90 shadow-md h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            {onQuickView && (
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full bg-white text-gray-700 hover:bg-white/90 shadow-md h-10 w-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        )}
      </div>

      <CardContent className="p-4">
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.brand}</p>
        )}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <StarRating rating={product.rating || 0} size={14} />

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">{product.price?.toFixed(2)} €</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {product.originalPrice.toFixed(2)} €
            </span>
          )}
        </div>

        <Button
          className="mt-3 w-full text-white font-medium transition-colors"
          style={{ backgroundColor: '#bc8752' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a07040')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bc8752')}
          onClick={handleAddToCart}
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  );
}
