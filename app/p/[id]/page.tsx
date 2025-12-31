import { notFound } from 'next/navigation';
import prisma from '@/lib/db';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;

  try {
    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1210] to-black text-white flex items-center justify-center">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl font-semibold mb-4 text-red-400">Paste Not Found</h1>
            <p className="text-white/60">The requested paste does not exist.</p>
          </div>
        </div>
      );
    }

    const now = new Date();

    if (paste.expiresAt && now > paste.expiresAt) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1210] to-black text-white flex items-center justify-center">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl font-semibold mb-4 text-red-400">Paste Expired</h1>
            <p className="text-white/60">This paste has expired and is no longer available.</p>
          </div>
        </div>
      );
    }

    if (paste.maxViews && paste.viewCount >= paste.maxViews) {
      return (
        <div className="min-h-screen bg-linear-to-br from-black via-[#0b1210] to-black text-white flex items-center justify-center">
          <div className="max-w-5xl mx-auto font-sans text-center">
            <h1 className="text-4xl font-semibold mb-4 text-white">View Limit Exceeded</h1>
            <p className="text-white/60">This paste has reached its maximum view limit.</p>
          </div>
        </div>
      );
    }

    await prisma.paste.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1210] to-black text-white px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-semibold mb-8">
            Paste <span className="text-[#14F195]">Content</span>
          </h1>

          {/* Glass container */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-6">
              <span>
                Views:{' '}
                <span className="text-white">
                  {paste.viewCount + 1}
                </span>
              </span>

              {paste.maxViews && (
                <span>
                  Max Views:{' '}
                  <span className="text-white">
                    {paste.maxViews}
                  </span>
                </span>
              )}

              {paste.expiresAt && (
                <span>
                  Expires:{' '}
                  <span className="text-white">
                    {paste.expiresAt.toLocaleString()}
                  </span>
                </span>
              )}
            </div>

            {/* Paste content */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 sm:p-6 overflow-x-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-white/90">
                {paste.content}
              </pre>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-10">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#14F195] transition"
            >
              ← Create a new paste
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching paste:', error);
    notFound();
  }
}
