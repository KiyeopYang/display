import { NextResponse } from 'next/server';
import googleAnalyticsService from '@/lib/googleAnalytics';
import databaseService from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { days = 3 } = await request.json(); // Default to last 3 days
    
    console.log(`Updating user metrics for the last ${days} days...`);
    
    // Fetch recent data from Google Analytics
    const metrics = await googleAnalyticsService.getRecentUserMetrics(days);
    
    if (!metrics || metrics.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No recent data available'
      });
    }

    console.log(`Fetched ${metrics.length} days of recent data. Updating database...`);
    
    // Save/update in database (will overwrite existing data for these dates)
    await databaseService.saveUserMetricsBatch(metrics);
    
    const koreanTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    console.log(`[${koreanTime}] User metrics updated for dates: ${metrics[0].date} to ${metrics[metrics.length - 1].date}`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully updated ${metrics.length} days of data`,
      data: {
        daysUpdated: metrics.length,
        dates: metrics.map(m => m.date),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating user metrics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get the last 7 days of data from database for preview
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const metrics = await databaseService.getUserMetrics(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    
    return NextResponse.json({
      success: true,
      data: metrics,
      count: metrics.length
    });
  } catch (error) {
    console.error('Error fetching recent user metrics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}