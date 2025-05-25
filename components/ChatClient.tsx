'use client';
import React, { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

export default function ChatClient({ slug }: { slug: string }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem('openai-key') || '' : ''
  );

  async function sendQuestion() {
    if (!question || !apiKey) return;
    setLoading(true);
    setError(null);

    setMessages((prev) => [...prev, { role: 'user', text: question }]);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, question, key: apiKey }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to get response');
      }

      const answer = await res.text();
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setQuestion('');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div className="border p-4 rounded h-[400px] overflow-y-auto bg-white shadow-inner">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-blue-600' : 'text-black'}`}>
            <strong>{m.role === 'user' ? 'You' : 'Assistant'}:</strong> {m.text}
          </div>
        ))}
        {loading && <div className="text-gray-500">Thinking...</div>}
      </div>

      <textarea
        rows={2}
        className="border p-2 rounded resize-none"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={sendQuestion}
        disabled={loading || !question || !apiKey}
      >
        Send
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}