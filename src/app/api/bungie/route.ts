import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';
import { redis } from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const { bungieName } = await req.json();

    // Check cache
    const cacheKey = `bungie:${bungieName}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Fetch data from Bungie API
    const result = await fetchBungieData(
      `/Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(bungieName)}`,
      'GET'
    );

    const response = result.Response;
    if (response && response.length > 0) {
      const { membershipId, membershipType } = response[0];

      // Cache the result
      await redis.set(cacheKey, JSON.stringify({ membershipId, membershipType }), { ex: 3600 }); // Cache for 1 hour

      return NextResponse.json({ membershipId, membershipType });
    }

    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    console.error('API Error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}