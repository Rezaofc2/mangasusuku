import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import BottomNav from "@/components/site/BottomNav";
import Footer from "@/components/site/Footer";
import { apiGet } from "@/lib/api";
import { Star, BookOpen, User, Palette, Calendar, Tag, ChevronRight, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 180;

interface ChapterItem { chapter: string; slug: string; url: string; date: string; }
interface MangaDetail {
  title: string; alternativeTitle?: string; poster: string;
  author?: string; artist?: string; status?: string; type?: string; score?: string;
  genres?: string[]; synopsis?: string; chapters?: ChapterItem[];
}

function chapterHref(chapterSlug: string, chapterUrl?: string): string {
  let s = chapterSlug || "";
  if (!s && chapterUrl) s = chapterUrl;
  s = s.replace(/^(https?:\/\/)?[^\/]+\//, "");
  s = s.replace(/^\/+|\/+$/g, "");
  return `/baca/${s}`;
}

export default async function KomikDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug);
  const detail = await apiGet<MangaDetail>("/api/mangasusuku/detail", { slug: cleanSlug });
  if (!detail || !detail.title) notFound();

  const chapters = detail.chapters || [];
  const typeColor =
    (detail.type || "").toLowerCase() === "manhwa" ? "bg-pink-500 text-white" :
    (detail.type || "").toLowerCase() === "manhua" ? "bg-teal-500 text-white" :
    (detail.type || "").toLowerCase() === "manga" ? "bg-amber-500 text-slate-950" :
    "bg-purple-500 text-white";
  const statusOnline = (detail.status || "").toLowerCase().includes("ongoing");
  const firstCh = chapters[chapters.length - 1];
  const latestCh = chapters[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="relative">
        <div className="absolute inset-0 h-[380px] bg-cover bg-center opacity-25 blur-2xl scale-110" style={{ backgroundImage: `url("${detail.poster}")` }} />
        <div className="absolute inset-x-0 top-0 h-[380px] bg-gradient-to-b from-transparent via-[#0b0d12]/70 to-[#0b0d12]" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <div className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-8">
            <div className="mx-auto md:mx-0 w-[180px] md:w-[220px] shrink-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-slate-800 shadow-2xl shadow-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={detail.poster} alt={detail.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {detail.type && (<span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${typeColor}`}>{detail.type}</span>)}
                {detail.status && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide border ${statusOnline ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-slate-500/10 text-slate-300 border-slate-500/30"}`}>
                    {statusOnline && (<span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />)}
                    {detail.status}
                  </span>
                )}
                {detail.score && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    {detail.score}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">{detail.title}</h1>
              {detail.alternativeTitle && (<p className="text-sm text-slate-400 mt-1.5">{detail.alternativeTitle}</p>)}

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {detail.author && (<MetaPill icon={<User size={12} />} label="Author" value={detail.author} />)}
                {detail.artist && detail.artist !== detail.author && (<MetaPill icon={<Palette size={12} />} label="Artist" value={detail.artist} />)}
                {detail.type && (<MetaPill icon={<BookOpen size={12} />} label="Tipe" value={detail.type} />)}
                {chapters.length > 0 && (<MetaPill icon={<Calendar size={12} />} label="Chapter" value={`${chapters.length}`} />)}
              </div>

              {detail.genres && detail.genres.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {detail.genres.map((g) => (
                    <span key={g} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      <Tag size={9} className="inline mr-1 opacity-60" />{g}
                    </span>
                  ))}
                </div>
              )}

              {chapters.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {firstCh && (
                    <Link href={chapterHref(firstCh.slug, firstCh.url)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-200 font-semibold hover:bg-white/10 transition-colors">
                      Baca Chapter 1
                    </Link>
                  )}
                  {latestCh && latestCh !== firstCh && (
                    <Link href={chapterHref(latestCh.slug, latestCh.url)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-shadow">
                      Baca {latestCh.chapter} <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {detail.synopsis && (
        <section className="relative max-w-7xl mx-auto px-4 md:px-6 mt-2 w-full">
          <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-2">Sinopsis</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{detail.synopsis}</p>
          </div>
        </section>
      )}

      <section className="relative max-w-7xl mx-auto px-4 md:px-6 mt-6 w-full">
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <BookOpen size={14} className="text-amber-400" />
              Daftar Chapter
            </h2>
            <span className="text-xs text-slate-500 font-medium">{chapters.length} chapter</span>
          </div>
          {chapters.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">Belum ada chapter tersedia.</div>
          ) : (
            <ul className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {chapters.map((ch, i) => (
                <li key={i}>
                  <Link href={chapterHref(ch.slug, ch.url)} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 shrink-0 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-amber-400 group-hover:border-amber-400/30 transition-colors">
                        {chapters.length - i}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">{ch.chapter}</div>
                        {ch.date && (<div className="text-[11px] text-slate-500 mt-0.5">{ch.date}</div>)}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
      <BottomNav />
      <div className="h-20 md:hidden" />
    </div>
  );
}

function MetaPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
      <span className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-amber-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[9px] uppercase tracking-wide text-slate-500 font-semibold">{label}</div>
        <div className="text-xs text-slate-200 font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
