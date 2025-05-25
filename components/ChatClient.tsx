'use client';
import React, { useState, useRef, useEffect } from 'react';

type Msg = { role: 'user' | 'assistant'; text: string };

export default function ChatClient({ slug }: { slug: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [txt, setTxt]   = useState('');
  const apiKey = localStorage.getItem('openai-key') || '';
  const [loading, setLoading] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  async function send() {
    if (!txt.trim()) return;
    setMsgs(m => [...m, { role: 'user', text: txt }]);
    setTxt(''); setLoading(true);

    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, question: txt, key: apiKey }),
    });
    const answer = await res.text();
    setMsgs(m => [...m, { role: 'assistant', text: answer }]);
    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* chat pane */}
      <div className="h-[420px] overflow-y-auto space-y-4 rounded bg-[#111] p-4">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <p className="text-gray-500">…thinking</p>}
        <div ref={bottom} />
      </div>

      {/* input bar */}
      <div className="relative">
        <textarea
          rows={1}
          value={txt}
          onChange={e => setTxt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask anything…"
          className="w-full resize-none rounded-full bg-[#222] text-white placeholder-gray-500 px-6 py-4 pr-28 outline-none"
        />
        <button
          onClick={send}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white rounded-full px-5 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}