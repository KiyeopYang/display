// Test script for user metrics functionality

async function testUserMetrics() {
  const baseUrl = 'http://localhost:3003';
  
  console.log('=== Testing User Metrics System ===\n');
  
  // Test 1: Update recent metrics (last 3 days)
  console.log('1. Testing recent metrics update (last 3 days)...');
  try {
    const updateResponse = await fetch(`${baseUrl}/api/analytics/user-metrics/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days: 3 })
    });
    
    const updateResult = await updateResponse.json();
    console.log('Update result:', updateResult);
    console.log('---\n');
  } catch (error) {
    console.error('Error updating metrics:', error);
  }
  
  // Test 2: Fetch stored metrics
  console.log('2. Fetching stored metrics from database...');
  try {
    const fetchResponse = await fetch(`${baseUrl}/api/analytics/user-metrics/update`);
    const fetchResult = await fetchResponse.json();
    
    if (fetchResult.success && fetchResult.data) {
      console.log(`Found ${fetchResult.count} days of data`);
      console.log('Sample data (last 3 days):');
      fetchResult.data.slice(0, 3).forEach(day => {
        console.log(`  ${day.date}: Total=${day.total_users}, New=${day.new_users}, Returning=${day.returning_users}`);
      });
    }
    console.log('---\n');
  } catch (error) {
    console.error('Error fetching metrics:', error);
  }
  
  // Test 3: Import historical data (optional - comment out if not needed)
  console.log('3. Import historical data? (This will fetch 2 years of data)');
  console.log('   Uncomment the code below if you want to import historical data');
  /*
  try {
    const historicalResponse = await fetch(`${baseUrl}/api/analytics/user-metrics/historical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days: 730 }) // 2 years
    });
    
    const historicalResult = await historicalResponse.json();
    console.log('Historical import result:', historicalResult);
  } catch (error) {
    console.error('Error importing historical data:', error);
  }
  */
  
  console.log('\n=== Test Complete ===');
}

// Run the test
testUserMetrics().catch(console.error);