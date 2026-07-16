import { headers } from "next/headers";

async function baseUrl(): Promise<string> {
  if (typeof window !== "undefined") return "";
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;
  } catch {}
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (envUrl) return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  return "http://localhost:3000";
}

export async function apiGet<T = any>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<T | null> {
  const base = await baseUrl();
  const url = new URL(path, base || "http://localhost:3000");
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && String(v).length > 0) {
        url.searchParams.set(k, String(v));
      }
    }
  }
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.error("[apiGet] error", url.toString(), err);
    return null;
  }
}
