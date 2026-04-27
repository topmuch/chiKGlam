import Papa, { ParseResult } from 'papaparse';

/**
 * Mapping from French WooCommerce CSV headers to English/internal field names.
 * Supports both French and English column names.
 */
const COLUMN_MAP: Record<string, string> = {
  // French headers (from WooCommerce FR export)
  'ID': 'id',
  'Type': 'type',
  'UGS': 'sku',
  'Nom': 'name',
  'Publié': 'published',
  'Mis en avant ?': 'featured',
  'Visibilité dans le catalogue': 'catalog_visibility',
  'Description courte': 'short_description',
  'Description': 'description',
  'Date de début de promo': 'sale_price_dates_from',
  'Date de fin de promo': 'sale_price_dates_to',
  'État de la TVA': 'tax_status',
  'Classe de TVA': 'tax_class',
  'En stock ?': 'in_stock',
  'Stock': 'stock_quantity',
  'Montant de stock faible': 'low_stock_amount',
  'Autoriser les commandes de produits en rupture ?': 'backorders',
  'Vendre individuellement ?': 'sold_individuellement',
  'Poids (kg)': 'weight',
  'Longueur (cm)': 'length',
  'Largeur (cm)': 'width',
  'Hauteur (cm)': 'height',
  'Autoriser les avis clients ?': 'reviews_allowed',
  'Note de commande': 'purchase_note',
  'Tarif promo': 'sale_price',
  'Tarif régulier': 'regular_price',
  'Catégories': 'categories',
  'Étiquettes': 'tags',
  'Classe d\'expédition': 'shipping_class',
  'Images': 'images',
  'Limite de téléchargement': 'download_limit',
  'Jours d\'expiration du téléchargement': 'download_expiry',
  'Parent': 'parent',
  'Groupes de produits': 'grouped_products',
  'Produits suggérés': 'upsell_ids',
  'Ventes croisées': 'cross_sell_ids',
  'URL externe': 'external_url',
  'Libellé du bouton': 'button_text',
  'Position': 'menu_order',
  'Swatches Attributes': 'swatches_attributes',
  'Nom de l\'attribut 1': 'attribute_name_1',
  'Valeur(s) de l\'attribut 1 ': 'attribute_values_1',
  'Valeur(s) de l\'attribut 1': 'attribute_values_1',
  'Attribut 1 visible': 'attribute_visible_1',
  'Attribut 1 global': 'attribute_global_1',
  'Nom de l\'attribut 2': 'attribute_name_2',
  'Valeur(s) de l\'attribut 2': 'attribute_values_2',
  'Attribut 2 visible': 'attribute_visible_2',
  'Attribut 2 global': 'attribute_global_2',
  // English headers (fallback) — only ones that differ from French
  'Name': 'name',
  'Short description': 'short_description',
  'Published': 'published',
  'SKU': 'sku',
  'Regular price': 'regular_price',
  'Sale price': 'sale_price',
  'Categories': 'categories',
  'Tags': 'tags',
  'Stock quantity': 'stock_quantity',
  'Weight (kg)': 'weight',
  'Attribute 1 name': 'attribute_name_1',
  'Attribute 1 value(s)': 'attribute_values_1',
  'Attribute 1 visible': 'attribute_visible_1',
  'Attribute 1 global': 'attribute_global_1',
};

/**
 * Strip HTML tags and clean up HTML entities from a string.
 */
function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/&ccp-props[^;]*;/g, '')
    .replace(/&quot;134245417&quot;:false[^}]*/g, '')
    .replace(/data-ccp-props="[^"]*"/g, '')
    .replace(/data-contrast="[^"]*"/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

interface ParsedCSVRow {
  id: string;
  type: string;
  sku: string;
  name: string;
  short_description: string;
  description: string;
  sale_price: string;
  regular_price: string;
  categories: string;
  tags: string;
  images: string;
  stock_quantity: string;
  weight: string;
  parent: string;
  attribute_name_1: string;
  attribute_values_1: string;
  in_stock: string;
  [key: string]: string;
}

/**
 * Parse a WooCommerce CSV export (French or English headers) into
 * an array of WooCommerceProduct-compatible objects.
 *
 * Skips "variation" rows — only imports "simple" and "variable" parent products.
 */
export function parseWooCommerceCSV(csvText: string): {
  products: WooCommerceCSVProduct[];
  skipped: number;
  total: number;
  errors: string[];
} {
  const errors: string[] = [];
  const products: WooCommerceCSVProduct[] = [];
  let skipped = 0;

  const parseResult = Papa.parse(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => {
      return COLUMN_MAP[header.trim()] || header.trim().toLowerCase().replace(/\s+/g, '_');
    },
  }) as ParseResult<Record<string, string>>;

  if (parseResult.errors.length > 0) {
    parseResult.errors.forEach((e) => {
      errors.push(`Ligne ${e.row}: ${e.message}`);
    });
  }

  const rows = parseResult.data;

  for (const row of rows) {
    const normalizedRow: ParsedCSVRow = {
      id: row.id || '',
      type: row.type || 'simple',
      sku: row.sku || '',
      name: row.name || '',
      short_description: row.short_description || '',
      description: row.description || '',
      sale_price: row.sale_price || '',
      regular_price: row.regular_price || '',
      categories: row.categories || '',
      tags: row.tags || '',
      images: row.images || '',
      stock_quantity: row.stock_quantity || '0',
      weight: row.weight || '',
      parent: row.parent || '',
      attribute_name_1: row.attribute_name_1 || '',
      attribute_values_1: row.attribute_values_1 || '',
      in_stock: row.in_stock || '',
    };

    // Skip variations — only import parent products (simple and variable)
    const type = (normalizedRow.type || '').trim().toLowerCase();
    if (type === 'variation') {
      skipped++;
      continue;
    }

    // Skip rows without a name
    const name = (normalizedRow.name || '').trim();
    if (!name) {
      skipped++;
      continue;
    }

    // Parse price
    const salePrice = parseFloat(normalizedRow.sale_price) || 0;
    const regularPrice = parseFloat(normalizedRow.regular_price) || salePrice || 0;

    // Parse categories: "Makeup, Makeup > Teint > Poudre bronzer, Makeup > Teint"
    const categoryParts = normalizedRow.categories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    // Get unique top-level categories
    const topLevelCategories = [...new Set(categoryParts.map((c) => c.split('>')[0].trim()))];
    const subCategories = categoryParts
      .filter((c) => c.includes('>'))
      .map((c) => c.split('>').pop()?.trim() || '')
      .filter(Boolean);

    // Parse images: comma-separated URLs
    const imageUrls = normalizedRow.images
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.startsWith('http'));

    // Parse stock
    const stockQty = parseInt(normalizedRow.stock_quantity, 10) || 0;
    const inStock = normalizedRow.in_stock === '1' || stockQty > 0;

    // Parse tags
    const tagNames = normalizedRow.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Parse attribute (for color variants etc.)
    const attributeName = normalizedRow.attribute_name_1.trim();
    const attributeValues = normalizedRow.attribute_values_1
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    // Build the product
    const product: WooCommerceCSVProduct = {
      name,
      type: normalizedRow.type.trim(),
      shortDescription: stripHtml(normalizedRow.short_description),
      description: stripHtml(normalizedRow.description),
      price: salePrice > 0 ? salePrice : regularPrice,
      originalPrice: salePrice > 0 && regularPrice > salePrice ? regularPrice : null,
      sku: normalizedRow.sku.trim(),
      categories: topLevelCategories,
      subcategories: subCategories.length > 0 ? subCategories : undefined,
      tags: tagNames,
      images: imageUrls,
      primaryImage: imageUrls[0] || '',
      stockQuantity: stockQty,
      inStock,
      weight: normalizedRow.weight ? parseFloat(normalizedRow.weight) : undefined,
      wooId: normalizedRow.id ? parseInt(normalizedRow.id, 10) : undefined,
      parent: normalizedRow.parent ? parseInt(normalizedRow.parent, 10) : undefined,
      attributeName: attributeName || undefined,
      attributeValues: attributeValues.length > 0 ? attributeValues : undefined,
    };

    products.push(product);
  }

  return {
    products,
    skipped,
    total: rows.length,
    errors,
  };
}

export interface WooCommerceCSVProduct {
  name: string;
  type: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice: number | null;
  sku: string;
  categories: string[];
  subcategories?: string[];
  tags: string[];
  images: string[];
  primaryImage: string;
  stockQuantity: number;
  inStock: boolean;
  weight?: number;
  wooId?: number;
  parent?: number;
  attributeName?: string;
  attributeValues?: string[];
}
