import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import BottomNav from "@/components/site/BottomNav";
import Footer from "@/components/site/Footer";
import MangaCard, { MangaCardData } from "@/components/site/MangaCard";
import { apiGet } from "@/lib/api";
import { Flame, Sparkles, ArrowRight, BookOpen, Zap } from "lucide-react";

export const revalidate = 300;

// API route mengembalikan { results, total, page }
// Fungsi ini mendukung kedua format: array langsung ATAU objek dengan { results }
async function fetchList(path: string): Promise<MangaCardData[]> {
  const res = await apiGet<any>(path);
  if (!res) return [];
  if (Array.isArray(res)) return res as MangaCardData[];
  if (Array.isArray(res.results)) return res.results as MangaCardData[];
  if (Array.isArray(res.data)) return res.data as MangaCardData[];
  return [];
}

export default async function HomePage() {
  const [ongoing, popular] = await Promise.all([
    fetchList("/api/mangasusuku/ongoing"),
    fetchList("/api/mangasusuku/popular"),
  ]);

  const hero = popular[0] || ongoing[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-pink-500/10 to-purple-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(251,146,60,0.15),transparent_40%),radial-gradient(circle_at_75%_60%,rgba(236,72,153,0.15),transparent_40%)]" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-16 md:pb-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4">
                <Zap size={12} className="fill-amber-400" />
                Update setiap hari
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05]">
                Baca <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">Komik</span>
                <br />
                Online Gratis
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-300 max-w-lg leading-relaxed">
                Manhwa dewasa terbaik dalam satu tempat tanpa VPN.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <Link href="/search?q=" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 rounded-full font-semibold hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all">
                  <BookOpen size={16} />
                  Jelajah Komik
                </Link>
                <a href="#terbaru" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full font-semibold text-slate-200 hover:bg-white/10 transition-colors">
                  Lihat Terbaru <ArrowRight size={16} />
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-400">
                <div>
                  <div className="text-2xl font-bold text-white">{ongoing.length + popular.length}+</div>
                  <div className="text-xs">Komik tersedia</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs">Gratis</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="text-2xl font-bold text-white">Bypass</div>
                  <div className="text-xs">Auto</div>
                </div>
              </div>
            </div>

            {hero && (
              <div className="relative hidden md:block">
                <Link href={`/komik/${encodeURIComponent(hero.slug.replace(/^komik\/|^manga\//, "").replace(/^\/+|\/+$/g, ""))}`} className="block relative aspect-[3/4] max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.poster} alt={hero.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold uppercase tracking-wide mb-2">Trending</span>
                    <h3 className="text-lg font-bold text-white line-clamp-2">{hero.title}</h3>
                    {hero.latestChapter && (<p className="text-xs text-slate-300 mt-1">{hero.latestChapter}</p>)}
                  </div>
                </Link>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="terbaru" className="max-w-7xl mx-auto px-4 md:px-6 mt-4 md:mt-6 w-full">
        <SectionHeader icon={<Sparkles size={18} className="text-amber-400" />} title="Komik Terbaru" subtitle="Update chapter terbaru" href="/search?q=" />
        <ScrollRow items={ongoing} emptyText="Belum ada komik terbaru." />
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-10 w-full">
        <SectionHeader icon={<Flame size={18} className="text-pink-500" />} title="Komik Populer" subtitle="Paling banyak dibaca" href="/search?q=" />
        <ScrollRow items={popular} emptyText="Belum ada komik populer." />
      </section>

      <div className="flex-1" />
      <Footer />
      <BottomNav />
      <div className="h-20 md:hidden" />
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, href }: { icon: React.ReactNode; title: string; subtitle: string; href: string; }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <Link href={href} className="text-xs md:text-sm text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1">
        Lihat Semua <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function ScrollRow({ items, emptyText }: { items: MangaCardData[]; emptyText: string; }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] py-12 text-center text-sm text-slate-500">
        {emptyText}
      </div>
    );
  }
  return (
    <div className="relative -mx-4 md:mx-0">
      <div className="flex gap-3 overflow-x-auto px-4 md:px-0 pb-3 snap-x">
        {items.map((it, i) => (
          <div key={i} className="snap-start">
            <MangaCard item={it} />
          </div>
        ))}
      </div>
    </div>
  );
}
