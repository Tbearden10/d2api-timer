import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';

export async function POST(req: NextRequest) {
  try {
    const { membershipType, membershipId } = await req.json();

    if (!membershipType || !membershipId) {
      return NextResponse.json({ error: 'Missing membershipType or membershipId' }, { status: 400 });
    }

    // Fetch from Bungie API
    const result = await fetchBungieData(
      `/Destiny2/${membershipType}/Profile/${membershipId}?components=200,204`,
      'GET'
    );

    if (!result || !result.Response) {
      return NextResponse.json({ error: 'No current activity found' }, { status: 404 });
    }

    return NextResponse.json({ Response: result.Response }, {
      headers: {
        'Cache-Control': 'no-store', // Do not cache because data changes frequently
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}