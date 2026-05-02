'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, RotateCcw, Home } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
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
import { ProductCard } from '@/components/shared/ProductCard';
import { QuickView } from '@/components/product/QuickView';
import {
  FilterSidebar,
  FilterSidebarContent,
  FilterState,
  defaultFilterState,
} from './FilterSidebar';
import { useStore } from '@/store/use-store';
import { useTemplate } from '@/hooks/use-template';
import { categories, getProductsByCategory, products } from '@/data/products';
import { Product } from '@/types';

interface CategoryPageProps {
  categorySlug: string;
}

const sortOptions = [
  { value: 'featured', label: 'Mis en avant' },
  { value: 'price-low-high', label: 'Prix: Croissant' },
  { value: 'price-high-low', label: 'Prix: Décroissant' },
  { value: 'newest', label: 'Plus récent' },
  { value: 'top-rated', label: 'Mieux notés' },
];

const categoryGradients: Record<string, string> = {
  boutique: 'from-gray-100 via-slate-50 to-zinc-50',
  makeup: 'from-pink-100 via-rose-50 to-fuchsia-50',
  lingerie: 'from-rose-100 via-pink-50 to-amber-50',
  accessoires: 'from-amber-100 via-orange-50 to-yellow-50',
  cadeaux: 'from-amber-100 via-yellow-50 to-rose-50',
  skincare: 'from-emerald-100 via-teal-50 to-cyan-50',
  haircare: 'from-violet-100 via-purple-50 to-fuchsia-50',
  fragrance: 'from-orange-100 via-amber-50 to-yellow-50',
  bodycare: 'from-rose-100 via-pink-50 to-red-50',
  nailcare: 'from-pink-100 via-fuchsia-50 to-purple-50',
};

// Glamshop-specific category banners
const glamshopCategoryBanners: Record<string, string> = {
  makeup: '/images/categories/glamshop-makeup-banner.jpg',
  lingerie: '/images/categories/glamshop-lingerie-banner.webp',
  accessoires: '/images/categories/glamshop-accessoires-banner.jpg',
};

export function CategoryPage({ categorySlug }: CategoryPageProps) {
  const navigateTo = useStore((s) => s.navigateTo);
  const { isGlamshop } = useTemplate();
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const isBoutique = categorySlug.toLowerCase() === 'boutique';
  const lowerSlug = categorySlug.toLowerCase();

  // Find category in static list, or create a dynamic one
  const staticCategory = categories.find(
    (c) => c.slug.toLowerCase() === lowerSlug
  );

  const boutiqueCategory = isBoutique
    ? { id: 'boutique', name: 'BOUTIQUE', image: '', slug: 'boutique', subcategories: [] }
    : staticCategory || {
        id: lowerSlug,
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
        image: '',
        slug: lowerSlug,
        subcategories: [],
      };

  // Use static data directly — no API dependency for product images
  const allProducts = isBoutique
    ? products
    : (staticCategory ? getProductsByCategory(staticCategory.name) : []);

  const filteredAndSorted = (() => {
    let result = allProducts.filter((product) => {
      // Price
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      )
        return false;

      // Brand
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand))
        return false;

      // Category (sub-category filter)
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.subcategory)
      )
        return false;

      // Concerns
      if (
        filters.concerns.length > 0 &&
        !product.concerns?.some((c) => filters.concerns.includes(c))
      )
        return false;

      // Rating
      if (filters.rating !== null && product.rating < filters.rating)
        return false;

      return true;
    });

    // Sort
    switch (filters.sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      case 'top-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured: bestsellers first, then trending, then by rating
        result.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return b.rating - a.rating;
        });
    }

    return result;
  })();

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilterState);
  };

  let activeFilterCount = 0;
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) activeFilterCount++;
  if (filters.brands.length > 0) activeFilterCount++;
  if (filters.categories.length > 0) activeFilterCount++;
  if (filters.concerns.length > 0) activeFilterCount++;
  if (filters.rating !== null) activeFilterCount++;

  const gradient = categoryGradients[lowerSlug] || 'from-gray-100 to-gray-50';

  return (
    <div className="min-h-screen bg-background">
      {/* Category Banner */}
      {isGlamshop && glamshopCategoryBanners[lowerSlug] ? (
        <section className="relative">
          <div className="relative w-full">
            <img
              src={glamshopCategoryBanners[lowerSlug]}
              alt={`Bannière ${boutiqueCategory.name}`}
              className="w-full h-[200px] sm:h-[280px] md:h-[340px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => navigateTo('home')}
                      className="cursor-pointer text-white/80 hover:text-white"
                    >
                      <Home className="size-3.5 mr-1" />
                      Accueil
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/60" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-white">
                      {boutiqueCategory.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight drop-shadow-lg">
                {boutiqueCategory.name}
              </h1>
              <p className="text-white/80 mt-2 text-sm sm:text-base max-w-xl drop-shadow">
                {isBoutique
                  ? 'Découvrez tous nos produits des meilleures marques de luxe'
                  : `Découvrez notre collection de ${boutiqueCategory.name.toLowerCase()} produits des meilleures marques de luxe`
                }
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section
          className={`relative bg-gradient-to-r ${gradient} py-12 sm:py-16 px-4 sm:px-6 lg:px-8`}
        >
          <div className="max-w-[1440px] mx-auto">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => navigateTo('home')}
                    className="cursor-pointer"
                  >
                    <Home className="size-3.5 mr-1" />
                    Accueil
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">
                    {boutiqueCategory.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-foreground tracking-tight">
                  {boutiqueCategory.name}
                </h1>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-xl">
                  {isBoutique
                    ? 'Découvrez tous nos produits des meilleures marques de luxe'
                    : `Découvrez notre collection de ${boutiqueCategory.name.toLowerCase()} produits des meilleures marques de luxe`
                  }
                </p>
              </div>
            </div>
            {/* Subcategory chips */}
            {boutiqueCategory.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {boutiqueCategory.subcategories.map((sub) => (
                  <button
                    key={sub.slug}
                    onClick={() =>
                      handleFilterChange({
                        ...filters,
                        categories: [sub.name],
                      })
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                      filters.categories.includes(sub.name)
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-white/60 text-foreground border-border hover:border-foreground/50'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          {/* Product Area */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Sheet
                  open={mobileFiltersOpen}
                  onOpenChange={setMobileFiltersOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden flex items-center gap-2"
                    >
                      <SlidersHorizontal className="size-4" />
                      Filtres
                      {activeFilterCount > 0 && (
                        <span className="ml-1 size-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-bold">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader className="pt-8">
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="px-4 py-4">
                      <FilterSidebarContent
                        filters={filters}
                        onFilterChange={(f) => {
                          handleFilterChange(f);
                        }}
                        onReset={handleResetFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {filteredAndSorted.length}
                  </span>{' '}
                  produit{filteredAndSorted.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Trier par :
                </span>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    handleFilterChange({ ...filters, sortBy: value })
                  }
                >
                  <SelectTrigger className="w-[160px] sm:w-[180px] h-9 text-sm">
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

            {/* Active Filters */}
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Actifs :
                    </span>
                    {filters.brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() =>
                          handleFilterChange({
                            ...filters,
                            brands: filters.brands.filter((b) => b !== brand),
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
                      >
                        {brand}
                        <ChevronDown className="size-3 rotate-45" />
                      </button>
                    ))}
                    {filters.concerns.map((concern) => (
                      <button
                        key={concern}
                        onClick={() =>
                          handleFilterChange({
                            ...filters,
                            concerns: filters.concerns.filter(
                              (c) => c !== concern
                            ),
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
                      >
                        {concern}
                        <ChevronDown className="size-3 rotate-45" />
                      </button>
                    ))}
                    {filters.rating !== null && (
                      <button
                        onClick={() =>
                          handleFilterChange({ ...filters, rating: null })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
                      >
                        {filters.rating}+ Stars
                        <ChevronDown className="size-3 rotate-45" />
                      </button>
                    )}
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RotateCcw className="size-3" />
                      Tout effacer
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <LayoutGroup>
              {filteredAndSorted.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredAndSorted.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard
                          product={product}
                          onQuickView={setQuickViewProduct}
                        />
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
                  <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <SlidersHorizontal className="size-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold font-heading mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                    Essayez d&apos;ajuster vos filtres ou de les effacer pour voir
                    plus de produits.
                  </p>
                  <Button onClick={handleResetFilters} variant="outline">
                    <RotateCcw className="size-4" />
                    Réinitialiser les filtres
                  </Button>
                </motion.div>
              )}
            </LayoutGroup>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
