import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';

const activityDefinitionCache = new Map();

export async function POST(req: NextRequest) {
  try {
    const { activityHash } = await req.json();

    if (!activityHash) {
      return NextResponse.json({ error: 'Missing activityHash' }, { status: 400 });
    }

    // Check Redis Cache (or in-memory cache for simplicity here)
    if (activityDefinitionCache.has(activityHash)) {
      const cachedResponse = activityDefinitionCache.get(activityHash);
      return NextResponse.json(cachedResponse, {
        headers: {
          'Cache-Control': 'public, max-age=86400', // Cache in the browser for 24 hours
        },
      });
    }

    // Fetch from Bungie API
    const result = await fetchBungieData(
      `/Destiny2/Manifest/DestinyActivityDefinition/${activityHash}`,
      'GET'
    );

    // Cache the result (for both Redis or in-memory cache)
    activityDefinitionCache.set(activityHash, result);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache in the browser for 24 hours
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}