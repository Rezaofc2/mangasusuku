import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import BottomNav from "@/components/site/BottomNav";
import Footer from "@/components/site/Footer";
import MangaCard, { MangaCardData } from "@/components/site/MangaCard";
import { apiGet } from "@/lib/api";
import { Search as SearchIcon, Compass, ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 60;

async function fetchResults(q: string, page: number): Promise<MangaCardData[]> {
  const path = q ? "/api/mangasusuku/search" : "/api/mangasusuku/ongoing";
  const params: Record<string, string | number> = { page };
  if (q) params.q = q;
  const res = await apiGet<MangaCardData[]>(path, params);
  return Array.isArray(res) ? res : [];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const results = await fetchResults(q, page);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-6 w-full">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
            {q ? <SearchIcon size={18} /> : <Compass size={18} />}
          </span>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {q ? `Hasil untuk "${q}"` : "Jelajah Komik"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {results.length > 0
                ? `${results.length} komik ditemukan · Halaman ${page}`
                : q
                ? "Tidak ada hasil"
                : "Menampilkan komik terbaru"}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 w-full">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] py-16 text-center">
            <SearchIcon size={32} className="mx-auto text-slate-700 mb-3" />
            <p className="text-sm text-slate-400">
              {q ? "Belum ada komik yang cocok. Coba kata kunci lain." : "Ketikkan kata kunci di kolom pencarian."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {results.map((it, i) => (
              <div key={i} className="w-full">
                <div className="[&>a]:w-full [&>a]:max-w-none">
                  <MangaCard item={it} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {results.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-8 mb-4 w-full flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-200 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={14} /> Sebelumnya
            </Link>
          )}
          <span className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 text-sm text-slate-400">
            Hal. {page}
          </span>
          <Link
            href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-shadow"
          >
            Selanjutnya <ChevronRight size={14} />
          </Link>
        </section>
      )}

      <div className="flex-1" />
      <Footer />
      <BottomNav />
      <div className="h-20 md:hidden" />
    </div>
  );
}
