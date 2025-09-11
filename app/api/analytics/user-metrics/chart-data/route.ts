import { NextResponse } from 'next/server';
import databaseService from '@/lib/database';

export async function GET() {
  try {
    // Get 2 years of data up to D-2 (2 days ago)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 2); // D-2
    
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);
    
    const metrics = await databaseService.getUserMetrics(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    
    // Format data for chart
    const chartData = {
      labels: metrics.map(m => m.date),
      datasets: [
        {
          label: '전체 사용자',
          data: metrics.map(m => m.total_users),
          borderColor: '#000000',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          tension: 0.4
        },
        {
          label: '신규 사용자',
          data: metrics.map(m => m.new_users),
          borderColor: '#666666',
          backgroundColor: 'rgba(102, 102, 102, 0.1)',
          tension: 0.4
        },
        {
          label: '재방문 사용자',
          data: metrics.map(m => m.returning_users),
          borderColor: '#999999',
          backgroundColor: 'rgba(153, 153, 153, 0.1)',
          tension: 0.4
        }
      ]
    };
    
    return NextResponse.json({
      success: true,
      data: chartData,
      count: metrics.length,
      dateRange: {
        start: metrics[0]?.date,
        end: metrics[metrics.length - 1]?.date
      }
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}