'use client';
import React, { useState } from 'react';
import ChatClient from './ChatClient';

export default function PdfDropzone() {
  const [slug, setSlug] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai-key') || '');
  const [drag, setDrag]   = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!apiKey) { setError('Enter your API key first'); return; }

    const form = new FormData();
    form.append('file', file);
    form.append('key', apiKey);

    const res = await fetch('/api/index', { method: 'POST', body: form });
    if (!res.ok) {
      const { error } = await res.json();
      setError(error || 'Upload failed');
      return;
    }
    const { slug } = await res.json();
    setSlug(slug);
  }

  if (slug) return <ChatClient slug={slug} />;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* key input */}
      <input
        type="password"
        placeholder="OpenAI API key..."
        className="w-full border border-gray-600 bg-[#111] rounded px-4 py-3 focus:outline-none"
        value={apiKey}
        onChange={e => {
          setApiKey(e.target.value);
          localStorage.setItem('openai-key', e.target.value);
        }}
      />

      {/* drag-and-drop zone */}
      <label
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => {
          e.preventDefault(); setDrag(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-40 cursor-pointer
          ${drag ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-[#111]'}`}
      >
        <p className="text-gray-400">Drag & drop your PDF here</p>
        <p className="text-gray-600 text-sm">or click to choose a file</p>
        <input
          type="file"
          accept="application/pdf"
          hidden
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}