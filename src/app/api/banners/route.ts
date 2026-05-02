import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';
    const activeOnly = searchParams.get('active') !== 'false';

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (activeOnly) where.isActive = true;

    const banners = await db.banner.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const banner = await db.banner.create({
      data: {
        type: body.type || 'hero',
        title: body.title,
        subtitle: body.subtitle,
        cta: body.cta,
        image: body.image,
        link: body.link,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
        promoProductIds: body.promoProductIds || '[]',
        promoStartDate: body.promoStartDate ? new Date(body.promoStartDate) : null,
        promoEndDate: body.promoEndDate ? new Date(body.promoEndDate) : null,
      },
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
