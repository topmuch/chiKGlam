'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Heart, X, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/shared/StarRating';
import type { Product } from '@/types';

interface QuickViewProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function QuickView({ open, onClose, product }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const safeImages = product.images?.length ? product.images : ['/placeholder.jpg'];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100">
            <Image
              src={safeImages[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.badge && (
              <Badge
                className="absolute top-3 left-3"
                style={{ backgroundColor: '#bc8752', color: 'white', border: 'none' }}
              >
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center p-6 md:p-8">
            {product.brand && (
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.brand}</p>
            )}
            <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>

            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={product.rating || 0} size={14} />
              <span className="text-xs text-gray-400">({product.reviewCount || 0} avis)</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-gray-900">{product.price?.toFixed(2)} €</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
              {discount > 0 && (
                <Badge
                  style={{ backgroundColor: '#dc2626', color: 'white', border: 'none' }}
                >
                  -{discount}%
                </Badge>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-gray-500 line-clamp-3 mb-6">{product.description}</p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantité</span>
              <div className="flex items-center gap-2">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-[#bc8752] hover:text-[#bc8752] transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-[#bc8752] hover:text-[#bc8752] transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                className="flex-1 text-white font-semibold py-5"
                style={{ backgroundColor: '#bc8752' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a07040')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bc8752')}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Ajouter au panier
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
                style={{ borderColor: '#bc8752', color: '#bc8752' }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
