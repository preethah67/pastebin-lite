import { redis } from '@/lib/redis';
import { notFound } from 'next/navigation';

export default async function ViewPaste({ params }: { params: { id: string } }) {
  const paste: any = await redis.get(`paste:${params.id}`);

  // Requirement: If unavailable, return 404 [cite: 75]
  if (!paste) notFound();

  // Simple logic to check if expired or out of views
  if (paste.expires_at && new Date(paste.expires_at).getTime() <= Date.now()) notFound();
  if (paste.remaining_views !== null && paste.remaining_views <= 0) notFound();

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Paste Content</h1>
      <hr />
      {/* Requirement: Rendered safely (no script execution) [cite: 76] */}
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {paste.content}
      </pre>
    </main>
  );
}