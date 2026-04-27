import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile, stat } from 'fs/promises';
import { join, resolve } from 'path';

const UPLOADS_DIR = resolve(process.cwd(), 'public', 'uploads', 'banners');

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// ============================================================
// POST /api/banners/upload — Upload a banner image
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided. Use "image" field.' },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Image too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Only allow image types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|gif|avif)$/i)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed (jpg, png, webp, gif, avif).' },
        { status: 400 }
      );
    }

    await mkdir(UPLOADS_DIR, { recursive: true });

    const sanitized = sanitizeFilename(file.name);

    // Avoid overwriting existing files
    let finalName = sanitized;
    let counter = 1;
    let finalPath = join(UPLOADS_DIR, finalName);
    while (true) {
      try {
        await stat(finalPath);
        const ext = sanitized.includes('.') ? '.' + sanitized.split('.').pop() : '';
        const base = sanitized.includes('.') ? sanitized.slice(0, sanitized.lastIndexOf('.')) : sanitized;
        finalName = `${base}_${counter}${ext}`;
        finalPath = join(UPLOADS_DIR, finalName);
        counter++;
      } catch {
        break;
      }
    }

    const bytes = await file.arrayBuffer();
    await writeFile(finalPath, Buffer.from(bytes));

    const imageUrl = `/uploads/banners/${finalName}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      filename: finalName,
    });
  } catch (error) {
    console.error('Banner image upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload banner image' },
      { status: 500 }
    );
  }
}
