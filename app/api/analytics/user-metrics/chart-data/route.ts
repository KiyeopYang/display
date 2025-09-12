import { NextResponse } from 'next/server';
import databaseService from '@/lib/database';

export async function GET() {
  try {
    // Get 1 year of data up to D-2 (2 days ago)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 2); // D-2
    
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    const metrics = await databaseService.getUserMetrics(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    
    // Format data for chart - daily data with styled lines
    const chartData = {
      labels: metrics.map(m => {
        const date = new Date(m.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          label: '전체 사용자',
          data: metrics.map(m => m.total_users),
          borderColor: '#ec4899',
          backgroundColor: 'rgba(236, 72, 153, 0.05)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ec4899',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          borderDash: [],
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
        },
        {
          label: '재방문 사용자',
          data: metrics.map(m => m.returning_users),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.05)',
          borderWidth: 2.5,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: '#8b5cf6',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          borderDash: [],
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
        },
        {
          label: '신규 사용자',
          data: metrics.map(m => m.new_users),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          borderDash: [5, 5],
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
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