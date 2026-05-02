'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  className,
  interactive = false,
  onRate,
  showValue = false,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => {
    const starValue = i + 1;
    const fill = Math.min(1, Math.max(0, rating - i));

    return (
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRate?.(starValue)}
        className={cn(
          'relative inline-flex shrink-0',
          interactive && 'cursor-pointer hover:scale-110 transition-transform',
          !interactive && 'cursor-default'
        )}
        aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
      >
        <Star
          size={size}
          className="text-gray-200"
          fill="currentColor"
          strokeWidth={0}
        />
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fill * 100}%` }}
        >
          <Star
            size={size}
            className="text-amber-400"
            fill="currentColor"
            strokeWidth={0}
          />
        </span>
      </button>
    );
  });

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {stars}
      {showValue && (
        <span className="text-sm font-medium text-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
