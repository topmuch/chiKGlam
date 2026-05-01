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
import { GoldenProductCard } from './GoldenProductCard';

// ─── Design tokens (Golden) ───
const PRIMARY = '#bc8752';
const BG_TERTIARY = '#FAF7F2';
const BG_SECTION = '#F9F6F2';
const BORDER_COLOR = '#E8E2DA';
const TEXT_LIGHT = '#555555';
const TEXT_MUTED = '#999999';

// ─── Types ───
interface GoldenShopPageProps {
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
        <h2
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: '#000' }}
        >
          Filtres
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs font-medium hover:opacity-70 transition-colors flex items-center gap-1"
            style={{ color: '#cc3333' }}
          >
            <X className="size-3" />
            Tout effacer
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: TEXT_MUTED }}
        >
          Catégories
        </h3>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`golden-filter-cat-${cat.id}`}
                checked={filters.selectedCategories.includes(cat.slug)}
                onCheckedChange={() => onCategoryToggle(cat.slug)}
                className="size-4 rounded"
                style={
                  {
                    '--tw-ring-color': PRIMARY,
                  } as React.CSSProperties
                }
              />
              <Label
                htmlFor={`golden-filter-cat-${cat.id}`}
                className="text-sm cursor-pointer font-normal transition-colors"
                style={{ color: TEXT_LIGHT }}
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: TEXT_MUTED }}
        >
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
            <span
              className="px-2.5 py-1 rounded text-xs font-medium border"
              style={{
                color: TEXT_LIGHT,
                backgroundColor: BG_SECTION,
                borderColor: BORDER_COLOR,
              }}
            >
              {filters.priceRange[0]}€
            </span>
            <span style={{ color: TEXT_MUTED }}>—</span>
            <span
              className="px-2.5 py-1 rounded text-xs font-medium border"
              style={{
                color: TEXT_LIGHT,
                backgroundColor: BG_SECTION,
                borderColor: BORDER_COLOR,
              }}
            >
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
                  className="px-3 py-1 rounded-full text-[11px] font-medium border transition-all duration-200"
                  style={
                    isActive
                      ? { backgroundColor: PRIMARY, color: '#fff', borderColor: PRIMARY }
                      : {
                          backgroundColor: '#fff',
                          color: TEXT_LIGHT,
                          borderColor: BORDER_COLOR,
                        }
                  }
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
        <div className="pt-4" style={{ borderTop: `1px solid ${BORDER_COLOR}` }}>
          <Button
            onClick={onClearAll}
            className="w-full text-sm font-medium rounded-lg h-10"
            style={{
              backgroundColor: '#fff',
              color: TEXT_LIGHT,
              borderColor: BORDER_COLOR,
            }}
            variant="outline"
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
export default function GoldenShopPage({ categorySlug }: GoldenShopPageProps) {
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
    ? categories.find(
        (c) => c.slug.toLowerCase() === categorySlug.toLowerCase()
      )
    : null;

  const categoryName = activeCategory
    ? activeCategory.name
    : categorySlug
      ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
      : 'Tous les produits';

  // Find category image for banner
  const categoryIndex = categories.findIndex(
    (c) => c.slug === categorySlug
  );
  const bannerImage =
    categoryIndex >= 0 ? categories[categoryIndex].image : null;

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
    (categorySlug
      ? filters.selectedCategories.filter((c) => c !== categorySlug).length
      : filters.selectedCategories.length) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff' }}>
      {/* ═══ CATEGORY BANNER ═══ */}
      <div
        className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] overflow-hidden"
        style={{ backgroundColor: BG_TERTIARY }}
      >
        {bannerImage ? (
          <>
            <img
              src={bannerImage}
              alt={categoryName}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)',
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: PRIMARY }}
          />
        )}
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider text-center"
            style={{ textTransform: 'uppercase' }}
          >
            {categoryName}
          </h1>
        </div>
      </div>

      {/* ─── Breadcrumb + Page Header ─── */}
      <section
        className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: BG_TERTIARY }}
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigateTo('home')}
                  className="cursor-pointer text-xs hover:opacity-70 transition-colors flex items-center gap-1"
                  style={{ color: TEXT_MUTED }}
                >
                  <Home className="size-3" />
                  Accueil
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator style={{ color: BORDER_COLOR }} />
              <BreadcrumbItem>
                <BreadcrumbPage
                  className="font-medium text-xs truncate"
                  style={{ color: '#000' }}
                >
                  {categoryName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ color: PRIMARY, textTransform: 'uppercase' }}
          >
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
                      className="lg:hidden flex items-center gap-2 rounded-lg h-9 px-3"
                      style={{
                        borderColor: BORDER_COLOR,
                        color: TEXT_LIGHT,
                      }}
                    >
                      <SlidersHorizontal className="size-4" />
                      Filtres
                      {activeFilterCount > 0 && (
                        <span
                          className="ml-0.5 size-5 rounded-full text-[10px] flex items-center justify-center font-bold text-white"
                          style={{ backgroundColor: PRIMARY }}
                        >
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0" style={{ backgroundColor: '#fff' }}>
                    <SheetHeader className="pt-6 px-6 pb-0">
                      <SheetTitle className="font-bold" style={{ color: '#000' }}>
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

                <p className="text-sm" style={{ color: TEXT_MUTED }}>
                  <span className="font-semibold" style={{ color: '#000' }}>
                    {allFilteredProducts.length}
                  </span>{' '}
                  produit{allFilteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <span
                  className="text-xs hidden sm:inline"
                  style={{ color: TEXT_MUTED }}
                >
                  Trier par :
                </span>
                <Select
                  value={filters.sortBy}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger
                    className="w-[170px] h-9 text-sm rounded-lg"
                    style={{ borderColor: BORDER_COLOR }}
                  >
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
                  <div
                    className="flex flex-wrap items-center gap-2 mb-6 pb-4"
                    style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}
                  >
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest mr-1"
                      style={{ color: TEXT_MUTED }}
                    >
                      Filtres actifs :
                    </span>
                    {filters.selectedCategories.map((slug) => {
                      if (categorySlug && slug === categorySlug) return null;
                      const cat = categories.find((c) => c.slug === slug);
                      return (
                        <button
                          key={slug}
                          onClick={() => handleCategoryToggle(slug)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: '#F5EDE3',
                            color: PRIMARY,
                          }}
                        >
                          {cat?.name || slug}
                          <X className="size-3" />
                        </button>
                      );
                    })}
                    {(filters.priceRange[0] > 0 ||
                      filters.priceRange[1] < 100) && (
                      <button
                        onClick={() => handlePriceChange([0, 100])}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: '#F5EDE3',
                          color: PRIMARY,
                        }}
                      >
                        {filters.priceRange[0]}€ – {filters.priceRange[1]}€
                        <X className="size-3" />
                      </button>
                    )}
                    <button
                      onClick={handleClearAll}
                      className="text-xs font-medium hover:opacity-70 transition-colors ml-1"
                      style={{ color: TEXT_MUTED }}
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
                      <GoldenProductCard product={product} />
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
                  style={{ backgroundColor: BG_TERTIARY }}
                >
                  <SlidersHorizontal className="size-8" style={{ color: TEXT_MUTED }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#000' }}>
                  Aucun produit trouvé
                </h3>
                <p
                  className="text-sm mb-6 max-w-sm"
                  style={{ color: TEXT_MUTED }}
                >
                  Essayez d&apos;ajuster vos filtres ou de les effacer pour voir plus
                  de produits.
                </p>
                <Button
                  onClick={handleClearAll}
                  className="rounded-lg text-white h-10"
                  style={{ backgroundColor: PRIMARY }}
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
                  className="size-9 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    borderColor: BORDER_COLOR,
                    backgroundColor: '#fff',
                    color: TEXT_LIGHT,
                  }}
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="size-9 rounded-lg text-sm font-medium transition-all duration-200"
                      style={
                        currentPage === page
                          ? {
                              backgroundColor: PRIMARY,
                              color: '#fff',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }
                          : {
                              borderColor: BORDER_COLOR,
                              backgroundColor: '#fff',
                              color: TEXT_LIGHT,
                              border: `1px solid ${BORDER_COLOR}`,
                            }
                      }
                      aria-label={`Page ${page}`}
                      aria-current={
                        currentPage === page ? 'page' : undefined
                      }
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="size-9 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    borderColor: BORDER_COLOR,
                    backgroundColor: '#fff',
                    color: TEXT_LIGHT,
                  }}
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
