import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';

export async function POST(req: NextRequest) {
  try {
    const { membershipType, membershipId, characterId } = await req.json();

    if (!membershipType || !membershipId || !characterId) {
      return NextResponse.json(
        { error: 'Missing required parameters: membershipType, membershipId, or characterId' },
        { status: 400 }
      );
    }

    // Construct the Bungie API URL
    const url = `/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/?count=2`;

    // Fetch data from Bungie API
    const result = await fetchBungieData(url, 'GET');

    // Return the raw response from Bungie API
    return NextResponse.json({ Response: result.Response });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    console.error('API Error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};