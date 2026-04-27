'use client';

import { Star, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { brands, categories } from '@/data/products';
import { cn } from '@/lib/utils';

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  categories: string[];
  concerns: string[];
  rating: number | null;
  sortBy: string;
}

export const defaultFilterState: FilterState = {
  priceRange: [0, 200],
  brands: [],
  categories: [],
  concerns: [],
  rating: null,
  sortBy: 'featured',
};

const skinConcerns = [
  'Acne',
  'Aging',
  'Dryness',
  'Dark Spots',
  'Sensitivity',
  'Oiliness',
];

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

function FilterSidebarContent({
  filters,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 200 ||
    filters.brands.length > 0 ||
    filters.categories.length > 0 ||
    filters.concerns.length > 0 ||
    filters.rating !== null;

  const toggleBrand = (brand: string) => {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: updated });
  };

  const toggleCategory = (category: string) => {
    const updated = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: updated });
  };

  const toggleConcern = (concern: string) => {
    const updated = filters.concerns.includes(concern)
      ? filters.concerns.filter((c) => c !== concern)
      : [...filters.concerns, concern];
    onFilterChange({ ...filters, concerns: updated });
  };

  const setRating = (rating: number | null) => {
    onFilterChange({ ...filters, rating: filters.rating === rating ? null : rating });
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground font-heading">
          Filtres
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <X className="size-3" />
            Tout effacer
          </button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={['price', 'brand', 'category', 'concerns', 'rating']}
        className="w-full"
      >
        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider py-3">
            Gamme de prix
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  onFilterChange({
                    ...filters,
                    priceRange: value as [number, number],
                  })
                }
                min={0}
                max={200}
                step={5}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground bg-muted px-2 py-1 rounded text-xs font-medium">
                  {filters.priceRange[0]}€
                </span>
                <span className="text-muted-foreground">—</span>
                <span className="text-muted-foreground bg-muted px-2 py-1 rounded text-xs font-medium">
                  {filters.priceRange[1]}€
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand */}
        <AccordionItem value="brand">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider py-3">
            Marque
            {filters.brands.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                {filters.brands.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 max-h-48 overflow-y-auto px-1">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                    className="size-4"
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm text-foreground cursor-pointer font-normal hover:text-foreground/80 transition-colors"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider py-3">
            Catégorie
            {filters.categories.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                {filters.categories.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 px-1">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`cat-${cat.id}`}
                    checked={filters.categories.includes(cat.name)}
                    onCheckedChange={() => toggleCategory(cat.name)}
                    className="size-4"
                  />
                  <Label
                    htmlFor={`cat-${cat.id}`}
                    className="text-sm text-foreground cursor-pointer font-normal hover:text-foreground/80 transition-colors"
                  >
                    {cat.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Skin Concerns */}
        <AccordionItem value="concerns">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider py-3">
            Préoccupations
            {filters.concerns.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                {filters.concerns.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 px-1">
              {skinConcerns.map((concern) => (
                <button
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
                    filters.concerns.includes(concern)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent text-foreground border-border hover:border-foreground/50'
                  )}
                >
                  {concern}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider py-3">
            Note
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 px-1">
              {[4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={cn(
                    'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors',
                    filters.rating === star
                      ? 'bg-muted font-medium'
                      : 'hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center">
                    {Array.from({ length: star }, (_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-amber-400 fill-amber-400"
                      />
                    ))}
                    {Array.from({ length: 5 - star }, (_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-gray-200 fill-gray-200"
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">et plus</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear All Filters Button */}
      {hasActiveFilters && (
        <div className="pt-4 border-t mt-4">
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full text-sm"
          >
            Tout effacer
          </Button>
        </div>
      )}
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24">
        <FilterSidebarContent {...props} />
      </div>
    </aside>
  );
}

export { FilterSidebarContent };
