// Manual script to import user metrics from Google Analytics
// Run this script to populate historical data

require('dotenv').config();
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize GA client
const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const propertyId = process.env.GA4_PROPERTY_ID;

if (!propertyId) {
  console.error('GA4_PROPERTY_ID is not set in .env file');
  process.exit(1);
}

const analyticsDataClient = keyFilePath 
  ? new BetaAnalyticsDataClient({ keyFilename: keyFilePath })
  : new BetaAnalyticsDataClient();

// Initialize database
const dbPath = path.join(process.cwd(), 'analytics.db');
const db = new sqlite3.Database(dbPath);

// Create table if not exists
const createTableSQL = `
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

// Create index
const createIndexSQL = `
  CREATE INDEX IF NOT EXISTS idx_user_metrics_date ON user_metrics(date)
`;

async function getUserMetrics(startDate, endDate) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'activeUsers' },
        { name: 'sessions' }
      ],
      dateRanges: [{ startDate, endDate }],
      orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
    });

    return response.rows?.map(row => {
      const date = row.dimensionValues[0].value;
      const totalUsers = parseInt(row.metricValues[0].value) || 0;
      const newUsers = parseInt(row.metricValues[1].value) || 0;
      const activeUsers = parseInt(row.metricValues[2].value) || 0;
      const sessions = parseInt(row.metricValues[3].value) || 0;
      const returningUsers = Math.max(0, totalUsers - newUsers);

      // Format date as YYYY-MM-DD
      const formattedDate = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;

      return {
        date: formattedDate,
        totalUsers,
        newUsers,
        returningUsers,
        activeUsers,
        sessions
      };
    }) || [];
  } catch (error) {
    console.error('Error fetching from GA4:', error);
    throw error;
  }
}

function saveMetrics(metrics) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO user_metrics (date, total_users, new_users, returning_users, active_users, sessions)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        total_users = excluded.total_users,
        new_users = excluded.new_users,
        returning_users = excluded.returning_users,
        active_users = excluded.active_users,
        sessions = excluded.sessions,
        updated_at = datetime('now', 'localtime')
    `;

    let savedCount = 0;
    metrics.forEach((metric, index) => {
      db.run(sql, [
        metric.date,
        metric.totalUsers,
        metric.newUsers,
        metric.returningUsers,
        metric.activeUsers,
        metric.sessions
      ], (err) => {
        if (err) {
          console.error(`Error saving ${metric.date}:`, err);
        } else {
          savedCount++;
        }
        
        if (index === metrics.length - 1) {
          resolve(savedCount);
        }
      });
    });
  });
}

async function importData(days = 730) {
  console.log(`=== Importing User Metrics (${days} days) ===\n`);
  
  // Create table
  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    
    db.run(createIndexSQL, async (err) => {
      if (err) {
        console.error('Error creating index:', err);
      }
      
      try {
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days + 1);
        
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        console.log(`Fetching data from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}...`);
        
        // Fetch metrics
        const metrics = await getUserMetrics(startDateStr, endDateStr);
        console.log(`Fetched ${metrics.length} days of data`);
        
        if (metrics.length > 0) {
          // Save to database
          const savedCount = await saveMetrics(metrics);
          console.log(`Successfully saved ${savedCount} records to database`);
          
          // Show sample
          console.log('\nSample data (last 5 days):');
          metrics.slice(-5).forEach(m => {
            console.log(`  ${m.date}: Total=${m.totalUsers}, New=${m.newUsers}, Returning=${m.returningUsers}`);
          });
        }
        
        db.close();
        console.log('\n=== Import Complete ===');
      } catch (error) {
        console.error('Import failed:', error);
        db.close();
      }
    });
  });
}

// Parse command line arguments
const args = process.argv.slice(2);
const days = args[0] ? parseInt(args[0]) : 30; // Default to 30 days

if (args[0] === '--help') {
  console.log('Usage: node importUserMetrics.js [days]');
  console.log('  days: Number of days to import (default: 30, max: 730)');
  console.log('\nExamples:');
  console.log('  node importUserMetrics.js        # Import last 30 days');
  console.log('  node importUserMetrics.js 7      # Import last 7 days');
  console.log('  node importUserMetrics.js 730    # Import last 2 years');
} else {
  importData(Math.min(days, 730)); // Cap at 2 years
}