const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./analytics.db');

// Get last 10 entries
db.all(
  'SELECT * FROM active_users ORDER BY timestamp DESC LIMIT 10',
  (err, rows) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    
    console.log('\n=== LAST 10 ENTRIES FROM SQLITE DATABASE ===\n');
    
    rows.forEach((row, index) => {
      // Convert SQLite timestamp to Korean time
      const timestamp = new Date(row.timestamp + ' GMT+0900');
      const koreanTime = timestamp.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
      
      console.log(`Entry #${index + 1} (ID: ${row.id})`);
      console.log(`  Timestamp: ${row.timestamp} (KST: ${koreanTime})`);
      console.log(`  Active Users: ${row.total_active_users}`);
      
      const byCountry = JSON.parse(row.by_country || '{}');
      const byDevice = JSON.parse(row.by_device || '{}');
      const byPlatform = JSON.parse(row.by_platform || '{}');
      
      console.log(`  Top Countries:`);
      Object.entries(byCountry)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .forEach(([country, count]) => {
          console.log(`    - ${country}: ${count} users`);
        });
      
      console.log(`  Devices:`);
      Object.entries(byDevice)
        .forEach(([device, count]) => {
          console.log(`    - ${device}: ${count}`);
        });
      
      console.log(`  Platforms:`);
      Object.entries(byPlatform)
        .forEach(([platform, count]) => {
          console.log(`    - ${platform}: ${count}`);
        });
      
      console.log('---');
    });
    
    // Get total count
    db.get('SELECT COUNT(*) as count FROM active_users', (err, result) => {
      if (!err) {
        console.log(`\nTotal entries in database: ${result.count}\n`);
      }
      
      // Get entries from last hour
      db.all(
        "SELECT datetime(timestamp) as time, total_active_users FROM active_users WHERE datetime(timestamp) > datetime('now', '-1 hour') ORDER BY timestamp DESC",
        (err, recentRows) => {
          if (!err && recentRows.length > 0) {
            console.log('=== LAST HOUR ACTIVITY ===\n');
            recentRows.forEach(row => {
              console.log(`  ${row.time}: ${row.total_active_users} users`);
            });
          }
          db.close();
        }
      );
    });
  }
);