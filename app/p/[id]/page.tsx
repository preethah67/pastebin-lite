import { redis } from '@/lib/redis';
import { notFound } from 'next/navigation';

export default async function ViewPaste({ params }: { params: { id: string } }) {
  // Use await to get params in newer Next.js versions
  const { id } = await params;
  const paste: any = await redis.get(`paste:${id}`);

  // 1. Check if paste exists [cite: 67, 75]
  if (!paste) notFound();

  // 2. Check if expired [cite: 68]
  if (paste.expires_at && new Date(paste.expires_at).getTime() <= Date.now()) {
    notFound();
  }

  // 3. Check view limits [cite: 69]
  if (paste.remaining_views !== null && paste.remaining_views <= 0) {
    notFound();
  }

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        backgroundColor: '#f4f4f4', 
        padding: '15px' 
      }}>
        {paste.content} {/* React escapes this safely [cite: 76] */}
      </pre>
    </main>
  );
}