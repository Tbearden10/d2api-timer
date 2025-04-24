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

    // Fetch from Bungie API
    const result = await fetchBungieData(
      `/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/?count=2`,
      'GET'
    );

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