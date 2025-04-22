import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';

export async function POST(req: NextRequest) {
  try {
    const { activityHash } = await req.json();

    // Validate input
    if (!activityHash) {
      return NextResponse.json({ error: 'Missing activityHash' }, { status: 400 });
    }

    const result = await fetchBungieData(
      `/Destiny2/Manifest/DestinyActivityDefinition/${activityHash}`,
      'GET'
    );

    console.log('Bungie API Activity Definition Result:', JSON.stringify(result, null, 2));


    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}