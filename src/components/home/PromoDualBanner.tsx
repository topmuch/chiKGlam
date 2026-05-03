'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { useTemplate } from '@/hooks/use-template';
import { useStore } from '@/store/use-store';

const PROMO_PRODUCTS = [
  {
    id: 'mk-011',
    name: 'Mascara Bleu Saphir',
    brand: 'ChicGlam by Eva',
    price: 17,
    image: '/images/products/makeup/mascara-bleu-saphir.png',
    originalPrice: null,
    inStock: true,
  },
  {
    id: 'mk-010',
    name: 'Mascara SMUDGE Noir',
    brand: 'ChicGlam by Eva',
    price: 17,
    image: '/images/products/makeup/mascara-smudge-noir.png',
    originalPrice: null,
    inStock: true,
  },
];

export function PromoDualBanner() {
  const navigateTo = useStore((s) => s.navigateTo);
  const { isGold, isGlamshop } = useTemplate();

  return (
    <section className="py-8 md:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative rounded-xl overflow-hidden bg-white shadow-sm border border-border">
            <div className="flex flex-col lg:flex-row items-stretch">
              {/* Left: Image */}
              <div className="w-full lg:w-[45%] flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                {/* Speech bubble "SPOTLIGHT ON:" */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-block relative mb-4">
                    <div className="bg-foreground text-background px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md">
                      Spotlight On
                    </div>
                    <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-foreground transform rotate-45 shadow-md" />
                  </div>
                </motion.div>

                <motion.h2
                  className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight max-w-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Offres
                  <br />
                  <span className="text-muted-foreground">Exclusives</span>
                </motion.h2>

                <motion.p
                  className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xs mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Découvrez nos mascaras exclusifs à prix réduit pour une durée limitée.
                </motion.p>

                {/* Promo image — matches height of product cards on the right */}
                <motion.div
                  className={`relative w-full rounded-xl overflow-hidden shadow-lg flex-1 ${isGlamshop ? 'min-h-[400px] sm:min-h-[500px] lg:min-h-[520px]' : 'min-h-[280px] sm:min-h-[340px] lg:min-h-0'}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <img
                    src="/images/banners/promo-offres-exclusives.jpeg"
                    alt="Offres Exclusives — Mascara Bleu Saphir & SMUDGE Noir"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Right: Two product cards side by side */}
              <div className={`w-full lg:w-[55%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center ${isGlamshop ? 'p-6 sm:p-10 lg:p-12' : ''}`}>
                <div className={`grid grid-cols-1 ${isGlamshop ? 'sm:grid-cols-2 gap-6 sm:gap-8' : 'sm:grid-cols-2 gap-4 sm:gap-5'}`}>
                  {PROMO_PRODUCTS.map((product, index) => (
                    <motion.div
                      key={product.id}
                      className={`flex flex-col h-full bg-white rounded-lg border border-border/60 ${isGlamshop ? 'p-5 sm:p-6 hover:shadow-lg' : 'p-3 sm:p-4 hover:shadow-md'} transition-shadow duration-300 group`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      {/* Product image */}
                      <div className={`relative flex-shrink-0 bg-[#F7F7F7] rounded-md overflow-hidden mb-4 ${isGlamshop ? 'aspect-[4/5]' : 'aspect-square mb-3'}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`w-full h-full object-contain ${isGlamshop ? 'p-6 sm:p-8' : 'p-2'} group-hover:scale-105 transition-transform duration-500`}
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex-1 flex flex-col">
                        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
                          {product.brand}
                        </p>
                        <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug line-clamp-2 mb-2">
                          {product.name}
                        </h3>

                        {/* Price section */}
                        <div className="mt-auto flex items-end justify-between gap-2">
                          <div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <p className="text-xs text-muted-foreground line-through mb-0.5">
                                {product.originalPrice.toFixed(2)}€
                              </p>
                            )}
                            <p className="text-base sm:text-lg font-bold text-foreground">
                              {product.price.toFixed(2)}€
                            </p>
                          </div>

                          {/* ACHETER button */}
                          <button
                            onClick={() => navigateTo('product', { product })}
                            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded transition-colors ${(isGold || isGlamshop) ? 'bg-[#bc8752] text-white hover:bg-[#bc8752]/90' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                          >
                            ACHETER
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
