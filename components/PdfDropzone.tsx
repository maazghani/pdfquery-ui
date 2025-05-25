'use client';
import React, { useState } from 'react';
import ChatClient from './ChatClient';

export default function PdfDropzone() {
  const [slug, setSlug] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/index', { method: 'POST', body: form });
    const data = await res.json();
    setSlug(data.slug);
  }

  return slug
    ? <ChatClient slug={slug} />
    : <input type="file" accept="application/pdf" onChange={onFile} />;
}
