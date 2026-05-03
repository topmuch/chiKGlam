import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/products/import/woocommerce
// Parses WooCommerce CSV export and imports products with local image paths

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') { current += '"'; i += 2; continue; }
      if (char === '"') { inQuotes = false; i++; continue; }
      current += char; i++; continue;
    }
    if (char === '"') { inQuotes = true; i++; continue; }
    if (char === ',') { result.push(current.trim()); current = ''; i++; continue; }
    current += char; i++;
  }
  result.push(current.trim());
  return result;
}

function convertExternalToLocal(imageUrl: string): string {
  try {
    const url = new URL(imageUrl.trim());
    const filename = url.pathname.split('/').pop();
    if (filename) return `/images/products/woocommerce/${filename}`;
  } catch {}
  return imageUrl;
}

function parseCategories(catStr: string): { category: string; subcategory: string } {
  if (!catStr) return { category: 'Skincare', subcategory: 'Other' };
  // WooCommerce stores categories as comma-separated hierarchical paths
  const paths = catStr.split(',').map((s) => s.replace(/"/g, '').trim()).filter(Boolean);
  const firstPath = paths[0].split('>').map((s) => s.trim());
  const catName = firstPath[0].trim();

  const categoryMap: Record<string, string> = {
    'Maquillage': 'Makeup', 'Makeup': 'Makeup',
    'Soins': 'Skincare', 'Skincare': 'Skincare',
    'Cheveux': 'Haircare', 'Haircare': 'Haircare',
    'Parfums': 'Fragrance', 'Fragrance': 'Fragrance',
    'Accessoires': 'Accessoires', 'Accessories': 'Accessoires',
    'Lingerie': 'Lingerie',
    'Pagnes': 'Lingerie',
    'Cadeaux': 'Cartes Cadeaux', 'Cartes Cadeaux': 'Cartes Cadeaux',
  };

  const mappedCat = categoryMap[catName] || 'Skincare';
  let subcategory = 'Other';
  if (paths.length > 0) {
    const lastPath = paths[paths.length - 1].split('>').map((s) => s.trim());
    if (lastPath.length > 1) subcategory = lastPath[lastPath.length - 1].trim();
  }

  return { category: mappedCat, subcategory };
}

function cleanHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function parsePrice(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/&quot;[^:]*:/g, '').replace(/["\s}/]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csv } = body;

    if (!csv || typeof csv !== 'string') {
      return NextResponse.json({ success: false, error: 'CSV data required' }, { status: 400 });
    }

    const csvContent = csv.replace(/^\uFEFF/, '');
    const lines = csvContent.split('\n').filter((l: string) => l.trim().length > 0);
    if (lines.length < 2) {
      return NextResponse.json({ success: false, error: 'CSV too short' }, { status: 400 });
    }

    const headers = parseCSVLine(lines[0]);
    const colIdx: Record<string, number> = {};
    headers.forEach((h, idx) => {
      const lower = h.toLowerCase().trim().replace(/\uFEFF/g, '');
      if (lower.includes('id') && !lower.includes('attribut') && !lower.includes('group')) colIdx.id = idx;
      if (lower === 'type') colIdx.type = idx;
      if (lower === 'ugs' || lower === 'sku') colIdx.sku = idx;
      if (lower === 'nom' || lower === 'name') colIdx.name = idx;
      if (lower.includes('publi')) colIdx.published = idx;
      if (lower.includes('description courte') || lower === 'short description') colIdx.shortDesc = idx;
      if (lower === 'description' && !lower.includes('courte')) colIdx.desc = idx;
      if (lower.includes('tarif promo') || lower === 'sale price') colIdx.salePrice = idx;
      if (lower.includes('tarif r') || lower === 'regular price') colIdx.regularPrice = idx;
      if (lower.includes('stock') && !lower.includes('montant')) colIdx.stock = idx;
      if (lower.includes('en stock')) colIdx.inStock = idx;
      if (lower.includes('poids')) colIdx.weight = idx;
      if (lower === 'catégories' || lower === 'categories') colIdx.categories = idx;
      if (lower.includes('étiquettes') || lower === 'tags') colIdx.tags = idx;
      if (lower === 'images') colIdx.images = idx;
      if (lower.includes('url externe') || lower === 'external url') colIdx.externalUrl = idx;
    });

    interface ParsedProduct {
      wcId: string; type: string; sku: string; name: string;
      published: boolean; shortDescription: string; description: string;
      price: number; regularPrice: number | null;
      stock: number; inStock: boolean; weight: number | null;
      category: string; subcategory: string; tags: string[];
      images: string[];
    }

    const products: ParsedProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const type = (values[colIdx.type] || '').trim().toLowerCase();
      if (type === 'variation' || type === 'grouped') continue;

      const name = cleanHtml(values[colIdx.name] || '').trim();
      if (!name) continue;

      const imagesRaw = values[colIdx.images] || '';
      const imageUrls = imagesRaw.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (imageUrls.length === 0) continue;

      const localImages = imageUrls.map(convertExternalToLocal);
      const salePrice = parsePrice(values[colIdx.salePrice] || '');
      const regularPrice = parsePrice(values[colIdx.regularPrice] || '');
      const price = salePrice > 0 ? salePrice : regularPrice;
      const { category, subcategory } = parseCategories(values[colIdx.categories] || '');

      products.push({
        wcId: values[colIdx.id] || `wc-${i}`,
        type, sku: (values[colIdx.sku] || '').trim(), name,
        published: values[colIdx.published] === '1',
        shortDescription: cleanHtml(values[colIdx.shortDesc] || ''),
        description: cleanHtml(values[colIdx.desc] || ''),
        price, regularPrice: regularPrice > 0 ? regularPrice : null,
        stock: parseInt(values[colIdx.stock] || '100', 10) || 100,
        inStock: values[colIdx.inStock] !== '0',
        weight: parseFloat(values[colIdx.weight] || '0') || null,
        category, subcategory,
        tags: (values[colIdx.tags] || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        images: localImages,
      });
    }

    if (products.length === 0) {
      return NextResponse.json({ success: false, error: 'Aucun produit trouvé dans le CSV' }, { status: 400 });
    }

    let created = 0;
    let updated = 0;
    let failed = 0;
    const errors: { index: number; name: string; error: string }[] = [];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      try {
        const existing = await db.product.findFirst({
          where: { name: { equals: p.name } },
        });

        const productData = {
          name: p.name,
          brand: '',
          price: p.price,
          originalPrice: p.regularPrice && p.regularPrice > p.price ? p.regularPrice : null,
          description: p.description || p.shortDescription || '',
          shortDescription: p.shortDescription || null,
          image: p.images[0] || '',
          images: JSON.stringify(p.images),
          category: p.category,
          subcategory: p.subcategory,
          tags: JSON.stringify(p.tags),
          stockCount: p.stock,
          inStock: p.inStock,
          isActive: p.published,
          weight: p.weight,
          sku: p.sku || `WC-${p.wcId}`,
        };

        if (existing) {
          await db.product.update({ where: { id: existing.id }, data: productData });
          updated++;
        } else {
          const uniqueSuffix = `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`;
          const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + `-${uniqueSuffix}`;
          await db.product.create({ data: { ...productData, slug } });
          created++;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
        errors.push({ index: i, name: p.name, error: errorMsg });
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: { total: products.length, created, updated, failed, csvLines: lines.length - 1, parsedProducts: products.length },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: unknown) {
    console.error('WooCommerce import error:', error);
    const message = error instanceof Error ? error.message : 'Échec de l\'importation';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
