'use client';
import React, { useState, useRef } from 'react';

type Msg = { role: 'user' | 'assistant'; text: string };

export default function ChatClient({ slug }: { slug: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [txt, setTxt]   = useState('');
  const [apiKey]        = useState(localStorage.getItem('openai-key') || '');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send() {
    if (!txt.trim() || !apiKey) return;
    setMsgs(m => [...m, { role: 'user', text: txt }]);
    setTxt('');
    setLoading(true);

    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, question: txt, key: apiKey })
    });
    const answer = await res.text();
    setMsgs(m => [...m, { role: 'assistant', text: answer }]);
    setLoading(false);
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* message window */}
      <div className="h-[400px] overflow-y-auto rounded bg-[#2a2a2a] p-4 space-y-4">
        {msgs.map((m, i) => (
          <p key={i} className={m.role === 'user' ? 'text-blue-400' : 'text-gray-200'}>
            {m.text}
          </p>
        ))}
        {loading && <p className="text-gray-500">…thinking</p>}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="relative w-full">
        <textarea
          rows={1}
          className="w-full resize-none rounded-full bg-[#333] placeholder-gray-400 outline-none px-5 py-4 pr-28"
          placeholder="Ask anything"
          value={txt}
          onChange={e => setTxt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        />
        <button
          onClick={send}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black rounded-full px-4 py-2 font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
