import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // This 'await' fixes the build error
    const paste = await redis.get(`paste:${id}`);

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    return NextResponse.json(paste);
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json({ error: 'Failed to fetch paste' }, { status: 500 });
  }
}