// _worker.js - Place this in your /out directory or project root
const activityDefinitionCache = new Map();
const prefixCache = new Map();
const userInfoCache = new Map();

async function fetchBungieData(endpoint, env) {
  const apiKey = env.BUNGIE_API_KEY;
  
  if (!apiKey) {
    throw new Error('BUNGIE_API_KEY environment variable is not set');
  }

  const url = `https://www.bungie.net/Platform${endpoint}`;
  console.log('Fetching from Bungie API:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-Key': apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Bungie API error:', response.status, errorText);
    throw new Error(`Bungie API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

async function handleActivityDefinition(request, env) {
  try {
    const body = await request.json();
    const { activityHash } = body;

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
  } catch (error) {
    console.error('handleActivityDefinition error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleBackupSearch(request, env) {
  try {
    const body = await request.json();
    const { prefix } = body;

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
  } catch (error) {
    console.error('handleBackupSearch error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleBungie(request, env) {
  try {
    const body = await request.json();
    console.log('handleBungie received body:', body);
    const { bungieName } = body;

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
  } catch (error) {
    console.error('handleBungie error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleCurrentActivity(request, env) {
  try {
    const body = await request.json();
    const { membershipType, membershipId } = body;

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
  } catch (error) {
    console.error('handleCurrentActivity error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleRecentActivity(request, env) {
  try {
    const body = await request.json();
    const { membershipType, membershipId, characterId } = body;

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
  } catch (error) {
    console.error('handleRecentActivity error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    console.log('Worker received request:', {
      method: request.method,
      pathname: url.pathname,
      hasEnv: !!env,
      hasApiKey: !!env?.BUNGIE_API_KEY
    });

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
        console.error('Main API Error:', error);
        return new Response(JSON.stringify({ 
          error: 'Internal Server Error',
          message: error.message,
          stack: error.stack 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Serve static assets for everything else
    return env.ASSETS.fetch(request);
  },
};