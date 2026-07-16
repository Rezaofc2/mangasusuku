"use client";

import { useState } from "react";

type Section = "mangasusuku";
type Tab = "search" | "ongoing" | "popular" | "detail" | "read";

interface Endpoint {
  method: "GET";
  path: string;
  params: { name: string; required: boolean; description: string }[];
  description: string;
}

const MANGASUSUKU_ENDPOINTS: Record<string, Endpoint> = {
  search: {
    method: "GET",
    path: "/api/mangasusuku/search",
    params: [
      { name: "q", required: true, description: "Kata kunci pencarian" },
      { name: "page", required: false, description: "Nomor halaman (default: 1)" },
    ],
    description: "Cari manga berdasarkan judul dari mangasusuku.com",
  },
  ongoing: {
    method: "GET",
    path: "/api/mangasusuku/ongoing",
    params: [{ name: "page", required: false, description: "Nomor halaman (default: 1)" }],
    description: "Daftar manga ongoing terbaru dari mangasusuku.com",
  },
  popular: {
    method: "GET",
    path: "/api/mangasusuku/popular",
    params: [{ name: "page", required: false, description: "Nomor halaman (default: 1)" }],
    description: "Daftar manga terpopuler dari mangasusuku.com",
  },
  detail: {
    method: "GET",
    path: "/api/mangasusuku/detail",
    params: [{ name: "slug", required: true, description: "Slug manga dari field slug di response, contoh: komik/one-piece" }],
    description: "Detail manga beserta daftar chapter",
  },
  read: {
    method: "GET",
    path: "/api/mangasusuku/read",
    params: [{ name: "slug", required: true, description: "Slug chapter dari field slug di daftar chapter, contoh: komik/one-piece/chapter-1" }],
    description: "Gambar-gambar chapter manga untuk dibaca (bypass blokir Indo otomatis)",
  },
};

export default function Page() {
  const [activeSection, setActiveSection] = useState<Section>("mangasusuku");
  const [activeTab, setActiveTab] = useState<Tab>("search");
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const endpoints = MANGASUSUKU_ENDPOINTS;
  const endpoint = endpoints[activeTab] as Endpoint | undefined;

  
  const mangaTabs: Tab[] = ["search", "ongoing", "popular", "detail", "read"];
  const tabs = mangaTabs;

  function switchSection(s: Section) {
    setActiveSection(s);
    setActiveTab("search");
    setParams({});
    setResponse("");
    setError("");
  }

  function switchTab(t: Tab) {
    setActiveTab(t);
    setParams({});
    setResponse("");
    setError("");
  }

  async function tryEndpoint() {
    if (!endpoint) return;
    setLoading(true);
    setError("");
    setResponse("");

    const url = new URL(endpoint.path, window.location.origin);
    for (const [k, v] of Object.entries(params)) {
      if (v.trim()) url.searchParams.set(k, v.trim());
    }

    try {
      const res = await fetch(url.toString());
      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const curlExample = (() => {
    if (!endpoint || typeof window === "undefined") return "";
    const base = window.location.origin;
    const url = new URL(endpoint.path, base);
    endpoint.params.forEach((p) => {
      if (p.required) url.searchParams.set(p.name, `<${p.name}>`);
    });
    return `curl "${url.toString()}"`;
  })();

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              API
            </span>
            <div>
              <h1 className="text-xl font-bold leading-tight text-balance">
                Anime &amp; Manga Scraper API
              </h1>
              <p className="text-sm text-muted-foreground">
                MangaSusuku Scraper API — scraper berbasis Next.js, bypass blokir Indonesia otomatis
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Source info */}
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
            <>
              <p className="font-semibold text-sm">mangasusuku.com</p>
              <p className="text-sm text-muted-foreground">
                Scraper HTML untuk situs manga Indonesia. Diblokir di server Indo —{" "}
                <strong>semua request diproxy otomatis</strong> melalui server Vercel (luar Indo) sehingga bypass transparan tanpa VPN. Mendukung: search, ongoing, popular, detail, baca chapter.
              </p>
            </>
        </div>

        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          {/* Left: endpoint list */}
          <nav className="flex md:flex-col gap-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                  activeTab === t
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>

          {/* Right: endpoint detail + tester */}
          {endpoint && (
            <div className="flex flex-col gap-5">
              {/* Endpoint info */}
              <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    GET
                  </span>
                  <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                </div>
                <p className="text-sm text-muted-foreground">{endpoint.description}</p>

                {/* Params */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Query Parameters
                  </p>
                  {endpoint.params.map((p) => (
                    <div key={p.name} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{p.name}</code>
                        {p.required ? (
                          <span className="text-xs text-destructive font-medium">wajib</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">opsional</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground pl-1">{p.description}</p>
                      <input
                        type="text"
                        placeholder={p.required ? `Masukkan ${p.name}...` : `${p.name} (opsional)`}
                        value={params[p.name] || ""}
                        onChange={(e) =>
                          setParams((prev) => ({ ...prev, [p.name]: e.target.value }))
                        }
                        className="mt-0.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  ))}
                </div>

                {/* cURL */}
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Contoh cURL
                  </p>
                  <pre className="rounded-lg bg-muted px-4 py-3 text-xs font-mono overflow-x-auto text-foreground">
                    {curlExample}
                  </pre>
                </div>

                <button
                  onClick={tryEndpoint}
                  disabled={loading}
                  className="self-start px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {loading ? "Memuat..." : "Coba Sekarang"}
                </button>
              </div>

              {/* Response */}
              {(response || error) && (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Response
                    </span>
                    {error && (
                      <span className="text-xs text-destructive font-medium">Error</span>
                    )}
                  </div>
                  <pre className="px-4 py-4 text-xs font-mono overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed text-foreground">
                    {error || response}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* All endpoints reference */}
        <section className="flex flex-col gap-4">
          <h2 className="text-base font-bold">Semua Endpoint</h2>
          <div className="grid gap-3">
            {Object.entries(MANGASUSUKU_ENDPOINTS).map(
              ([key, ep]) => (
                <div
                  key={key}
                  className="rounded-xl border border-border bg-card px-5 py-3 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      GET
                    </span>
                    <code className="text-sm font-mono">{ep.path}</code>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">{ep.description}</p>
                  <div className="flex gap-2 flex-wrap pl-10">
                    {ep.params.map((p) => (
                      <span
                        key={p.name}
                        className="text-xs bg-muted px-2 py-0.5 rounded font-mono"
                      >
                        ?{p.name}={p.required ? "..." : "(optional)"}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* Bypass note */}
        <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 flex flex-col gap-2">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Tentang Proxy &amp; Bypass
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>MangaSusuku:</strong> mangasusuku.com diblokir Kominfo di Indonesia. Semua request{" "}
            <code className="text-xs bg-muted px-1 rounded">/api/mangasusuku/*</code> berjalan di server
            Vercel (luar Indonesia) sehingga bypass otomatis tanpa VPN.
          </p>
          </section>
      </div>
    </main>
  );
}
