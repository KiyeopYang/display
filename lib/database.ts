import sqlite3 from 'sqlite3';
import path from 'path';

class DatabaseService {
  private db!: sqlite3.Database;
  private isInitialized: Promise<void>;

  constructor() {
    this.isInitialized = this.init();
  }

  private async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(process.cwd(), 'analytics.db');
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
          return;
        }
        console.log('Connected to SQLite database');
        
        this.createTables()
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  private createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create main active_users table
      const sqlUsers = `
        CREATE TABLE IF NOT EXISTS active_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          total_active_users INTEGER,
          by_country TEXT,
          by_device TEXT,
          by_platform TEXT,
          location_details TEXT,
          raw_data TEXT
        )
      `;

      // Create location_history table for detailed city/country tracking
      const sqlLocations = `
        CREATE TABLE IF NOT EXISTS location_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          country TEXT NOT NULL,
          city TEXT NOT NULL,
          active_users INTEGER NOT NULL,
          collection_id INTEGER,
          FOREIGN KEY (collection_id) REFERENCES active_users(id)
        )
      `;

      // Create user_metrics table for historical data
      const sqlUserMetrics = `
        CREATE TABLE IF NOT EXISTS user_metrics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date DATE NOT NULL UNIQUE,
          total_users INTEGER NOT NULL DEFAULT 0,
          new_users INTEGER NOT NULL DEFAULT 0,
          returning_users INTEGER NOT NULL DEFAULT 0,
          active_users INTEGER DEFAULT 0,
          sessions INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create indexes for better query performance
      const sqlIndexes = [
        `CREATE INDEX IF NOT EXISTS idx_location_timestamp ON location_history(timestamp)`,
        `CREATE INDEX IF NOT EXISTS idx_location_country ON location_history(country)`,
        `CREATE INDEX IF NOT EXISTS idx_location_city ON location_history(city)`,
        `CREATE INDEX IF NOT EXISTS idx_user_metrics_date ON user_metrics(date)`
      ];

      this.db.run(sqlUsers, (err) => {
        if (err) {
          console.error('Error creating active_users table:', err);
          reject(err);
          return;
        }
        console.log('Active users table ready');
        
        // Create location_history table
        this.db.run(sqlLocations, (err) => {
          if (err) {
            console.error('Error creating location_history table:', err);
            reject(err);
            return;
          }
          console.log('Location history table ready');
          
          // Create user_metrics table
          this.db.run(sqlUserMetrics, (err) => {
            if (err) {
              console.error('Error creating user_metrics table:', err);
              reject(err);
              return;
            }
            console.log('User metrics table ready');
            
            // Create indexes
            let indexCount = 0;
            sqlIndexes.forEach(indexSql => {
              this.db.run(indexSql, (err) => {
                indexCount++;
                if (indexCount === sqlIndexes.length) {
                  // Try to add column for existing databases
                  this.db.run(`ALTER TABLE active_users ADD COLUMN location_details TEXT`, () => {
                    resolve();
                  });
                }
              });
            });
          });
        });
      });
    });
  }

  async saveActiveUsers(data: any): Promise<void> {
    await this.isInitialized;
    
    return new Promise((resolve, reject) => {
      if (!data) {
        resolve();
        return;
      }

      // Store timestamp as ISO string with timezone
      const sql = `
        INSERT INTO active_users (timestamp, total_active_users, by_country, by_device, by_platform, raw_data)
        VALUES (datetime('now', 'localtime'), ?, ?, ?, ?, ?)
      `;

      const params = [
        data.totalActiveUsers || 0,
        JSON.stringify(data.byCountry || {}),
        JSON.stringify(data.byDevice || {}),
        JSON.stringify(data.byPlatform || {}),
        JSON.stringify(data.rawData || [])
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Error saving active users:', err);
          reject(err);
          return;
        }
        const koreanTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        console.log(`[${koreanTime}] Active users data saved - ID: ${this.lastID}, Users: ${data.totalActiveUsers}`);
        resolve();
      });
    });
  }

  async getRecentHistory(hours: number = 24): Promise<any[]> {
    await this.isInitialized;
    
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM active_users 
        WHERE datetime(timestamp) > datetime('now', '-${hours} hours')
        ORDER BY timestamp DESC
      `;

      this.db.all(sql, (err, rows) => {
        if (err) {
          console.error('Error fetching history:', err);
          reject(err);
          return;
        }
        
        const parsedRows = rows.map((row: any) => ({
          ...row,
          by_country: JSON.parse(row.by_country || '{}'),
          by_device: JSON.parse(row.by_device || '{}'),
          by_platform: JSON.parse(row.by_platform || '{}'),
          raw_data: JSON.parse(row.raw_data || '[]')
        }));
        
        resolve(parsedRows);
      });
    });
  }

  async getLatestEntry(): Promise<any> {
    await this.isInitialized;
    
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM active_users 
        ORDER BY timestamp DESC 
        LIMIT 1
      `;

      this.db.get(sql, (err, row) => {
        if (err) {
          console.error('Error fetching latest entry:', err);
          reject(err);
          return;
        }
        
        if (row) {
          const parsedRow = {
            ...row,
            by_country: JSON.parse((row as any).by_country || '{}'),
            by_device: JSON.parse((row as any).by_device || '{}'),
            by_platform: JSON.parse((row as any).by_platform || '{}'),
            location_details: JSON.parse((row as any).location_details || '[]'),
            raw_data: JSON.parse((row as any).raw_data || '[]')
          };
          resolve(parsedRow);
        } else {
          resolve(null);
        }
      });
    });
  }

  async saveCompleteData(data: any): Promise<void> {
    await this.isInitialized;
    
    return new Promise((resolve, reject) => {
      if (!data) {
        resolve();
        return;
      }

      const sql = `
        INSERT INTO active_users (timestamp, total_active_users, by_country, by_device, by_platform, location_details, raw_data)
        VALUES (datetime('now', 'localtime'), ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        data.totalActiveUsers || 0,
        JSON.stringify(data.byCountry || {}),
        JSON.stringify(data.byDevice || {}),
        JSON.stringify(data.byPlatform || {}),
        JSON.stringify(data.locationDetails || []),
        JSON.stringify(data.rawData || [])
      ];

      this.db.run(sql, params, async function(err) {
        if (err) {
          console.error('Error saving complete data:', err);
          reject(err);
          return;
        }
        
        const collectionId = this.lastID;
        const koreanTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        console.log(`[${koreanTime}] Complete data saved - ID: ${collectionId}, Users: ${data.totalActiveUsers}, Locations: ${data.locationDetails?.length || 0}`);
        
        // Save individual location records
        if (data.locationDetails && data.locationDetails.length > 0) {
          try {
            await databaseService.saveLocationHistory(data.locationDetails, collectionId);
            console.log(`[${koreanTime}] Location history saved - ${data.locationDetails.length} locations`);
          } catch (locErr) {
            console.error('Error saving location history:', locErr);
          }
        }
        
        resolve();
      });
    });
  }

  async saveLocationHistory(locations: any[], collectionId: number): Promise<void> {
    await this.isInitialized;
    
    return new Promise((resolve, reject) => {
      if (!locations || locations.length === 0) {
        resolve();
        return;
      }

      const sql = `
        INSERT INTO location_history (timestamp, country, city, active_users, collection_id)
        VALUES (datetime('now', 'localtime'), ?, ?, ?, ?)
      `;

      let savedCount = 0;
      let errors: any[] = [];

      locations.forEach((location) => {
        const params = [
          location.country || 'Unknown',
          location.city || 'Unknown',
          location.activeUsers || 0,
          collectionId
        ];

        this.db.run(sql, params, (err) => {
          if (err) {
            errors.push(err);
          }
          savedCount++;
          
          if (savedCount === locations.length) {
            if (errors.length > 0) {
              console.error(`Failed to save ${errors.length} location records`);
            }
            resolve();
          }
        });
      });
    });
  }

  async getLocationHistory(hours: number = 24): Promise<any[]> {
    await this.isInitialized;
    
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          timestamp,
          country,
          city,
          active_users,
          collection_id
        FROM location_history 
        WHERE datetime(timestamp) > datetime('now', '-${hours} hours')
        ORDER BY timestamp DESC, active_users DESC
      `;

      this.db.all(sql, (err, rows) => {
        if (err) {
          console.error('Error fetching location history:', err);
          reject(err);
          return;
        }
        resolve(rows || []);
      });
    });
  }

  async saveUserMetrics(metrics: {
    date: string;
    totalUsers: number;
    newUsers: number;
    returningUsers: number;
    activeUsers?: number;
    sessions?: number;
  }): Promise<void> {
    await this.isInitialized;
    
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO user_metrics (date, total_users, new_users, returning_users, active_users, sessions)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(date) DO UPDATE SET
          total_users = excluded.total_users,
          new_users = excluded.new_users,
          returning_users = excluded.returning_users,
          active_users = COALESCE(excluded.active_users, active_users),
          sessions = COALESCE(excluded.sessions, sessions),
          updated_at = datetime('now', 'localtime')
      `;

      const params = [
        metrics.date,
        metrics.totalUsers,
        metrics.newUsers,
        metrics.returningUsers,
        metrics.activeUsers || 0,
        metrics.sessions || 0
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Error saving user metrics:', err);
          reject(err);
          return;
        }
        console.log(`User metrics saved for ${metrics.date}`);
        resolve();
      });
    });
  }

  async getUserMetrics(startDate?: string, endDate?: string): Promise<any[]> {
    await this.isInitialized;
    
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT * FROM user_metrics
      `;
      const params: any[] = [];

      if (startDate && endDate) {
        sql += ` WHERE date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      } else if (startDate) {
        sql += ` WHERE date >= ?`;
        params.push(startDate);
      } else if (endDate) {
        sql += ` WHERE date <= ?`;
        params.push(endDate);
      }

      sql += ` ORDER BY date ASC`;

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Error fetching user metrics:', err);
          reject(err);
          return;
        }
        resolve(rows || []);
      });
    });
  }

  async saveUserMetricsBatch(metricsList: Array<{
    date: string;
    totalUsers: number;
    newUsers: number;
    returningUsers: number;
    activeUsers?: number;
    sessions?: number;
  }>): Promise<void> {
    await this.isInitialized;
    
    for (const metrics of metricsList) {
      await this.saveUserMetrics(metrics);
    }
  }
}

const databaseService = new DatabaseService();
export default databaseService;