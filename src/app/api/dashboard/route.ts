import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/dashboard - Admin dashboard stats
export async function GET() {
  try {
    const [
      totalOrders,
      deliveredOrders,
      activeProducts,
      totalProducts,
      customerUsers,
      totalUsers,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      // Total orders
      db.order.count(),
      // Delivered orders for revenue
      db.order.findMany({ where: { status: 'delivered' } }),
      // Active products
      db.product.count({ where: { isActive: true } }),
      // Total products
      db.product.count(),
      // Customer users
      db.user.count({ where: { role: 'customer' } }),
      // Total users
      db.user.count(),
      // Recent 5 orders
      db.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: true },
      }),
      // Low stock products (stock < 10)
      db.product.findMany({
        where: { stockCount: { lt: 10 }, isActive: true },
        orderBy: { stockCount: 'asc' },
        take: 10,
      }),
    ]);

    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);

    // Order status breakdown
    const statusBreakdown = await db.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        activeProducts,
        totalProducts,
        totalCustomers: customerUsers,
        totalUsers,
      },
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s.status,
        count: s._count.status,
      })),
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error('Dashboard GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
