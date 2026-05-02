import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { sendEmail } from '@/lib/email-sender';
import { orderTrackingWithAccountEmail } from '@/lib/email-order-tracking';
import { orderConfirmationEmail, type OrderData, type CustomerData } from '@/lib/email-templates';

// GET /api/orders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const where: Prisma.OrderWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, limit });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerName, customerEmail, customerPhone, shippingAddress, billingAddress, paymentMethod, paymentStatus, status, notes, userId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order items are required' },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Customer name, email, and shipping address are required' },
        { status: 400 }
      );
    }

    // Fetch existing products from DB
    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems: {
      productId: string;
      productName: string;
      productImage: string;
      brand: string;
      price: number;
      quantity: number;
      total: number;
    }[] = [];

    // Ensure all products exist in DB (create missing ones from cart data)
    for (const item of items) {
      const { productId, quantity, productName, productImage, brand, price } = item as {
        productId: string;
        quantity: number;
        productName?: string;
        productImage?: string;
        brand?: string;
        price?: number;
      };

      let product = productMap.get(productId);

      // If product not found in DB, create it from cart data
      if (!product) {
        const slug = (productName || 'product')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') + '-' + productId.slice(0, 6);

        product = await db.product.create({
          data: {
            id: productId,
            name: productName || `Produit ${productId.slice(0, 8)}`,
            slug: slug,
            brand: brand || 'Unknown',
            price: price || 0,
            image: productImage || '',
            images: JSON.stringify(productImage ? [productImage] : []),
            category: 'Skincare',
            subcategory: 'Other',
            description: productName || `Produit ${productId.slice(0, 8)}`,
            tags: '[]',
            inStock: true,
            stockCount: 100,
            sku: 'CGE-' + productId.slice(0, 6).toUpperCase(),
          },
        });
      }

      const itemPrice = product.price;
      const itemTotal = itemPrice * quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        brand: product.brand,
        price: itemPrice,
        quantity,
        total: itemTotal,
      });
    }

    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.2;
    const total = subtotal + shippingCost + tax;

    // Generate order number: CGE-YYYY-0001
    const year = new Date().getFullYear();
    const orderCount = await db.order.count();
    const paddedNumber = String(orderCount + 1).padStart(4, '0');
    const orderNumber = `CGE-${year}-${paddedNumber}`;

    // --- Auto-create or link customer account ---
    let accountCreated = false;
    let generatedPassword = '';
    let linkedUserId = userId || null;

    const existingUser = await db.user.findUnique({ where: { email: customerEmail } });

    if (existingUser) {
      // Link order to existing user
      linkedUserId = existingUser.id;
    } else {
      // Create a new customer account with a random password
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      generatedPassword = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

      const newUser = await db.user.create({
        data: {
          email: customerEmail,
          password: generatedPassword,
          name: customerName,
          phone: customerPhone || '',
          role: 'customer',
          isActive: true,
        },
      });

      linkedUserId = newUser.id;
      accountCreated = true;
    }

    const order = await db.order.create({
      data: {
        orderNumber,
        userId: linkedUserId,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
        billingAddress: billingAddress ? (typeof billingAddress === 'string' ? billingAddress : JSON.stringify(billingAddress)) : null,
        paymentMethod: paymentMethod || 'card',
        paymentStatus: paymentStatus || 'pending',
        status: status || 'processing',
        notes: notes || null,
        subtotal,
        shippingCost,
        tax,
        total,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    // --- Send order tracking email with account credentials (if new account) ---
    (async () => {
      try {
        const trackingHtml = orderTrackingWithAccountEmail(
          {
            orderNumber: order.orderNumber,
            items: order.items.map((item) => ({
              productName: item.productName,
              brand: item.brand,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
              image: item.productImage,
            })),
            subtotal: order.subtotal,
            shippingCost: order.shippingCost,
            tax: order.tax,
            total: order.total,
          },
          { name: customerName, email: customerEmail },
          accountCreated,
          accountCreated ? { email: customerEmail, password: generatedPassword } : null
        );

        await sendEmail(
          customerEmail,
          `Votre commande ${order.orderNumber} — Chic Glam by Eva`,
          trackingHtml
        );

        // Also send standard confirmation email for backward compat
        const templateOrderData: OrderData = {
          orderNumber: order.orderNumber,
          items: order.items.map((item) => ({
            productName: item.productName,
            brand: item.brand,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            image: item.productImage,
          })),
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          tax: order.tax,
          total: order.total,
        };
        const templateCustomerData: CustomerData = {
          name: order.customerName,
          email: order.customerEmail,
        };

        await sendEmail(
          order.customerEmail,
          `Commande confirmée : ${order.orderNumber} — ChicGlambyEva`,
          orderConfirmationEmail(templateOrderData, templateCustomerData)
        );

        await db.order.update({
          where: { id: order.id },
          data: { orderConfirmedAt: new Date() },
        });
      } catch (err) {
        console.error('[Orders POST] Failed to send order emails:', err);
      }
    })();

    return NextResponse.json(
      {
        success: true,
        order,
        accountCreated,
        generatedPassword: accountCreated ? generatedPassword : undefined,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Orders POST error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
