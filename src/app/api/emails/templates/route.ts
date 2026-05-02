import { NextRequest, NextResponse } from 'next/server';
import { EMAIL_TEMPLATES, type EmailTemplateKey } from '@/lib/email-templates';

// ============================================================
// GET /api/emails/templates — List available email templates
// ============================================================

export async function GET() {
  const templates = EMAIL_TEMPLATES.map((t) => ({
    key: t.key,
    label: t.label,
  }));

  return NextResponse.json({
    success: true,
    templates,
  });
}

// ============================================================
// POST /api/emails/templates — Generate a template preview
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateKey } = body;

    if (!templateKey) {
      return NextResponse.json(
        { success: false, error: 'templateKey is required' },
        { status: 400 }
      );
    }

    const tmpl = EMAIL_TEMPLATES.find((t) => t.key === templateKey) as
      | (typeof EMAIL_TEMPLATES)[number]
      | undefined;

    if (!tmpl) {
      return NextResponse.json(
        { success: false, error: `Unknown template: ${templateKey}` },
        { status: 404 }
      );
    }

    // Build sample data for preview
    const sampleOrder = {
      orderNumber: 'CGE-2025-001',
      items: [
        {
          productName: 'Fenty Beauty Gloss Bomb',
          brand: 'Fenty Beauty',
          quantity: 1,
          price: 22.0,
          total: 22.0,
          image: '/images/products/fenty-gloss-bomb.png',
        },
        {
          productName: 'Charlotte Tilbury Pillow Talk',
          brand: 'Charlotte Tilbury',
          quantity: 2,
          price: 35.0,
          total: 70.0,
          image: '/images/products/ct-lipstick.png',
        },
      ],
      subtotal: 92.0,
      shippingCost: 0,
      tax: 18.4,
      total: 110.4,
      trackingNumber: body.includeTracking ? '1Z999AA10123456784' : undefined,
      trackingUrl: body.includeTracking
        ? 'https://www.colissimo.fr/portal/page/redirect?trackingNumber=1Z999AA10123456784'
        : undefined,
      shippingCarrier: body.includeTracking ? 'Colissimo' : undefined,
    };

    const sampleCustomer = {
      name: 'Eva Dupont',
      email: 'eva@example.com',
    };

    const html = tmpl.fn(sampleOrder, sampleCustomer);

    return NextResponse.json({
      success: true,
      templateKey,
      label: tmpl.label,
      html,
    });
  } catch (error) {
    console.error('Email template preview error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate template preview' },
      { status: 500 }
    );
  }
}
