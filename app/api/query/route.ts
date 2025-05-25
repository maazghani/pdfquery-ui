import { NextResponse } from 'next/server';
import { ask } from '@/lib/pdfquery';

export async function POST(req: Request) {
  const { slug, question } = await req.json();
  if (!slug || !question) return NextResponse.json({ error: 'Missing input' }, { status: 400 });

  const answer = await ask(slug, question);
  return new NextResponse(answer);
}
