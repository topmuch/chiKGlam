import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email-sender';
import {
  orderConfirmationEmail,
  orderShippedEmail,
  orderDeliveredEmail,
  orderCancelledEmail,
  type OrderData,
  type CustomerData,
} from '@/lib/email-templates';

// ===== HELPERS =====

/**
 * Convert a database order (with items) into the OrderData shape
 * expected by email templates.
 */
function buildOrderData(order: {
  orderNumber: string;
  items: {
    productName: string;
    brand: string;
    quantity: number;
    price: number;
    total: number;
    productImage: string;
  }[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippingCarrier: string | null;
}): OrderData {
  return {
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
    trackingNumber: order.trackingNumber ?? undefined,
    trackingUrl: order.trackingUrl ?? undefined,
    shippingCarrier: order.shippingCarrier ?? undefined,
  };
}

function buildCustomerData(order: {
  customerName: string;
  customerEmail: string;
}): CustomerData {
  return {
    name: order.customerName,
    email: order.customerEmail,
  };
}

// ===== SEND NOTIFICATION =====

async function sendNotification(type: string, orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  const orderData = buildOrderData(order);
  const customerData = buildCustomerData(order);

  let subject: string;
  let htmlEmail: string;

  switch (type) {
    case 'order_confirmed':
      subject = `Commande confirmée : ${order.orderNumber} — ChicGlambyEva`;
      htmlEmail = orderConfirmationEmail(orderData, customerData);
      await db.order.update({
        where: { id: orderId },
        data: { orderConfirmedAt: new Date() },
      });
      break;

    case 'order_shipped':
      subject = `Votre commande ${order.orderNumber} a été expédiée ! — ChicGlambyEva`;
      htmlEmail = orderShippedEmail(orderData, customerData);
      await db.order.update({
        where: { id: orderId },
        data: { orderShippedAt: new Date() },
      });
      break;

    case 'order_delivered':
      subject = `Commande livrée : ${order.orderNumber} — ChicGlambyEva`;
      htmlEmail = orderDeliveredEmail(orderData, customerData);
      await db.order.update({
        where: { id: orderId },
        data: { orderDeliveredAt: new Date() },
      });
      break;

    case 'order_cancelled':
      subject = `Commande annulée : ${order.orderNumber} — ChicGlambyEva`;
      htmlEmail = orderCancelledEmail(orderData, customerData);
      break;

    default:
      throw new Error(`Unknown notification type: ${type}`);
  }

  // Send the real email via nodemailer
  const emailResult = await sendEmail(order.customerEmail, subject, htmlEmail);

  if (!emailResult.success) {
    console.error(`[Notify] Email failed for ${type} / ${order.orderNumber}: ${emailResult.error}`);
  }

  return {
    type,
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerEmail: order.customerEmail,
    subject,
    emailSent: emailResult.success,
    emailError: emailResult.error,
    sentAt: new Date().toISOString(),
  };
}

// ===== POST /api/notify =====

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, orderId } = body;

    if (!type || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Type and orderId are required' },
        { status: 400 }
      );
    }

    const VALID_TYPES = [
      'order_confirmed',
      'order_shipped',
      'order_delivered',
      'order_cancelled',
    ];
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid notification type. Must be one of: ${VALID_TYPES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const result = await sendNotification(type, orderId);

    return NextResponse.json({
      success: true,
      message: `Notification ${type} processed for order ${result.orderNumber}`,
      details: result,
    });
  } catch (error) {
    console.error('Notify POST error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to send notification' },
      { status: 500 }
    );
  }
}
