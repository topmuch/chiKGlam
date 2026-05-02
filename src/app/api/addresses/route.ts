import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/addresses?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const addresses = await db.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error('Addresses GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// POST /api/addresses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, label, firstName, lastName, address1, address2, city, state, postalCode, country, phone, isDefault } = body;

    if (!userId || !firstName || !lastName || !address1 || !city || !postalCode) {
      return NextResponse.json(
        { success: false, error: 'Required fields: userId, firstName, lastName, address1, city, postalCode' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults first
    if (isDefault) {
      await db.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await db.address.create({
      data: {
        userId,
        label: label || null,
        firstName,
        lastName,
        address1,
        address2: address2 || null,
        city,
        state: state || null,
        postalCode,
        country: country || 'France',
        phone: phone || null,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({ success: true, address }, { status: 201 });
  } catch (error) {
    console.error('Addresses POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create address' },
      { status: 500 }
    );
  }
}
