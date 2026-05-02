'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Star, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FilterSidebarProps {
  onFilterChange?: (filters: any) => void;
  categories?: { name: string; slug: string; count?: number }[];
  priceRange?: [number, number];
}

export default function FilterSidebar({
  onFilterChange,
  categories = [],
  priceRange = [0, 200],
}: FilterSidebarProps) {
  const [priceMin, setPriceMin] = useState(priceRange[0]);
  const [priceMax, setPriceMax] = useState(priceRange[1]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
  });

  const defaultCategories = categories.length > 0
    ? categories
    : [
        { name: 'Maquillage', slug: 'maquillage', count: 42 },
        { name: 'Soin Visage', slug: 'soin-visage', count: 38 },
        { name: 'Soin Corps', slug: 'soin-corps', count: 25 },
        { name: 'Parfums', slug: 'parfums', count: 18 },
        { name: 'Cheveux', slug: 'cheveux', count: 22 },
        { name: 'Accessoires', slug: 'accessoires', count: 15 },
      ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (slug: string) => {
    const newCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];
    setSelectedCategories(newCategories);
    onFilterChange?.({ categories: newCategories, price: [priceMin, priceMax], ratings: selectedRatings });
  };

  const toggleRating = (rating: number) => {
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter((r) => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(newRatings);
    onFilterChange?.({ categories: selectedCategories, price: [priceMin, priceMax], ratings: newRatings });
  };

  const clearFilters = () => {
    setPriceMin(priceRange[0]);
    setPriceMax(priceRange[1]);
    setSelectedCategories([]);
    setSelectedRatings([]);
    onFilterChange?.({ categories: [], price: priceRange, ratings: [] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" style={{ color: '#bc8752' }} />
          Filtres
        </h3>
        <button
          onClick={clearFilters}
          className="text-xs font-medium text-[#bc8752] hover:text-[#a07040] transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <button
          onClick={() => toggleSection('categories')}
          className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-900"
        >
          Catégories
          {expandedSections.categories ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {expandedSections.categories && (
          <div className="mt-2 space-y-2">
            {defaultCategories.map((cat) => (
              <label
                key={cat.slug}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Checkbox
                  checked={selectedCategories.includes(cat.slug)}
                  onCheckedChange={() => toggleCategory(cat.slug)}
                  className="data-[state=checked]:bg-[#bc8752] data-[state=checked]:border-[#bc8752]"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors flex-1">
                  {cat.name}
                </span>
                {cat.count !== undefined && (
                  <span className="text-xs text-gray-400">({cat.count})</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-900"
        >
          Prix
          {expandedSections.price ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="mt-3">
            <Slider
              min={priceRange[0]}
              max={priceRange[1]}
              step={5}
              value={[priceMin, priceMax]}
              onValueChange={(value) => {
                setPriceMin(value[0]);
                setPriceMax(value[1]);
                onFilterChange?.({
                  categories: selectedCategories,
                  price: value as [number, number],
                  ratings: selectedRatings,
                });
              }}
              className="[&_[role=slider]]:bg-[#bc8752] [&_[role=slider]]:border-[#bc8752] [&>.bg-primary]:bg-[#bc8752]"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">{priceMin} €</span>
              <span className="text-sm text-gray-500">{priceMax} €</span>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <button
          onClick={() => toggleSection('rating')}
          className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-900"
        >
          Note
          {expandedSections.rating ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="mt-2 space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Checkbox
                  checked={selectedRatings.includes(rating)}
                  onCheckedChange={() => toggleRating(rating)}
                  className="data-[state=checked]:bg-[#bc8752] data-[state=checked]:border-[#bc8752]"
                />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < rating
                          ? 'fill-[#bc8752] text-[#bc8752]'
                          : 'fill-gray-200 text-gray-200'
                      }
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-400">& plus</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
