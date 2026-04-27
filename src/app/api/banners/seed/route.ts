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
        title: 'Nouvelle Collection Maquillage',
        subtitle: 'Découvrez notre gamme hyper-pigmentée, minérale et végan — conçue pour toutes les carnations.',
        cta: 'Découvrir',
        image: '/images/hero/slide-1.png',
        link: 'makeup',
        sortOrder: 0,
        isActive: true,
      },
      {
        type: 'hero',
        title: 'Secret de Dame — Lingerie Africaine',
        subtitle: "L'élégance traditionnelle revisitée. Fait main par nos artisans sénégalais.",
        cta: 'Explorer',
        image: '/images/hero/slide-2.png',
        link: 'lingerie',
        sortOrder: 1,
        isActive: true,
      },
      {
        type: 'hero',
        title: 'Box de Séduction',
        subtitle: 'Petits pagnes, kit nuisette, kimono et accessoires — le cadeau parfait.',
        cta: 'Offrir',
        image: '/images/hero/slide-3.png',
        link: 'box-de-seduction',
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
        image: '/images/banners/promo-1.png',
        link: 'boutique',
        sortOrder: 0,
        isActive: true,
      },
    ];

    const allBanners = [...heroBanners, ...promoBanners];

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
