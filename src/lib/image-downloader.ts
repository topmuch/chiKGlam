import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');

/**
 * Ensure the upload directory exists.
 */
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Download an image from a URL and save it locally.
 * Returns the local path relative to /public (e.g. "/uploads/products/abc123.jpg").
 * If download fails, returns the original URL as fallback.
 */
export async function downloadImageToLocal(
  imageUrl: string,
  productSku?: string
): Promise<string> {
  if (!imageUrl || !imageUrl.startsWith('http')) {
    return imageUrl;
  }

  try {
    // Fetch the image
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(15000), // 15s timeout
      headers: {
        'User-Agent': 'ChicGlambyEva-Import/1.0',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to download image (${response.status}): ${imageUrl}`);
      return imageUrl;
    }

    // Get content type to determine extension
    const contentType = response.headers.get('content-type') || '';
    let ext = '.jpg';
    if (contentType.includes('png')) ext = '.png';
    else if (contentType.includes('webp')) ext = '.webp';
    else if (contentType.includes('gif')) ext = '.gif';
    else if (contentType.includes('svg')) ext = '.svg';

    // Get buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate filename: SKU hash + random suffix to avoid collisions
    const hash = crypto
      .createHash('md5')
      .update(productSku || imageUrl)
      .digest('hex')
      .slice(0, 8);

    const timestamp = Date.now().toString(36);
    const filename = `woo-${hash}-${timestamp}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Save file
    ensureUploadDir();
    fs.writeFileSync(filepath, buffer);

    console.log(`  ✓ Image saved: ${filename} (${(buffer.length / 1024).toFixed(1)}KB) from ${imageUrl}`);

    // Return the public URL path
    return `/uploads/products/${filename}`;
  } catch (err) {
    console.warn(`  ✗ Image download failed: ${imageUrl}`, err instanceof Error ? err.message : err);
    return imageUrl; // Return original URL as fallback
  }
}

/**
 * Download multiple images in batch (with concurrency limit).
 * Returns an array of local paths (or original URLs if download failed).
 */
export async function downloadImagesToLocal(
  imageUrls: string[],
  productSku?: string,
  concurrency = 3
): Promise<string[]> {
  if (!imageUrls || imageUrls.length === 0) return [];

  const results: string[] = [];

  // Process in batches to avoid overwhelming the server
  for (let i = 0; i < imageUrls.length; i += concurrency) {
    const batch = imageUrls.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((url) => downloadImageToLocal(url, productSku))
    );
    results.push(...batchResults);

    // Small delay between batches
    if (i + concurrency < imageUrls.length) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  return results;
}
