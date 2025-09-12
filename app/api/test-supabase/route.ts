import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // You need to provide your Supabase credentials here
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Supabase credentials not found');
    console.log('Please add to .env.local:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
    
    return NextResponse.json({ 
      error: 'Supabase credentials not configured',
      message: 'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('🔍 Querying animate_character_performance_history table...');

  try {
    const { data, error } = await supabase
      .from('animate_character_performance_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('❌ Error querying table:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Found ${data?.length || 0} records`);
    
    // Log to server console
    if (data && data.length > 0) {
      console.log('\n' + '='.repeat(80));
      console.log('ANIMATE CHARACTER PERFORMANCE HISTORY');
      console.log('='.repeat(80));
      
      data.forEach((record, index) => {
        console.log(`\n📊 Record #${index + 1}`);
        console.log('-'.repeat(40));
        Object.entries(record).forEach(([key, value]) => {
          console.log(`  ${key}: ${JSON.stringify(value)}`);
        });
      });
      
      console.log('\n' + '='.repeat(80));
      console.log(`Total records: ${data.length}`);
      
      // Show table columns
      console.log('\n📋 Table columns:');
      Object.keys(data[0]).forEach(key => {
        console.log(`  - ${key}`);
      });
      console.log('='.repeat(80) + '\n');
    } else {
      console.log('📭 No data found in the table');
    }

    return NextResponse.json({ 
      success: true, 
      count: data?.length || 0,
      data: data,
      columns: data && data.length > 0 ? Object.keys(data[0]) : []
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}