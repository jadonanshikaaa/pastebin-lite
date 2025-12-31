import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';

const createPasteSchema = z.object({
  content: z.string().min(1, 'Content is required and must be non-empty'),
  ttl_seconds: z.number().int().min(1).optional(),
  max_views: z.number().int().min(1).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createPasteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues.map(i => i.message).join(', ') }, { status: 400 });
    }

    const { content, ttl_seconds, max_views } = validation.data;

    const now = new Date();
    const expiresAt = ttl_seconds ? new Date(now.getTime() + ttl_seconds * 1000) : null;

    const paste = await prisma.paste.create({
      data: {
        content,
        expiresAt,
        maxViews: max_views,
        viewCount: 0,
      },
    });

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const url = `${baseUrl}/p/${paste.id}`;

    return NextResponse.json({ id: paste.id, url });
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}