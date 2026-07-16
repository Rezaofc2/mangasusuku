import { NextRequest, NextResponse } from 'next/server';
import { getOngoingManga } from '@/lib/mangasusuku';

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
  const results = await getOngoingManga(page);
  return NextResponse.json({ results, total: results.length, page });
}
