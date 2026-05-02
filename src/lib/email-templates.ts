// ============================================================
// CHIC GLAM BY EVA — Email Templates (French)
// Luxury beauty e-commerce brand: black / gold / white
// ============================================================

export interface OrderItem {
  productName: string;
  brand?: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

export interface OrderData {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingCarrier?: string;
}

export interface CustomerData {
  name: string;
  email: string;
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function buildBaseHTML(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f7f7f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Preheader -->
  <div style="display:none;font-size:1px;color:#f7f7f7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    CHIC GLAM BY EVA — ${title}
  </div>
  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <!-- Container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%);padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:4px;color:#D4AF37;font-family:'Georgia','Times New Roman',serif;">CHIC GLAM BY EVA</h1>
              <p style="margin:6px 0 0;font-size:11px;letter-spacing:3px;color:#999999;text-transform:uppercase;">Beauty &bull; Elegance &bull; Luxury</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#0a0a0a;padding:24px 32px;text-align:center;border-radius:0 0 12px 12px;">
              <p style="margin:0;font-size:12px;color:#D4AF37;letter-spacing:2px;font-family:'Georgia','Times New Roman',serif;">CHIC GLAM BY EVA</p>
              <p style="margin:8px 0 0;font-size:11px;color:#888888;">Merci de votre confiance. &bull; Retrouvez-nous sur <a href="https://chicglambyeva.com" style="color:#D4AF37;text-decoration:none;">chicglambyeva.com</a></p>
              <p style="margin:6px 0 0;font-size:10px;color:#666666;">&copy; ${new Date().getFullYear()} ChicGlambyEva. Tous droits r&eacute;serv&eacute;s.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildItemsTable(items: OrderItem[]): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right:12px;">
                <img src="${item.image || ''}" alt="${item.productName}" width="56" height="56" style="border-radius:8px;object-fit:cover;background:#f5f5f5;" onerror="this.style.display='none'" />
              </td>
              <td>
                <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a1a;">${item.productName}</p>
                ${item.brand ? `<p style="margin:2px 0 0;font-size:12px;color:#888888;">${item.brand}</p>` : ''}
                <p style="margin:2px 0 0;font-size:12px;color:#999999;">Qt&eacute; : ${item.quantity} &times; ${formatEur(item.price)}</p>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:right;vertical-align:top;">
          <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a1a;">${formatEur(item.total)}</p>
        </td>
      </tr>`
    )
    .join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
      <tr>
        <td style="padding-bottom:8px;border-bottom:2px solid #D4AF37;">
          <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:1px;color:#D4AF37;text-transform:uppercase;">D&eacute;tail de votre commande</p>
        </td>
        <td></td>
      </tr>
      ${rows}
    </table>`;
}

export function buildTotals(order: OrderData): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
      <tr>
        <td style="padding:8px 0;font-size:14px;color:#666666;">Sous-total</td>
        <td style="padding:8px 0;font-size:14px;color:#1a1a1a;text-align:right;">${formatEur(order.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:14px;color:#666666;">Livraison</td>
        <td style="padding:8px 0;font-size:14px;color:#1a1a1a;text-align:right;">${order.shippingCost === 0 ? 'Gratuite' : formatEur(order.shippingCost)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:14px;color:#666666;">TVA (20%)</td>
        <td style="padding:8px 0;font-size:14px;color:#1a1a1a;text-align:right;">${formatEur(order.tax)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;border-top:2px solid #1a1a1a;font-size:16px;font-weight:700;color:#1a1a1a;">Total</td>
        <td style="padding:12px 0 0;border-top:2px solid #1a1a1a;font-size:16px;font-weight:700;color:#D4AF37;text-align:right;">${formatEur(order.total)}</td>
      </tr>
    </table>`;
}

export function buildCTAButton(label: string, url: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px auto 0;">
      <tr>
        <td align="center" style="border-radius:8px;background:linear-gradient(135deg,#D4AF37 0%,#C5A028 100%);">
          <a href="${url}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:14px;font-weight:600;color:#0a0a0a;text-decoration:none;letter-spacing:1px;border-radius:8px;">${label}</a>
        </td>
      </tr>
    </table>`;
}

// ============================================================
// 1. Order Confirmation
// ============================================================

export function orderConfirmationEmail(order: OrderData, customer: CustomerData): string {
  const body = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a1a;">Bonjour ${customer.name},</p>
    <p style="margin:0 0 4px;font-size:16px;color:#333333;">Nous avons le plaisir de vous confirmer votre commande.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
      <tr>
        <td style="background:#f9f6ef;border:1px solid #D4AF37;border-radius:8px;padding:14px 20px;">
          <p style="margin:0;font-size:13px;color:#888888;">Num&eacute;ro de commande</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#1a1a1a;letter-spacing:1px;">${order.orderNumber}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 0;font-size:14px;color:#666666;line-height:1.6;">Votre commande est en cours de pr&eacute;paration avec soin. Vous recevrez une notification d&egrave;s qu'elle sera exp&eacute;di&eacute;e.</p>
    ${buildItemsTable(order.items)}
    ${buildTotals(order)}
    ${buildCTAButton('Voir ma commande', `https://chicglambyeva.com/order/${order.orderNumber}`)}
  `;
  return buildBaseHTML('Commande confirmée', body);
}

// ============================================================
// 2. Order In Progress
// ============================================================

export function orderInProgressEmail(order: OrderData, customer: CustomerData): string {
  const body = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a1a;">Bonjour ${customer.name},</p>
    <p style="margin:0 0 4px;font-size:16px;color:#333333;">Votre commande est en cours de pr&eacute;paration !</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
      <tr>
        <td style="background:#f9f6ef;border:1px solid #D4AF37;border-radius:8px;padding:14px 20px;">
          <p style="margin:0;font-size:13px;color:#888888;">Num&eacute;ro de commande</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#1a1a1a;letter-spacing:1px;">${order.orderNumber}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 0;font-size:14px;color:#666666;line-height:1.6;">Notre &eacute;quipe pr&eacute;pare vos articles avec le plus grand soin. Vous recevrez un e-mail de confirmation d&rsquo;exp&eacute;dition avec le num&eacute;ro de suivi d&egrave;s que votre colis sera remis au transporteur.</p>
    ${buildItemsTable(order.items)}
    ${buildTotals(order)}
    ${buildCTAButton('Voir ma commande', `https://chicglambyeva.com/order/${order.orderNumber}`)}
  `;
  return buildBaseHTML('Commande en cours de préparation', body);
}

// ============================================================
// 3. Order Shipped
// ============================================================

export function orderShippedEmail(order: OrderData, customer: CustomerData): string {
  const trackingSection = order.trackingNumber
    ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;background:#f9f6ef;border:1px solid #D4AF37;border-radius:8px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:1px;color:#D4AF37;text-transform:uppercase;">Suivi de livraison</p>
          <p style="margin:0;font-size:14px;color:#1a1a1a;">
            <strong>Transporteur :</strong> ${order.shippingCarrier || 'Non sp&eacute;cifi&eacute;'}<br />
            <strong>Num&eacute;ro de suivi :</strong> ${order.trackingNumber}
          </p>
          ${order.trackingUrl ? `
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
              <tr>
                <td align="center" style="border-radius:6px;background:linear-gradient(135deg,#D4AF37 0%,#C5A028 100%);">
                  <a href="${order.trackingUrl}" target="_blank" style="display:inline-block;padding:10px 24px;font-size:13px;font-weight:600;color:#0a0a0a;text-decoration:none;border-radius:6px;">Suivre mon colis</a>
                </td>
              </tr>
            </table>
          ` : ''}
        </td>
      </tr>
    </table>`
    : '';

  const body = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a1a;">Bonjour ${customer.name},</p>
    <p style="margin:0 0 4px;font-size:16px;color:#333333;">Votre commande a &eacute;t&eacute; exp&eacute;di&eacute;e ! &nbsp;&#127881;</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
      <tr>
        <td style="background:#f9f6ef;border:1px solid #D4AF37;border-radius:8px;padding:14px 20px;">
          <p style="margin:0;font-size:13px;color:#888888;">Num&eacute;ro de commande</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#1a1a1a;letter-spacing:1px;">${order.orderNumber}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 0;font-size:14px;color:#666666;line-height:1.6;">Votre colis est en route vers vous. Vous pouvez suivre sa progression en utilisant les informations ci-dessous.</p>
    ${trackingSection}
    ${buildItemsTable(order.items)}
    ${buildTotals(order)}
    ${buildCTAButton('Voir ma commande', `https://chicglambyeva.com/order/${order.orderNumber}`)}
  `;
  return buildBaseHTML('Commande expédiée', body);
}

// ============================================================
// 4. Order Delivered
// ============================================================

export function orderDeliveredEmail(order: OrderData, customer: CustomerData): string {
  const body = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a1a;">Bonjour ${customer.name},</p>
    <p style="margin:0 0 4px;font-size:16px;color:#333333;">Votre commande a &eacute;t&eacute; livr&eacute;e ! &nbsp;&#10024;</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
      <tr>
        <td style="background:#f9f6ef;border:1px solid #D4AF37;border-radius:8px;padding:14px 20px;">
          <p style="margin:0;font-size:13px;color:#888888;">Num&eacute;ro de commande</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#1a1a1a;letter-spacing:1px;">${order.orderNumber}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 0;font-size:14px;color:#666666;line-height:1.6;">Nous esp&eacute;rons que vos produits vous donnent enti&egrave;re satisfaction ! N&rsquo;h&eacute;sitez pas &agrave; partager votre exp&eacute;rience en laissant un avis sur notre site.</p>
    ${buildItemsTable(order.items)}
    ${buildTotals(order)}
    ${buildCTAButton('Voir ma commande', `https://chicglambyeva.com/order/${order.orderNumber}`)}
    <p style="margin:24px 0 0;font-size:13px;color:#999999;text-align:center;">&mdash; &Agrave; tr&egrave;s bient&ocirc;t sur <a href="https://chicglambyeva.com" style="color:#D4AF37;text-decoration:none;">CHIC GLAM BY EVA</a> &mdash;</p>
  `;
  return buildBaseHTML('Commande livrée', body);
}

// ============================================================
// 5. Order Cancelled
// ============================================================

export function orderCancelledEmail(order: OrderData, customer: CustomerData): string {
  const body = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a1a;">Bonjour ${customer.name},</p>
    <p style="margin:0 0 4px;font-size:16px;color:#333333;">Votre commande a &eacute;t&eacute; annul&eacute;e.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
      <tr>
        <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px 20px;">
          <p style="margin:0;font-size:13px;color:#888888;">Num&eacute;ro de commande</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#1a1a1a;letter-spacing:1px;">${order.orderNumber}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 0;font-size:14px;color:#666666;line-height:1.6;">Conform&eacute;ment &agrave; votre demande, votre commande a &eacute;t&eacute; annul&eacute;e. Si un remboursement est applicable, il sera trait&eacute; sous 5 &agrave; 10 jours ouvrables.</p>
    <p style="margin:12px 0 0;font-size:14px;color:#666666;line-height:1.6;">Si vous avez des questions, n&rsquo;h&eacute;sitez pas &agrave; contacter notre service client.</p>
    ${buildItemsTable(order.items)}
    ${buildTotals(order)}
    ${buildCTAButton('Contacter le service client', 'https://chicglambyeva.com/contact')}
  `;
  return buildBaseHTML('Commande annulée', body);
}

// ============================================================
// Template Registry (for API use)
// ============================================================

export const EMAIL_TEMPLATES = [
  { key: 'orderConfirmation', label: 'Commande confirmée', fn: orderConfirmationEmail },
  { key: 'orderInProgress', label: 'Commande en cours de préparation', fn: orderInProgressEmail },
  { key: 'orderShipped', label: 'Commande expédiée', fn: orderShippedEmail },
  { key: 'orderDelivered', label: 'Commande livrée', fn: orderDeliveredEmail },
  { key: 'orderCancelled', label: 'Commande annulée', fn: orderCancelledEmail },
] as const;

export type EmailTemplateKey = (typeof EMAIL_TEMPLATES)[number]['key'];
