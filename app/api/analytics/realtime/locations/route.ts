import { NextResponse } from 'next/server';
import googleAnalyticsService from '@/lib/googleAnalytics';

export async function GET() {
  try {
    const result = await googleAnalyticsService.getDetailedLocationData();
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}