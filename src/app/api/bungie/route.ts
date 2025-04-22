import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';

export async function POST(req: NextRequest) {
  try {
    const { bungieName } = await req.json();

    // Encode the Bungie name for safe usage in the API
    const encodedBungieName = encodeURIComponent(bungieName);

  
    // Fetch data from Bungie API
    const result = await fetchBungieData(
      `/Destiny2/SearchDestinyPlayer/-1/${encodedBungieName}`,
      'GET'
    );

   
    // Return the raw response from Bungie API
    const rawResult = { Response: result.Response };
    return NextResponse.json(rawResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    console.error('API Error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}