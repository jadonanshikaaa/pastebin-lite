import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Simple query to check database connection
    await prisma.paste.count();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}