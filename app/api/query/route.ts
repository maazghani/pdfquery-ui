// app/api/query/route.ts

import { NextResponse } from 'next/server';
import { ask } from '@/lib/pdfquery';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { slug, question, key } = await req.json();

  if (!slug || !question || !key) {
    return NextResponse.json({ error: 'Missing input' }, { status: 400 });
  }

  try {
    const answer = await ask(slug, question, key); // ✅ Now includes all required arguments
    return new NextResponse(answer);
  } catch (err: any) {
    console.error('[QUERY ERROR]', err);
    return NextResponse.json({ error: err.message || 'Query failed' }, { status: 500 });
  }
}