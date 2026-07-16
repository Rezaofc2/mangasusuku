/**
 * ✧ MangaSusuku Scraper
 * ✧ Source: mangasusuku.com
 * ✧ Features: search, ongoing, popular, detail, read chapter
 * ✧ Note: mangasusuku.com diblokir di Indonesia — semua request diproxy
 *         lewat server (Next.js API route berjalan di server Vercel
 *         yang berada di luar Indo), sehingga bypass otomatis.
 *         Header yang diset meniru browser biasa.
 */

import * as cheerio from 'cheerio';

const BASE_URL = 'https://mangasusuku.com';

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  Referer: BASE_URL + '/',
  // Spoofing country via header to bypass some geo-checks
  'CF-IPCountry': 'US',
  'X-Forwarded-For': '8.8.8.8',
};

async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(url, {
      headers: HEADERS,
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[MangaSusuku] Error fetching ${url}:`, error.message);
    return null;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MangaCard {
  title: string;
  slug: string;
  url: string;
  poster: string;
  latestChapter?: string;
  type?: string;
  score?: string;
}

export interface MangaDetail {
  title: string;
  alternativeTitle: string;
  poster: string;
  author: string;
  artist: string;
  status: string;
  type: string;
  score: string;
  genres: string[];
  synopsis: string;
  chapters: ChapterItem[];
}

export interface ChapterItem {
  chapter: string;
  slug: string;
  url: string;
  date: string;
}

export interface ChapterImages {
  title: string;
  images: string[];
  prevChapter?: string;
  nextChapter?: string;
}

// ─── Helper: extract slug from URL ───────────────────────────────────────────

function slugFromUrl(url: string): string {
  return url.replace(BASE_URL, '').replace(/^\/+|\/+$/g, '');
}

// ─── Helper: parse manga cards from HTML (unified selector) ──────────────────
// Situs mangasusuku terkadang membungkus daftar di `div.listupd`, terkadang
// langsung di `div.bs`. Kita cari `div.bs` di manapun untuk dukung keduanya.
function parseCards($: cheerio.CheerioAPI): MangaCard[] {
  const results: MangaCard[] = [];
  const seen = new Set<string>();

  $('div.bs').each((_, el) => {
    // Ambil <a> pertama di dalam div.bsx (atau langsung di dalam div.bs)
    const a = $(el).find('div.bsx a').first().length
      ? $(el).find('div.bsx a').first()
      : $(el).find('a').first();

    const title =
      a.attr('title') ||
      $(el).find('div.tt').text().trim() ||
      $(el).find('.tt').text().trim() ||
      a.text().trim();

    const href = a.attr('href') || '';
    if (!href || seen.has(href)) return;
    seen.add(href);

    const slug = slugFromUrl(href);
    const url = href;
    const img = $(el).find('img').first();
    const poster =
      img.attr('src') ||
      img.attr('data-src') ||
      img.attr('data-lazy-src') ||
      img.attr('data-cfsrc') ||
      '';
    const latestChapter = $(el).find('.epxs, .adds .epxs').text().trim();
    const score = $(el).find('.numscore, .rating .numscore').text().trim();
    const type = $(el).find('.typeflag, span.type').first().text().trim();

    if (title && slug) {
      results.push({ title, slug, url, poster, latestChapter, score, type });
    }
  });

  return results;
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchManga(query: string, page = 1): Promise<MangaCard[]> {
  // MangaSusuku search URL format
  const url = page === 1
    ? `${BASE_URL}/?s=${encodeURIComponent(query)}`
    : `${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}`;
  const html = await fetchPage(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  return parseCards($);
}

// ─── Ongoing / Terbaru ───────────────────────────────────────────────────────
// Coba dari halaman utama dulu (yang menyajikan Latest Update), fallback ke
// /komik/?status=ongoing&order=update
export async function getOngoingManga(page = 1): Promise<MangaCard[]> {
  const urls =
    page === 1
      ? [
          `${BASE_URL}/`,
          `${BASE_URL}/komik/?status=ongoing&order=update`,
          `${BASE_URL}/komik/?order=update`,
        ]
      : [`${BASE_URL}/komik/page/${page}/?status=ongoing&order=update`];

  for (const url of urls) {
    const html = await fetchPage(url);
    if (!html) continue;
    const $ = cheerio.load(html);
    const results = parseCards($);
    if (results.length > 0) return results;
  }
  return [];
}

// ─── Popular ─────────────────────────────────────────────────────────────────
// Coba /komik/?order=popular dulu; jika kosong, ambil "Popular Today" dari
// homepage sebagai fallback.
export async function getPopularManga(page = 1): Promise<MangaCard[]> {
  const urls =
    page === 1
      ? [
          `${BASE_URL}/komik/?order=popular`,
          `${BASE_URL}/komik/?status=&type=&order=popular`,
          `${BASE_URL}/`,
        ]
      : [`${BASE_URL}/komik/page/${page}/?order=popular`];

  for (const url of urls) {
    const html = await fetchPage(url);
    if (!html) continue;
    const $ = cheerio.load(html);

    // Untuk homepage, coba ambil section "Popular Today" secara spesifik
    if (url === `${BASE_URL}/`) {
      const popularSection = $('div.serieslist.pop, div.bixbox.hothome, div.hothome')
        .first();
      if (popularSection.length) {
        const results: MangaCard[] = [];
        const seen = new Set<string>();
        popularSection.find('li, div.bs').each((_, el) => {
          const a = $(el).find('a').first();
          const title = a.attr('title') || $(el).find('h4, .leftseries h2, .tt').text().trim();
          const href = a.attr('href') || '';
          if (!href || seen.has(href)) return;
          seen.add(href);
          const slug = slugFromUrl(href);
          const img = $(el).find('img').first();
          const poster =
            img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || '';
          if (title && slug) {
            results.push({ title, slug, url: href, poster });
          }
        });
        if (results.length > 0) return results;
      }
    }

    const results = parseCards($);
    if (results.length > 0) return results;
  }
  return [];
}

// ─── Detail ───────────────────────────────────────────────────────────────────

export async function getMangaDetail(slug: string): Promise<MangaDetail | null> {
  // clean up slug from full URL or custom inputs
  let cleanSlug = slug.replace(/^(https?:\/\/)?(www\.)?mangasusuku\.(com|xyz|me|app|co)\/?/, '');
  cleanSlug = cleanSlug.replace(/^\/+|^komik\/|^manga\/|\/+$/g, '');
  cleanSlug = `komik/${cleanSlug}`;

  const url = `${BASE_URL}/${cleanSlug}/`;
  const html = await fetchPage(url);
  if (!html) return null;

  const $ = cheerio.load(html);

  const title = $('h1.entry-title, .seriestuheader h1').text().trim();
  const alternativeTitle = $('span.alter').text().trim();
  const poster =
    $('div.thumb img').attr('src') ||
    $('div.thumb img').attr('data-src') ||
    $('img.wp-post-image').attr('src') ||
    '';

  const info: Record<string, string> = {};
  $('div.infotable tr, table.infotable tr').each((_, el) => {
    const key = $(el).find('td').first().text().trim().toLowerCase();
    const val = $(el).find('td').last().text().trim();
    if (key) info[key] = val;
  });

  // Fallback: seriestucont
  $('div.seriestucont span.item-list, div.seriestucon .wd-full').each((_, el) => {
    const b = $(el).find('b').text().trim().toLowerCase();
    const val = $(el).clone().children('b').remove().end().text().trim();
    if (b) info[b] = val;
  });

  const genres: string[] = [];
  $('div.seriestugenre a, span.mgen a').each((_, el) => {
    genres.push($(el).text().trim());
  });

  const synopsis = $('div.entry-content.entry-content-single p, div.synops').text().trim();

  const chapters: ChapterItem[] = [];
  $('#chapterlist ul li, .eplister ul li').each((_, el) => {
    const chTitle = $(el).find('.chapternum, .chnum').text().trim();
    const chHref = $(el).find('a').attr('href') || '';
    const chSlug = slugFromUrl(chHref);
    const chUrl = chHref || `${BASE_URL}/${chSlug}/`;
    const chDate = $(el).find('.chapterdate').text().trim();
    if (chTitle) {
      chapters.push({ chapter: chTitle, slug: chSlug, url: chUrl, date: chDate });
    }
  });

  return {
    title,
    alternativeTitle,
    poster,
    author: info['author'] || info['pengarang'] || '',
    artist: info['artist'] || info['seniman'] || '',
    status: info['status'] || '',
    type: info['type'] || info['tipe'] || '',
    score: info['score'] || info['rating'] || '',
    genres,
    synopsis,
    chapters,
  };
}

// ─── Read Chapter ─────────────────────────────────────────────────────────────


export async function readChapter(slug: string): Promise<ChapterImages | null> {
  // slug can be a full URL, a path like "komik/manga-slug/chapter-1", or just "manga-slug/chapter-1"
  let cleanSlug = slug.startsWith('http') ? slugFromUrl(slug) : slug.replace(/^\/+/, '');
  // ensure it starts with komik/ if it looks like a bare slug with chapter
  if (!cleanSlug.startsWith('komik/') && cleanSlug.includes('/')) {
    cleanSlug = `komik/${cleanSlug}`;
  }
  const url = `${BASE_URL}/${cleanSlug}/`.replace(/\/+$/, '/');
  const html = await fetchPage(url);
  if (!html) return null;

  const $ = cheerio.load(html);
  const title = $('h1.entry-title, .headpost h1, .reader-area h1').text().trim();
  const images: string[] = [];

  // Primary: reader image list
  $('div#readerarea img, div.reader-area img, div.img-landmine img').each((_, el) => {
    const src =
      $(el).attr('src') ||
      $(el).attr('data-src') ||
      $(el).attr('data-lazy-src') ||
      $(el).attr('data-cfsrc') ||
      '';
    if (src && src.match(/\.(jpg|jpeg|png|webp|gif)/i)) {
      images.push(src);
    }
  });

  // Fallback: ts_reader.run JSON embedded in script tags
  if (images.length === 0) {
    $('script').each((_, el) => {
      const content = $(el).html() || '';
      const match = content.match(/ts_reader\.run\((\{[\s\S]*?\})\)/);
      if (match) {
        try {
          const data = JSON.parse(match[1]) as {
            sources?: { images?: string[] }[];
          };
          const srcs = data?.sources?.[0]?.images || [];
          images.push(...srcs);
        } catch {
          // ignore parse error
        }
      }
    });
  }

  // ─── Navigation: extract manga slug from chapter slug, then fetch detail for chapter list ───
  let prevChapter: string | undefined;
  let nextChapter: string | undefined;

  // Extract manga slug from chapter slug
  // e.g. "komik/intimate-tutoring-chapter-1" -> "intimate-tutoring"
  // e.g. "intimate-tutoring-chapter-1" -> "intimate-tutoring"
  let mangaSlug = cleanSlug
    .replace(/^komik\//, '')
    .replace(/-chapter[-\d.]+$/i, '')
    .replace(/\/$/, '');

  if (mangaSlug) {
    try {
      const detail = await getMangaDetail(mangaSlug);
      if (detail && detail.chapters.length > 0) {
        // Build chapter slug for current chapter from cleanSlug
        const currentChapterSlug = cleanSlug
          .replace(/^komik\//, '')
          .replace(/\/+$/g, '');

        // Find index of current chapter in the list
        const idx = detail.chapters.findIndex(
          (ch) => ch.slug === currentChapterSlug
        );

        if (idx > 0) {
          prevChapter = detail.chapters[idx - 1].slug;
        }
        if (idx >= 0 && idx < detail.chapters.length - 1) {
          nextChapter = detail.chapters[idx + 1].slug;
        }
      }
    } catch {
      // fallback: try old selectors
      prevChapter = slugFromUrl($('a.prev_page, .nextprev .prev').attr('href') || '') || undefined;
      nextChapter = slugFromUrl($('a.next_page, .nextprev .next').attr('href') || '') || undefined;
    }
  }

  return {
    title,
    images,
    prevChapter,
    nextChapter,
  };
}
