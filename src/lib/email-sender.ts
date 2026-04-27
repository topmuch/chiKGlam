// ============================================================
// CHIC GLAM BY EVA — Email Sender (nodemailer + SMTP)
// Reads SMTP config from SiteSettings in the database.
// Gracefully degrades: if SMTP is not configured, logs a
// warning and returns success so order flow is never blocked.
// ============================================================

import nodemailer from 'nodemailer';
import { db } from '@/lib/db';

const FROM_NAME = 'ChicGlambyEva';
const FROM_EMAIL = 'noreply@chicglambyeva.com';

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

interface SendResult {
  success: boolean;
  error?: string;
}

/**
 * Read SMTP configuration from SiteSettings in the database.
 * Returns null if no valid SMTP configuration is set.
 */
async function getSmtpConfig(): Promise<SmtpConfig | null> {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: 'main' },
      select: {
        smtpHost: true,
        smtpPort: true,
        smtpUser: true,
        smtpPass: true,
      },
    });

    if (!settings) return null;

    const { smtpHost, smtpPort, smtpUser, smtpPass } = settings;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      return null;
    }

    return {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
    };
  } catch (error) {
    console.error('[EmailSender] Failed to read SMTP config from DB:', error);
    return null;
  }
}

/**
 * Send an email using SMTP configured in SiteSettings.
 * If SMTP is not configured, logs a warning and returns success.
 * Never throws — errors are caught and returned gracefully.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<SendResult> {
  const smtpConfig = await getSmtpConfig();

  if (!smtpConfig) {
    console.warn(
      '[EmailSender] SMTP not configured — skipping email send. ' +
      `To: ${to}, Subject: ${subject}`
    );
    return { success: true }; // Don't block order flow
  }

  try {
    const transport = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465, // TLS for port 465, STARTTLS otherwise
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    const info = await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log(`[EmailSender] Email sent successfully to ${to}: ${info.messageId}`);
    transport.close();

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[EmailSender] Failed to send email to ${to}:`, message);
    return { success: false, error: message };
  }
}
