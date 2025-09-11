const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./analytics.db');

// Check active_users table
db.get(`
  SELECT 
    COUNT(*) as count, 
    datetime(MIN(timestamp), 'localtime') as oldest, 
    datetime(MAX(timestamp), 'localtime') as newest 
  FROM active_users
`, (err, row) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('\n=== ACTIVE USERS TABLE ===');
  console.log(`Total records: ${row.count}`);
  console.log(`Oldest record: ${row.oldest || 'No data'}`);
  console.log(`Newest record: ${row.newest || 'No data'}`);
  
  if (row.count > 0) {
    // Get the latest entry details
    db.get(`
      SELECT 
        datetime(timestamp, 'localtime') as time,
        total_active_users,
        location_details
      FROM active_users 
      ORDER BY timestamp DESC 
      LIMIT 1
    `, (err, latest) => {
      if (!err && latest) {
        console.log(`\nLatest Entry (${latest.time}):`);
        console.log(`  Active users: ${latest.total_active_users}`);
        
        const locations = JSON.parse(latest.location_details || '[]');
        console.log(`  Location records: ${locations.length}`);
      }
      
      // Check location_history table
      db.get(`
        SELECT 
          COUNT(*) as count,
          COUNT(DISTINCT collection_id) as collections
        FROM location_history
      `, (err, locRow) => {
        if (!err && locRow) {
          console.log('\n=== LOCATION HISTORY TABLE ===');
          console.log(`Total location records: ${locRow.count}`);
          console.log(`Total collections: ${locRow.collections}`);
        }
        db.close();
      });
    });
  } else {
    db.close();
  }
});