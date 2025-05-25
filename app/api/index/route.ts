import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { buildIndex } from '@/lib/pdfquery';
import fs from 'node:fs/promises';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const form = formidable();
  const data = await req.formData();
  const file = data.get('file') as File;
  const bytes = await file.arrayBuffer();
  const buf = Buffer.from(bytes);

  const tmpPath = `/tmp/${Date.now()}-${file.name}`;
  await fs.writeFile(tmpPath, buf);
  const slug = await buildIndex(tmpPath);

  return NextResponse.json({ slug });
}
