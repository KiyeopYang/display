import { NextResponse } from 'next/server';
import databaseService from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    
    const locationHistory = await databaseService.getLocationHistory(hours);
    
    // Group by timestamp for better organization
    const groupedByTime: { [key: string]: any[] } = {};
    
    locationHistory.forEach(location => {
      if (!groupedByTime[location.timestamp]) {
        groupedByTime[location.timestamp] = [];
      }
      groupedByTime[location.timestamp].push({
        country: location.country,
        city: location.city,
        activeUsers: location.active_users,
        collectionId: location.collection_id
      });
    });
    
    // Convert to array format
    const timeSeriesData = Object.entries(groupedByTime).map(([timestamp, locations]) => ({
      timestamp,
      totalLocations: locations.length,
      totalUsers: locations.reduce((sum, loc) => sum + loc.activeUsers, 0),
      topLocations: locations
        .sort((a, b) => b.activeUsers - a.activeUsers)
        .slice(0, 10)
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        hours,
        totalRecords: locationHistory.length,
        timeSeries: timeSeriesData.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      }
    });
  } catch (error) {
    console.error('Error fetching location history:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch location history',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}