import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const seedCategories = [
  {
    name: 'Makeup',
    slug: 'makeup',
    image: '/images/categories/makeup.png',
    banner: '/images/banners/makeup-banner.png',
    description: 'Découvrez notre collection complète de maquillage professionnel. Des fonds de teint aux rouges à lèvres, trouvez les produits parfaits pour sublimer votre beauté naturelle.',
    sortOrder: 1,
    isActive: true,
    subcategories: JSON.stringify(['Visage', 'Yeux', 'Lèvres', 'Ongles', 'Fixation']),
  },
  {
    name: 'Lingerie',
    slug: 'lingerie',
    image: '/images/categories/lingerie.png',
    banner: '/images/banners/lingerie-banner.webp',
    description: 'Notre collection de lingerie allie élégance et confort. Des ensembles en dentelle aux nuisettes en satin, chaque pièce est conçue pour vous faire sentir belle et confiante.',
    sortOrder: 2,
    isActive: true,
    subcategories: JSON.stringify(['Ensembles', 'Soutiens-gorge', 'Culottes', 'Nuisettes', 'Bodys', 'Accessoires']),
  },
  {
    name: 'Accessoires',
    slug: 'accessoires',
    image: '/images/categories/accessoires.png',
    banner: '/images/banners/accessoires-banner.png',
    description: 'Les accessoires indispensables pour compléter votre routine beauté et votre style. Pinceaux, trousses, bijoux et plus encore.',
    sortOrder: 3,
    isActive: true,
    subcategories: JSON.stringify(['Pinceaux', 'Trousse', 'Bijoux', 'Accessoires cheveux']),
  },
  {
    name: 'Cartes Cadeaux',
    slug: 'cartes-cadeaux',
    image: '/images/categories/carte-cadeau.png',
    banner: '/images/banners/carte-cadeau-banner.png',
    description: 'Offrez le cadeau parfait avec nos cartes cadeaux CHIC GLAM BY EVA. Disponibles en plusieurs montants, elles sont idéales pour toutes les occasions.',
    sortOrder: 4,
    isActive: true,
    subcategories: JSON.stringify([]),
  },
];

export async function POST() {
  try {
    const count = await db.category.count();

    if (count > 0) {
      return NextResponse.json({ message: 'Categories already exist, skipping seed' });
    }

    const categories = await Promise.all(
      seedCategories.map((cat) => db.category.create({ data: cat }))
    );

    return NextResponse.json({
      message: `Seeded ${categories.length} categories successfully`,
      count: categories.length,
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json({ error: 'Failed to seed categories' }, { status: 500 });
  }
}
