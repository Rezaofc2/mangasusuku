import { NextRequest, NextResponse } from 'next/server';
import { readChapter } from '@/lib/mangasusuku';

// This endpoint also acts as a GEO-BYPASS proxy:
// Since Next.js API routes run on Vercel's edge/server (outside Indonesia),
// the request to mangasusuku.com goes through a non-blocked IP automatically.

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Parameter "slug" is required (e.g. judul-manga/chapter-1)' }, { status: 400 });
  }

  const data = await readChapter(slug);
  if (!data) {
    return NextResponse.json({ error: 'Chapter not found or failed to fetch' }, { status: 404 });
  }

  return NextResponse.json(data);
}
