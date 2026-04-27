import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper to trigger notification without blocking the response
async function triggerNotification(type: string, orderId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    await fetch(`${baseUrl}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, orderId }),
    });
  } catch (err) {
    console.error(`Failed to trigger ${type} notification:`, err);
  }
}

// GET /api/orders/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
      include: { items: true, user: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.user) {
      const { password: _, ...userWithoutPassword } = order.user;
      return NextResponse.json({
        success: true,
        order: { ...order, user: userWithoutPassword },
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.order.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.status !== undefined) {
      const oldStatus = existing.status;
      const newStatus = body.status;
      updateData.status = newStatus;

      if (newStatus === 'validated' && !existing.orderConfirmedAt) {
        updateData.orderConfirmedAt = new Date();
      }

      if (newStatus === 'shipped' && !existing.shippedAt) {
        updateData.shippedAt = new Date();
      }

      if (newStatus === 'delivered' && !existing.deliveredAt) {
        updateData.deliveredAt = new Date();
      }

      // Auto-trigger notifications on status transitions
      if (newStatus === 'validated' && oldStatus !== 'validated') {
        // Fire async — don't block the response
        triggerNotification('order_confirmed', id);
      }

      if (newStatus === 'shipped' && oldStatus !== 'shipped') {
        triggerNotification('order_shipped', id);
      }

      if (newStatus === 'delivered' && oldStatus !== 'delivered') {
        triggerNotification('order_delivered', id);
      }

      if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
        triggerNotification('order_cancelled', id);
      }
    }

    if (body.trackingNumber !== undefined) {
      updateData.trackingNumber = body.trackingNumber;
    }

    if (body.trackingUrl !== undefined) {
      updateData.trackingUrl = body.trackingUrl;
    }

    if (body.shippingCarrier !== undefined) {
      updateData.shippingCarrier = body.shippingCarrier;
    }

    if (body.paymentStatus !== undefined) {
      updateData.paymentStatus = body.paymentStatus;
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const order = await db.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.order.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    await db.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
