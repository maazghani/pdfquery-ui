import { NextResponse } from 'next/server';
import { buildIndex } from '@/lib/pdfquery';
import fs from 'node:fs/promises';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const key = formData.get('key') as string;

  if (!file || !key) {
    return NextResponse.json({ error: 'Missing file or key' }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const tmpPath = `/tmp/${Date.now()}-${file.name}`;
  await fs.writeFile(tmpPath, buf);

  const slug = await buildIndex(tmpPath, key);
  return NextResponse.json({ slug }); // ✅ return structured JSON
}
