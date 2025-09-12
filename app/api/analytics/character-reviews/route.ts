import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!projectUrl || !anonKey) {
      throw new Error('Supabase credentials not configured');
    }

    // Fetch recent reviews with character information
    const query = `
      SELECT 
        r.id,
        r.character,
        r.user,
        r.story_star,
        r.art_star,
        r.review,
        r.created_at,
        c.name as character_name,
        c.profile_img
      FROM arimate_character_reviews r
      LEFT JOIN arimate_characters c ON r.character = c.id
      WHERE r.review IS NOT NULL AND r.review != ''
      ORDER BY r.created_at DESC
      LIMIT 8
    `;

    // Use the REST API to execute raw SQL
    const response = await fetch(
      `${projectUrl}/rest/v1/rpc/sql`,
      {
        method: 'POST',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      // Fallback: Try using the tables directly
      const reviewsResponse = await fetch(
        `${projectUrl}/rest/v1/arimate_character_reviews?review=not.is.null&review=neq.&order=created_at.desc&limit=8&select=*,arimate_characters(name,profile_img)`,
        {
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!reviewsResponse.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const reviewsData = await reviewsResponse.json();
      
      // Transform the data to match expected format
      const formattedReviews = reviewsData.map((item: any) => ({
        id: item.id,
        character: item.character,
        user: item.user,
        story_star: item.story_star,
        art_star: item.art_star,
        review: item.review,
        created_at: item.created_at,
        character_name: item.arimate_characters?.name || 'Unknown',
        profile_img: item.arimate_characters?.profile_img || ''
      }));

      return NextResponse.json({ reviews: formattedReviews });
    }

    const data = await response.json();
    return NextResponse.json({ reviews: data });
    
  } catch (error) {
    console.error('Error fetching character reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character reviews' },
      { status: 500 }
    );
  }
}