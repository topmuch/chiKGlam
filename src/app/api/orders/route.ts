import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const orders = await db.order.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        items: true,
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const orderNumber = 'CG-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

    const order = await db.order.create({
      data: {
        orderNumber,
        userId: body.userId,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        shippingAddress: body.shippingAddress,
        billingAddress: body.billingAddress,
        subtotal: body.subtotal,
        shippingCost: body.shippingCost || 0,
        tax: body.tax || 0,
        total: body.total,
        status: body.status || 'processing',
        paymentMethod: body.paymentMethod,
        paymentId: body.paymentId,
        paymentStatus: body.paymentStatus || 'pending',
        notes: body.notes,
        items: {
          create: (body.items || []).map((item: {
            productId: string;
            productName: string;
            productImage: string;
            brand: string;
            price: number;
            quantity: number;
          }) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            brand: item.brand || '',
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
