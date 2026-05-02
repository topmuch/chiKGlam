import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const seedBanners = [
  {
    type: 'hero',
    title: 'Collection Automne Glamour',
    subtitle: 'Découvrez les couleurs chaudes de la saison. -20% sur votre première commande avec le code GLAM20.',
    cta: 'Découvrir la collection',
    image: '/images/banners/hero-autumn-glam.png',
    link: '/shop?category=Makeup',
    sortOrder: 1,
    isActive: true,
    promoProductIds: JSON.stringify([]),
  },
  {
    type: 'hero',
    title: 'Lingerie Dentelle Française',
    subtitle: 'Élégance et confort au quotidien. Livraison offerte dès 50€ d\'achat.',
    cta: 'Voir la collection',
    image: '/images/banners/hero-lingerie-dentelle.png',
    link: '/shop?category=Lingerie',
    sortOrder: 2,
    isActive: true,
    promoProductIds: JSON.stringify([]),
  },
  {
    type: 'hero',
    title: 'Nouveautés Beauté',
    subtitle: 'Les dernières tendances maquillage sont arrivées. Soyez la première à les découvrir !',
    cta: 'Explorer les nouveautés',
    image: '/images/banners/hero-new-beauty.png',
    link: '/shop?new=true',
    sortOrder: 3,
    isActive: true,
    promoProductIds: JSON.stringify([]),
  },
];

export async function POST() {
  try {
    const count = await db.banner.count();

    if (count > 0) {
      return NextResponse.json({ message: 'Banners already exist, skipping seed' });
    }

    const banners = await Promise.all(
      seedBanners.map((banner) => db.banner.create({ data: banner }))
    );

    return NextResponse.json({
      message: `Seeded ${banners.length} banners successfully`,
      count: banners.length,
    });
  } catch (error) {
    console.error('Error seeding banners:', error);
    return NextResponse.json({ error: 'Failed to seed banners' }, { status: 500 });
  }
}
