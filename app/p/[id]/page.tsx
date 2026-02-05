import { redis } from '@/lib/redis';
import { notFound } from 'next/navigation';

export default async function ViewPaste({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paste: any = await redis.get(`paste:${id}`);

  if (!paste) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-tr from-yellow-200 via-pink-200 to-pink-400 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-pink-600">Your Secret Paste</h2>
          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold uppercase">ID: {id}</span>
        </div>
        
        {/* This is where your entered text will show up clearly */}
        <div className="bg-white border-2 border-pink-100 rounded-xl p-6 min-h-[300px] shadow-inner">
          <pre className="text-gray-800 font-mono text-lg whitespace-pre-wrap break-words">
            <code>{paste.content}</code>
          </pre>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-pink-600 hover:text-pink-800 font-bold underline transition-all">
            ← Create Another One
          </a>
        </div>
      </div>
    </main>
  );
}