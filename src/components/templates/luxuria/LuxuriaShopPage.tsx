'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Home,
  X,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/store/use-store';
import { categories, products } from '@/data/products';
import { Product } from '@/types';
import { LuxuriaProductCard } from './LuxuriaProductCard';

// ─── Design tokens (Amiy) ───
const BURGUNDY = '#663130';
const BG_TERTIARY = '#F4F2ED';
const BG_SECTION = '#F9F7F4';
const BORDER_COLOR = '#E8E4DE';
const TEXT_LIGHT = '#666666';
const TEXT_MUTED = '#999999';

// ─── Types ───
interface LuxuriaShopPageProps {
  categorySlug?: string;
}

interface ShopFilterState {
  selectedCategories: string[];
  priceRange: [number, number];
  sortBy: string;
}

const PRODUCTS_PER_PAGE = 9;

const sortOptions = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'name-az', label: 'Nom A-Z' },
  { value: 'rating', label: 'Note' },
];

const pricePresets: [number, number][] = [
  [0, 10],
  [10, 20],
  [20, 35],
  [35, 70],
];

// ─── Sidebar Content (shared between desktop & mobile) ───
function FilterContent({
  filters,
  onCategoryToggle,
  onPriceChange,
  onClearAll,
}: {
  filters: ShopFilterState;
  onCategoryToggle: (slug: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearAll: () => void;
}) {
  const hasActiveFilters =
    filters.selectedCategories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest font-heading text-[#000]">
          Filtres
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs font-medium text-[#cc3333] hover:text-[#663130] transition-colors flex items-center gap-1"
          >
            <X className="size-3" />
            Tout effacer
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#999]">
          Catégories
        </h3>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`filter-cat-${cat.id}`}
                checked={filters.selectedCategories.includes(cat.slug)}
                onCheckedChange={() => onCategoryToggle(cat.slug)}
                className="size-4 rounded border-[#E8E4DE] data-[state=checked]:bg-[#663130] data-[state=checked]:border-[#663130]"
              />
              <Label
                htmlFor={`filter-cat-${cat.id}`}
                className="text-sm text-[#666] cursor-pointer font-normal hover:text-[#000] transition-colors"
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#999]">
          Prix
        </h3>
        <div className="space-y-3">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => onPriceChange(value as [number, number])}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#666] bg-[#F9F7F4] px-2.5 py-1 rounded text-xs font-medium border border-[#E8E4DE]">
              {filters.priceRange[0]}€
            </span>
            <span className="text-[#999]">—</span>
            <span className="text-[#666] bg-[#F9F7F4] px-2.5 py-1 rounded text-xs font-medium border border-[#E8E4DE]">
              {filters.priceRange[1]}€
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pricePresets.map(([min, max]) => {
              const isActive =
                filters.priceRange[0] === min && filters.priceRange[1] === max;
              return (
                <button
                  key={`${min}-${max}`}
                  onClick={() => onPriceChange([min, max])}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 ${
                    isActive
                      ? 'bg-[#663130] text-white border-[#663130]'
                      : 'bg-white text-[#666] border-[#E8E4DE] hover:border-[#663130] hover:text-[#663130]'
                  }`}
                >
                  {min}€ – {max}€
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-[#E8E4DE]">
          <Button
            onClick={onClearAll}
            className="w-full text-sm font-medium rounded-lg border-[#E8E4DE] bg-white text-[#666] hover:bg-[#F9F7F4] hover:text-[#000] h-10"
          >
            <X className="size-4 mr-2" />
            Effacer tous les filtres
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───
export default function LuxuriaShopPage({ categorySlug }: LuxuriaShopPageProps) {
  const navigateTo = useStore((s) => s.navigateTo);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<ShopFilterState>({
    selectedCategories: categorySlug ? [categorySlug] : [],
    priceRange: [0, 100],
    sortBy: 'pertinence',
  });

  // Determine which category we're browsing
  const activeCategory = categorySlug
    ? categories.find((c) => c.slug.toLowerCase() === categorySlug.toLowerCase())
    : null;

  const categoryName = activeCategory
    ? activeCategory.name
    : categorySlug
      ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
      : 'Tous les produits';

  // Filter & sort products
  const allFilteredProducts = useMemo(() => {
    let result: Product[] = [...products];

    // Filter by category
    if (filters.selectedCategories.length > 0) {
      result = result.filter((p) =>
        filters.selectedCategories.some(
          (slug) => p.category.toLowerCase() === slug.toLowerCase()
        )
      );
    }

    // Filter by price
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Pertinence: bestsellers first, then trending, then rating
        result.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return b.rating - a.rating;
        });
    }

    return result;
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(allFilteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return allFilteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [allFilteredProducts, currentPage]);

  // Filter handlers
  const handleCategoryToggle = (slug: string) => {
    setFilters((prev) => {
      const updated = prev.selectedCategories.includes(slug)
        ? prev.selectedCategories.filter((c) => c !== slug)
        : [...prev.selectedCategories, slug];
      return { ...prev, selectedCategories: updated };
    });
    setCurrentPage(1);
  };

  const handlePriceChange = (range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setFilters({
      selectedCategories: categorySlug ? [categorySlug] : [],
      priceRange: [0, 100],
      sortBy: 'pertinence',
    });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    (filters.selectedCategories.length > 0 && !categorySlug) ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100;

  const activeFilterCount =
    (categorySlug ? filters.selectedCategories.filter((c) => c !== categorySlug).length : filters.selectedCategories.length) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Breadcrumb + Header ─── */}
      <section className="bg-[#F9F7F4] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigateTo('home')}
                  className="cursor-pointer text-xs text-[#999] hover:text-[#663130] transition-colors flex items-center gap-1"
                >
                  <Home className="size-3" />
                  Accueil
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[#E8E4DE]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-xs text-[#000]">
                  {categoryName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[#000] tracking-tight">
            {categoryName}
          </h1>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-8">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-[250px] shrink-0">
            <div className="sticky top-24">
              <FilterContent
                filters={filters}
                onCategoryToggle={handleCategoryToggle}
                onPriceChange={handlePriceChange}
                onClearAll={handleClearAll}
              />
            </div>
          </aside>

          {/* ── Product Area ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Trigger */}
                <Sheet
                  open={mobileFiltersOpen}
                  onOpenChange={setMobileFiltersOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden flex items-center gap-2 rounded-lg border-[#E8E4DE] text-[#666] hover:bg-[#F9F7F4] hover:border-[#663130] hover:text-[#663130] h-9 px-3"
                    >
                      <SlidersHorizontal className="size-4" />
                      Filtres
                      {activeFilterCount > 0 && (
                        <span className="ml-0.5 size-5 rounded-full bg-[#663130] text-white text-[10px] flex items-center justify-center font-bold">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0 bg-white">
                    <SheetHeader className="pt-6 px-6 pb-0">
                      <SheetTitle className="font-heading font-bold text-[#000]">
                        Filtres
                      </SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-100px)] px-6 pb-6">
                      <div className="pt-4">
                        <FilterContent
                          filters={filters}
                          onCategoryToggle={handleCategoryToggle}
                          onPriceChange={handlePriceChange}
                          onClearAll={handleClearAll}
                        />
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-[#999]">
                  <span className="font-semibold text-[#000]">
                    {allFilteredProducts.length}
                  </span>{' '}
                  produit{allFilteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#999] hidden sm:inline">
                  Trier par :
                </span>
                <Select
                  value={filters.sortBy}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-[170px] h-9 text-sm rounded-lg border-[#E8E4DE] focus:ring-[#663130]/20 focus:border-[#663130]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Chips */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-[#E8E4DE]">
                    <span className="text-[10px] text-[#999] font-bold uppercase tracking-widest mr-1">
                      Filtres actifs :
                    </span>
                    {filters.selectedCategories.map((slug) => {
                      if (categorySlug && slug === categorySlug) return null;
                      const cat = categories.find((c) => c.slug === slug);
                      return (
                        <button
                          key={slug}
                          onClick={() => handleCategoryToggle(slug)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FBEADE] text-xs font-medium text-[#663130] hover:bg-[#F4F2ED] transition-colors"
                        >
                          {cat?.name || slug}
                          <X className="size-3" />
                        </button>
                      );
                    })}
                    {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100) && (
                      <button
                        onClick={() => handlePriceChange([0, 100])}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FBEADE] text-xs font-medium text-[#663130] hover:bg-[#F4F2ED] transition-colors"
                      >
                        {filters.priceRange[0]}€ – {filters.priceRange[1]}€
                        <X className="size-3" />
                      </button>
                    )}
                    <button
                      onClick={handleClearAll}
                      className="text-xs font-medium text-[#999] hover:text-[#cc3333] transition-colors ml-1"
                    >
                      Tout effacer
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LuxuriaProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div
                  className="size-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#F4F2ED' }}
                >
                  <SlidersHorizontal className="size-8" style={{ color: '#999' }} />
                </div>
                <h3 className="text-lg font-heading font-bold text-[#000] mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-sm text-[#999] mb-6 max-w-sm">
                  Essayez d&apos;ajuster vos filtres ou de les effacer pour voir plus
                  de produits.
                </p>
                <Button
                  onClick={handleClearAll}
                  className="rounded-lg bg-[#000] text-white hover:bg-[#663130] h-10"
                >
                  <X className="size-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-1.5 mt-10 pb-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="size-9 rounded-lg border border-[#E8E4DE] bg-white flex items-center justify-center text-[#666] hover:bg-[#F9F7F4] hover:border-[#663130] hover:text-[#663130] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#E8E4DE] disabled:hover:text-[#666]"
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`size-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-[#663130] text-white shadow-sm'
                        : 'border border-[#E8E4DE] bg-white text-[#666] hover:bg-[#F9F7F4] hover:border-[#663130] hover:text-[#663130]'
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="size-9 rounded-lg border border-[#E8E4DE] bg-white flex items-center justify-center text-[#666] hover:bg-[#F9F7F4] hover:border-[#663130] hover:text-[#663130] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#E8E4DE] disabled:hover:text-[#666]"
                  aria-label="Page suivante"
                >
                  <ChevronRight className="size-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
