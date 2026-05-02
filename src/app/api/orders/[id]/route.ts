import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const order = await db.order.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.paymentStatus !== undefined && { paymentStatus: body.paymentStatus }),
        ...(body.paymentMethod !== undefined && { paymentMethod: body.paymentMethod }),
        ...(body.paymentId !== undefined && { paymentId: body.paymentId }),
        ...(body.shippingCarrier !== undefined && { shippingCarrier: body.shippingCarrier }),
        ...(body.trackingNumber !== undefined && { trackingNumber: body.trackingNumber }),
        ...(body.trackingUrl !== undefined && { trackingUrl: body.trackingUrl }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.shippedAt !== undefined && { shippedAt: body.shippedAt ? new Date(body.shippedAt) : null }),
        ...(body.deliveredAt !== undefined && { deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : null }),
      },
      include: { items: true },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.orderItem.deleteMany({ where: { orderId: id } });
    await db.order.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
