import { NextResponse } from 'next/server';
import googleAnalyticsService from '@/lib/googleAnalytics';
import databaseService from '@/lib/database';

export async function POST() {
  try {
    console.log('Manual data collection triggered');
    
    // Get both realtime users and location data
    const [usersResult, locationsResult] = await Promise.all([
      googleAnalyticsService.getRealtimeUsers(),
      googleAnalyticsService.getDetailedLocationData()
    ]);
    
    if (usersResult.success && usersResult.data && locationsResult.success && locationsResult.data) {
      // Combine the data for storage
      const combinedData = {
        ...usersResult.data,
        locationDetails: locationsResult.data.locationDetails
      };
      
      await databaseService.saveCompleteData(combinedData);
      
      return NextResponse.json({
        success: true,
        message: 'Data collection completed successfully',
        data: {
          totalUsers: usersResult.data.totalActiveUsers,
          locations: locationsResult.data.locationDetails.length
        }
      });
    } else {
      throw new Error(usersResult.error || locationsResult.error || 'Failed to fetch data');
    }
  } catch (error) {
    console.error('Error in manual data collection:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to collect data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}