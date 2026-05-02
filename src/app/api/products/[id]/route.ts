import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const product = await db.product.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.brand !== undefined && { brand: body.brand }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.images !== undefined && { images: body.images }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.subcategory !== undefined && { subcategory: body.subcategory }),
        ...(body.rating !== undefined && { rating: body.rating }),
        ...(body.reviewCount !== undefined && { reviewCount: body.reviewCount }),
        ...(body.inStock !== undefined && { inStock: body.inStock }),
        ...(body.stockCount !== undefined && { stockCount: body.stockCount }),
        ...(body.isNew !== undefined && { isNew: body.isNew }),
        ...(body.isTrending !== undefined && { isTrending: body.isTrending }),
        ...(body.isBestseller !== undefined && { isBestseller: body.isBestseller }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.sku !== undefined && { sku: body.sku }),
        ...(body.seoTitle !== undefined && { seoTitle: body.seoTitle }),
        ...(body.seoDescription !== undefined && { seoDescription: body.seoDescription }),
        ...(body.weight !== undefined && { weight: body.weight }),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
