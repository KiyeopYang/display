import { NextResponse } from 'next/server';
import databaseService from '@/lib/database';

export async function GET() {
  try {
    // Get the latest data from SQLite instead of calling GA4 API
    const latest = await databaseService.getLatestEntry();
    
    if (latest) {
      // Format the data to match what the dashboard expects
      const formattedData = {
        success: true,
        data: {
          totalActiveUsers: latest.total_active_users,
          byCountry: latest.by_country,
          byDevice: latest.by_device,
          byPlatform: latest.by_platform,
          locationDetails: latest.location_details || [],
          timestamp: latest.timestamp
        }
      };
      
      return NextResponse.json(formattedData);
    } else {
      // No data yet, return empty response
      return NextResponse.json({
        success: true,
        data: {
          totalActiveUsers: 0,
          byCountry: {},
          byDevice: {},
          byPlatform: {},
          locationDetails: [],
          timestamp: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error fetching dashboard data from SQLite:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}