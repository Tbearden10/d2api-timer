import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';

const userInfoCache = new Map();

export async function POST(req: NextRequest) {
  try {
    const { bungieName } = await req.json();

    if (!bungieName) {
      return NextResponse.json({ error: 'Missing bungieName' }, { status: 400 });
    }

    const encodedBungieName = encodeURIComponent(bungieName);

    // Check Redis/In-memory Cache
    if (userInfoCache.has(encodedBungieName)) {
      const cachedResponse = userInfoCache.get(encodedBungieName);
      return NextResponse.json(cachedResponse, {
        headers: {
          'Cache-Control': 'public, max-age=86400', // Cache in the browser for 24 hours
        },
      });
    }

    // Fetch from Bungie API
    const result = await fetchBungieData(
      `/Destiny2/SearchDestinyPlayer/-1/${encodedBungieName}`,
      'GET'
    );

    // Cache the result (for both Redis or in-memory cache)
    userInfoCache.set(encodedBungieName, { Response: result.Response });

    return NextResponse.json({ Response: result.Response }, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache in the browser for 24 hours
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};