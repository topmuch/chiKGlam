'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGallery from './ProductGallery';
import StarRating from '@/components/shared/StarRating';
import ProductCard from '@/components/shared/ProductCard';
import { useStore } from '@/store/use-store';
import { useCartStore } from '@/store/use-cart-store';
import { getTrendingProducts } from '@/data/products';
import type { Product } from '@/types';

interface ProductPageProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductPage({ product, relatedProducts }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const { navigateTo, goBack } = useStore();
  const { addItem } = useCartStore();

  const trending = relatedProducts || getTrendingProducts?.()?.slice(0, 4) || [];

  const safeImages = product.images?.length ? product.images : ['/placeholder.jpg'];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: safeImages[0],
      quantity,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => goBack()}
              className="hover:text-[#bc8752] transition-colors"
            >
              Accueil
            </button>
            <ChevronRight className="h-3 w-3" />
            <button
              onClick={() =>
                navigateTo('category', { slug: product.category?.slug || 'all', name: 'Boutique' })
              }
              className="hover:text-[#bc8752] transition-colors"
            >
              {product.category?.name || 'Boutique'}
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGallery images={safeImages} productName={product.name} />
          </motion.div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{product.brand}</p>
            )}

            {/* Name */}
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating || 0} size={18} />
              <span className="text-sm text-gray-500">
                {product.rating?.toFixed(1) || '0.0'} ({product.reviewCount || 0} avis)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">{product.price?.toFixed(2)} €</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {product.originalPrice.toFixed(2)} €
                  </span>
                  <Badge
                    style={{ backgroundColor: '#dc2626', color: 'white', border: 'none' }}
                    className="text-sm px-2 py-0.5"
                  >
                    -{discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            )}

            <Separator className="mb-6" />

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantité :</span>
              <div className="flex items-center gap-2">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-[#bc8752] hover:text-[#bc8752] transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-base font-semibold">{quantity}</span>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-[#bc8752] hover:text-[#bc8752] transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <Button
              className="w-full text-white font-semibold py-6 text-base"
              style={{ backgroundColor: '#bc8752' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a07040')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bc8752')}
              onClick={handleAddToCart}
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ajouter au panier
            </Button>

            {/* Secondary actions */}
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1 font-medium"
                style={{ borderColor: '#bc8752', color: '#bc8752' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#bc8752';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#bc8752';
                }}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                {isLiked ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
              </Button>
              <Button variant="outline" className="font-medium" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5 flex-shrink-0" style={{ color: '#bc8752' }} />
                <span>Livraison gratuite</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw className="h-5 w-5 flex-shrink-0" style={{ color: '#bc8752' }} />
                <span>Retours 30 jours</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 flex-shrink-0" style={{ color: '#bc8752' }} />
                <span>Paiement sécurisé</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12 md:mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent rounded-none h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#bc8752] data-[state=active]:text-[#bc8752] data-[state=active]:shadow-none px-4 py-3 text-sm font-medium text-gray-500"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="ingredients"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#bc8752] data-[state=active]:text-[#bc8752] data-[state=active]:shadow-none px-4 py-3 text-sm font-medium text-gray-500"
              >
                Ingrédients
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#bc8752] data-[state=active]:text-[#bc8752] data-[state=active]:shadow-none px-4 py-3 text-sm font-medium text-gray-500"
              >
                Avis ({product.reviewCount || 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'Description détaillée du produit bientôt disponible.'}
              </p>
            </TabsContent>
            <TabsContent value="ingredients" className="pt-6">
              <p className="text-gray-600 leading-relaxed">
                Liste des ingrédients bientôt disponible. Contactez notre service client pour plus
                d&apos;informations.
              </p>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              <div className="text-center py-8 text-gray-400">
                <Package className="h-12 w-12 mx-auto mb-3" />
                <p>Aucun avis pour le moment</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related products */}
        {trending.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {trending.map((p: any, idx: number) => (
                <ProductCard key={p.id || idx} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
