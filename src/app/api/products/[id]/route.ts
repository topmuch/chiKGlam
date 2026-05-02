import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check product exists
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = await db.product.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.brand !== undefined && { brand: body.brand }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.subcategory !== undefined && { subcategory: body.subcategory }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription || null }),
        ...(body.tags !== undefined && { tags: JSON.stringify(body.tags) }),
        ...(body.inStock !== undefined && { inStock: body.inStock }),
        ...(body.isNew !== undefined && { isNew: body.isNew }),
        ...(body.isTrending !== undefined && { isTrending: body.isTrending }),
        ...(body.isBestseller !== undefined && { isBestseller: body.isBestseller }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.sku !== undefined && { sku: body.sku }),
        ...(body.stockCount !== undefined && { stockCount: parseInt(body.stockCount) }),
        ...(body.seoTitle !== undefined && { seoTitle: body.seoTitle || null }),
        ...(body.seoDescription !== undefined && { seoDescription: body.seoDescription || null }),
        ...(body.weight !== undefined && { weight: body.weight ? parseFloat(body.weight) : null }),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Product PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await db.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
