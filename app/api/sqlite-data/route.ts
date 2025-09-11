import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const table = searchParams.get('table') || 'active_users';
    
    const dbPath = path.join(process.cwd(), 'analytics.db');
    const db = new Database(dbPath);
    
    let query: string;
    let countQuery: string;
    
    if (table === 'location_history') {
      query = `
        SELECT 
          lh.*,
          au.total_active_users as collection_total
        FROM location_history lh
        LEFT JOIN active_users au ON lh.collection_id = au.id
        ORDER BY lh.timestamp DESC 
        LIMIT ?
      `;
      countQuery = 'SELECT COUNT(*) as count FROM location_history';
    } else {
      query = `
        SELECT * FROM active_users 
        ORDER BY timestamp DESC 
        LIMIT ?
      `;
      countQuery = 'SELECT COUNT(*) as count FROM active_users';
    }
    
    const data = db.prepare(query).all(limit);
    
    // Get total count
    const countResult = db.prepare(countQuery).get() as { count: number };
    
    db.close();
    
    return NextResponse.json({
      data,
      total: countResult.count,
      limit,
      table
    });
  } catch (error) {
    console.error('Error fetching SQLite data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from database' },
      { status: 500 }
    );
  }
}