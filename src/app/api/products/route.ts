import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const brand = searchParams.get('brand');
    const isNew = searchParams.get('isNew');
    const isTrending = searchParams.get('isTrending');
    const isBestseller = searchParams.get('isBestseller');
    const active = searchParams.get('active');
    const admin = searchParams.get('admin') === 'true';

    const where: Prisma.ProductWhereInput = {};

    // Default: only show active products for non-admin queries
    if (!admin) {
      where.isActive = true;
    }

    // Explicit active override
    if (active !== null && active !== '') {
      where.isActive = active === 'true';
    }

    if (category) {
      where.category = { equals: category };
    }

    if (subcategory) {
      where.subcategory = { equals: subcategory };
    }

    if (brand) {
      where.brand = { equals: brand };
    }

    if (isNew !== null && isNew !== '') {
      where.isNew = isNew === 'true';
    }

    if (isTrending !== null && isTrending !== '') {
      where.isTrending = isTrending === 'true';
    }

    if (isBestseller !== null && isBestseller !== '') {
      where.isBestseller = isBestseller === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'trending':
        orderBy = [{ isTrending: 'desc' }, { rating: 'desc' }];
        break;
      case 'featured':
        orderBy = [{ isFeatured: 'desc' }, { isBestseller: 'desc' }, { rating: 'desc' }];
        break;
      case 'bestselling':
        orderBy = [{ isBestseller: 'desc' }, { rating: 'desc' }];
        break;
      case 'random':
        // Random order handled after fetch
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip: sort === 'random' ? 0 : skip,
        take: sort === 'random' ? Math.min(limit * 3, 100) : limit,
      }),
      db.product.count({ where }),
    ]);

    // Shuffle for random sort
    const finalProducts = sort === 'random'
      ? [...products].sort(() => Math.random() - 0.5).slice(0, limit)
      : products;

    // Transform products to match the frontend Product type
    const transformedProducts = finalProducts.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      image: p.image,
      images: JSON.parse(p.images || '[]') as string[],
      category: p.category,
      subcategory: p.subcategory,
      rating: p.rating,
      reviewCount: p.reviewCount,
      description: p.shortDescription || p.description,
      tags: JSON.parse(p.tags || '[]') as string[],
      inStock: p.inStock,
      isNew: p.isNew || undefined,
      isTrending: p.isTrending || undefined,
      isBestseller: p.isBestseller || undefined,
    }));

    return NextResponse.json({ products: transformedProducts, total, page, limit });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate slug from name
    const slug = body.name
      ? body.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') +
        '-' +
        Date.now()
      : `product-${Date.now()}`;

    const product = await db.product.create({
      data: {
        name: body.name || '',
        slug,
        brand: body.brand || '',
        price: parseFloat(body.price) || 0,
        originalPrice: body.originalPrice
          ? parseFloat(body.originalPrice)
          : null,
        image: body.image || '',
        images: JSON.stringify(body.images || []),
        category: body.category || '',
        subcategory: body.subcategory || '',
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        description: body.description || '',
        shortDescription: body.shortDescription || null,
        tags: JSON.stringify(body.tags || []),
        inStock: body.inStock !== undefined ? body.inStock : true,
        isNew: body.isNew || false,
        isTrending: body.isTrending || false,
        isBestseller: body.isBestseller || false,
        isFeatured: body.isFeatured || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
        sku: body.sku || '',
        stockCount: parseInt(body.stockCount) || 0,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        weight: body.weight ? parseFloat(body.weight) : null,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
