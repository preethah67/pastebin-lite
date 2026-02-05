"use client";
import React, { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.id) window.location.href = `/p/${data.id}`;
    } catch (err) {
      alert("Failed to save!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2 text-center">
          Pastebin Lite
        </h1>
        <p className="text-gray-500 text-center mb-8 font-medium">Share your code snippets instantly and securely.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            className="w-full h-64 p-5 bg-gray-50 border-2 border-purple-100 rounded-2xl focus:border-purple-500 focus:ring-0 text-gray-800 font-mono text-sm transition-all outline-none"
            placeholder="Paste your masterpiece here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? '✨ Creating Magic...' : '🚀 Create Secret Paste'}
          </button>
        </form>
      </div>
    </main>
  );
}