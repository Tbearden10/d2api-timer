import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';

export async function POST(req: NextRequest) {
  try {
    const { membershipType, membershipId, characterId } = await req.json();

    // Validate input
    if (!membershipType || !membershipId || !characterId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch up to 200 activities in a single API call
    const result = await fetchBungieData(
      `/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities?&count=100`,
      'GET'
    );

    if (!result || !result.Response || !result.Response.activities) {
      return NextResponse.json({ activities: [] }); // Return empty if no activities are found
    }

    console.log('Fetched up to 200 activities from Bungie API');

    // Cache the raw result
    const rawResult = { Response: result.Response };
    return NextResponse.json(rawResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    console.error('API Error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}