import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const headers = request.headers;
  
  // Requirement: Deterministic Time for Testing [cite: 78, 79]
  const testNowHeader = headers.get('x-test-now-ms');
  const now = (process.env.TEST_MODE === '1' && testNowHeader) 
    ? parseInt(testNowHeader) 
    : Date.now();

  try {
    const paste: any = await redis.get(`paste:${id}`);

    // Requirement: Return 404 if missing [cite: 67, 71]
    if (!paste) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Requirement: Check Expiry (TTL) [cite: 68, 107]
    if (paste.expires_at && new Date(paste.expires_at).getTime() <= now) {
      return NextResponse.json({ error: "Expired" }, { status: 404 });
    }

    // Requirement: Check View Limits [cite: 69, 112]
    if (paste.remaining_views !== null && paste.remaining_views <= 0) {
      return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
    }

    // Requirement: Each successful fetch counts as a view [cite: 65]
    let updatedRemaining = paste.remaining_views;
    if (paste.remaining_views !== null) {
      updatedRemaining = paste.remaining_views - 1;
      // Update the count in Redis
      await redis.set(`paste:${id}`, { ...paste, remaining_views: updatedRemaining });
    }

    // Requirement: Successful response JSON [cite: 56, 57]
    return NextResponse.json({
      content: paste.content,
      remaining_views: updatedRemaining,
      expires_at: paste.expires_at
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}