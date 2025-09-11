import * as cron from 'node-cron';
import googleAnalyticsService from './googleAnalytics';
import databaseService from './database';

class SchedulerService {
  private task: cron.ScheduledTask | null = null;
  private dailyTask: cron.ScheduledTask | null = null;

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

    // Daily task to update user metrics (runs at 2 AM every day)
    this.dailyTask = cron.schedule('0 2 * * *', async () => {
      console.log(`[${new Date().toISOString()}] Running daily user metrics update...`);
      
      try {
        // Get last 3 days of user metrics
        const metrics = await googleAnalyticsService.getRecentUserMetrics(3);
        
        if (metrics && metrics.length > 0) {
          // Save/update in database
          await databaseService.saveUserMetricsBatch(metrics);
          console.log(`Daily update completed - Updated ${metrics.length} days of user metrics`);
        }
      } catch (error) {
        console.error('Error in daily scheduler:', error);
      }
    });

    console.log('Scheduler started - collecting real-time data every 3 minutes and user metrics daily at 2 AM');
  }

  stopDataCollection(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log('Real-time scheduler stopped');
    }
    if (this.dailyTask) {
      this.dailyTask.stop();
      this.dailyTask = null;
      console.log('Daily scheduler stopped');
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