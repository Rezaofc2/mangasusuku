import Link from "next/link";
import { Star, BookOpen } from "lucide-react";

export interface MangaCardData {
  title: string;
  slug: string;
  url?: string;
  poster: string;
  latestChapter?: string;
  type?: string;
  score?: string;
}

function slugToPath(slug: string): string {
  let s = slug || "";
  s = s.replace(/^(https?:\/\/)?[^\/]+\//, "");
  s = s.replace(/^\/+|\/+$/g, "");
  if (s.startsWith("komik/")) s = s.slice(6);
  if (s.startsWith("manga/")) s = s.slice(6);
  return `/komik/${encodeURIComponent(s)}`;
}

export default function MangaCard({ item }: { item: MangaCardData }) {
  const href = slugToPath(item.slug);
  const type = (item.type || "").trim();
  const typeColor =
    type.toLowerCase() === "manhwa"
      ? "bg-pink-500/90 text-white"
      : type.toLowerCase() === "manhua"
      ? "bg-teal-500/90 text-white"
      : type.toLowerCase() === "manga"
      ? "bg-amber-500/90 text-slate-950"
      : "bg-purple-500/90 text-white";

  return (
    <Link
      href={href}
      className="group block shrink-0 w-[150px] md:w-[170px] rounded-xl overflow-hidden bg-[#161923] border border-white/5 hover:border-amber-400/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10"
    >
      <div className="relative aspect-[3/4] bg-slate-800 overflow-hidden">
        {item.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <BookOpen size={32} />
          </div>
        )}
        {type && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${typeColor} shadow-lg`}>
            {type}
          </span>
        )}
        {item.score && (
          <span className="absolute top-2 right-2 flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-amber-300 border border-amber-400/30">
            <Star size={9} className="fill-amber-400 text-amber-400" />
            {item.score}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        {item.latestChapter && (
          <span className="absolute bottom-2 left-2 right-2 text-[11px] font-semibold text-white truncate">
            {item.latestChapter}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-[13px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors min-h-[2.6em]">
          {item.title}
        </h3>
      </div>
    </Link>
  );
}
