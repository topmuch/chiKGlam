'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const safeImages = Array.isArray(images) && images.length > 0 ? images : ['/placeholder.jpg'];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev + 1) % safeImages.length);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={safeImages[selectedIndex]}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {safeImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                idx === selectedIndex
                  ? 'border-[#bc8752]'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} - Vignette ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
