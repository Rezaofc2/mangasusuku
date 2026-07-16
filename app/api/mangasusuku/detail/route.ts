import { NextRequest, NextResponse } from 'next/server';
import { getMangaDetail } from '@/lib/mangasusuku';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Parameter "slug" is required' }, { status: 400 });
  }

  const detail = await getMangaDetail(slug);
  if (!detail || !detail.title) {
    return NextResponse.json({ error: 'Manga not found or failed to fetch' }, { status: 404 });
  }

  return NextResponse.json(detail);
}
