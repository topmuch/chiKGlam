import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/addresses/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const address = await db.address.findUnique({
      where: { id },
    });

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error('Address GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch address' },
      { status: 500 }
    );
  }
}

// PUT /api/addresses/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.address.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults for this user first
    if (body.isDefault) {
      await db.address.updateMany({
        where: { userId: existing.userId, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updateData: Record<string, unknown> = {};
    if (body.label !== undefined) updateData.label = body.label;
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.address1 !== undefined) updateData.address1 = body.address1;
    if (body.address2 !== undefined) updateData.address2 = body.address2;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.postalCode !== undefined) updateData.postalCode = body.postalCode;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.isDefault !== undefined) updateData.isDefault = body.isDefault;

    const address = await db.address.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error('Address PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE /api/addresses/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.address.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    await db.address.delete({ where: { id } });

    // If the deleted address was default, set another as default
    if (existing.isDefault) {
      const nextDefault = await db.address.findFirst({
        where: { userId: existing.userId },
      });
      if (nextDefault) {
        await db.address.update({
          where: { id: nextDefault.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Address DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
