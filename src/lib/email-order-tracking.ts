// ============================================================
// CHIC GLAM BY EVA — Order Tracking Email with Account Credentials
// Sent after checkout: includes order confirmation + tracking link
// + auto-generated account credentials if a new account was created.
// ============================================================

import {
  type OrderData,
  type CustomerData,
  buildBaseHTML,
  buildItemsTable,
  buildTotals,
  buildCTAButton,
} from '@/lib/email-templates';

interface AccountCredentials {
  email: string;
  password: string;
}

/**
 * Generates an order tracking + confirmation email HTML.
 * If a new account was created, includes the credentials section.
 */
export function orderTrackingWithAccountEmail(
  order: OrderData,
  customer: CustomerData,
  accountCreated: boolean,
  credentials: AccountCredentials | null
): string {
  // Account credentials section (only shown when a new account was created)
  const credentialsSection = accountCreated && credentials
    ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;background:#f9f6ef;border:1px solid #D4AF37;border-radius:8px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:1px;color:#D4AF37;text-transform:uppercase;">&#128274; Votre nouveau compte</p>
          <p style="margin:0 0 12px;font-size:13px;color:#666666;line-height:1.6;">
            Un compte a &eacute;t&eacute; automatiquement cr&eacute;&eacute; pour vous. Voici vos identifiants de connexion :
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:6px;overflow:hidden;">
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;">
                <p style="margin:0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.5px;">E-mail</p>
                <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#1a1a1a;">${credentials.email}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 16px;">
                <p style="margin:0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.5px;">Mot de passe</p>
                <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#1a1a1a;letter-spacing:2px;">${credentials.password}</p>
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0;font-size:11px;color:#999999;line-height:1.5;">
            Nous vous recommandons de changer votre mot de passe apr&egrave;s votre premi&egrave;re connexion pour plus de s&eacute;curit&eacute;.
          </p>
        </td>
      </tr>
    </table>`
    : '';

  const body = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a1a;">Bonjour ${customer.name},</p>
    <p style="margin:0 0 4px;font-size:16px;color:#333333;">Merci pour votre commande ! Nous la pr&eacute;parons avec soin.</p>

    <!-- Order number card -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
      <tr>
        <td style="background:#f9f6ef;border:1px solid #D4AF37;border-radius:8px;padding:14px 20px;">
          <p style="margin:0;font-size:13px;color:#888888;">Num&eacute;ro de commande</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#1a1a1a;letter-spacing:1px;">${order.orderNumber}</p>
        </td>
      </tr>
    </table>

    <!-- Tracking link -->
    <p style="margin:0 0 0;font-size:14px;color:#666666;line-height:1.6;">
      Vous pouvez suivre l&rsquo;&eacute;tat de votre commande &agrave; tout moment en cliquant sur le bouton ci-dessous.
    </p>

    ${buildCTAButton('Suivre ma commande', `https://chicglambyeva.com/order-tracking/${order.orderNumber}`)}

    <!-- Account credentials (only if new account) -->
    ${credentialsSection}

    <!-- Order details -->
    ${buildItemsTable(order.items)}
    ${buildTotals(order)}

    ${buildCTAButton('Voir mes commandes', 'https://chicglambyeva.com/order-tracking')}

    <p style="margin:24px 0 0;font-size:13px;color:#999999;text-align:center;">
      &mdash; &Agrave; tr&egrave;s bient&ocirc;t sur <a href="https://chicglambyeva.com" style="color:#D4AF37;text-decoration:none;">CHIC GLAM BY EVA</a> &mdash;
    </p>
  `;

  return buildBaseHTML(`Commande ${order.orderNumber} — Suivi`, body);
}
