import { NextRequest, NextResponse } from 'next/server';
import { getPopularManga } from '@/lib/mangasusuku';

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
  const results = await getPopularManga(page);
  return NextResponse.json({ results, total: results.length, page });
}
