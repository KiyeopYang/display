import { NextResponse } from 'next/server';
import googleAnalyticsService from '@/lib/googleAnalytics';
import databaseService from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { days = 730 } = await request.json(); // Default to 2 years (730 days)
    
    console.log(`Fetching historical user metrics for ${days} days...`);
    
    // Fetch historical data from Google Analytics
    const metrics = await googleAnalyticsService.getHistoricalUserMetrics(days);
    
    if (!metrics || metrics.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No historical data available'
      });
    }

    console.log(`Fetched ${metrics.length} days of data. Saving to database...`);
    
    // Save to database
    await databaseService.saveUserMetricsBatch(metrics);
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${metrics.length} days of historical data`,
      data: {
        daysImported: metrics.length,
        startDate: metrics[0]?.date,
        endDate: metrics[metrics.length - 1]?.date
      }
    });
  } catch (error) {
    console.error('Error importing historical user metrics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    
    const metrics = await databaseService.getUserMetrics(startDate, endDate);
    
    return NextResponse.json({
      success: true,
      data: metrics,
      count: metrics.length
    });
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}