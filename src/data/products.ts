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

export const brands: string[] = [];

export const products: Product[] = [];

export const reviews: Review[] = [];

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
