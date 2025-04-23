import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';
import { redis } from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const { activityHash } = await req.json();

    // Validate input
    if (!activityHash) {
      return NextResponse.json({ error: 'Missing activityHash' }, { status: 400 });
    }

    // Check cache
    const cacheKey = `activity:${activityHash}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Fetch data from Bungie API
    const result = await fetchBungieData(
      `/Destiny2/Manifest/DestinyActivityDefinition/${activityHash}`,
      'GET'
    );

    const response = result.Response;
    if (response) {
      const activityData = {
        name: response.displayProperties?.name || 'Unknown Activity',
        mode: response.activityModeTypes?.[0] || 'Unknown Mode',
        hash: activityHash,
      };

      // Cache the result
      await redis.set(cacheKey, JSON.stringify(activityData), { ex: 3600 }); // Cache for 1 hour

      return NextResponse.json(activityData);
    }

    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};