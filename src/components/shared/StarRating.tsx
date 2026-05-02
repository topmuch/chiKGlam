'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  className?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  className = '',
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;

        return (
          <Star
            key={i}
            size={size}
            className={
              filled
                ? 'fill-[#bc8752] text-[#bc8752]'
                : partial
                ? 'fill-[#bc8752]/50 text-[#bc8752]'
                : 'fill-gray-200 text-gray-200'
            }
          />
        );
      })}
    </div>
  );
}
