"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUrl("");
    setLoading(true);

    const body: any = { content };
    if (ttl) body.ttl_seconds = parseInt(ttl);
    if (maxViews) body.max_views = parseInt(maxViews);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error creating paste");
        return;
      }

      setUrl(data.url);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-[#0b1210] to-black text-white px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className=" font-sans text-5xl text-center font-semibold mb-10">
          Pastebin <span className="text-[#14F195]">Lite</span>
        </h1>

        {/* Glass Container */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content box */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <label className="block text-sm text-white/60 mb-2">
                Content
              </label>
              <textarea
                rows={10}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none resize-none"
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <label className="block text-sm text-white/60 mb-2">
                  TTL (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none"
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <label className="block text-sm text-white/60 mb-2">
                  Max Views
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none"
                />
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#14F195] text-black font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Paste"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {url && (
            <div className="mt-6 bg-[#14F195]/10 border border-[#14F195]/20 rounded-xl p-4">
              <p className="text-sm text-[#14F195] mb-2">Paste created</p>

              <div className="flex gap-2 items-center">
                {/* Clickable URL */}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white hover:border-[#14F195]/40 hover:text-[#14F195] transition"
                >
                  {url}
                </a>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="bg-[#14F195]/10 hover:bg-[#14F195]/20 border border-[#14F195]/20 rounded-lg px-3 py-2 text-sm text-[#14F195] hover:text-[#14F195] transition"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
