import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';

export async function POST(req: NextRequest) {
  try {
    const { membershipType, membershipId } = await req.json();

    // Validate input
    if (!membershipType || !membershipId) {
      if (!membershipType || !membershipId) {
        return NextResponse.json({ error: 'Missing membershipType or membershipId' }, { status: 400 });
      }
    }

    // Fetch current activity and transitory data from Bungie API
    const result = await fetchBungieData(
      `/Destiny2/${membershipType}/Profile/${membershipId}?components=200,204`,
      'GET'
    );

    if (!result || !result.Response) {
      return NextResponse.json({ error: 'No current activity found' }, { status: 404 });
    }

    const rawResult = { Response: result.Response };
    return NextResponse.json(rawResult);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}