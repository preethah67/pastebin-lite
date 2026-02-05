import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { redis } from '@/lib/redis';

// Validate input requirements [cite: 43, 44, 45, 46]
const pasteSchema = z.object({
  content: z.string().min(1),
  ttl_seconds: z.number().int().min(1).optional(),
  max_views: z.number().int().min(1).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = pasteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 }); // [cite: 53]
    }

    const { content, ttl_seconds, max_views } = result.data;
    const id = uuidv4();
    
    const expires_at = ttl_seconds 
      ? new Date(Date.now() + ttl_seconds * 1000).toISOString() 
      : null;

    // Store the data [cite: 86]
    await redis.set(`paste:${id}`, {
      content,
      remaining_views: max_views ?? null, // [cite: 63]
      expires_at
    });

    if (ttl_seconds) {
      await redis.expire(`paste:${id}`, ttl_seconds);
    }

    const host = request.headers.get('host');
    const url = `https://${host}/p/${id}`; // [cite: 51]

    return NextResponse.json({ id, url }, { status: 201 }); // [cite: 50, 51]
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}