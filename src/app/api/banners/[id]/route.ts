import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ============================================================
// GET /api/banners/[id] — Get a single banner
// ============================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const banner = await db.banner.findUnique({ where: { id } });

    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Banner get error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT /api/banners/[id] — Update a banner
// ============================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const banner = await db.banner.findUnique({ where: { id } });
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    const updated = await db.banner.update({
      where: { id },
      data: {
        ...(body.type !== undefined && { type: body.type }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
        ...(body.cta !== undefined && { cta: body.cta }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.link !== undefined && { link: body.link }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.promoProductIds !== undefined && { promoProductIds: body.promoProductIds || '' }),
        ...(body.promoStartDate !== undefined && body.promoStartDate ? { promoStartDate: new Date(body.promoStartDate) } : {}),
        ...(body.promoEndDate !== undefined && body.promoEndDate ? { promoEndDate: new Date(body.promoEndDate) } : {}),
        ...(body.promoStartDate === null && { promoStartDate: null }),
        ...(body.promoEndDate === null && { promoEndDate: null }),
      },
    });

    return NextResponse.json({ success: true, banner: updated });
  } catch (error) {
    console.error('Banner update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/banners/[id] — Delete a banner
// ============================================================

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Banner delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
