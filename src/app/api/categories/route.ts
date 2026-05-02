import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ============================================================
// GET /api/categories — List all categories (product-derived + custom)
// ============================================================

export async function GET() {
  try {
    // 1. Product-derived categories (existing logic)
    const productCategories = await db.product.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { id: true },
      orderBy: { category: 'asc' },
    });

    const enriched = await Promise.all(
      productCategories.map(async (cat) => {
        const firstProduct = await db.product.findFirst({
          where: { category: cat.category, isActive: true, image: { not: '' } },
          orderBy: { createdAt: 'asc' },
          select: { image: true },
        });

        return {
          name: cat.category,
          count: cat._count.id,
          image: firstProduct?.image || '',
          source: 'product',
        };
      }),
    );

    // 2. Custom categories from the Category table
    const customCategories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    const customEnriched = customCategories.map((cat) => {
      // Count products that match this category name
      const productMatch = enriched.find(
        (p) => p.name.toLowerCase() === cat.name.toLowerCase(),
      );

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        subcategories: cat.subcategories || '[]',
        count: productMatch?.count || 0,
        source: 'custom',
      };
    });

    // 3. Merge: custom first, then product-derived (avoid duplicates)
    const existingNames = new Set(customEnriched.map((c) => c.name.toLowerCase()));
    const productOnly = enriched.filter(
      (p) => !existingNames.has(p.name.toLowerCase()),
    );

    const categories = [...customEnriched, ...productOnly];

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Categories list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 },
    );
  }
}

// ============================================================
// POST /api/categories — Create a new custom category
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image, subcategories } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Le nom est requis' },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();

    // Check for duplicate name
    const existing = await db.category.findFirst({
      where: { name: trimmedName },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Une catégorie avec ce nom existe déjà' },
        { status: 409 },
      );
    }

    // Auto-generate slug from name if not provided
    const categorySlug = slug
      ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : trimmedName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

    // Check for duplicate slug
    const existingSlug = await db.category.findFirst({
      where: { slug: categorySlug },
    });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'Une catégorie avec ce slug existe déjà' },
        { status: 409 },
      );
    }

    // Parse subcategories from comma-separated string to JSON
    let subcategoriesJson = '[]';
    if (subcategories && typeof subcategories === 'string') {
      const items = subcategories
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
      subcategoriesJson = JSON.stringify(
        items.map((item: string) => ({
          name: item,
          slug: item
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
        })),
      );
    }

    // Create the category
    const category = await db.category.create({
      data: {
        name: trimmedName,
        slug: categorySlug,
        description: description?.trim() || '',
        image: image?.trim() || '',
        subcategories: subcategoriesJson,
      },
    });

    return NextResponse.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        subcategories: category.subcategories,
        count: 0,
        source: 'custom',
      },
    });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { success: false, error: 'Échec de la création de la catégorie' },
      { status: 500 },
    );
  }
}
