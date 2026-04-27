'use client';

import Image from 'next/image';
import { ShoppingBag, Star, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';
import { Product } from '@/types';

interface QuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const addItem = useCartStore((s) => s.addItem);
  const navigateTo = useStore((s) => s.navigateTo);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const handleViewDetails = () => {
    onClose();
    navigateTo('product', { product });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Quick view of {product.name}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
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
            </div>
          </div>

          {/* Info */}
          <div className="p-5 sm:p-6 flex flex-col justify-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
                {product.brand}
              </p>
              <h3 className="text-lg font-bold font-heading text-foreground leading-snug">
                {product.name}
              </h3>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={14}
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

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-sm font-semibold gap-2"
              >
                <ShoppingBag className="size-4" />
                Add to Cart
              </Button>
              <Button
                onClick={handleViewDetails}
                variant="outline"
                className="w-full h-11 rounded-xl text-sm font-medium gap-2"
              >
                View Full Details
                <ExternalLink className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
