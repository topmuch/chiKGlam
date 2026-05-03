import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ============================================================
// GET /api/banners — List all banners (optionally filtered by type)
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const banners = await db.banner.findMany({
      where: type ? { type } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error('Banners list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/banners — Create a new banner
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, subtitle, cta, image, link, sortOrder, isActive, promoProductIds, promoStartDate, promoEndDate } = body;

    if (!type || !['hero', 'offer', 'promo'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid banner type. Must be "hero", "offer", or "promo".' },
        { status: 400 }
      );
    }

    const banner = await db.banner.create({
      data: {
        type,
        title: title || '',
        subtitle: subtitle || '',
        cta: cta || '',
        image: image || '',
        link: link || '',
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        isActive: typeof isActive === 'boolean' ? isActive : true,
        ...(promoProductIds !== undefined && { promoProductIds: promoProductIds || '' }),
        ...(promoStartDate !== undefined && promoStartDate ? { promoStartDate: new Date(promoStartDate) } : {}),
        ...(promoEndDate !== undefined && promoEndDate ? { promoEndDate: new Date(promoEndDate) } : {}),
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Banner create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT /api/banners — Bulk update or reorder (optional)
// ============================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orders } = body; // [{id, sortOrder, isActive, ...}]

    if (!Array.isArray(orders)) {
      return NextResponse.json(
        { success: false, error: 'Expected "orders" array' },
        { status: 400 }
      );
    }

    for (const item of orders) {
      await db.banner.update({
        where: { id: item.id },
        data: {
          ...(item.sortOrder !== undefined && { sortOrder: item.sortOrder }),
          ...(item.isActive !== undefined && { isActive: item.isActive }),
          ...(item.promoProductIds !== undefined && { promoProductIds: item.promoProductIds || '' }),
          ...(item.promoStartDate !== undefined && item.promoStartDate ? { promoStartDate: new Date(item.promoStartDate) } : {}),
          ...(item.promoEndDate !== undefined && item.promoEndDate ? { promoEndDate: new Date(item.promoEndDate) } : {}),
          ...((item.promoStartDate === null) && { promoStartDate: null }),
          ...((item.promoEndDate === null) && { promoEndDate: null }),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Banners bulk update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update banners' },
      { status: 500 }
    );
  }
}
