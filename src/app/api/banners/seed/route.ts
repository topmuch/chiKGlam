import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Check if banners already exist
    const existing = await db.banner.count();
    if (existing > 0) {
      return NextResponse.json({
        success: true,
        message: `Banners already exist (${existing} found). Skipping seed.`,
        count: existing,
      });
    }

    // Seed Hero slides
    const heroBanners = [
      {
        type: 'hero',
        title: 'Brillez Comme Jamais',
        subtitle: 'Découvrez notre collection de soins et maquillage haut de gamme',
        cta: 'Découvrir',
        image: '/images/hero/hero-1.png',
        link: 'makeup',
        sortOrder: 0,
        isActive: true,
      },
      {
        type: 'hero',
        title: 'La Beauté Réinventée',
        subtitle: 'Explorez les dernières tendances en cosmétiques de luxe',
        cta: 'Voir la Collection',
        image: '/images/hero/hero-2.png',
        link: 'makeup',
        sortOrder: 1,
        isActive: true,
      },
      {
        type: 'hero',
        title: "L'Art du Maquillage",
        subtitle: 'Sublimez votre beauté naturelle avec nos produits d\'exception',
        cta: 'Acheter Maintenant',
        image: '/images/hero/hero-3.png',
        link: 'makeup',
        sortOrder: 2,
        isActive: true,
      },
    ];

    // Seed Offer banners
    const offerBanners = [
      {
        type: 'offer',
        title: "Jusqu'à -30% sur le Maquillage",
        subtitle: 'Offre limitée sur tous nos produits maquillage',
        cta: 'Acheter',
        image: '/images/banners/makeup-new.png',
        link: 'makeup',
        sortOrder: 0,
        isActive: true,
      },
      {
        type: 'offer',
        title: 'Nouveautés en Lingerie',
        subtitle: 'Soyez la première à découvrir notre collection',
        cta: 'Découvrir',
        image: '/images/banners/skincare-sale.png',
        link: 'lingerie',
        sortOrder: 1,
        isActive: true,
      },
      {
        type: 'offer',
        title: 'Cartes Cadeaux — Offrez la Beauté',
        subtitle: 'La carte cadeau parfaite pour toutes les occasions',
        cta: 'Découvrir',
        image: '/images/banners/gift-card-promo.png',
        link: 'boutique',
        sortOrder: 2,
        isActive: true,
      },
    ];

    // Seed Promo banner
    const promoBanners = [
      {
        type: 'promo',
        title: 'Offres',
        subtitle: 'Exclusives',
        cta: '',
        image: '/images/banners/promo-spotlight.png',
        link: 'boutique',
        sortOrder: 0,
        isActive: true,
      },
    ];

    const allBanners = [...heroBanners, ...offerBanners, ...promoBanners];

    const result = await db.banner.createMany({
      data: allBanners,
    });

    return NextResponse.json({
      success: true,
      message: `Seeded ${result.count} banners successfully.`,
      count: result.count,
    });
  } catch (error) {
    console.error('Banner seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed banners' },
      { status: 500 }
    );
  }
}
