import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { buildIndex } from '../../lib/pdfquery';
import fs from 'node:fs/promises';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = formidable();
  const [fields, files] = await form.parse(req);
  const pdf = (files.file && files.file[0]) as formidable.File;
  if (!pdf) return res.status(400).json({ error: 'No file' });

  // copy file into /tmp so pdfquery can read it after formidable deletes temp file
  const tempPath = `/tmp/${pdf.newFilename}.pdf`;
  await fs.copyFile(pdf.filepath, tempPath);

  const slug = await buildIndex(tempPath);
  res.status(200).json({ slug });
}
