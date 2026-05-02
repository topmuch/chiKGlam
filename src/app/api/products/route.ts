import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const trending = searchParams.get('trending') === 'true';
    const bestseller = searchParams.get('bestseller') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const isNew = searchParams.get('new') === 'true';

    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (trending) where.isTrending = true;
    if (bestseller) where.isBestseller = true;
    if (featured) where.isFeatured = true;
    if (isNew) where.isNew = true;

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await db.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: body.brand || 'CHIC GLAM BY EVA',
        price: body.price,
        originalPrice: body.originalPrice,
        description: body.description,
        shortDescription: body.shortDescription,
        image: body.image,
        images: body.images || '[]',
        category: body.category,
        subcategory: body.subcategory || '',
        rating: body.rating || 4.5,
        reviewCount: body.reviewCount || 0,
        inStock: body.inStock !== undefined ? body.inStock : true,
        stockCount: body.stockCount || 100,
        isNew: body.isNew || false,
        isTrending: body.isTrending || false,
        isBestseller: body.isBestseller || false,
        isFeatured: body.isFeatured || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
        tags: body.tags || '[]',
        sku: body.sku || '',
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        weight: body.weight,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
