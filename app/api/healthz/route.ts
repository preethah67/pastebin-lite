import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    // Check if the persistence layer is accessible [cite: 31]
    await redis.ping(); 
    return NextResponse.json({ ok: true }, { status: 200 }); // [cite: 27, 34]
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}