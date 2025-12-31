import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Get current time, considering TEST_MODE
    const testMode = process.env.TEST_MODE === '1';
    const testNowMs = request.headers.get('x-test-now-ms');
    const now = testMode && testNowMs ? new Date(parseInt(testNowMs)) : new Date();

    // Fetch the paste
    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    // Check expiry
    if (paste.expiresAt && now > paste.expiresAt) {
      return NextResponse.json({ error: 'Paste expired' }, { status: 404 });
    }

    // Check view limit
    if (paste.maxViews && paste.viewCount >= paste.maxViews) {
      return NextResponse.json({ error: 'View limit exceeded' }, { status: 404 });
    }

    // Calculate remaining views
    const remainingViews = paste.maxViews ? paste.maxViews - paste.viewCount - 1 : null;

    // Increment view count atomically
    await prisma.paste.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt?.toISOString() || null,
    });
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}