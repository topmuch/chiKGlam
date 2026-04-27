import { Product, Category, Review } from '@/types';

export const categories: Category[] = [
  {
    id: 'makeup',
    name: 'MAKEUP',
    slug: 'makeup',
    image: '/images/categories/makeup.png',
    subcategories: [
      { slug: 'teint', name: 'Teint' },
      { slug: 'yeux', name: 'Yeux' },
      { slug: 'levres', name: 'Lèvres' },
    ],
  },
  {
    id: 'lingerie',
    name: 'LINGERIE',
    slug: 'lingerie',
    image: '/images/categories/lingerie.png',
    subcategories: [
      { slug: 'ensembles', name: 'Ensembles' },
      { slug: 'nuisettes', name: 'Nuisettes' },
      { slug: 'bodys', name: 'Bodys' },
      { slug: 'pagnes', name: 'Pagnes' },
      { slug: 'box-seduction', name: 'Box Séduction' },
    ],
  },
  {
    id: 'accessoires',
    name: 'ACCESSOIRES',
    slug: 'accessoires',
    image: '/images/categories/accessoires.png',
    subcategories: [
      { slug: 'cils', name: 'Cils' },
      { slug: 'pinceaux', name: 'Pinceaux' },
    ],
  },
  {
    id: 'box-de-seduction',
    name: 'BOX DE SEDUCTION',
    slug: 'box-de-seduction',
    image: '/images/categories/box-de-seduction.png',
    subcategories: [
      { slug: 'petits-pagnes', name: 'Petits pagnes' },
      { slug: 'kit-nuisette', name: 'Kit nuisette' },
      { slug: 'kimono', name: 'Kimono' },
      { slug: 'accessoires-perles-tour-de-taille', name: 'Accessoires perles/tour de taille' },
    ],
  },
];

export const brands: string[] = ['ChicGlam by Eva'];

// ============================================================
// FALLBACK PRODUCTS — displayed when DB is empty
// ============================================================
export const products: Product[] = [
  // ---- MAKEUP ----
  {
    id: 'mk-001',
    name: 'Fond de Teint Minéral Lumineux',
    brand: 'ChicGlam by Eva',
    price: 29.90,
    originalPrice: 39.90,
    image: '/images/products/makeup/fondation.png',
    images: ['/images/products/makeup/fondation.png'],
    category: 'Makeup',
    subcategory: 'Teint',
    rating: 4.8,
    reviewCount: 124,
    description: 'Notre fond de teint minéral ultra-couvrant offre un fini lumineux naturel. Formulé avec des ingrédients naturels, il est adapté à toutes les carnations. Sa texture légère laisse la peau respirer toute la journée.',
    tags: ['minéral', 'couvrant', 'lumineux', 'vegan'],
    inStock: true,
    isNew: true,
    isTrending: true,
    isBestseller: true,
  },
  {
    id: 'mk-002',
    name: 'Rouge à Lèvres Mat Hyper-Pigmenté',
    brand: 'ChicGlam by Eva',
    price: 19.90,
    originalPrice: null,
    image: '/images/products/makeup/rouge-a-levres.png',
    images: ['/images/products/makeup/rouge-a-levres.png'],
    category: 'Makeup',
    subcategory: 'Lèvres',
    rating: 4.9,
    reviewCount: 98,
    description: 'Rouge à lèvres mat longue tenue avec une formule hyper-pigmentée. Une seule application suffit pour un résultat intense et velouté. Enrichi en vitamine E pour nourrir les lèvres.',
    tags: ['mat', 'longue-tenue', 'hyper-pigmenté', 'vegan'],
    inStock: true,
    isNew: true,
    isTrending: true,
    isBestseller: false,
  },
  {
    id: 'mk-003',
    name: 'Palette Yeux Warm Glam',
    brand: 'ChicGlam by Eva',
    price: 34.90,
    originalPrice: 44.90,
    image: '/images/products/makeup/palette-yeux.png',
    images: ['/images/products/makeup/palette-yeux.png'],
    category: 'Makeup',
    subcategory: 'Yeux',
    rating: 4.7,
    reviewCount: 76,
    description: 'Palette de 12 teints chauds allant du nude doré au brun profond. Formules ultra-pigmentées et fondantes pour un maquillage smokey eyes ou naturel. Miroirs inclus.',
    tags: ['palette', 'yeux', 'warm', 'doré', 'pigmenté'],
    inStock: true,
    isNew: true,
    isTrending: false,
    isBestseller: true,
  },
  {
    id: 'mk-004',
    name: 'Mascara Volume Extrême',
    brand: 'ChicGlam by Eva',
    price: 16.90,
    originalPrice: null,
    image: '/images/products/makeup/mascara.png',
    images: ['/images/products/makeup/mascara.png'],
    category: 'Makeup',
    subcategory: 'Yeux',
    rating: 4.6,
    reviewCount: 63,
    description: 'Mascara waterproof au volume spectaculaire. Sa brosse en spirale capture chaque cil pour un regard intense et dramatique. Tient toute la journée sans s\'effriter.',
    tags: ['mascara', 'volume', 'waterproof', 'longue-tenue'],
    inStock: true,
    isNew: false,
    isTrending: true,
    isBestseller: false,
  },
  // ---- LINGERIE ----
  {
    id: 'lg-001',
    name: 'Nuisette en Soie Élégance',
    brand: 'ChicGlam by Eva',
    price: 49.90,
    originalPrice: 69.90,
    image: '/images/products/lingerie/nuisette-soie.png',
    images: ['/images/products/lingerie/nuisette-soie.png'],
    category: 'Lingerie',
    subcategory: 'Nuisettes',
    rating: 4.9,
    reviewCount: 87,
    description: 'Nuisette en soie naturelle avec broderies dorées artisanales. Fait main au Sénégal par nos artisans qualifiés. Coupe fluide et élégante pour un confort absolu.',
    tags: ['soie', 'fait-main', 'artisanat', 'sénégal', 'luxe'],
    inStock: true,
    isNew: true,
    isTrending: true,
    isBestseller: true,
  },
  {
    id: 'lg-002',
    name: 'Kimono Africain Wax',
    brand: 'ChicGlam by Eva',
    price: 59.90,
    originalPrice: null,
    image: '/images/products/lingerie/kimono-africain.png',
    images: ['/images/products/lingerie/kimono-africain.png'],
    category: 'Lingerie',
    subcategory: 'Ensembles',
    rating: 4.8,
    reviewCount: 52,
    description: 'Kimono en tissu wax africain authentique. Chaque pièce est unique grâce aux motifs traditionnels. Parfait pour la maison ou comme pièce de style.',
    tags: ['wax', 'africain', 'kimono', 'fait-main', 'sénégal'],
    inStock: true,
    isNew: true,
    isTrending: true,
    isBestseller: false,
  },
  {
    id: 'lg-003',
    name: 'Ensemble Wax Noir & Or',
    brand: 'ChicGlam by Eva',
    price: 54.90,
    originalPrice: 74.90,
    image: '/images/products/lingerie/ensemble-wax.png',
    images: ['/images/products/lingerie/ensemble-wax.png'],
    category: 'Lingerie',
    subcategory: 'Ensembles',
    rating: 4.7,
    reviewCount: 41,
    description: 'Ensemble deux pièces en tissu wax avec détails dorés. L\'alliance parfaite entre tradition africaine et modernité. Fait main avec amour au Sénégal.',
    tags: ['wax', 'ensemble', 'fait-main', 'luxe', 'africain'],
    inStock: true,
    isNew: false,
    isTrending: true,
    isBestseller: true,
  },
  {
    id: 'lg-004',
    name: 'Body Satin Luxe',
    brand: 'ChicGlam by Eva',
    price: 39.90,
    originalPrice: null,
    image: '/images/products/lingerie/body-satin.png',
    images: ['/images/products/lingerie/body-satin.png'],
    category: 'Lingerie',
    subcategory: 'Bodys',
    rating: 4.6,
    reviewCount: 33,
    description: 'Body en satin avec finitions dorées. Coupe ajustée et confortable, parfait pour se sentir belle et confiante. Disponible en tailles S à XXL.',
    tags: ['satin', 'body', 'luxe', 'confort'],
    inStock: true,
    isNew: true,
    isTrending: false,
    isBestseller: false,
  },
  // ---- ACCESSOIRES ----
  {
    id: 'ac-001',
    name: 'Set Cils Premium',
    brand: 'ChicGlam by Eva',
    price: 14.90,
    originalPrice: 19.90,
    image: '/images/products/accessoires/cils-faux.png',
    images: ['/images/products/accessoires/cils-faux.png'],
    category: 'Accessoires',
    subcategory: 'Cils',
    rating: 4.7,
    reviewCount: 89,
    description: 'Set de 3 paires de faux cils de différents styles : naturel, volumineux et dramatique. Faciles à poser et réutilisables. Colle incluse.',
    tags: ['cils', 'faux-cils', 'premium', 'réutilisable'],
    inStock: true,
    isNew: true,
    isTrending: true,
    isBestseller: true,
  },
  {
    id: 'ac-002',
    name: 'Set Pinceaux Dorés 12 pièces',
    brand: 'ChicGlam by Eva',
    price: 44.90,
    originalPrice: null,
    image: '/images/products/accessoires/pinceaux-set.png',
    images: ['/images/products/accessoires/pinceaux-set.png'],
    category: 'Accessoires',
    subcategory: 'Pinceaux',
    rating: 4.8,
    reviewCount: 67,
    description: 'Set complet de 12 pinceaux maquillage avec manches dorés et poils synthétiques ultra-doux. Livrés dans un élégant étui de protection.',
    tags: ['pinceaux', 'set', 'doré', 'professionnel'],
    inStock: true,
    isNew: false,
    isTrending: true,
    isBestseller: true,
  },
  {
    id: 'ac-003',
    name: 'Tour de Taille Perles & Or',
    brand: 'ChicGlam by Eva',
    price: 24.90,
    originalPrice: null,
    image: '/images/products/accessoires/tour-de-taille.png',
    images: ['/images/products/accessoires/tour-de-taille.png'],
    category: 'Accessoires',
    subcategory: 'Cils',
    rating: 4.9,
    reviewCount: 45,
    description: 'Tour de taille artisanal en perles et chaîne dorée. Fait main au Sénégal, chaque pièce est unique. S\'ajuste à toutes les tailles.',
    tags: ['perles', 'or', 'fait-main', 'sénégal', 'artisanat'],
    inStock: true,
    isNew: true,
    isTrending: true,
    isBestseller: false,
  },
  // ---- BOX DE SEDUCTION ----
  {
    id: 'bx-001',
    name: 'Petit Pagne Wax Premium',
    brand: 'ChicGlam by Eva',
    price: 29.90,
    originalPrice: null,
    image: '/images/products/box-de-seduction/petit-pagne.png',
    images: ['/images/products/box-de-seduction/petit-pagne.png'],
    category: 'Box de Seduction',
    subcategory: 'Petits pagnes',
    rating: 4.7,
    reviewCount: 38,
    description: 'Petit pagne en tissu wax authentique de haute qualité. Parfait pour créer des ensembles uniques. Tissu doux et confortable.',
    tags: ['pagne', 'wax', 'africain', 'fait-main', 'sénégal'],
    inStock: true,
    isNew: true,
    isTrending: true,
    isBestseller: false,
  },
  {
    id: 'bx-002',
    name: 'Kit Nuisette Séduction',
    brand: 'ChicGlam by Eva',
    price: 79.90,
    originalPrice: 109.90,
    image: '/images/products/box-de-seduction/kit-nuisette.png',
    images: ['/images/products/box-de-seduction/kit-nuisette.png'],
    category: 'Box de Seduction',
    subcategory: 'Kit nuisette',
    rating: 4.9,
    reviewCount: 62,
    description: 'Kit séduction complet avec nuisette en soie, string assorti et masque pour les yeux. Présenté dans un écrin cadeau élégant. Le cadeau parfait.',
    tags: ['kit', 'nuisette', 'soie', 'cadeau', 'séduction'],
    inStock: true,
    isNew: true,
    isTrending: true,
    isBestseller: true,
  },
  {
    id: 'bx-003',
    name: 'Box Kimono & Accessoires',
    brand: 'ChicGlam by Eva',
    price: 89.90,
    originalPrice: null,
    image: '/images/products/box-de-seduction/box-kimono.png',
    images: ['/images/products/box-de-seduction/box-kimono.png'],
    category: 'Box de Seduction',
    subcategory: 'Kimono',
    rating: 4.8,
    reviewCount: 29,
    description: 'Box comprenant un kimono en tissu wax, un masque satin et un tour de taille en perles. Le tout dans un coffret cadeau luxueux.',
    tags: ['box', 'kimono', 'wax', 'cadeau', 'luxe'],
    inStock: true,
    isNew: true,
    isTrending: false,
    isBestseller: true,
  },
  {
    id: 'bx-004',
    name: 'Box Accessoires Perles & Chaînes',
    brand: 'ChicGlam by Eva',
    price: 39.90,
    originalPrice: 54.90,
    image: '/images/products/box-de-seduction/box-accessoires.png',
    images: ['/images/products/box-de-seduction/box-accessoires.png'],
    category: 'Box de Seduction',
    subcategory: 'Accessoires perles/tour de taille',
    rating: 4.6,
    reviewCount: 21,
    description: 'Collection de 3 tours de taille en perles et chaînes dorées. Fait main par nos artisanes sénégalaises. Livré dans un pochon en tissu wax.',
    tags: ['perles', 'chaînes', 'fait-main', 'sénégal', 'artisanat'],
    inStock: true,
    isNew: false,
    isTrending: true,
    isBestseller: false,
  },
];

export const reviews: Review[] = [
  {
    id: 'rev-001',
    author: 'Aminata D.',
    rating: 5,
    date: '2025-01-15',
    title: 'Qualité exceptionnelle !',
    content: 'Le maquillage est incroyable. Le fond de teint couvre parfaitement et tient toute la journée. Je recommande à 100%.',
    verified: true,
  },
  {
    id: 'rev-002',
    author: 'Fatou S.',
    rating: 5,
    date: '2025-01-12',
    title: 'Sublime lingerie',
    content: 'La nuisette en soie est magnifique. Le tissu est de haute qualité et les finitions sont parfaites. Un vrai coup de cœur !',
    verified: true,
  },
  {
    id: 'rev-003',
    author: 'Marie L.',
    rating: 4,
    date: '2025-01-10',
    title: 'Beau produit',
    content: 'Les pinceaux sont très doux et la qualité est au rendez-vous. Seul petit bémol, l\'étui pourrait être un peu plus rigide.',
    verified: true,
  },
];

export const heroSlides: { title: string; subtitle: string; cta: string; image: string; link: string }[] = [
  {
    title: 'Nouvelle Collection Maquillage',
    subtitle: 'Découvrez notre gamme hyper-pigmentée, minérale et végan — conçue pour toutes les carnations.',
    cta: 'Découvrir',
    image: '/images/hero/slide-1.png',
    link: 'makeup',
  },
  {
    title: 'Secret de Dame — Lingerie Africaine',
    subtitle: "L'élégance traditionnelle revisitée. Fait main par nos artisans sénégalais.",
    cta: 'Explorer',
    image: '/images/hero/slide-2.png',
    link: 'lingerie',
  },
  {
    title: 'Box de Séduction',
    subtitle: 'Petits pagnes, kit nuisette, kimono et accessoires — le cadeau parfait.',
    cta: 'Offrir',
    image: '/images/hero/slide-3.png',
    link: 'box-de-seduction',
  },
];

export const offerBanners: { title: string; subtitle: string; cta: string; image: string; link: string }[] = [
  {
    title: '-20% sur la Collection Maquillage',
    subtitle: "Offre limitée sur toute la gamme maquillage CHIC GLAM BY EVA",
    cta: 'En profiter',
    image: '/images/banners/promo-1.png',
    link: 'makeup',
  },
  {
    title: 'Nouvelle Collection Lingerie',
    subtitle: "Découvrez nos créations artisanales faites main au Sénégal",
    cta: 'Découvrir',
    image: '/images/banners/promo-2.png',
    link: 'lingerie',
  },
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getProductsBySubcategory(subcategory: string): Product[] {
  return products.filter(
    (p) => p.subcategory.toLowerCase() === subcategory.toLowerCase()
  );
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getTrendingProducts(): Product[] {
  return products.filter((p) => p.isTrending);
}

export function getRelatedProducts(productId: string, category: string): Product[] {
  return products
    .filter((p) => p.category.toLowerCase() === category.toLowerCase() && p.id !== productId)
    .slice(0, 6);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}
