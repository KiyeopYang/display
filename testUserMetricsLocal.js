// Local test script for user metrics functionality
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open database
const dbPath = path.join(process.cwd(), 'analytics.db');
const db = new sqlite3.Database(dbPath);

function testDatabase() {
  console.log('=== Testing User Metrics Database ===\n');
  
  // Check if user_metrics table exists
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='user_metrics'", (err, row) => {
    if (err) {
      console.error('Error checking table:', err);
      return;
    }
    
    if (row) {
      console.log('✓ user_metrics table exists');
      
      // Check table structure
      db.all("PRAGMA table_info(user_metrics)", (err, columns) => {
        if (err) {
          console.error('Error getting table info:', err);
          return;
        }
        
        console.log('\nTable structure:');
        columns.forEach(col => {
          console.log(`  - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
        });
        
        // Check for existing data
        db.get("SELECT COUNT(*) as count, MIN(date) as min_date, MAX(date) as max_date FROM user_metrics", (err, stats) => {
          if (err) {
            console.error('Error getting stats:', err);
            return;
          }
          
          console.log('\nData statistics:');
          console.log(`  - Total records: ${stats.count}`);
          if (stats.count > 0) {
            console.log(`  - Date range: ${stats.min_date} to ${stats.max_date}`);
            
            // Show sample data
            db.all("SELECT * FROM user_metrics ORDER BY date DESC LIMIT 5", (err, rows) => {
              if (err) {
                console.error('Error getting sample data:', err);
                return;
              }
              
              console.log('\nSample data (last 5 days):');
              rows.forEach(row => {
                console.log(`  ${row.date}: Total=${row.total_users}, New=${row.new_users}, Returning=${row.returning_users}, Active=${row.active_users}`);
              });
              
              db.close();
            });
          } else {
            console.log('  - No data yet. Run the import to populate the table.');
            db.close();
          }
        });
      });
    } else {
      console.log('✗ user_metrics table does not exist');
      console.log('  The table will be created when you start the Next.js server');
      db.close();
    }
  });
}

// Run the test
testDatabase();