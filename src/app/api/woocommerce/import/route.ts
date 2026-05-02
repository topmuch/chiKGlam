import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseWooCommerceCSV, WooCommerceCSVProduct } from '@/lib/woocommerce-csv-parser';
import { downloadImagesToLocal } from '@/lib/image-downloader';

interface WooCommerceProduct {
  name?: string;
  short_description?: string;
  description?: string;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  images?: { src: string }[];
  categories?: { name: string; slug?: string }[];
  sku?: string;
  brand?: string;
  stock_quantity?: number;
  tags?: { name: string }[];
  status?: string;
  id?: number;
  type?: string;
}

// POST /api/woocommerce/import
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let imported = 0;
    let errors = 0;
    const importErrors: string[] = [];

    // Check if this is a CSV import
    if (body.csv) {
      const result = parseWooCommerceCSV(body.csv);

      for (const prod of result.products) {
        try {
          // Download images locally before importing
          const localImages = await downloadImagesToLocal(prod.images, prod.sku);
          const localPrimaryImage = localImages[0] || prod.primaryImage;

          // Update product with local image paths
          const productWithLocalImages = {
            ...prod,
            images: localImages,
            primaryImage: localPrimaryImage,
          };

          const product = await importCSVProduct(productWithLocalImages);
          await db.wooCommerceImport.create({
            data: {
              productId: product.id,
              wooId: prod.wooId ? String(prod.wooId) : null,
              status: 'success',
              rawData: JSON.stringify(prod),
            },
          });
          imported++;
        } catch (err) {
          console.error(`Failed to import CSV product "${prod.name}":`, err);
          errors++;
          importErrors.push(`${prod.name}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);

          await db.wooCommerceImport.create({
            data: {
              wooId: prod.wooId ? String(prod.wooId) : null,
              status: 'failed',
              error: err instanceof Error ? err.message : 'Unknown error',
              rawData: JSON.stringify(prod),
            },
          });
        }
      }

      return NextResponse.json({
        success: true,
        imported,
        errors,
        skipped: result.skipped,
        total: result.total,
        parseErrors: result.errors,
        importErrors,
        mode: 'csv',
      });
    }

    // Original JSON-based import
    let wooProducts: WooCommerceProduct[] = [];

    if (body.products && Array.isArray(body.products)) {
      wooProducts = body.products;
    } else {
      return NextResponse.json(
        { success: false, error: 'Aucun produit fourni. Envoyez { products: [...] } ou { csv: "..." }' },
        { status: 400 }
      );
    }

    for (const wp of wooProducts) {
      try {
        const images = wp.images?.map((img) => img.src) || [];
        const categoryNames = wp.categories?.map((cat) => cat.name) || [];
        const category = mapCategoryName(categoryNames[0]) || '';
        const subcategory = categoryNames[1] || '';
        const tagNames = wp.tags?.map((tag) => tag.name) || [];

        const price = parseFloat(wp.price || '0');
        const regularPrice = wp.regular_price ? parseFloat(wp.regular_price) : null;
        const originalPrice = regularPrice && regularPrice > price ? regularPrice : null;

        const slug = wp.name
          ? wp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()
          : `woo-${Date.now()}`;

        // Download images locally
        const sku = wp.sku || `WOO-${wp.id || Date.now()}`;
        const localImages = await downloadImagesToLocal(images, sku);
        const primaryImage = localImages[0] || '';

        const product = await db.product.create({
          data: {
            name: wp.name || 'Unnamed Product',
            slug,
            brand: wp.brand || '',
            price,
            originalPrice,
            image: primaryImage,
            images: JSON.stringify(localImages),
            category,
            subcategory,
            description: wp.short_description || wp.description || '',
            tags: JSON.stringify(tagNames),
            inStock: (wp.stock_quantity ?? 0) > 0 || wp.status === 'publish',
            sku,
            stockCount: wp.stock_quantity || 0,
          },
        });

        // Log the import per product
        await db.wooCommerceImport.create({
          data: {
            productId: product.id,
            wooId: wp.id ? String(wp.id) : null,
            status: 'success',
            rawData: JSON.stringify(wp),
          },
        });

        imported++;
      } catch (err) {
        console.error(`Failed to import product "${wp.name}":`, err);
        errors++;

        await db.wooCommerceImport.create({
          data: {
            wooId: wp.id ? String(wp.id) : null,
            status: 'failed',
            error: err instanceof Error ? err.message : 'Unknown error',
            rawData: JSON.stringify(wp),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      errors,
      total: wooProducts.length,
      mode: 'json',
    });
  } catch (error) {
    console.error('WooCommerce import error:', error);
    return NextResponse.json(
      { success: false, error: "Échec de l'import des produits" },
      { status: 500 }
    );
  }
}

// French -> English category mapping for WooCommerce imports
const CATEGORY_MAP: Record<string, string> = {
  'maquillage': 'Makeup',
  'soins': 'Skincare',
  'cheveux': 'Haircare',
  'parfums': 'Fragrance',
  'parfum': 'Fragrance',
  'accessoires': 'Accessoires',
  'lingerie': 'Lingerie',
  'pagnes': 'Lingerie',
  'cadeaux': 'Cartes Cadeaux',
  'cartes cadeaux': 'Cartes Cadeaux',
  'carte cadeau': 'Cartes Cadeaux',
  'soins du corps': 'Bodycare',
  'bodycare': 'Bodycare',
  'soins des ongles': 'Nailcare',
  'nailcare': 'Nailcare',
  'makeup': 'Makeup',
  'skincare': 'Skincare',
  'haircare': 'Haircare',
  'fragrance': 'Fragrance',
};

function mapCategoryName(raw: string): string {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  return CATEGORY_MAP[lower] || trimmed;
}

// Helper function to import a CSV-parsed product into the database
async function importCSVProduct(prod: WooCommerceCSVProduct) {
  const category = mapCategoryName(prod.categories[0]) || 'Non classé';
  const subcategory = prod.subcategories?.[0] || '';

  const slug = prod.name
    .toLowerCase()
    .replace(/[^a-z0-9àâäéèêëïîôùûüÿçœæ\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') +
    '-' +
    Date.now();

  // Check if product with same SKU already exists
  const existing = prod.sku ? await db.product.findUnique({ where: { sku: prod.sku } }) : null;
  if (existing) {
    throw new Error(`Produit avec SKU "${prod.sku}" existe déjà (ID: ${existing.id})`);
  }

  // Build tags including type and attributes
  const allTags = [...prod.tags];
  if (prod.attributeName && prod.attributeValues) {
    allTags.push(`${prod.attributeName}: ${prod.attributeValues.join(', ')}`);
  }
  if (prod.type === 'variable') {
    allTags.push('variable');
  }

  // Build description with attribute info
  let fullDescription = prod.description || '';
  if (prod.shortDescription && !fullDescription) {
    fullDescription = prod.shortDescription;
  }
  if (prod.attributeName && prod.attributeValues && prod.attributeValues.length > 0) {
    fullDescription += `\n\n${prod.attributeName} : ${prod.attributeValues.join(', ')}`;
  }

  // Build images JSON string
  const images = prod.images.length > 0 ? prod.images : [];
  const primaryImage = prod.primaryImage || images[0] || '';

  return db.product.create({
    data: {
      name: prod.name,
      slug,
      brand: 'ChicGlambyEva',
      price: prod.price,
      originalPrice: prod.originalPrice,
      image: primaryImage,
      images: JSON.stringify(images),
      category,
      subcategory,
      description: fullDescription.trim(),
      tags: JSON.stringify(allTags),
      inStock: prod.inStock,
      sku: prod.sku || `WOO-${prod.wooId || Date.now()}`,
      stockCount: prod.stockQuantity,
      weight: prod.weight,
      isNew: false,
      isTrending: false,
      isBestseller: false,
      isFeatured: false,
      isActive: true,
    },
  });
}

// GET /api/woocommerce/import - Get import history
export async function GET() {
  try {
    const imports = await db.wooCommerceImport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        product: {
          select: { name: true, image: true },
        },
      },
    });

    return NextResponse.json({ success: true, imports });
  } catch (error) {
    console.error('WooCommerce import history error:', error);
    return NextResponse.json(
      { success: false, error: 'Échec de la récupération de l\'historique' },
      { status: 500 }
    );
  }
}
