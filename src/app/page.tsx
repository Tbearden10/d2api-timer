'use client';

import React, { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import TimerContainer from '../components/TimerContainer';
import LoadingIndicator from '../components/LoadingIndicator';

const REFRESH_INTERVAL_MS = 30000; // Auto-fetch every 30 seconds

const HomePage: React.FC = () => {
  const [bungieName, setBungieName] = useState('');
  const [currentActivity, setCurrentActivity] = useState<{ name: string | null; startTime: string | null; }>({
    name: null,
    startTime: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const fetchActivityData = async (bungieName: string) => {
    setLoading(true);
    setError('');
    try {
      // Step 1: Resolve Bungie ID
      const searchResponse = await fetch('/api/bungie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bungieName }),
      });
      const searchData = await searchResponse.json();
  
      if (!searchData.Response || searchData.Response.length === 0) {
        throw new Error('Player not found');
      }
  
      const { membershipId, membershipType } = searchData.Response[0];
  
      // Step 2: Fetch Profile Data
      const profileResponse = await fetch('/api/current-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipType, membershipId }),
      });
      const profileData = await profileResponse.json();
  
      const characters = Object.values(profileData.Response.characters.data) as Array<{
        characterId: string;
        dateLastPlayed: string;
      }>;
      characters.sort((a: any, b: any) => new Date(b.dateLastPlayed).getTime() - new Date(a.dateLastPlayed).getTime());
      const mostRecentCharacter = characters[0];
      const currentActivityData = profileData.Response.characterActivities.data[mostRecentCharacter.characterId];
      const isInSession = currentActivityData.currentActivityHash !== 0 && currentActivityData.dateActivityStarted;
  
      // Step 3: Fetch Current Activity Details
      let currentActivity = null;
      if (isInSession) {
        const activityResponse = await fetch('/api/activity-definition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activityHash: currentActivityData.currentActivityHash }),
        });
        const activityData = await activityResponse.json();
  
        currentActivity = {
          name: activityData.Response?.displayProperties?.name || 'Orbit',
          startTime: currentActivityData.dateActivityStarted,
        };
      } else {
        // No activity in progress
        currentActivity = {
          name: 'No activity in progress',
          startTime: null,
        };
      }
  
      setCurrentActivity(currentActivity);
  
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activity data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (newBungieName: string) => {
    setBungieName(newBungieName);
    if (fetchIntervalRef.current) {
      clearInterval(fetchIntervalRef.current);
    }
    await fetchActivityData(newBungieName);

    // Set up auto-refresh
    fetchIntervalRef.current = setInterval(() => {
      fetchActivityData(newBungieName);
    }, REFRESH_INTERVAL_MS);
  };

  useEffect(() => {
    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen gap-4">
      <SearchBar onSearch={handleSearch} />
      {loading && <LoadingIndicator />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {currentActivity ? (
        currentActivity.startTime ? (
          <TimerContainer
            activityName={currentActivity.name}
            startTime={currentActivity.startTime}
          />
        ) : (
          <p className="text-center text-gray-500">{currentActivity.name}</p>
        )
      ) : (
        <p className="text-center text-gray-500">No activity data available.</p>
      )}
    </div>
  );
};

export default HomePage;