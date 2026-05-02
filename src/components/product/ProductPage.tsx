'use client';

import { useState, useRef } from 'react';
import {
  ShoppingBag,
  Minus,
  Plus,
  Home,
  ChevronRight,
  Star,
  MessageSquare,
  Shield,
  Truck,
  RotateCcw,
  Award,
  Instagram,
  Facebook,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { StarRating } from '@/components/shared/StarRating';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductGallery } from './ProductGallery';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';
import { useTemplate } from '@/hooks/use-template';
import { getRelatedProducts } from '@/data/products';
import { Product, Review } from '@/types';
import { cn } from '@/lib/utils';

interface ProductPageProps {
  product: Product;
}

const paymentBadges = [
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'PayPal', icon: '🅿️' },
  { name: 'Stripe', icon: '💳' },
];

// Empty reviews - will be populated from DB when available
const mockReviews: Review[] = [];

const benefits = [
  { icon: Truck, text: 'Livraison gratuite dès 50€' },
  { icon: RotateCcw, text: 'Retours sous 30 jours' },
  { icon: Award, text: 'Produits authentiques' },
  { icon: Shield, text: 'Paiement sécurisé' },
];

// Glamshop-specific category banners
const glamshopCategoryBanners: Record<string, string> = {
  makeup: '/images/categories/glamshop-makeup-banner.jpg',
  lingerie: '/images/categories/glamshop-lingerie-banner.webp',
  accessoires: '/images/categories/glamshop-accessoires-banner.jpg',
};



function ReviewStarsBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-right text-muted-foreground">{star}</span>
      <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs text-muted-foreground">
        {count}
      </span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 sm:p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{review.author}</span>
            {review.verified && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 font-medium"
              >
                ✓ Achat vérifié
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(review.date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>
      <h4 className="font-semibold text-sm">{review.title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {review.content}
      </p>
    </div>
  );
}

export function ProductPage({ product }: ProductPageProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const navigateTo = useStore((s) => s.navigateTo);
  const { isGlamshop } = useTemplate();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const reviewsRef = useRef<HTMLDivElement>(null);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Use static data directly — no API dependency for product images
  const relatedProducts = getRelatedProducts(product.id, product.category);

  const avgRating = product.rating || 0;

  // Get category banner for Glamshop
  const categoryLower = product.category.toLowerCase();
  const categoryBanner = glamshopCategoryBanners[categoryLower];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setCartOpen(true);
  };

  const scrollToReviews = () => {
    setTimeout(() => {
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Glamshop Category Banner */}
      {isGlamshop && categoryBanner && (
        <div className="relative w-full">
          <img
            src={categoryBanner}
            alt={`Bannière ${product.category}`}
            className="w-full h-[160px] sm:h-[220px] md:h-[280px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                {product.category}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigateTo('home')}
                className="cursor-pointer flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Home className="size-3" />
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() =>
                  navigateTo('category', { category: product.category })
                }
                className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
              >
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-xs text-foreground truncate max-w-[200px]">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product Main Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 lg:gap-10 xl:gap-16">
          {/* Left: Gallery — sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-5 pb-24 lg:pb-0">
            {/* Stock Status */}
            {product.inStock && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-green-600 fill-green-600" />
                <span className="text-sm font-medium text-green-700">En stock</span>
              </div>
            )}

            {/* Brand */}
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="text-2xl sm:text-[28px] font-bold text-neutral-900 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.slice(0, 4).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px] font-normal bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Rating */}
            <button
              onClick={scrollToReviews}
              className="flex items-center gap-2 group"
            >
              <StarRating rating={product.rating} size={15} />
              <span className="text-sm text-muted-foreground group-hover:text-neutral-900 transition-colors underline-offset-2 group-hover:underline">
                {product.reviewCount} avis
              </span>
            </button>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-[28px] sm:text-3xl font-bold text-neutral-900">
                {product.price.toFixed(2)}€
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    {product.originalPrice.toFixed(2)}€
                  </span>
                  <Badge className="bg-red-500 text-white border-none text-[11px] font-bold px-2 py-0.5">
                    -{discount}%
                  </Badge>
                </>
              )}
            </div>

            <Separator className="bg-gray-100" />

            {/* Short Description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Product Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {product.variants.map((variant) => (
                  <div key={variant.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-neutral-900">
                        {variant.name}
                      </span>
                      {selectedVariants[variant.name] && (
                        <span className="text-xs text-muted-foreground">
                          {variant.options.find((o) => o.label === selectedVariants[variant.name])?.label}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.type === 'color' ? (
                        // Color swatches
                        variant.options.map((option) => (
                          <button
                            key={option.label}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variant.name]: option.label,
                              }))
                            }
                            title={option.label}
                            className={cn(
                              'relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-200',
                              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900',
                              selectedVariants[variant.name] === option.label
                                ? 'border-neutral-900 ring-2 ring-neutral-900/20 scale-110'
                                : 'border-gray-200 hover:border-gray-400',
                              !option.inStock && 'opacity-30 cursor-not-allowed hover:border-gray-200 hover:scale-100'
                            )}
                            disabled={!option.inStock}
                          >
                            <span
                              className="absolute inset-0.5 rounded-full"
                              style={{ backgroundColor: option.value }}
                            />
                          </button>
                        ))
                      ) : (
                        // Text buttons (Taille, Volume, Motif, etc.)
                        variant.options.map((option) => (
                          <button
                            key={option.label}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variant.name]: option.label,
                              }))
                            }
                            className={cn(
                              'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-200',
                              'hover:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-900',
                              selectedVariants[variant.name] === option.label
                                ? 'bg-neutral-900 text-white border-neutral-900'
                                : 'bg-white text-neutral-900 border-gray-200 hover:bg-gray-50',
                              !option.inStock && 'opacity-30 cursor-not-allowed hover:bg-white hover:border-gray-200'
                            )}
                            disabled={!option.inStock}
                          >
                            {option.label}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Benefits Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
              {benefits.map((benefit) => (
                <div
                  key={benefit.text}
                  className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg bg-gray-50"
                >
                  <benefit.icon className="size-5 text-neutral-700" />
                  <span className="text-[11px] leading-tight text-gray-600 font-medium">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="bg-gray-100" />

            {/* Quantity + Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-neutral-900">Quantité :</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 rounded-none hover:bg-gray-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="w-12 text-center text-sm font-semibold tabular-nums text-neutral-900">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 rounded-none hover:bg-gray-50"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className={cn(
                  'w-full h-13 rounded-lg text-sm font-bold gap-2.5 tracking-wide',
                  'text-white hover:opacity-90',
                  'shadow-sm hover:shadow-md transition-all'
                )}
                style={{ backgroundColor: '#bc8752' }}
              >
                <ShoppingBag className="size-5" />
                AJOUTER AU PANIER
              </Button>

              {/* Payment Badges */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {paymentBadges.map((badge) => (
                  <span
                    key={badge.name}
                    className="px-2 py-0.5 bg-gray-50 rounded text-[10px] font-medium text-gray-400 border border-gray-100"
                  >
                    {badge.icon} {badge.name}
                  </span>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Social Links */}
            <div className="flex items-center gap-3 py-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Suivez-nous</span>
              <div className="flex items-center gap-2">
                <a href="https://www.instagram.com/p/DDKVWj_tcSq/" target="_blank" rel="noopener noreferrer" className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform" aria-label="Instagram">
                  <Instagram className="size-3.5" />
                </a>
                <a href="https://web.facebook.com/evadiagne05/" target="_blank" rel="noopener noreferrer" className="size-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform" aria-label="Facebook">
                  <Facebook className="size-3.5" />
                </a>
                <a href="https://www.tiktok.com/@chic_and_glamour_by_eva" target="_blank" rel="noopener noreferrer" className="size-8 rounded-full bg-neutral-900 flex items-center justify-center text-white hover:scale-110 transition-transform" aria-label="TikTok">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.82 4.82 0 01-3.77-1.58V6.69h3.77z" /></svg>
                </a>
              </div>
            </div>

            {/* Product Details Accordion — desktop only, below the add-to-cart */}
            <div className="hidden lg:block pt-2">
              <Accordion type="multiple" defaultValue={['description']} className="w-full">
                <AccordionItem value="description" className="border-gray-100">
                  <AccordionTrigger className="text-sm font-semibold text-neutral-900 hover:no-underline py-4">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                    <p>{product.description}</p>
                    <p className="mt-3">
                      Crafted with the finest ingredients and backed by scientific
                      research, this premium {product.category.toLowerCase()} product
                      delivers visible results. Suitable for{' '}
                      {product.skinType?.join(', ') || 'all skin types'}, it
                      addresses {product.concerns?.join(', ').toLowerCase() || 'common skin concerns'}{' '}
                      with a powerful yet gentle formula that&apos;s become a
                      favorite among beauty enthusiasts worldwide.
                    </p>
                    {product.isBestseller && (
                      <p className="text-sm font-semibold text-neutral-900 mt-3 flex items-center gap-1.5">
                        <Star className="size-4 text-amber-400 fill-amber-400" />
                        Best-seller — adoré par des milliers de clientes.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-to-use" className="border-gray-100">
                  <AccordionTrigger className="text-sm font-semibold text-neutral-900 hover:no-underline py-4">
                    Mode d&apos;emploi
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                    <ol className="space-y-3">
                      <li className="flex gap-3">
                        <span className="size-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0 text-neutral-700">
                          1
                        </span>
                        <span>
                          Commencez avec une peau propre et sèche. Appliquez une petite quantité sur le bout des doigts.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0 text-neutral-700">
                          2
                        </span>
                        <span>
                          Massez délicatement en effectuant des mouvements circulaires ascendantes. Concentrez-vous sur les zones concernées.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0 text-neutral-700">
                          3
                        </span>
                        <span>
                          Laissez le produit absorber complètement avant d&apos;appliquer d&apos;autres produits ou du maquillage.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="size-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0 text-neutral-700">
                          4
                        </span>
                        <span>
                          Utilisez matin et soir pour de meilleurs résultats. Appliquez une protection solaire le jour.
                        </span>
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ingredients" className="border-gray-100">
                  <AccordionTrigger className="text-sm font-semibold text-neutral-900 hover:no-underline py-4">
                    Ingrédients
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                    <p className="mb-3">
                      Notre formule est minutieusement élaborée avec des ingrédients premium, testés cliniquement :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { name: 'Acide Hyaluronique', desc: 'Hydratation profonde' },
                        { name: 'Niacinamide', desc: 'Affinement des pores' },
                        { name: 'Vitamine C', desc: 'Éclat' },
                        { name: 'Rétinol', desc: 'Anti-âge' },
                        { name: 'Peptides', desc: 'Fermeté' },
                        { name: 'Céramides', desc: 'Réparation barrière' },
                      ].map((ingredient) => (
                        <div
                          key={ingredient.name}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <p className="font-semibold text-sm text-neutral-900">{ingredient.name}</p>
                          <p className="text-xs text-gray-500">
                            {ingredient.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      *Liste complète des ingrédients disponible sur l&apos;emballage du produit. Ce produit est sans parabènes, sulfates et phtalates.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Accordion Section (mobile & desktop below product area) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {/* Mobile Accordion (always visible on mobile) */}
        <div className="lg:hidden">
          <Accordion type="multiple" defaultValue={['description']} className="w-full">
            <AccordionItem value="description" className="border-gray-100">
              <AccordionTrigger className="text-sm font-semibold text-neutral-900 hover:no-underline py-4">
                Description
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-3">
                  Crafted with the finest ingredients and backed by scientific
                  research, this premium {product.category.toLowerCase()} product
                  delivers visible results. Suitable for{' '}
                  {product.skinType?.join(', ') || 'all skin types'}, it
                  addresses {product.concerns?.join(', ').toLowerCase() || 'common skin concerns'}{' '}
                  with a powerful yet gentle formula that&apos;s become a
                  favorite among beauty enthusiasts worldwide.
                </p>
                {product.isBestseller && (
                  <p className="text-sm font-semibold text-neutral-900 mt-3 flex items-center gap-1.5">
                    <Star className="size-4 text-amber-400 fill-amber-400" />
                    Best-seller — adoré par des milliers de clientes.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-to-use" className="border-gray-100">
              <AccordionTrigger className="text-sm font-semibold text-neutral-900 hover:no-underline py-4">
                Mode d&apos;emploi
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="size-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0 text-neutral-700">
                      1
                    </span>
                    <span>
                      Commencez avec une peau propre et sèche. Appliquez une petite quantité sur le bout des doigts.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="size-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0 text-neutral-700">
                      2
                    </span>
                    <span>
                      Massez délicatement en effectuant des mouvements circulaires ascendantes. Concentrez-vous sur les zones concernées.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="size-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0 text-neutral-700">
                      3
                    </span>
                    <span>
                      Laissez le produit absorber complètement avant d&apos;appliquer d&apos;autres produits ou du maquillage.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="size-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0 text-neutral-700">
                      4
                    </span>
                    <span>
                      Utilisez matin et soir pour de meilleurs résultats. Appliquez une protection solaire le jour.
                    </span>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ingredients" className="border-gray-100">
              <AccordionTrigger className="text-sm font-semibold text-neutral-900 hover:no-underline py-4">
                Ingrédients
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                <p className="mb-3">
                  Notre formule est minutieusement élaborée avec des ingrédients premium, testés cliniquement :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { name: 'Acide Hyaluronique', desc: 'Hydratation profonde' },
                    { name: 'Niacinamide', desc: 'Affinement des pores' },
                    { name: 'Vitamine C', desc: 'Éclat' },
                    { name: 'Rétinol', desc: 'Anti-âge' },
                    { name: 'Peptides', desc: 'Fermeté' },
                    { name: 'Céramides', desc: 'Réparation barrière' },
                  ].map((ingredient) => (
                    <div
                      key={ingredient.name}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <p className="font-semibold text-sm text-neutral-900">{ingredient.name}</p>
                      <p className="text-xs text-gray-500">
                        {ingredient.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  *Liste complète des ingrédients disponible sur l&apos;emballage du produit. Ce produit est sans parabènes, sulfates et phtalates.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Reviews Section — only show if product has reviews */}
      {product.reviewCount > 0 && (
        <section ref={reviewsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="border border-gray-100 rounded-xl bg-white p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                Avis clients ({product.reviewCount})
              </h2>
              <Button variant="outline" className="gap-2 text-sm border-gray-200">
                <MessageSquare className="size-4" />
                Écrire un avis
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 p-5 bg-gray-50 rounded-xl">
              <div className="text-center sm:text-left shrink-0">
                <p className="text-5xl font-bold text-neutral-900">{avgRating.toFixed(1)}</p>
                <StarRating rating={avgRating} size={18} className="mt-2 justify-center sm:justify-start" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-500">Les avis de nos clientes apparaîtront ici.</p>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Separator className="bg-gray-100 mb-8" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
              Vous aimerez aussi
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigateTo('category', { category: product.category })
              }
              className="text-sm gap-1 text-muted-foreground hover:text-neutral-900"
            >
              Voir Tout
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Add-to-Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900 truncate">
              {product.price.toFixed(2)}€
            </p>
            {product.originalPrice && (
              <p className="text-xs text-gray-400 line-through">
                {product.originalPrice.toFixed(2)}€
              </p>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            className="h-11 rounded-lg text-white hover:opacity-90 text-sm font-bold gap-2 px-6 shrink-0"
            style={{ backgroundColor: '#bc8752' }}
          >
            <ShoppingBag className="size-4" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}
