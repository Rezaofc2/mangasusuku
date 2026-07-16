import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import { apiGet } from "@/lib/api";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Home, List } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 300;

interface ChapterImages {
  title: string; images: string[]; prevChapter?: string; nextChapter?: string;
}

function normalizeChapterHref(chapterSlug?: string): string | null {
  if (!chapterSlug) return null;
  let s = chapterSlug;
  s = s.replace(/^(https?:\/\/)?[^\/]+\//, "");
  s = s.replace(/^\/+|\/+$/g, "");
  if (!s) return null;
  return `/baca/${s}`;
}

function guessMangaHref(chapterSlug: string): string | null {
  let s = chapterSlug.replace(/^\/+|\/+$/g, "");
  if (s.startsWith("komik/")) s = s.slice(6);
  const m = s.match(/^(.+?)-chapter[-\d.]*$/i);
  if (m) return `/komik/${encodeURIComponent(m[1])}`;
  const m2 = s.match(/^([^\/]+)\//);
  if (m2) return `/komik/${encodeURIComponent(m2[1])}`;
  return null;
}

export default async function BacaPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const path = (slug || []).map(decodeURIComponent).join("/");
  if (!path) notFound();

  const data = await apiGet<ChapterImages>("/api/mangasusuku/read", { slug: path });
  if (!data || !data.images || data.images.length === 0) notFound();

  const mangaHref = guessMangaHref(path);
  const prevHref = normalizeChapterHref(data.prevChapter);
  const nextHref = normalizeChapterHref(data.nextChapter);

  return (
    <div className="min-h-screen bg-[#07090d]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center justify-between gap-3">
          <Link href={mangaHref || "/"} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Kembali ke Detail</span>
            <span className="sm:hidden">Kembali</span>
          </Link>
          <div className="flex items-center gap-1.5">
            {mangaHref && (
              <Link href={mangaHref} className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors" title="Daftar Chapter">
                <List size={14} />
              </Link>
            )}
            <Link href="/" className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors" title="Home">
              <Home size={14} />
            </Link>
          </div>
        </div>
        <h1 className="mt-3 text-lg md:text-xl font-bold text-white flex items-center gap-2">
          <BookOpen size={18} className="text-amber-400" />
          {data.title || "Baca Chapter"}
        </h1>
      </div>

      <ChapterNav prev={prevHref} next={nextHref} mangaHref={mangaHref} />

      <div className="max-w-3xl mx-auto px-2 md:px-4 py-4 flex flex-col items-center">
        {data.images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt={`Page ${i + 1}`} loading={i < 3 ? "eager" : "lazy"} className="max-w-full h-auto block" />
        ))}
      </div>

      <ChapterNav prev={prevHref} next={nextHref} mangaHref={mangaHref} bottom />
    </div>
  );
}

function ChapterNav({ prev, next, mangaHref, bottom }: { prev: string | null; next: string | null; mangaHref: string | null; bottom?: boolean; }) {
  return (
    <div className={`max-w-3xl mx-auto px-4 ${bottom ? "pt-4 pb-16" : "pb-2"}`}>
      <div className="grid grid-cols-3 gap-2">
        {prev ? (
          <Link href={prev} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-slate-200 hover:bg-white/10 transition-colors">
            <ChevronLeft size={16} /><span>Sebelumnya</span>
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/[0.02] border border-white/5 rounded-full text-sm text-slate-600 cursor-not-allowed">
            <ChevronLeft size={16} /><span>Sebelumnya</span>
          </span>
        )}
        <Link href={mangaHref || "/"} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-slate-200 hover:bg-white/10 transition-colors">
          <List size={14} />
          <span className="hidden sm:inline">Daftar Chapter</span>
          <span className="sm:hidden">List</span>
        </Link>
        {next ? (
          <Link href={next} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-shadow">
            <span>Berikutnya</span><ChevronRight size={16} />
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/[0.02] border border-white/5 rounded-full text-sm text-slate-600 cursor-not-allowed">
            <span>Berikutnya</span><ChevronRight size={16} />
          </span>
        )}
      </div>
    </div>
  );
}
