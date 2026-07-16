import { NextRequest, NextResponse } from 'next/server';
import { searchManga } from '@/lib/mangasusuku';

export async function GET(req: NextRequest) {
  let q = req.nextUrl.searchParams.get('q') || '';
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);

  if (!q) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  // SUCURI WebSite Firewall (WAF) akan langsung memblokir (403 Forbidden) jika 
  // parameter query pencarian mengandung karakter aneh/berbahaya seperti '<', '>', atau '<?'
  // Di sini kita sanitasi string pencarian agar aman dan tidak memicu trigger WAF Sucuri.
  q = q.replace(/[<>?]/g, '').trim();

  if (!q) {
    return NextResponse.json({ results: [], total: 0, page });
  }

  const results = await searchManga(q, page);
  return NextResponse.json({ results, total: results.length, page });
}
