import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

// POST /api/products/[id]/images
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.png';
    const filename = `${id}-${Date.now()}${ext}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', 'products', filename);

    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/products/${filename}`;

    // Parse existing images and add new one
    let images: string[] = [];
    try {
      images = JSON.parse(product.images || '[]');
    } catch {
      images = product.image ? [product.image] : [];
    }
    images.push(imageUrl);

    const updated = await db.product.update({
      where: { id },
      data: {
        image: imageUrl,
        images: JSON.stringify(images),
      },
    });

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Product image upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
