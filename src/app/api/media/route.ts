import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat, unlink, mkdir, writeFile } from 'fs/promises';
import { join, resolve, basename } from 'path';
import { db } from '@/lib/db';

// ============================================================
// Helpers
// ============================================================

const UPLOADS_DIR = resolve(process.cwd(), 'public', 'uploads');
const IMAGES_DIR = resolve(process.cwd(), 'public', 'images');
const PUBLIC_DIR = resolve(process.cwd(), 'public');
const ALLOWED_FOLDERS = ['products', 'banners', 'categories', 'general'];

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp', 'avif']);

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
    ico: 'image/x-icon', bmp: 'image/bmp', avif: 'image/avif',
    pdf: 'application/pdf', mp4: 'video/mp4', webm: 'video/webm',
  };
  return mimeMap[ext] || 'application/octet-stream';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface MediaFile {
  name: string;
  url: string;
  folder: string;
  size: number;
  sizeFormatted: string;
  type: string;
  lastModified: string;
  source: string; // "upload" | "images" | "product"
}

function isWithinUploads(filePath: string): boolean {
  const resolved = resolve(filePath);
  return resolved.startsWith(UPLOADS_DIR + '/') || resolved === UPLOADS_DIR;
}

// ============================================================
// Scan filesystem directories recursively
// ============================================================

async function scanDirectory(dirPath: string, folderLabel: string, source: string, baseUrl: string): Promise<MediaFile[]> {
  const files: MediaFile[] = [];
  let entries;
  try {
    entries = await readdir(dirPath, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await scanDirectory(fullPath, folderLabel, source, `${baseUrl}/${entry.name}`);
      files.push(...subFiles);
    } else if (entry.isFile()) {
      const ext = entry.name.split('.').pop()?.toLowerCase() || '';
      if (!IMAGE_EXTENSIONS.has(ext)) continue;
      try {
        const s = await stat(fullPath);
        const subfolder = dirPath.replace(IMAGES_DIR, '').replace(UPLOADS_DIR, '').replace(/\\/g, '/').replace(/^\//, '');
        files.push({
          name: entry.name,
          url: `${baseUrl}/${entry.name}`,
          folder: subfolder ? `${folderLabel}/${subfolder}` : folderLabel,
          size: s.size,
          sizeFormatted: formatFileSize(s.size),
          type: getMimeType(entry.name),
          lastModified: s.mtime.toISOString(),
          source,
        });
      } catch {
        // skip
      }
    }
  }

  return files;
}

// ============================================================
// Get product images from DB (for external URLs stored in products)
// ============================================================

async function getProductImagesFromDB(): Promise<MediaFile[]> {
  const files: MediaFile[] = [];
  try {
    const products = await db.product.findMany({
      select: { image: true, images: true, updatedAt: true, category: true },
      distinct: ['image'],
    });

    const seenUrls = new Set<string>();

    for (const product of products) {
      // Parse all image URLs from the product
      const allImages: string[] = [];
      if (product.image) allImages.push(product.image);
      try {
        const imgs = JSON.parse(product.images || '[]');
        if (Array.isArray(imgs)) allImages.push(...imgs);
      } catch { /* skip */ }

      for (const imgUrl of allImages) {
        if (!imgUrl || seenUrls.has(imgUrl)) continue;
        seenUrls.add(imgUrl);

        // Only include external URLs (those not already in /uploads/ or /images/)
        if (imgUrl.startsWith('/uploads/') || imgUrl.startsWith('/images/')) continue;

        files.push({
          name: basename(imgUrl) || 'external-image',
          url: imgUrl,
          folder: `Produits / ${product.category || 'Non classé'}`,
          size: 0,
          sizeFormatted: 'Externe',
          type: 'image/jpeg',
          lastModified: product.updatedAt.toISOString(),
          source: 'product',
        });
      }
    }
  } catch (e) {
    console.error('Error fetching product images from DB:', e);
  }

  return files;
}

// ============================================================
// GET /api/media — List ALL media files
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || undefined;
    const source = searchParams.get('source') || undefined; // "upload" | "images" | "product"

    const allFiles: MediaFile[] = [];

    // 1. Scan /public/uploads/ directory
    if (!source || source === 'upload') {
      const uploadFiles = await scanDirectory(UPLOADS_DIR, 'uploads', 'upload', '/uploads');
      allFiles.push(...uploadFiles);
    }

    // 2. Scan /public/images/ directory (static images)
    if (!source || source === 'images') {
      const imageFiles = await scanDirectory(IMAGES_DIR, 'images', 'images', '/images');
      allFiles.push(...imageFiles);
    }

    // 3. Get external product images from DB
    if (!source || source === 'product') {
      const dbImages = await getProductImagesFromDB();
      allFiles.push(...dbImages);
    }

    // Filter by folder if specified
    let filtered = allFiles;
    if (folder) {
      const f = folder.toLowerCase();
      filtered = allFiles.filter((file) =>
        file.folder.toLowerCase().includes(f) ||
        file.name.toLowerCase().includes(f)
      );
    }

    // Sort by lastModified descending (external images go last)
    filtered.sort((a, b) => {
      // External images (size 0) go to the end
      if (a.size === 0 && b.size > 0) return 1;
      if (a.size > 0 && b.size === 0) return -1;
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    });

    return NextResponse.json({
      success: true,
      files: filtered,
      total: filtered.length,
      sources: {
        uploads: allFiles.filter((f) => f.source === 'upload').length,
        images: allFiles.filter((f) => f.source === 'images').length,
        products: allFiles.filter((f) => f.source === 'product').length,
      },
    });
  } catch (error) {
    console.error('Media list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list media files' },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/media — Upload a file
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided. Use "file" field.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json(
        { success: false, error: `Invalid folder. Allowed: ${ALLOWED_FOLDERS.join(', ')}` },
        { status: 400 }
      );
    }

    // Max file size: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const targetDir = join(UPLOADS_DIR, folder);
    await mkdir(targetDir, { recursive: true });

    // Sanitize filename
    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = join(targetDir, sanitized);

    // Check for existing file and add suffix to avoid overwrite
    let finalPath = filePath;
    let finalName = sanitized;
    let counter = 1;
    while (true) {
      try {
        await stat(finalPath);
        const ext = sanitized.includes('.') ? '.' + sanitized.split('.').pop() : '';
        const base = sanitized.includes('.') ? sanitized.slice(0, sanitized.lastIndexOf('.')) : sanitized;
        finalName = `${base}_${counter}${ext}`;
        finalPath = join(targetDir, finalName);
        counter++;
      } catch {
        break;
      }
    }

    const bytes = await file.arrayBuffer();
    await writeFile(finalPath, Buffer.from(bytes));

    const url = `/uploads/${folder}/${finalName}`;

    return NextResponse.json({
      success: true,
      file: {
        name: finalName,
        url,
        folder,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type || getMimeType(finalName),
      },
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/media?url=... — Delete a file
// ============================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL query parameter is required' },
        { status: 400 }
      );
    }

    // Only allow deleting files within public directory (uploads + images)
    const relativePath = url.startsWith('/') ? url.slice(1) : url;
    if (!relativePath.startsWith('uploads/') && !relativePath.startsWith('images/')) {
      return NextResponse.json(
        { success: false, error: 'Can only delete files within /uploads/ or /images/' },
        { status: 403 }
      );
    }

    const filePath = resolve(PUBLIC_DIR, relativePath);

    // Safety check
    if (!filePath.startsWith(PUBLIC_DIR)) {
      return NextResponse.json(
        { success: false, error: 'Path is outside public directory' },
        { status: 403 }
      );
    }

    await unlink(filePath);

    return NextResponse.json({
      success: true,
      deleted: url,
    });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
