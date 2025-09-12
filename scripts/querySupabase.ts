import { createClient } from '@supabase/supabase-js';

// You need to provide your Supabase URL and anon key
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function queryAnimateCharacterPerformance() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Supabase credentials not found in environment variables');
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('🔍 Querying animate_character_performance_history table...\n');

  try {
    const { data, error } = await supabase
      .from('animate_character_performance_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Limit to 100 recent records

    if (error) {
      console.error('❌ Error querying table:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No data found in the table');
      return;
    }

    console.log(`✅ Found ${data.length} records\n`);
    console.log('=' .repeat(80));
    
    // Display data in a formatted way
    data.forEach((record, index) => {
      console.log(`\n📊 Record #${index + 1}`);
      console.log('-'.repeat(40));
      Object.entries(record).forEach(([key, value]) => {
        console.log(`  ${key}: ${JSON.stringify(value)}`);
      });
    });
    
    console.log('\n' + '='.repeat(80));
    console.log(`\n📈 Summary: Total ${data.length} records retrieved`);
    
    // Show table structure from first record
    if (data.length > 0) {
      console.log('\n📋 Table columns:');
      Object.keys(data[0]).forEach(key => {
        console.log(`  - ${key}`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the query
queryAnimateCharacterPerformance();