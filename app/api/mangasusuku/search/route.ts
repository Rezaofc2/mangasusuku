import { NextRequest, NextResponse } from 'next/server';
import { searchManga } from '@/lib/mangasusuku';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);

  if (!q) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  const results = await searchManga(q, page);
  return NextResponse.json({ results, total: results.length, page });
}
