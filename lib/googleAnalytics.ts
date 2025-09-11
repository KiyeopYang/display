import { BetaAnalyticsDataClient } from '@google-analytics/data';

interface LocationDetails {
  country: string;
  region: string;
  city: string;
  activeUsers: number;
}

export class GoogleAnalyticsService {
  private analyticsDataClient: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor() {
    const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    
    if (!keyFilePath) {
      console.warn('GOOGLE_APPLICATION_CREDENTIALS not set. Using default authentication.');
      this.analyticsDataClient = new BetaAnalyticsDataClient();
    } else {
      this.analyticsDataClient = new BetaAnalyticsDataClient({
        keyFilename: keyFilePath
      });
    }

    this.propertyId = process.env.GA4_PROPERTY_ID || '';
    
    if (!this.propertyId) {
      console.error('GA4_PROPERTY_ID is not set in environment variables');
    }
  }

  async getRealtimeUsers() {
    try {
      if (!this.propertyId) {
        throw new Error('GA4 Property ID is not configured');
      }

      const [response] = await this.analyticsDataClient.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        dimensions: [
          { name: 'country' },
          { name: 'deviceCategory' },
          { name: 'platform' }
        ],
        metrics: [
          { name: 'activeUsers' }
        ]
      });

      const summary = {
        totalActiveUsers: 0,
        byCountry: {} as Record<string, number>,
        byDevice: {} as Record<string, number>,
        byPlatform: {} as Record<string, number>,
        timestamp: new Date().toISOString()
      };

      if (response.rows) {
        response.rows.forEach(row => {
          const activeUsers = parseInt(row.metricValues?.[0]?.value || '0');
          const country = row.dimensionValues?.[0]?.value || 'Unknown';
          const device = row.dimensionValues?.[1]?.value || 'Unknown';
          const platform = row.dimensionValues?.[2]?.value || 'Unknown';

          summary.totalActiveUsers += activeUsers;

          if (!summary.byCountry[country]) {
            summary.byCountry[country] = 0;
          }
          summary.byCountry[country] += activeUsers;

          if (!summary.byDevice[device]) {
            summary.byDevice[device] = 0;
          }
          summary.byDevice[device] += activeUsers;

          if (!summary.byPlatform[platform]) {
            summary.byPlatform[platform] = 0;
          }
          summary.byPlatform[platform] += activeUsers;
        });
      }

      return {
        success: true,
        data: summary,
        rawData: response.rows || []
      };
    } catch (error) {
      console.error('Error fetching realtime data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null
      };
    }
  }

  async getDetailedLocationData() {
    try {
      if (!this.propertyId) {
        throw new Error('GA4 Property ID is not configured');
      }

      const [response] = await this.analyticsDataClient.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        dimensions: [
          { name: 'country' },
          { name: 'city' },
          { name: 'cityId' }
        ],
        metrics: [
          { name: 'activeUsers' }
        ],
        limit: 200
      });

      const locations: LocationDetails[] = [];
      const summary = {
        totalActiveUsers: 0,
        byCountry: {} as Record<string, number>,
        byRegion: {} as Record<string, number>,
        byCity: {} as Record<string, number>,
        locationDetails: [] as LocationDetails[]
      };

      if (response.rows) {
        response.rows.forEach(row => {
          const country = row.dimensionValues?.[0]?.value || 'Unknown';
          const city = row.dimensionValues?.[1]?.value || 'Unknown';
          const region = '';
          const activeUsers = parseInt(row.metricValues?.[0]?.value || '0');

          summary.totalActiveUsers += activeUsers;

          if (!summary.byCountry[country]) {
            summary.byCountry[country] = 0;
          }
          summary.byCountry[country] += activeUsers;

          const cityKey = `${city}, ${country}`;
          if (!summary.byCity[cityKey]) {
            summary.byCity[cityKey] = 0;
          }
          summary.byCity[cityKey] += activeUsers;

          const existingLocation = locations.find(
            loc => loc.country === country && loc.region === region && loc.city === city
          );
          
          if (existingLocation) {
            existingLocation.activeUsers += activeUsers;
          } else {
            locations.push({
              country,
              region,
              city,
              activeUsers
            });
          }
        });

        summary.locationDetails = locations.sort((a, b) => b.activeUsers - a.activeUsers);
      }

      return {
        success: true,
        data: summary,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching detailed location data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null
      };
    }
  }

  async getUserMetrics(startDate: string, endDate: string): Promise<any> {
    try {
      if (!this.propertyId) {
        throw new Error('GA4 Property ID is not configured');
      }

      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dimensions: [
          { name: 'date' }
        ],
        metrics: [
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'activeUsers' },
          { name: 'sessions' }
        ],
        dateRanges: [
          {
            startDate,
            endDate
          }
        ],
        orderBys: [
          {
            dimension: {
              dimensionName: 'date'
            },
            desc: false
          }
        ]
      });

      // Process the response to calculate returning users
      const metrics = response.rows?.map((row: any) => {
        const date = row.dimensionValues[0].value;
        const totalUsers = parseInt(row.metricValues[0].value) || 0;
        const newUsers = parseInt(row.metricValues[1].value) || 0;
        const activeUsers = parseInt(row.metricValues[2].value) || 0;
        const sessions = parseInt(row.metricValues[3].value) || 0;
        const returningUsers = totalUsers - newUsers;

        // Format date as YYYY-MM-DD
        const formattedDate = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;

        return {
          date: formattedDate,
          totalUsers,
          newUsers,
          returningUsers: Math.max(0, returningUsers), // Ensure non-negative
          activeUsers,
          sessions
        };
      }) || [];

      return metrics;
    } catch (error) {
      console.error('Error getting user metrics:', error);
      throw error;
    }
  }

  async getHistoricalUserMetrics(days: number = 730): Promise<any[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Format dates as YYYYMMDD for GA4 API
      const startDateStr = startDate.toISOString().split('T')[0].replace(/-/g, '');
      const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');

      return await this.getUserMetrics(startDateStr, endDateStr);
    } catch (error) {
      console.error('Error getting historical user metrics:', error);
      throw error;
    }
  }

  async getRecentUserMetrics(days: number = 3): Promise<any[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days + 1); // Include today

      // Format dates as YYYYMMDD for GA4 API
      const startDateStr = startDate.toISOString().split('T')[0].replace(/-/g, '');
      const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');

      return await this.getUserMetrics(startDateStr, endDateStr);
    } catch (error) {
      console.error('Error getting recent user metrics:', error);
      throw error;
    }
  }
}

export default {
  getRealtimeUsers: async () => {
    const service = new GoogleAnalyticsService();
    return service.getRealtimeUsers();
  },
  getDetailedLocationData: async () => {
    const service = new GoogleAnalyticsService();
    return service.getDetailedLocationData();
  },
  getHistoricalUserMetrics: async (days?: number) => {
    const service = new GoogleAnalyticsService();
    return service.getHistoricalUserMetrics(days);
  },
  getRecentUserMetrics: async (days?: number) => {
    const service = new GoogleAnalyticsService();
    return service.getRecentUserMetrics(days);
  }
};