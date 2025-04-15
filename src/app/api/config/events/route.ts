import { NextResponse } from 'next/server';
import { getAllEvents } from '@/data/events';

export async function GET() {
  try {
    const events = getAllEvents();
    
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error getting events:', error);
    return NextResponse.json(
      { error: 'Failed to load events' },
      { status: 500 }
    );
  }
}