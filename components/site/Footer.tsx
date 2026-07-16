import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5 bg-[#0a0c11]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center">
              <BookOpen size={14} className="text-slate-950" strokeWidth={2.5} />
            </span>
            <span className="text-base font-bold">
              <span className="text-white">Komik</span>
              <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
                Cat
              </span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Portal baca komik online — manhwa, manga, dan manhua bahasa Indonesia gratis, update setiap hari.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Navigasi</h4>
          <ul className="space-y-1.5 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
            <li><Link href="/search?q=" className="hover:text-amber-400 transition-colors">Jelajah Komik</Link></li>
            <li><Link href="/api-docs" className="hover:text-amber-400 transition-colors">API Docs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Info</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Semua komik di website ini hanyalah preview dari komik asli. Untuk versi asli, silakan beli komik di kota Anda.
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} KomikCat · Dibuat dengan <Heart size={11} className="inline text-pink-500 fill-pink-500" /> untuk pecinta komik
      </div>
    </footer>
  );
}
