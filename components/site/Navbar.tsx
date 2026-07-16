"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, BookOpen } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0b0d12]/85 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <BookOpen size={18} className="text-slate-950" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-white">Komik</span>
            <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
              Cat
            </span>
          </span>
        </Link>

        <form onSubmit={submit} className="flex-1 max-w-md ml-auto md:ml-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari komik…"
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-full text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-colors"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/search?q="
            className="px-3 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Jelajah
          </Link>
          <Link
            href="/api-docs"
            className="px-3 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            API
          </Link>
        </nav>
      </div>
    </header>
  );
}
