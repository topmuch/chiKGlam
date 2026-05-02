import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

interface ImportProduct {
  name?: string;
  brand?: string;
  price?: number | string;
  originalPrice?: number | string | null;
  description?: string;
  shortDescription?: string;
  image?: string;
  images?: string | string[];
  category?: string;
  subcategory?: string;
  tags?: string | string[];
  sku?: string;
  stockCount?: number | string;
  inStock?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  weight?: number | string | null;
  seoTitle?: string;
  seoDescription?: string;
}

function generateSlug(name: string, suffix: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base}-${suffix}`;
}

function normalizeImages(images: string | string[] | undefined | null): string {
  if (!images) return '[]';
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return JSON.stringify(parsed);
    } catch {
      return JSON.stringify([images]);
    }
  }
  if (Array.isArray(images)) return JSON.stringify(images);
  return '[]';
}

function normalizeTags(tags: string | string[] | undefined | null): string {
  if (!tags) return '[]';
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return JSON.stringify(parsed);
    } catch {
      return JSON.stringify(tags.split(',').map((t) => t.trim()).filter(Boolean));
    }
  }
  if (Array.isArray(tags)) return JSON.stringify(tags);
  return '[]';
}

function parsePrismaError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  
  // Unique constraint violations
  if (msg.includes('Unique constraint')) {
    if (msg.includes('slug')) return 'Slug déjà existant (nom similaire)';
    if (msg.includes('sku')) return 'SKU déjà existant';
    if (msg.includes('Product_name_key') || msg.includes('name')) return 'Nom de produit en conflit';
    return 'Contrainte d\'unicité violée';
  }

  // Foreign key violations
  if (msg.includes('Foreign key')) {
    return 'Clé étrangère invalide';
  }

  // Field too long
  if (msg.includes('too long') || msg.includes('exceeds')) {
    return 'Un champ est trop long';
  }

  // Return original message truncated if too long
  if (msg.length > 200) return msg.substring(0, 200) + '...';
  return msg;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products, mode } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucun produit fourni. Envoyez un tableau "products".' },
        { status: 400 }
      );
    }

    if (products.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Maximum 500 produits par importation.' },
        { status: 400 }
      );
    }

    const importMode = mode || 'create';
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const errors: { index: number; name: string; error: string }[] = [];

    for (let i = 0; i < products.length; i++) {
      const p: ImportProduct = products[i];

      // Validation minimale
      if (!p.name || typeof p.name !== 'string' || p.name.trim().length === 0) {
        errors.push({ index: i, name: p.name || `Produit #${i + 1}`, error: 'Nom manquant' });
        failed++;
        continue;
      }

      const name = p.name.trim();
      const price = parseFloat(String(p.price || '0'));
      const images = normalizeImages(p.images);
      const tags = normalizeTags(p.tags);
      const originalPrice = p.originalPrice ? parseFloat(String(p.originalPrice)) : null;
      const stockCount = parseInt(String(p.stockCount || '100'), 10);
      const weight = p.weight ? parseFloat(String(p.weight)) : null;
      const primaryImage = p.image || (JSON.parse(images) as string[])[0] || '';

      try {
        // === UPSERT MODE: find by SKU or name, update if exists ===
        if (importMode === 'upsert' || importMode === 'update') {
          let existing = null;
          
          // Try to find by SKU first
          if (p.sku && p.sku.trim()) {
            try {
              existing = await db.product.findUnique({ where: { sku: p.sku.trim() } });
            } catch {
              // SKU lookup failed, continue without it
            }
          }

          // Try to find by name if no SKU match
          if (!existing) {
            try {
              existing = await db.product.findFirst({
                where: { name: { equals: name } },
              });
            } catch {
              // Name lookup failed
            }
          }

          if (existing) {
            if (importMode === 'update') {
              // Update mode: update existing
              await db.product.update({
                where: { id: existing.id },
                data: {
                  name,
                  brand: p.brand || existing.brand,
                  price,
                  originalPrice: originalPrice !== null ? originalPrice : existing.originalPrice,
                  description: p.description || existing.description,
                  shortDescription: p.shortDescription || existing.shortDescription,
                  image: primaryImage || existing.image,
                  images,
                  category: p.category || existing.category,
                  subcategory: p.subcategory || existing.subcategory,
                  tags,
                  stockCount,
                  inStock: p.inStock !== undefined ? p.inStock : existing.inStock,
                  isNew: p.isNew !== undefined ? p.isNew : existing.isNew,
                  isTrending: p.isTrending !== undefined ? p.isTrending : existing.isTrending,
                  isBestseller: p.isBestseller !== undefined ? p.isBestseller : existing.isBestseller,
                  isFeatured: p.isFeatured !== undefined ? p.isFeatured : existing.isFeatured,
                  isActive: p.isActive !== undefined ? p.isActive : existing.isActive,
                  weight: weight !== null ? weight : existing.weight,
                  seoTitle: p.seoTitle || existing.seoTitle,
                  seoDescription: p.seoDescription || existing.seoDescription,
                },
              });
              updated++;
              continue;
            } else {
              // Upsert mode: update existing product
              await db.product.update({
                where: { id: existing.id },
                data: {
                  name,
                  brand: p.brand || existing.brand,
                  price,
                  originalPrice: originalPrice !== null ? originalPrice : existing.originalPrice,
                  description: p.description || existing.description,
                  shortDescription: p.shortDescription || existing.shortDescription,
                  image: primaryImage || existing.image,
                  images,
                  category: p.category || existing.category,
                  subcategory: p.subcategory || existing.subcategory,
                  tags,
                  stockCount,
                  inStock: p.inStock !== undefined ? p.inStock : existing.inStock,
                  isNew: p.isNew !== undefined ? p.isNew : existing.isNew,
                  isTrending: p.isTrending !== undefined ? p.isTrending : existing.isTrending,
                  isBestseller: p.isBestseller !== undefined ? p.isBestseller : existing.isBestseller,
                  isFeatured: p.isFeatured !== undefined ? p.isFeatured : existing.isFeatured,
                  isActive: p.isActive !== undefined ? p.isActive : existing.isActive,
                  weight: weight !== null ? weight : existing.weight,
                  seoTitle: p.seoTitle || existing.seoTitle,
                  seoDescription: p.seoDescription || existing.seoDescription,
                },
              });
              updated++;
              continue;
            }
          }
          
          // Product not found and in update-only mode
          if (importMode === 'update') {
            skipped++;
            errors.push({ index: i, name, error: 'Non trouvé en base (mode mise à jour)' });
            continue;
          }
          
          // Upsert mode: product not found, will create below
        }

        // === CREATE MODE (or upsert fallback) ===
        const uniqueSuffix = `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`;
        const slug = generateSlug(name, uniqueSuffix);
        
        // Generate a unique SKU if not provided or if it might conflict
        let sku = p.sku?.trim() || `CGE-${Date.now()}-${i}`;
        
        // Check if SKU exists and append suffix if needed
        try {
          const skuExists = await db.product.findUnique({ where: { sku } });
          if (skuExists) {
            sku = `${sku}-${uniqueSuffix.slice(-6)}`;
          }
        } catch {
          // ignore
        }

        await db.product.create({
          data: {
            name,
            slug,
            brand: p.brand || '',
            price,
            originalPrice,
            description: p.description || p.shortDescription || '',
            shortDescription: p.shortDescription || null,
            image: primaryImage,
            images,
            category: p.category || 'Skincare',
            subcategory: p.subcategory || 'Other',
            rating: 0,
            reviewCount: 0,
            tags,
            inStock: p.inStock !== undefined ? p.inStock : true,
            stockCount,
            isNew: p.isNew || false,
            isTrending: p.isTrending || false,
            isBestseller: p.isBestseller || false,
            isFeatured: p.isFeatured || false,
            isActive: p.isActive !== undefined ? p.isActive : true,
            sku,
            weight,
            seoTitle: p.seoTitle || null,
            seoDescription: p.seoDescription || null,
          },
        });
        created++;

      } catch (err) {
        const errorMsg = parsePrismaError(err);
        errors.push({ index: i, name: p.name!, error: errorMsg });
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: products.length,
        created,
        updated,
        skipped,
        failed,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: unknown) {
    console.error('Product import error:', error);
    const message = error instanceof Error ? error.message : 'Échec de l\'importation';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
