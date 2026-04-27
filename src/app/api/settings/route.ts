import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/settings
export async function GET() {
  try {
    let settings = await db.siteSettings.findUnique({
      where: { id: 'main' },
    });

    if (!settings) {
      settings = await db.siteSettings.create({
        data: { id: 'main' },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      'siteName', 'siteDescription', 'siteUrl', 'ogImage', 'contactEmail', 'activeTemplate',
      'stripeKey', 'stripeSecret', 'sumupKey', 'sumUpMerchantId',
      'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const settings = await db.siteSettings.upsert({
      where: { id: 'main' },
      update: updateData,
      create: { id: 'main', ...updateData },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
