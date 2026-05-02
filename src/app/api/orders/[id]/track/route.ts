import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/orders/[id]/track
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
      select: {
        shippingCarrier: true,
        trackingNumber: true,
        trackingUrl: true,
        status: true,
        shippedAt: true,
        deliveredAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    let trackingUrl = order.trackingUrl;

    // Auto-generate tracking URL based on carrier
    if (!trackingUrl && order.trackingNumber && order.shippingCarrier) {
      const code = order.trackingNumber;
      const carrier = order.shippingCarrier.toLowerCase();

      if (carrier === 'colissimo') {
        trackingUrl = `https://www.colissimo.fr/portal/page/redirect?trackingNumber=${code}`;
      } else if (carrier === 'chronopost') {
        trackingUrl = `https://www.chronopost.fr/tracking-no-cms/suivi-page?lang=en&listNumber=${code}`;
      }
    }

    return NextResponse.json({
      success: true,
      tracking: {
        carrier: order.shippingCarrier || null,
        trackingNumber: order.trackingNumber || null,
        trackingUrl: trackingUrl || null,
        status: order.status,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
      },
    });
  } catch (error) {
    console.error('Order track GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tracking info' },
      { status: 500 }
    );
  }
}
