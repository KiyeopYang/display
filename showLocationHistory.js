const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./analytics.db');

// Check if location_history table exists and show data
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='location_history'", (err, row) => {
  if (err) {
    console.error('Error checking table:', err);
    db.close();
    return;
  }
  
  if (!row) {
    console.log('Location history table does not exist yet.');
    console.log('It will be created when the server restarts and data is collected.');
    db.close();
    return;
  }
  
  // Get location history
  db.all(
    `SELECT 
      datetime(timestamp, 'localtime') as local_time,
      country,
      city,
      active_users,
      collection_id
    FROM location_history 
    ORDER BY timestamp DESC, active_users DESC
    LIMIT 50`,
    (err, rows) => {
      if (err) {
        console.error('Error:', err);
        db.close();
        return;
      }
      
      if (rows.length === 0) {
        console.log('No location history data yet.');
        console.log('Data will be saved every 3 minutes when GA4 quota is available.');
      } else {
        console.log('\n=== LOCATION HISTORY (Top 50) ===\n');
        
        // Group by collection_id
        const collections = {};
        rows.forEach(row => {
          if (!collections[row.collection_id]) {
            collections[row.collection_id] = {
              timestamp: row.local_time,
              locations: []
            };
          }
          collections[row.collection_id].locations.push({
            city: row.city,
            country: row.country,
            users: row.active_users
          });
        });
        
        // Display grouped data
        Object.entries(collections).forEach(([id, data]) => {
          console.log(`\nCollection #${id} - ${data.timestamp}`);
          console.log('─'.repeat(50));
          
          data.locations
            .sort((a, b) => b.users - a.users)
            .slice(0, 10)
            .forEach((loc, idx) => {
              console.log(`  ${idx + 1}. ${loc.city}, ${loc.country}: ${loc.users} users`);
            });
        });
      }
      
      // Get total count
      db.get('SELECT COUNT(*) as count FROM location_history', (err, result) => {
        if (!err && result) {
          console.log(`\nTotal location records: ${result.count}`);
        }
        
        // Get unique cities count
        db.get('SELECT COUNT(DISTINCT city || country) as unique_cities FROM location_history', (err, result) => {
          if (!err && result) {
            console.log(`Unique city/country combinations: ${result.unique_cities}`);
          }
          db.close();
        });
      });
    }
  );
});