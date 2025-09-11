import * as cron from 'node-cron';
import googleAnalyticsService from './googleAnalytics';
import databaseService from './database';

class SchedulerService {
  private task: cron.ScheduledTask | null = null;

  startDataCollection(): void {
    if (this.task) {
      console.log('Scheduler already running');
      return;
    }

    // Run every 3 minutes to avoid GA4 quota limits
    this.task = cron.schedule('*/3 * * * *', async () => {
      console.log(`[${new Date().toISOString()}] Fetching real-time user data...`);
      
      try {
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
          console.log(`[${new Date().toISOString()}] Successfully saved: ${usersResult.data.totalActiveUsers} users with location data`);
        } else {
          console.error('Failed to fetch analytics data:', usersResult.error || locationsResult.error);
        }
      } catch (error) {
        console.error('Error in scheduled task:', error);
      }
    });

    console.log('Scheduler started - collecting data every 3 minutes');
  }

  stopDataCollection(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log('Scheduler stopped');
    }
  }

  async collectDataNow(): Promise<void> {
    console.log('Manual data collection triggered');
    
    const result = await googleAnalyticsService.getRealtimeUsers();
    
    if (result.success && result.data) {
      await databaseService.saveActiveUsers(result.data);
      console.log(`Successfully saved active users: ${result.data.totalActiveUsers} users`);
    } else {
      throw new Error(result.error || 'Failed to fetch analytics data');
    }
  }

  getStatus() {
    return {
      isRunning: this.task !== null,
      schedule: '*/3 * * * * (every 3 minutes)',
      nextRun: 'In less than 3 minutes'
    };
  }
}

const schedulerService = new SchedulerService();
export default schedulerService;