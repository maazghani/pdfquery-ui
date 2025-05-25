import type { NextApiRequest, NextApiResponse } from 'next';
import { ask } from '../../lib/pdfquery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { slug, question } = req.body;
  if (!slug || !question) return res.status(400).json({ error: 'Bad request' });

  const answer = await ask(slug, question);
  res.status(200).send(answer);
}
