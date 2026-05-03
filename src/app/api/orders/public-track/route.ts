import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/orders/public-track?orderNumber=CGE-2025-0001&email=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    if (!orderNumber || !orderNumber.trim()) {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {
      orderNumber: orderNumber.trim(),
    };

    // If email is provided, verify it matches
    if (email && email.trim()) {
      where.customerEmail = email.trim().toLowerCase();
    }

    const order = await db.order.findFirst({
      where,
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Aucune commande trouvée avec ce numéro' },
        { status: 404 }
      );
    }

    // Build tracking URL if not set
    let trackingUrl = order.trackingUrl;
    if (!trackingUrl && order.trackingNumber && order.shippingCarrier) {
      const code = order.trackingNumber;
      const carrier = order.shippingCarrier.toLowerCase();
      if (carrier === 'colissimo') {
        trackingUrl = `https://www.colissimo.fr/transport-suivi-page?lang=fr_FR&trackingNumber=${code}`;
      } else if (carrier === 'chronopost') {
        trackingUrl = `https://www.chronopost.fr/tracking-cgi?listeNumeroBT=${code}&lang=fr`;
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        status: order.status,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        tax: order.tax,
        total: order.total,
        shippingCarrier: order.shippingCarrier,
        trackingNumber: order.trackingNumber,
        trackingUrl: trackingUrl,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        orderConfirmedAt: order.orderConfirmedAt,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.productName,
          productImage: item.productImage,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        })),
      },
    });
  } catch (error) {
    console.error('Public track GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
