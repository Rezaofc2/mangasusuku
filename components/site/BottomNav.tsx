"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, BookOpen } from "lucide-react";

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search?q=", icon: Search, label: "Cari" },
  { href: "/api-docs", icon: BookOpen, label: "API" },
  { href: "https://saweria.co/", icon: Heart, label: "Donasi", ext: true },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-[#151821]/95 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 shadow-2xl shadow-black/60 flex items-center gap-1">
      {items.map((it) => {
        const Icon = it.icon;
        const active =
          it.href === "/" ? pathname === "/" : pathname.startsWith(it.href.split("?")[0]);
        const inner = (
          <div
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-full transition-all ${
              active
                ? "bg-gradient-to-br from-amber-400 to-pink-500 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Icon size={16} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[9px] font-semibold">{it.label}</span>
          </div>
        );
        return it.ext ? (
          <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        ) : (
          <Link key={it.label} href={it.href}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
