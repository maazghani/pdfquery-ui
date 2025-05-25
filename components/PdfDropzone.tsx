'use client';
import React, { useState } from 'react';
import ChatClient from './ChatClient';

export default function PdfDropzone() {
  const [slug, setSlug] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem('openai-key') || '' : ''
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !apiKey) {
      setError('Both PDF file and API key are required.');
      return;
    }

    setUploading(true);
    setError(null);

    const form = new FormData();
    form.append('file', file);
    form.append('key', apiKey);

    try {
      const res = await fetch('/api/index', { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to upload');
      }

      const data = await res.json();
      setSlug(data.slug);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function onApiKeyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem('openai-key', key);
  }

  return slug ? (
    <ChatClient slug={slug} />
  ) : (
    <div className="flex flex-col gap-4">
      <input
        type="password"
        placeholder="Enter your OpenAI API key"
        className="border rounded p-2"
        value={apiKey}
        onChange={onApiKeyChange}
      />
      <input
        type="file"
        accept="application/pdf"
        className="border rounded p-2"
        onChange={onFile}
        disabled={uploading}
      />
      {uploading && <p className="text-sm text-gray-500">Uploading and indexing PDF…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}