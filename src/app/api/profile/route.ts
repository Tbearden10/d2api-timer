import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';

export async function POST(req: NextRequest) {
  try {
    const { membershipType, membershipId } = await req.json();

    // Validate input
    if (!membershipType || !membershipId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch profile data from Bungie API
    const result = await fetchBungieData(
      `/Destiny2/${membershipType}/Profile/${membershipId}/?components=200,204`,
      'GET'
    );

    if (!result || !result.Response) {
      return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }

    return NextResponse.json({ Response: result.Response }); // Return structured response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    console.error('API Error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}