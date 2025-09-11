import { NextResponse } from 'next/server';
import schedulerService from '@/lib/scheduler';

export async function POST() {
  try {
    schedulerService.startDataCollection();
    return NextResponse.json({
      success: true,
      message: 'Scheduler started successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to start scheduler',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}