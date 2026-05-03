import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/maintenance — returns maintenance status (public, no auth needed)
export async function GET() {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: 'main' },
      select: {
        maintenanceMode: true,
        maintenanceMessage: true,
        maintenanceEnd: true,
      },
    });

    return NextResponse.json({
      maintenanceMode: settings?.maintenanceMode ?? false,
      maintenanceMessage: settings?.maintenanceMessage ?? 'Nous effectuons une mise à jour. Revenez bientôt !',
      maintenanceEnd: settings?.maintenanceEnd ?? null,
    });
  } catch (error) {
    console.error('Maintenance GET error:', error);
    return NextResponse.json({ maintenanceMode: false }, { status: 500 });
  }
}
