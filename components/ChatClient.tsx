'use client';
import React, { useState } from 'react';

export default function ChatClient({ slug }: { slug: string }) {
  const [history, setHistory] = useState<{role: string; text: string}[]>([]);
  const [q, setQ] = useState('');

  async function send() {
    if (!q) return;
    setHistory(h => [...h, { role: 'user', text: q }]);
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, question: q }),
    });
    const answer = await res.text();
    setHistory(h => [...h, { role: 'assistant', text: answer }]);
    setQ('');
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grow overflow-y-auto border rounded p-3 h-64">
        {history.map((m, i) => (
          <p key={i} className={m.role === 'user' ? 'font-semibold' : ''}>
            <span className="opacity-60">{m.role}: </span>{m.text}
          </p>
        ))}
      </div>
      <input
        className="border p-2 rounded"
        placeholder="Ask something…"
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && send()}
      />
    </div>
  );
}
