import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const id = uuidv4().substring(0, 8);
    const pasteData = {
      id,
      content,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hour expiry
    };

    await redis.set(`paste:${id}`, pasteData);

    return NextResponse.json({ id });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}