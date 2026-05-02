import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (action === 'login') {
      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      if (user.isActive === false) {
        return NextResponse.json(
          { success: false, error: 'Account is deactivated' },
          { status: 403 }
        );
      }

      // Simple plain text password comparison
      if (user.password !== password) {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 401 }
        );
      }

      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({ success: true, user: userWithoutPassword });
    }

    if (action === 'register') {
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 409 }
        );
      }

      const user = await db.user.create({
        data: {
          email,
          password,
          name: name || null,
          phone: phone || null,
          role: 'customer',
        },
      });

      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "login" or "register"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
