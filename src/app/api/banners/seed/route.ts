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

    // Seed Hero slides (homepage)
    const heroBanners = [
      {
        type: 'hero',
        title: 'Révélez Votre Beauté Naturelle',
        subtitle: 'Maquillage minéral hyper-pigmenté conçu pour sublimer chaque carnation. Vegan & cruelty-free.',
        cta: 'Découvrir',
        image: '/images/hero/slide-noir-1.webp',
        link: 'makeup',
        sortOrder: 0,
        isActive: true,
      },
      {
        type: 'hero',
        title: 'Secret de Dame — Lingerie Africaine',
        subtitle: "L'élégance traditionnelle revisitée. Fait main par nos artisans sénégalais.",
        cta: 'Explorer',
        image: '/images/hero/slide-2.webp',
        link: 'lingerie',
        sortOrder: 1,
        isActive: true,
      },
      {
        type: 'hero',
        title: 'Glamour Absolu',
        subtitle: 'Notre collection maquillage est conçue pour sublimer votre beauté naturelle avec des teintes vibrantes.',
        cta: 'Voir la Collection',
        image: '/images/hero/slide-noir-2.webp',
        link: 'makeup',
        sortOrder: 2,
        isActive: true,
      },
    ];

    // Seed Offer banners (displayed on category & product pages)
    const offerBanners = [
      {
        type: 'offer',
        title: '-20% sur la Collection Maquillage',
        subtitle: 'Offre limitée sur toute la gamme maquillage CHIC GLAM BY EVA. Profitez-en !',
        cta: 'En profiter',
        image: '/images/banners/promo-1.webp',
        link: 'makeup',
        sortOrder: 0,
        isActive: true,
      },
      {
        type: 'offer',
        title: 'Nouvelle Collection Lingerie',
        subtitle: "Découvrez nos créations artisanales faites main au Sénégal. Pièces uniques et élégantes.",
        cta: 'Découvrir',
        image: '/images/banners/promo-2.webp',
        link: 'lingerie',
        sortOrder: 1,
        isActive: true,
      },
      {
        type: 'offer',
        title: 'Completez Votre Look',
        subtitle: 'Accessoires indispensables pour un maquillage professionnel. Cils, pinceaux et plus.',
        cta: 'Voir les accessoires',
        image: '/images/categories/accessoires-banner.jpg',
        link: 'accessoires',
        sortOrder: 2,
        isActive: true,
      },
    ];

    // Seed Promo banner (general)
    const promoBanners = [
      {
        type: 'promo',
        title: 'Livraison Gratuite',
        subtitle: 'Dès 50€ d\'achat',
        cta: '',
        image: '/images/banners/promo-1.webp',
        link: '',
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
