import { NextResponse } from 'next/server';
import schedulerService from '@/lib/scheduler';

export async function GET() {
  const status = schedulerService.getStatus();
  return NextResponse.json({
    success: true,
    data: status
  });
}