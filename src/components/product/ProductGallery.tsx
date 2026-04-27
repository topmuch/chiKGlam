'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  const showThumbnails = images.length > 1;
  const showArrows = images.length > 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={images[selectedIndex]}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {showArrows && (
          <>
            <Button
              onClick={goToPrev}
              variant="secondary"
              size="icon"
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 z-10',
                'size-10 rounded-full shadow-lg',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                'bg-white/90 backdrop-blur-sm hover:bg-white'
              )}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              onClick={goToNext}
              variant="secondary"
              size="icon"
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 z-10',
                'size-10 rounded-full shadow-lg',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                'bg-white/90 backdrop-blur-sm hover:bg-white'
              )}
            >
              <ChevronRight className="size-5" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {showArrows && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 sm:overflow-visible">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-200 border-2',
                selectedIndex === index
                  ? 'border-foreground ring-2 ring-foreground/20'
                  : 'border-transparent hover:border-border opacity-70 hover:opacity-100'
              )}
            >
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
