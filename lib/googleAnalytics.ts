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
}

export default {
  getRealtimeUsers: async () => {
    const service = new GoogleAnalyticsService();
    return service.getRealtimeUsers();
  },
  getDetailedLocationData: async () => {
    const service = new GoogleAnalyticsService();
    return service.getDetailedLocationData();
  }
};