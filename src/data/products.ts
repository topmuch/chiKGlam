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
      { slug: 'ongles', name: 'Ongles' },
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
      { slug: 'bijoux', name: 'Bijoux' },
    ],
  },
  {
    id: 'cadeaux',
    name: 'CARTE DE CADEAUX',
    slug: 'cadeaux',
    image: '/images/categories/cadeaux.png',
    subcategories: [
      { slug: 'cartes', name: 'Cartes Cadeaux' },
    ],
  },
];

export const brands = [
  'La Mer',
  'SK-II',
  'Drunk Elephant',
  'Tatcha',
  'Glossier',
  'Charlotte Tilbury',
  'Augustinus Bader',
  'Olaplex',
  'Fenty Beauty',
  'Tom Ford',
  'Jo Malone',
  'The Ordinary',
  'CeraVe',
  'Dyson',
  'Aesop',
];

export const products: Product[] = [
  // ===== SKINCARE - Cleansers =====
  {
    id: 'prod-001',
    name: 'The Cream Cleansing Gel',
    brand: 'La Mer',
    price: 95,
    originalPrice: 120,
    image: '/images/products/la-mer-cleanser.png',
    images: [
      '/images/products/la-mer-cleanser.png',
      '/images/products/la-mer-cleanser.png',
    ],
    category: 'Skincare',
    subcategory: 'Cleansers',
    rating: 4.8,
    reviewCount: 342,
    description: 'A luxurious gel-to-foam cleanser that gently removes impurities while nourishing skin with nutrient-rich sea minerals. Leaves skin feeling refreshed, soft, and perfectly balanced.',
    tags: ['gentle', 'foaming', 'hydrating', 'luxury'],
    inStock: true,
    isBestseller: true,
    concerns: ['Dryness', 'Dullness'],
    skinType: ['Normal', 'Dry', 'Combination'],
  },
  {
    id: 'prod-002',
    name: 'Facial Treatment Cleansing Oil',
    brand: 'SK-II',
    price: 78,
    image: '/images/products/skii-cleansing-oil.png',
    images: [
      '/images/products/skii-cleansing-oil.png',
      '/images/products/skii-cleansing-oil.png',
    ],
    category: 'Skincare',
    subcategory: 'Cleansers',
    rating: 4.7,
    reviewCount: 256,
    description: 'A silky cleansing oil enriched with Pitera™ that melts away makeup and impurities effortlessly. Transforms into a milky emulsion upon contact with water.',
    tags: ['oil cleanser', 'makeup remover', 'Pitera'],
    inStock: true,
    isTrending: true,
    concerns: ['Clogged Pores', 'Makeup Removal'],
    skinType: ['All'],
  },

  // ===== SKINCARE - Moisturizers =====
  {
    id: 'prod-003',
    name: 'The Water Cream',
    brand: 'Tatcha',
    price: 68,
    image: '/images/products/tatcha-water-cream.png',
    images: [
      '/images/products/tatcha-water-cream.png',
      '/images/products/tatcha-water-cream.png',
    ],
    category: 'Skincare',
    subcategory: 'Moisturizers',
    rating: 4.6,
    reviewCount: 512,
    description: 'An oil-free, weightless moisturizer that releases a burst of hydration for a healthy, dewy glow. Formulated with Japanese botanicals and Hadasei-3™ complex.',
    tags: ['oil-free', 'lightweight', 'dewy', 'Japanese'],
    inStock: true,
    isBestseller: true,
    concerns: ['Oiliness', 'Large Pores'],
    skinType: ['Oily', 'Combination'],
  },
  {
    id: 'prod-004',
    name: 'The Cream Rich Moisturizer',
    brand: 'Augustinus Bader',
    price: 280,
    originalPrice: 320,
    image: '/images/products/bader-rich-cream.png',
    images: [
      '/images/products/bader-rich-cream.png',
      '/images/products/bader-rich-cream.png',
    ],
    category: 'Skincare',
    subcategory: 'Moisturizers',
    rating: 4.9,
    reviewCount: 189,
    description: 'The ultimate rich moisturizer powered by TFC8® technology that supports cellular renewal. Deeply nourishes and transforms dry, mature skin for a visibly plump, youthful complexion.',
    tags: ['rich', 'anti-aging', 'TFC8', 'luxury'],
    inStock: true,
    isNew: true,
    concerns: ['Fine Lines', 'Dryness', 'Loss of Firmness'],
    skinType: ['Dry', 'Mature'],
  },

  // ===== SKINCARE - Serums =====
  {
    id: 'prod-005',
    name: 'Facial Treatment Essence',
    brand: 'SK-II',
    price: 179,
    image: '/images/products/skii-essence.png',
    images: [
      '/images/products/skii-essence.png',
      '/images/products/skii-essence.png',
    ],
    category: 'Skincare',
    subcategory: 'Serums',
    rating: 4.8,
    reviewCount: 1024,
    description: 'The iconic essence with over 90% Pitera™ that transforms skin texture in just 28 days. Visibly improves radiance, smoothness, and clarity for crystal-clear skin.',
    tags: ['essence', 'Pitera', 'radiance', 'bestseller'],
    inStock: true,
    isBestseller: true,
    isTrending: true,
    concerns: ['Dullness', 'Uneven Texture', 'Dark Spots'],
    skinType: ['All'],
  },
  {
    id: 'prod-006',
    name: 'Protini Polypeptide Cream',
    brand: 'Drunk Elephant',
    price: 68,
    image: '/images/products/drunk-elephant-protini.png',
    images: [
      '/images/products/drunk-elephant-protini.png',
      '/images/products/drunk-elephant-protini.png',
    ],
    category: 'Skincare',
    subcategory: 'Serums',
    rating: 4.5,
    reviewCount: 678,
    description: 'A protein-rich moisturizer that replenishes and restores skin with a unique blend of signal peptides, growth factors, and amino acids. Visibly improves firmness and elasticity.',
    tags: ['peptides', 'firming', 'clean beauty'],
    inStock: true,
    concerns: ['Loss of Firmness', 'Fine Lines'],
    skinType: ['Normal', 'Dry', 'Combination'],
  },
  {
    id: 'prod-007',
    name: 'Niacinamide + Zinc Serum',
    brand: 'The Ordinary',
    price: 6,
    image: '/images/products/ordinary-niacinamide.png',
    images: [
      '/images/products/ordinary-niacinamide.png',
      '/images/products/ordinary-niacinamide.png',
    ],
    category: 'Skincare',
    subcategory: 'Serums',
    rating: 4.3,
    reviewCount: 2341,
    description: 'A high-strength vitamin B3 formula that reduces the appearance of blemishes and congestion. Combined with zinc to balance visible sebum activity.',
    tags: ['niacinamide', 'blemish control', 'affordable'],
    inStock: true,
    isBestseller: true,
    concerns: ['Blemishes', 'Congestion', 'Oiliness'],
    skinType: ['Oily', 'Combination'],
  },

  // ===== SKINCARE - Masks =====
  {
    id: 'prod-008',
    name: 'Violet-C Brightening Mask',
    brand: 'Tatcha',
    price: 88,
    image: '/images/products/tatcha-violet-mask.png',
    images: [
      '/images/products/tatcha-violet-mask.png',
      '/images/products/tatcha-violet-mask.png',
    ],
    category: 'Skincare',
    subcategory: 'Masks',
    rating: 4.6,
    reviewCount: 298,
    description: 'A rinse-off treatment mask with two types of vitamin C that instantly reveals a radiant, healthy-looking complexion. Japanese beautyberry and mugwort calm and soothe.',
    tags: ['brightening', 'vitamin C', 'mask', 'Japanese'],
    inStock: true,
    isNew: true,
    concerns: ['Dullness', 'Dark Spots', 'Uneven Tone'],
    skinType: ['All'],
  },
  {
    id: 'prod-009',
    name: 'A-Passioni Retinol Cream',
    brand: 'Drunk Elephant',
    price: 74,
    image: '/images/products/de-retinol.png',
    images: [
      '/images/products/de-retinol.png',
      '/images/products/de-retinol.png',
    ],
    category: 'Skincare',
    subcategory: 'Masks',
    rating: 4.4,
    reviewCount: 445,
    description: 'A gentle yet effective overnight retinol cream formulated with passionfruit, apricot, and jojoba oils. Targets fine lines, wrinkles, and uneven skin tone.',
    tags: ['retinol', 'anti-aging', 'overnight'],
    inStock: true,
    concerns: ['Fine Lines', 'Wrinkles', 'Uneven Tone'],
    skinType: ['Normal', 'Dry', 'Combination'],
  },

  // ===== SKINCARE - Sunscreen =====
  {
    id: 'prod-010',
    name: 'Moisturizing Cream SPF 30',
    brand: 'La Mer',
    price: 165,
    image: '/images/products/la-mer-spf.png',
    images: [
      '/images/products/la-mer-spf.png',
      '/images/products/la-mer-spf.png',
    ],
    category: 'Skincare',
    subcategory: 'Sunscreen',
    rating: 4.7,
    reviewCount: 156,
    description: 'A luxurious SPF 30 moisturizer that protects while hydrating with sea-born nutrients. The soft, silky texture absorbs quickly and doubles as a perfect makeup primer.',
    tags: ['SPF 30', 'hydrating', 'luxury', 'primer'],
    inStock: true,
    isTrending: true,
    concerns: ['Sun Protection', 'Dryness'],
    skinType: ['Normal', 'Dry'],
  },

  // ===== HAIRCARE - Shampoo =====
  {
    id: 'prod-011',
    name: 'No.4 Bond Maintenance Shampoo',
    brand: 'Olaplex',
    price: 28,
    image: '/images/products/olaplex-shampoo.png',
    images: [
      '/images/products/olaplex-shampoo.png',
      '/images/products/olaplex-shampoo.png',
    ],
    category: 'Haircare',
    subcategory: 'Shampoo',
    rating: 4.6,
    reviewCount: 1876,
    description: 'A highly moisturizing reparative shampoo that relinks broken bonds in the hair. Leaves hair easier to manage, shinier, and healthier with each use.',
    tags: ['bond repair', 'repairing', 'color-safe'],
    inStock: true,
    isBestseller: true,
    concerns: ['Damage', 'Color-Treated Hair'],
  },
  {
    id: 'prod-012',
    name: 'Classic Shampoo',
    brand: 'Aesop',
    price: 40,
    image: '/images/products/aesop-shampoo.png',
    images: [
      '/images/products/aesop-shampoo.png',
      '/images/products/aesop-shampoo.png',
    ],
    category: 'Haircare',
    subcategory: 'Shampoo',
    rating: 4.5,
    reviewCount: 334,
    description: 'A gentle, everyday shampoo with botanical oils that cleanses effectively without stripping natural oils. Leaves hair soft, manageable, and subtly fragranced.',
    tags: ['gentle', 'botanical', 'everyday'],
    inStock: true,
    concerns: ['Dry Scalp', 'Normal Hair'],
  },

  // ===== HAIRCARE - Conditioner =====
  {
    id: 'prod-013',
    name: 'No.5 Bond Maintenance Conditioner',
    brand: 'Olaplex',
    price: 28,
    image: '/images/products/olaplex-conditioner.png',
    images: [
      '/images/products/olaplex-conditioner.png',
      '/images/products/olaplex-conditioner.png',
    ],
    category: 'Haircare',
    subcategory: 'Conditioner',
    rating: 4.7,
    reviewCount: 1543,
    description: 'A deeply hydrating conditioner that restores, repairs, and strengthens hair from within. Formulated with patented bond-building technology for visibly healthier hair.',
    tags: ['conditioner', 'bond repair', 'hydrating'],
    inStock: true,
    isBestseller: true,
    concerns: ['Damage', 'Frizz', 'Dryness'],
  },

  // ===== HAIRCARE - Treatments =====
  {
    id: 'prod-014',
    name: 'No.3 Hair Perfector',
    brand: 'Olaplex',
    price: 30,
    image: '/images/products/olaplex-no3.png',
    images: [
      '/images/products/olaplex-no3.png',
      '/images/products/olaplex-no3.png',
    ],
    category: 'Haircare',
    subcategory: 'Treatments',
    rating: 4.8,
    reviewCount: 3456,
    description: 'The bestselling at-home treatment that relinks broken disulfide bonds in the hair. Use once a week for dramatically healthier, stronger, and shinier hair.',
    tags: ['treatment', 'bond building', 'weekly'],
    inStock: true,
    isBestseller: true,
    isTrending: true,
    concerns: ['Damage', 'Breakage', 'Split Ends'],
  },
  {
    id: 'prod-015',
    name: 'Supersonic Hair Dryer',
    brand: 'Dyson',
    price: 429,
    originalPrice: 499,
    image: '/images/products/dyson-supersonic.png',
    images: [
      '/images/products/dyson-supersonic.png',
      '/images/products/dyson-supersonic.png',
    ],
    category: 'Haircare',
    subcategory: 'Treatments',
    rating: 4.7,
    reviewCount: 876,
    description: 'The award-winning hair dryer engineered for fast drying with extreme control. Measures temperature 40 times per second to prevent extreme heat damage.',
    tags: ['hair dryer', 'technology', 'fast drying'],
    inStock: true,
    isTrending: true,
    concerns: ['Heat Damage', 'Frizz'],
  },

  // ===== MAKEUP - Face =====
  {
    id: 'prod-016',
    name: 'Flawless Filter',
    brand: 'Charlotte Tilbury',
    price: 44,
    image: '/images/products/ct-flawless-filter.png',
    images: [
      '/images/products/ct-flawless-filter.png',
      '/images/products/ct-flawless-filter.png',
    ],
    category: 'Makeup',
    subcategory: 'Face',
    rating: 4.6,
    reviewCount: 2345,
    description: 'A revolutionary complexion booster that blurs, smooths, and illuminates for a flawless, lit-from-within glow. Can be worn alone, under, or over makeup.',
    tags: ['primer', 'highlighter', 'blur', 'glow'],
    inStock: true,
    isBestseller: true,
    isTrending: true,
    concerns: ['Dullness', 'Uneven Tone'],
  },
  {
    id: 'prod-017',
    name: 'Pro Filt\'r Soft Matte Foundation',
    brand: 'Fenty Beauty',
    price: 40,
    image: '/images/products/fenty-foundation.png',
    images: [
      '/images/products/fenty-foundation.png',
      '/images/products/fenty-foundation.png',
    ],
    category: 'Makeup',
    subcategory: 'Face',
    rating: 4.5,
    reviewCount: 1890,
    description: 'A soft matte, longwear foundation with 50 shades that adapts to your skin. Controls oil and shine while remaining comfortable and breathable all day.',
    tags: ['foundation', 'matte', 'longwear', '50 shades'],
    inStock: true,
    isBestseller: true,
    concerns: ['Oiliness', 'Uneven Tone'],
  },

  // ===== MAKEUP - Eyes =====
  {
    id: 'prod-018',
    name: 'Pillow Talk Push-Up Lashes',
    brand: 'Charlotte Tilbury',
    price: 29,
    image: '/images/products/ct-mascara.png',
    images: [
      '/images/products/ct-mascara.png',
      '/images/products/ct-mascara.png',
    ],
    category: 'Makeup',
    subcategory: 'Eyes',
    rating: 4.7,
    reviewCount: 1567,
    description: 'A quad-brush mascara that coats every lash with a glossy, volumizing formula. Creates a lifted, wide-eyed, Pillow Talk gaze that lasts all day.',
    tags: ['mascara', 'volumizing', 'lifting'],
    inStock: true,
    isNew: true,
    isTrending: true,
  },
  {
    id: 'prod-019',
    name: 'Boy Brow',
    brand: 'Glossier',
    price: 17,
    image: '/images/products/glossier-boy-brow.png',
    images: [
      '/images/products/glossier-boy-brow.png',
      '/images/products/glossier-boy-brow.png',
    ],
    category: 'Makeup',
    subcategory: 'Eyes',
    rating: 4.4,
    reviewCount: 3456,
    description: 'The iconic brow grooming pomade that holds, shapes, and fills in brows with natural-looking color. Lightweight formula that looks like real hair.',
    tags: ['brow gel', 'grooming', 'natural'],
    inStock: true,
    isBestseller: true,
  },

  // ===== MAKEUP - Lips =====
  {
    id: 'prod-020',
    name: 'Pillow Talk Lipstick',
    brand: 'Charlotte Tilbury',
    price: 38,
    image: '/images/products/ct-lipstick.png',
    images: [
      '/images/products/ct-lipstick.png',
      '/images/products/ct-lipstick.png',
    ],
    category: 'Makeup',
    subcategory: 'Lips',
    rating: 4.8,
    reviewCount: 1234,
    description: 'The universally flattering, award-winning matte lipstick in the iconic Pillow Talk shade. A warm nude-pink that suits every skin tone for a perfect pout.',
    tags: ['lipstick', 'matte', 'nude', 'iconic'],
    inStock: true,
    isBestseller: true,
    isTrending: true,
  },
  {
    id: 'prod-021',
    name: 'Fenty Gloss Bomb',
    brand: 'Fenty Beauty',
    price: 24,
    image: '/images/products/fenty-gloss-bomb.png',
    images: [
      '/images/products/fenty-gloss-bomb.png',
      '/images/products/fenty-gloss-bomb.png',
    ],
    category: 'Makeup',
    subcategory: 'Lips',
    rating: 4.5,
    reviewCount: 987,
    description: 'A shimmery, non-sticky lip gloss that delivers explosive shine and a tingling, plumping effect. Available in universal shades that flatter all skin tones.',
    tags: ['lip gloss', 'shimmer', 'plumping'],
    inStock: true,
    isTrending: true,
  },

  // ===== FRAGRANCE - Perfumes =====
  {
    id: 'prod-022',
    name: 'Lost Cherry',
    brand: 'Tom Ford',
    price: 350,
    image: '/images/products/tom-ford-lost-cherry.png',
    images: [
      '/images/products/tom-ford-lost-cherry.png',
      '/images/products/tom-ford-lost-cherry.png',
    ],
    category: 'Fragrance',
    subcategory: 'Perfumes',
    rating: 4.7,
    reviewCount: 567,
    description: 'An intoxicating eau de parfum that combines the dark, sweetness of black cherry with the warmth of Turkish rose and sweetened by jasmine sambac. A seductive, unisex scent.',
    tags: ['eau de parfum', 'cherry', 'oriental', 'unisex'],
    inStock: true,
    isTrending: true,
  },
  {
    id: 'prod-023',
    name: 'Wood Sage & Sea Salt Cologne',
    brand: 'Jo Malone',
    price: 135,
    image: '/images/products/jo-malone-wood-sage.png',
    images: [
      '/images/products/jo-malone-wood-sage.png',
      '/images/products/jo-malone-wood-sage.png',
    ],
    category: 'Fragrance',
    subcategory: 'Perfumes',
    rating: 4.8,
    reviewCount: 876,
    description: 'An earthy, aromatic fragrance that captures the spirit of the British coast. Ambrette seeds, sea salt, and sage create a fresh, windswept scent that is effortlessly elegant.',
    tags: ['cologne', 'fresh', 'woody', 'coastal'],
    inStock: true,
    isBestseller: true,
  },
  {
    id: 'prod-024',
    name: 'English Pear & Freesia Cologne',
    brand: 'Jo Malone',
    price: 135,
    image: '/images/products/jo-malone-pear.png',
    images: [
      '/images/products/jo-malone-pear.png',
      '/images/products/jo-malone-pear.png',
    ],
    category: 'Fragrance',
    subcategory: 'Perfumes',
    rating: 4.6,
    reviewCount: 654,
    description: 'A quintessentially British fragrance inspired by the ripe sweetness of pears at the start of autumn. Warm, sensuous, and uniquely feminine with a magnetic alchemy.',
    tags: ['cologne', 'fruity', 'floral', 'feminine'],
    inStock: true,
  },
];

export const reviews: Review[] = [
  {
    id: 'rev-001',
    author: 'Sophia M.',
    rating: 5,
    date: '2024-12-15',
    title: 'Absolutely life-changing!',
    content: 'I\'ve been using the Facial Treatment Essence for 3 months now and my skin has never looked better. The radiance is unreal, and my pores appear so much smaller. Worth every penny.',
    verified: true,
  },
  {
    id: 'rev-002',
    author: 'Emily R.',
    rating: 4,
    date: '2024-12-10',
    title: 'Great product, slightly overpriced',
    content: 'The quality is undeniable and my skin feels amazing after each use. However, I do feel the price point is a bit steep. Still, I\'d repurchase because the results speak for themselves.',
    verified: true,
  },
  {
    id: 'rev-003',
    author: 'Jessica L.',
    rating: 5,
    date: '2024-11-28',
    title: 'My holy grail moisturizer',
    content: 'The Water Cream is everything I\'ve been looking for. It\'s lightweight yet incredibly hydrating, and it layers beautifully under makeup. My skin has never been this balanced.',
    verified: true,
  },
  {
    id: 'rev-004',
    author: 'Aria K.',
    rating: 5,
    date: '2024-11-20',
    title: 'Perfect for sensitive skin',
    content: 'I have extremely sensitive skin and was hesitant to try a new brand, but Drunk Elephant did not disappoint. The Protini Cream is gentle, effective, and has zero irritation. Love it!',
    verified: false,
  },
  {
    id: 'rev-005',
    author: 'Mia T.',
    rating: 4,
    date: '2024-11-15',
    title: 'Beautiful scent, lasts all day',
    content: 'Wood Sage & Sea Salt is my go-to fragrance. It\'s fresh without being overpowering and I always get compliments. The only reason for 4 stars is I wish the bottle were bigger.',
    verified: true,
  },
  {
    id: 'rev-006',
    author: 'Olivia P.',
    rating: 5,
    date: '2024-11-08',
    title: 'Best lip color ever',
    content: 'Pillow Talk is truly universal. It looks incredible on every skin tone. The formula is creamy, long-lasting, and doesn\'t dry out my lips. Charlotte Tilbury never disappoints!',
    verified: true,
  },
];

export const heroSlides = [
  {
    title: "Brillez Comme Jamais",
    subtitle: "Découvrez notre collection de soins et maquillage haut de gamme",
    cta: "Découvrir",
    image: "/images/hero/hero-1.png",
    link: "makeup"
  },
  {
    title: "La Beauté Réinventée",
    subtitle: "Explorez les dernières tendances en cosmétiques de luxe",
    cta: "Voir la Collection",
    image: "/images/hero/hero-2.png",
    link: "makeup"
  },
  {
    title: "L'Art du Maquillage",
    subtitle: "Sublimez votre beauté naturelle avec nos produits d'exception",
    cta: "Acheter Maintenant",
    image: "/images/hero/hero-3.png",
    link: "makeup"
  }
];

export const offerBanners = [
  {
    title: "Jusqu'à -30% sur le Maquillage",
    subtitle: "Offre limitée sur tous nos produits maquillage",
    cta: "Acheter",
    image: "/images/banners/makeup-new.png",
    link: "makeup"
  },
  {
    title: "Nouveautés en Lingerie",
    subtitle: "Soyez la première à découvrir notre collection",
    cta: "Découvrir",
    image: "/images/banners/skincare-sale.png",
    link: "lingerie"
  },
  {
    title: "Cartes Cadeaux — Offrez la Beauté",
    subtitle: "La carte cadeau parfaite pour toutes les occasions",
    cta: "Découvrir",
    image: "/images/banners/gift-card-promo.png",
    link: "cadeaux"
  }
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
