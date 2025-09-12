import { NextResponse } from 'next/server';

interface Character {
  id: string;
  name: string;
  profile_img: string;
}

interface PerformanceData {
  character: string;
  mean_payment_ratio: number;
  review_count: number;
  avg_story_rating: number;
  avg_art_rating: number;
  play_count: number;
  completion_rate_recent_30d: number;
  dropout_rate_recent_30d: number;
  created_at?: string;
}

interface RankedCharacter extends Character, Omit<PerformanceData, 'character' | 'created_at'> {
  rank: number;
}

export async function GET() {
  try {
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!projectUrl || !anonKey) {
      throw new Error('Supabase credentials not configured');
    }

    // First, get all active characters
    const charactersResponse = await fetch(
      `${projectUrl}/rest/v1/arimate_characters?on=eq.true&select=id,name,profile_img`,
      {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!charactersResponse.ok) {
      throw new Error('Failed to fetch characters');
    }

    const characters = await charactersResponse.json();
    const characterIds = characters.map((c: Character) => c.id);

    if (characterIds.length === 0) {
      return NextResponse.json({ rankings: [] });
    }

    // Get the most recent performance history for each character
    // Using a subquery to get the latest record per character
    const performanceQuery = `
      SELECT DISTINCT ON (character)
        character,
        mean_payment_ratio,
        review_count,
        avg_story_rating,
        avg_art_rating,
        play_count,
        completion_rate_recent_30d,
        dropout_rate_recent_30d,
        created_at
      FROM arimate_character_performance_history
      WHERE character IN (${characterIds.map((id: string) => `'${id}'`).join(',')})
      ORDER BY character, created_at DESC
    `;

    const performanceResponse = await fetch(
      `${projectUrl}/rest/v1/rpc/sql`,
      {
        method: 'POST',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: performanceQuery }),
      }
    );

    // If RPC endpoint doesn't work, try alternative approach
    let performanceData;
    if (!performanceResponse.ok) {
      // Fallback: Get all performance records and filter in JavaScript
      const allPerformanceResponse = await fetch(
        `${projectUrl}/rest/v1/arimate_character_performance_history?character=in.(${characterIds.join(',')})&order=created_at.desc`,
        {
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!allPerformanceResponse.ok) {
        throw new Error('Failed to fetch performance data');
      }

      const allPerformance = await allPerformanceResponse.json();
      
      // Get the most recent record for each character
      const latestPerformance = new Map();
      allPerformance.forEach((record: PerformanceData) => {
        if (!latestPerformance.has(record.character)) {
          latestPerformance.set(record.character, record);
        }
      });
      
      performanceData = Array.from(latestPerformance.values());
    } else {
      performanceData = await performanceResponse.json();
    }

    // Combine character data with performance data
    const rankings = characters
      .map((character: Character) => {
        const performance = performanceData.find((p: PerformanceData) => p.character === character.id);
        return {
          ...character,
          mean_payment_ratio: performance?.mean_payment_ratio || 0,
          review_count: performance?.review_count || 0,
          avg_story_rating: performance?.avg_story_rating || 0,
          avg_art_rating: performance?.avg_art_rating || 0,
          play_count: performance?.play_count || 0,
          completion_rate_recent_30d: performance?.completion_rate_recent_30d || 0,
          dropout_rate_recent_30d: performance?.dropout_rate_recent_30d || 0,
        };
      })
      .filter((c: Omit<RankedCharacter, 'rank'>) => c.mean_payment_ratio > 0) // Only include characters with payment data
      .sort((a: Omit<RankedCharacter, 'rank'>, b: Omit<RankedCharacter, 'rank'>) => b.mean_payment_ratio - a.mean_payment_ratio)
      .slice(0, 10); // Top 10

    // Add ranking numbers
    const rankedData = rankings.map((item: Omit<RankedCharacter, 'rank'>, index: number) => ({
      ...item,
      rank: index + 1,
    }));

    return NextResponse.json({ rankings: rankedData });
  } catch (error) {
    console.error('Error fetching character rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character rankings' },
      { status: 500 }
    );
  }
}