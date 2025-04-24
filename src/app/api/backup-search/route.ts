import { NextRequest, NextResponse } from 'next/server';
import { fetchBungieData } from '@/lib/BungieApi';

const prefixCache = new Map();

export async function POST(req: NextRequest) {
  try {
    const { prefix } = await req.json();

    if (!prefix) {
      return NextResponse.json({ error: 'Missing prefix' }, { status: 400 });
    }

    const encodedPrefix = encodeURIComponent(prefix);



    // Check Redis/In-memory Cache
    if (prefixCache.has(encodedPrefix)) {
      const cachedResponse = prefixCache.get(encodedPrefix);
      return NextResponse.json(cachedResponse, {
        headers: {
          'Cache-Control': 'public, max-age=86400', // Cache in the browser for 24 hours
        },
      });
    }

    // Fetch from Bungie API using the correct endpoint
    const result = await fetchBungieData(
      `/User/Search/Prefix/${encodedPrefix}/0/`, // Page 0 for the first set of results
      'GET'
    );


    if (!result.Response || result.Response.length === 0) {
      return NextResponse.json({ error: 'No users found with the given prefix' }, { status: 404 });
    }

    // Cache the result (for both Redis or in-memory cache)
    prefixCache.set(encodedPrefix, { Response: result.Response });

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