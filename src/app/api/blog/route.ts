import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    // Single post lookup by slug
    if (slug) {
      const where: Record<string, unknown> = { slug };
      if (published === 'true') where.isPublished = true;
      const post = await db.blogPost.findFirst({
        where,
      });
      if (!post) {
        return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, post });
    }

    const where: Record<string, unknown> = {};
    if (published === 'true') where.isPublished = true;
    if (category) where.category = category;

    const posts = await db.blogPost.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, posts, total: posts.length });
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category, author, coverImage, isPublished, readTime } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'Title and slug are required' }, { status: 400 });
    }

    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
    }

    const post = await db.blogPost.create({
      data: { title, slug, excerpt: excerpt || '', content: content || '', category: category || 'Conseils Beauté', author: author || 'Chic Glam', coverImage: coverImage || '', isPublished: isPublished ?? true, readTime: readTime || '5 min' },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}
