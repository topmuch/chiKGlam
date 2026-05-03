'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Home,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '@/types';
import { getRelatedProducts } from '@/data/products';
import { useStore } from '@/store/use-store';
import { useCartStore } from '@/store/use-cart-store';
import { LuxuriaProductCard } from './LuxuriaProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

// ─── Design tokens (Amiy) ───
const BURGUNDY = '#663130';
const BG_TERTIARY = '#F4F2ED';
const BG_QUATERNARY = '#FBEADE';
const BG_SECTION = '#F9F7F4';
const BORDER_COLOR = '#E8E4DE';
const TEXT_LIGHT = '#666666';
const TEXT_MUTED = '#999999';
const SALE_RED = '#cc3333';

// ─── Trust Badges ───
const trustBadges = [
  { icon: Truck, label: 'Livraison gratuite dès 50€' },
  { icon: RotateCcw, label: 'Retours sous 15 jours' },
  { icon: ShieldCheck, label: 'Paiement 100% sécurisé' },
];

// ─── Star Rating Component ───
function ProductStars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? 'fill-[#663130] text-[#663130]'
              : 'fill-[#E8E4DE] text-[#E8E4DE]'
          }
        />
      ))}
    </div>
  );
}

// ─── Main Component ───
interface LuxuriaProductPageProps {
  product: Product;
}

export default function LuxuriaProductPage({ product }: LuxuriaProductPageProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const navigateTo = useStore((s) => s.navigateTo);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isWishlisted, setIsWishlisted] = useState(false);

  const allImages = product.images?.length > 0 ? product.images : [product.image];
  const relatedProducts = getRelatedProducts(product.id, product.category);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigateTo('checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Breadcrumb ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <Breadcrumb>
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
              <BreadcrumbLink
                onClick={() => navigateTo('category', { category: product.category })}
                className="cursor-pointer text-xs text-[#999] hover:text-[#663130] transition-colors"
              >
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-[#E8E4DE]" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-xs text-[#000] truncate max-w-[200px]">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ─── Product Main Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-10 xl:gap-16"
        >
          {/* ═══ LEFT: Image Gallery ═══ */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4">
              {/* Main Image */}
              <div
                className="relative aspect-square rounded-2xl overflow-hidden"
                style={{ backgroundColor: BG_TERTIARY }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={allImages[selectedImageIndex]}
                      alt={`${product.name} — Vue ${selectedImageIndex + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-contain p-4 sm:p-8"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {discount > 0 && (
                    <Badge
                      className="border-none text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: SALE_RED }}
                    >
                      -{discount}%
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-[#000] text-white border-none text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      NOUVEAU
                    </Badge>
                  )}
                  {product.isBestseller && (
                    <Badge className="border-none text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: BURGUNDY }}>
                      BESTSELLER
                    </Badge>
                  )}
                </div>

                {/* Wishlist + Share */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => setIsWishlisted((prev) => !prev)}
                    className="size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-200"
                    aria-label="Ajouter aux favoris"
                  >
                    <Heart
                      size={16}
                      className={cn(
                        'transition-colors',
                        isWishlisted ? 'fill-[#cc3333] text-[#cc3333]' : 'text-[#666]'
                      )}
                    />
                  </button>
                  <button
                    className="size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-200"
                    aria-label="Partager"
                  >
                    <Share2 size={16} className="text-[#666]" />
                  </button>
                </div>

                {/* Image counter */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-medium text-[#666] shadow-sm">
                    {selectedImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        'relative shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden transition-all duration-300 border-2',
                        selectedImageIndex === index
                          ? 'border-[#663130] shadow-sm'
                          : 'border-transparent opacity-50 hover:opacity-90 hover:border-[#E8E4DE]'
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} — Miniature ${index + 1}`}
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ═══ RIGHT: Product Info ═══ */}
          <div className="space-y-5 pb-24 lg:pb-0">
            {/* Category Label */}
            <p
              className="text-[11px] uppercase tracking-[0.2em] font-semibold"
              style={{ color: TEXT_MUTED }}
            >
              {product.category} — {product.subcategory}
            </p>

            {/* Stock Status */}
            {product.inStock && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600 fill-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">En stock</span>
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-[26px] sm:text-[30px] lg:text-[32px] font-heading font-bold text-[#000] leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Star Rating + Review Count */}
            <div className="flex items-center gap-2">
              <ProductStars rating={product.rating} size={15} />
              <span className="text-sm text-[#999]">
                ({product.reviewCount} avis)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.originalPrice ? (
                <>
                  <span className="text-[28px] sm:text-[32px] font-bold text-white" style={{ backgroundColor: SALE_RED, padding: '2px 10px', borderRadius: '6px' }}>
                    {product.price.toFixed(2)}€
                  </span>
                  <span className="text-lg text-[#999] line-through">
                    {product.originalPrice.toFixed(2)}€
                  </span>
                </>
              ) : (
                <span className="text-[28px] sm:text-[32px] font-bold text-[#000]">
                  {product.price.toFixed(2)}€
                </span>
              )}
            </div>

            <Separator className="bg-[#E8E4DE]" />

            {/* Short Description */}
            <p className="text-sm leading-relaxed line-clamp-3" style={{ color: TEXT_LIGHT }}>
              {product.description}
            </p>

            {/* ── Variant Selectors ── */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-5">
                {product.variants.map((variant) => (
                  <div key={variant.name}>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-semibold text-[#000]">
                        {variant.name}
                      </span>
                      {selectedVariants[variant.name] && (
                        <span className="text-xs text-[#999]">
                          {variant.options.find(
                            (o) => o.label === selectedVariants[variant.name]
                          )?.label}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.type === 'color'
                        ? variant.options.map((option) => (
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
                                'relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none',
                                selectedVariants[variant.name] === option.label
                                  ? 'border-[#663130] ring-2 ring-[#663130]/20 scale-110'
                                  : 'border-[#E8E4DE] hover:border-[#999]',
                                !option.inStock && 'opacity-30 cursor-not-allowed'
                              )}
                              disabled={!option.inStock}
                            >
                              <span
                                className="absolute inset-1 rounded-full"
                                style={{ backgroundColor: option.value }}
                              />
                            </button>
                          ))
                        : variant.options.map((option) => (
                            <button
                              key={option.label}
                              onClick={() =>
                                setSelectedVariants((prev) => ({
                                  ...prev,
                                  [variant.name]: option.label,
                                }))
                              }
                              className={cn(
                                'px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-200',
                                selectedVariants[variant.name] === option.label
                                  ? 'bg-[#663130] text-white border-[#663130]'
                                  : 'bg-white text-[#666] border-[#E8E4DE] hover:border-[#663130] hover:text-[#663130]',
                                !option.inStock && 'opacity-30 cursor-not-allowed'
                              )}
                              disabled={!option.inStock}
                            >
                              {option.label}
                            </button>
                          ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Quantity Selector ── */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-[#000]">Quantité :</span>
              <div className="flex items-center border border-[#E8E4DE] rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="size-10 flex items-center justify-center text-[#666] hover:bg-[#F9F7F4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1) setQuantity(val);
                  }}
                  className="w-12 text-center text-sm font-semibold tabular-nums text-[#000] bg-transparent border-x border-[#E8E4DE] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="size-10 flex items-center justify-center text-[#666] hover:bg-[#F9F7F4] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* ── Add to Cart Button ── */}
            <Button
              onClick={handleAddToCart}
              className="w-full h-12 rounded-lg text-sm font-bold tracking-widest uppercase text-white shadow-md hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: BURGUNDY }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#7a3a38';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = BURGUNDY;
              }}
            >
              <ShoppingBag className="size-5 mr-2" />
              Ajouter au panier
            </Button>

            {/* ── Buy Now Button ── */}
            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="w-full h-12 rounded-lg text-sm font-bold tracking-widest uppercase border-[#000] text-[#000] bg-transparent hover:bg-[#000] hover:text-white transition-all duration-300"
            >
              Acheter maintenant
            </Button>

            {/* ── Trust Badges ── */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center text-center gap-1.5 py-3 px-2 rounded-xl"
                  style={{ backgroundColor: BG_TERTIARY }}
                >
                  <badge.icon size={18} style={{ color: BURGUNDY }} />
                  <span className="text-[10px] leading-tight font-medium text-[#666]">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Product Details Accordion ── */}
            <Accordion
              type="multiple"
              defaultValue={['description']}
              className="w-full"
            >
              {/* Description */}
              <AccordionItem value="description" className="border-[#E8E4DE]">
                <AccordionTrigger className="text-sm font-bold text-[#000] hover:no-underline py-4">
                  Description
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-relaxed text-[#666] pb-2">
                    {product.description}
                  </p>
                  <p className="text-sm leading-relaxed text-[#666]">
                    Ce produit {product.category.toLowerCase()} premium de{' '}
                    {product.brand} est formulé avec les meilleurs ingrédients pour des
                    résultats visibles. Convient à{' '}
                    {product.skinType?.join(', ') || 'tous les types de peau'}
                    {product.concerns?.length
                      ? `, et s&apos;adresse particulièrement aux préoccupations de ${product.concerns.join(', ').toLowerCase()}`
                      : ''}
                    .
                  </p>
                  {product.isBestseller && (
                    <p className="text-sm font-semibold text-[#000] pt-3 flex items-center gap-1.5">
                      <Star size={14} className="fill-[#663130] text-[#663130]" />
                      Best-seller — adoré par des milliers de clientes.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Ingredients */}
              <AccordionItem value="ingredients" className="border-[#E8E4DE]">
                <AccordionTrigger className="text-sm font-bold text-[#000] hover:no-underline py-4">
                  Ingrédients
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-relaxed text-[#666] pb-2">
                    Formulé avec des ingrédients soigneusement sélectionnés. Sans parabènes,
                    sans sulfates, sans phtalates. Convient à tous les types de peau.
                    Produit non testé sur les animaux. Vegan &amp; cruelty-free.
                  </p>
                  <p className="text-xs text-[#999] mt-2">
                    Pour la liste complète des ingrédients, veuillez vous référer à
                    l&apos;emballage du produit.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Shipping */}
              <AccordionItem value="shipping" className="border-[#E8E4DE]">
                <AccordionTrigger className="text-sm font-bold text-[#000] hover:no-underline py-4">
                  Livraison &amp; Retours
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm text-[#666] pb-2">
                    <div className="flex items-start gap-2">
                      <Truck size={16} className="mt-0.5 shrink-0" style={{ color: BURGUNDY }} />
                      <p>
                        <strong className="text-[#000]">Livraison gratuite</strong> dès 50€
                        d&apos;achat. Livraison standard en 3-5 jours ouvrés, express en 1-2
                        jours.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <RotateCcw size={16} className="mt-0.5 shrink-0" style={{ color: BURGUNDY }} />
                      <p>
                        <strong className="text-[#000]">Retours gratuits</strong> sous 15
                        jours. Le produit doit être non ouvert et dans son emballage d&apos;origine.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheck size={16} className="mt-0.5 shrink-0" style={{ color: BURGUNDY }} />
                      <p>
                        <strong className="text-[#000]">Paiement sécurisé</strong> par carte
                        bancaire, PayPal ou mobile money. Vos données sont protégées.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* ── Tags ── */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[11px] font-medium text-[#666] border border-[#E8E4DE] bg-[#F9F7F4]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ─── Related Products ─── */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Separator className="bg-[#E8E4DE] mb-10" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#000] tracking-tight">
              Vous aimerez aussi
            </h2>
            <button
              onClick={() => navigateTo('category', { category: product.category })}
              className="text-sm font-medium text-[#999] hover:text-[#663130] transition-colors flex items-center gap-1"
            >
              Voir tout
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.slice(0, 4).map((p) => (
              <LuxuriaProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Mobile Sticky Add-to-Cart ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#E8E4DE] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[#000] truncate">
              {product.price.toFixed(2)}€
            </p>
            {product.originalPrice && (
              <p className="text-xs text-[#999] line-through">
                {product.originalPrice.toFixed(2)}€
              </p>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            className="h-11 rounded-lg text-sm font-bold tracking-wide uppercase px-6 shrink-0 text-white"
            style={{ backgroundColor: BURGUNDY }}
          >
            <ShoppingBag size={16} className="mr-1.5" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}
