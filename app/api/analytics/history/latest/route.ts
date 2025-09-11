import { NextResponse } from 'next/server';
import databaseService from '@/lib/database';

export async function GET() {
  try {
    const latest = await databaseService.getLatestEntry();
    
    return NextResponse.json({
      success: true,
      data: latest
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve latest data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}