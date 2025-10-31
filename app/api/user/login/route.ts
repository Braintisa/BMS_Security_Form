import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email en wachtwoord zijn vereist' }, { status: 400 });
    }

    const [rows] = await pool.query(
      'SELECT id, email, password_hash, name FROM users WHERE email = ? LIMIT 1',
      [email]
    ) as any[];

    const user = (rows as any)[0];
    if (!user) {
      return NextResponse.json({ error: 'Ongeldige inloggegevens' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: 'Ongeldige inloggegevens' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';
    const token = jwt.sign({ uid: user.id, email: user.email, name: user.name }, jwtSecret, { expiresIn: '7d' });

    return NextResponse.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


