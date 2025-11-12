// _worker.js - Place this in your /out directory or project root
const activityDefinitionCache = new Map();
const prefixCache = new Map();
const userInfoCache = new Map();

async function fetchBungieData(endpoint, env) {
  const response = await fetch(`https://www.bungie.net/Platform${endpoint}`, {
    method: 'GET',
    headers: {
      'X-API-Key': env.BUNGIE_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Bungie API error: ${response.status}`);
  }

  return await response.json();
}

async function handleActivityDefinition(request, env) {
  const { activityHash } = await request.json();

  if (!activityHash) {
    return new Response(JSON.stringify({ error: 'Missing activityHash' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (activityDefinitionCache.has(activityHash)) {
    const cachedResponse = activityDefinitionCache.get(activityHash);
    return new Response(JSON.stringify(cachedResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  const result = await fetchBungieData(
    `/Destiny2/Manifest/DestinyActivityDefinition/${activityHash}`,
    env
  );

  activityDefinitionCache.set(activityHash, result);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

async function handleBackupSearch(request, env) {
  const { prefix } = await request.json();

  if (!prefix) {
    return new Response(JSON.stringify({ error: 'Missing prefix' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encodedPrefix = encodeURIComponent(prefix);

  if (prefixCache.has(encodedPrefix)) {
    const cachedResponse = prefixCache.get(encodedPrefix);
    return new Response(JSON.stringify(cachedResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  const result = await fetchBungieData(
    `/User/Search/Prefix/${encodedPrefix}/0/`,
    env
  );

  if (!result.Response || result.Response.length === 0) {
    return new Response(JSON.stringify({ error: 'No users found with the given prefix' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const responseData = { Response: result.Response };
  prefixCache.set(encodedPrefix, responseData);

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

async function handleBungie(request, env) {
  const { bungieName } = await request.json();

  if (!bungieName) {
    return new Response(JSON.stringify({ error: 'Missing bungieName' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encodedBungieName = encodeURIComponent(bungieName);

  if (userInfoCache.has(encodedBungieName)) {
    const cachedResponse = userInfoCache.get(encodedBungieName);
    return new Response(JSON.stringify(cachedResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  const result = await fetchBungieData(
    `/Destiny2/SearchDestinyPlayer/-1/${encodedBungieName}`,
    env
  );

  const responseData = { Response: result.Response };
  userInfoCache.set(encodedBungieName, responseData);

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

async function handleCurrentActivity(request, env) {
  const { membershipType, membershipId } = await request.json();

  if (!membershipType || !membershipId) {
    return new Response(JSON.stringify({ error: 'Missing membershipType or membershipId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await fetchBungieData(
    `/Destiny2/${membershipType}/Profile/${membershipId}?components=200,204`,
    env
  );

  if (!result || !result.Response) {
    return new Response(JSON.stringify({ error: 'No current activity found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ Response: result.Response }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

async function handleRecentActivity(request, env) {
  const { membershipType, membershipId, characterId } = await request.json();

  if (!membershipType || !membershipId || !characterId) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters: membershipType, membershipId, or characterId' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const result = await fetchBungieData(
    `/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/?count=2`,
    env
  );

  return new Response(JSON.stringify({ Response: result.Response }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname.startsWith('/api/') && request.method === 'POST') {
      try {
        if (url.pathname === '/api/activity-definition') {
          return await handleActivityDefinition(request, env);
        }
        if (url.pathname === '/api/backup-search') {
          return await handleBackupSearch(request, env);
        }
        if (url.pathname === '/api/bungie') {
          return await handleBungie(request, env);
        }
        if (url.pathname === '/api/current-activity') {
          return await handleCurrentActivity(request, env);
        }
        if (url.pathname === '/api/recent-activity') {
          return await handleRecentActivity(request, env);
        }

        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Serve static assets for everything else
    return env.ASSETS.fetch(request);
  },
};