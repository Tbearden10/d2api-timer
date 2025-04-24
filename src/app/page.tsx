'use client';

import React, { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import TimerContainer from '../components/TimerContainer';
import LoadingIndicator from '../components/LoadingIndicator'; // Import the techno wave loader
import ActivityContainer from '@/components/ActivityContainer';

const activityModes = { 
  "0": "None",
  "2": "Story",
  "3": "Strike",
  "4": "Raid",
  "5": "All PvP",
  "6": "Patrol",
  "7": "All PvE",
  "9": "Reserved9",
  "10": "Control",
  "11": "Reserved11",
  "12": "Clash",
  "13": "Reserved13",
  "15": "Crimson Doubles",
  "16": "Nightfall",
  "17": "Heroic Nightfall",
  "18": "All Strikes",
  "19": "Iron Banner",
  "20": "Reserved20",
  "21": "Reserved21",
  "22": "Reserved22",
  "24": "Reserved24",
  "25": "All Mayhem",
  "26": "Reserved26",
  "27": "Reserved27",
  "28": "Reserved28",
  "29": "Reserved29",
  "30": "Reserved30",
  "31": "Supremacy",
  "32": "Private Matches All",
  "37": "Survival",
  "38": "Countdown",
  "39": "Trials of the Nine",
  "40": "Social",
  "41": "Trials Countdown",
  "42": "Trials Survival",
  "43": "Iron Banner Control",
  "44": "Iron Banner Clash",
  "45": "Iron Banner Supremacy",
  "46": "Scored Nightfall",
  "47": "Scored Heroic Nightfall",
  "48": "Rumble",
  "49": "All Doubles",
  "50": "Doubles",
  "51": "Private Matches Clash",
  "52": "Private Matches Control",
  "53": "Private Matches Supremacy",
  "54": "Private Matches Countdown",
  "55": "Private Matches Survival",
  "56": "Private Matches Mayhem",
  "57": "Private Matches Rumble",
  "58": "Heroic Adventure",
  "59": "Showdown",
  "60": "Lockdown",
  "61": "Scorched",
  "62": "Scorched Team",
  "63": "Gambit",
  "64": "All PvE Competitive",
  "65": "Breakthrough",
  "66": "Black Armory Run",
  "67": "Salvage",
  "68": "Iron Banner Salvage",
  "69": "PvP Competitive",
  "70": "PvP Quickplay",
  "71": "Clash Quickplay",
  "72": "Clash Competitive",
  "73": "Control Quickplay",
  "74": "Control Competitive",
  "75": "Gambit Prime",
  "76": "Reckoning",
  "77": "Menagerie",
  "78": "Vex Offensive",
  "79": "Nightmare Hunt",
  "80": "Elimination",
  "81": "Momentum",
  "82": "Dungeon",
  "83": "Sundial",
  "84": "Trials of Osiris",
  "85": "Dares",
  "86": "Offensive",
  "87": "Lost Sector",
  "88": "Rift",
  "89": "Zone Control",
  "90": "Iron Banner Rift",
  "91": "Iron Banner Zone Control",
  "92": "Relic"
}

const REFRESH_INTERVAL_MS = 10000; // Auto-fetch every 30 seconds

const HomePage: React.FC = () => {
  const [bungieName, setBungieName] = useState('');
  const [currentActivity, setCurrentActivity] = useState<{ name: string | null; startTime: string | null }>({
    name: null,
    startTime: null,
  });
  const [recentActivity, setRecentActivity] = useState<{ mode: string; name: string; duration: string } | null>(null);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchActivityData = async (bungieName: string, isSearch: boolean = false) => {
    try {
      if (isSearch) {
        setLoading(true); // Set loading to true only for manual search
      }
  
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
  
      if (!profileData.Response || !profileData.Response.characters.data) {
        throw new Error('Profile data not found');
      }
  
      // Get the most recently played character
      const characters = Object.values(profileData.Response.characters.data) as Array<{ dateLastPlayed: string; characterId: string }>;
      const mostRecentCharacter = characters.reduce((latest, character) => {
        return new Date(character.dateLastPlayed) > new Date(latest.dateLastPlayed) ? character : latest;
      }, characters[0]);
  
      if (!mostRecentCharacter || !mostRecentCharacter.characterId) {
        throw new Error('No characters found for this player');
      }
  
      const { characterId } = mostRecentCharacter;
  
      const currentActivityData =
        profileData.Response.characterActivities.data[characterId];
      const isInSession =
        currentActivityData.currentActivityHash !== 0 &&
        currentActivityData.dateActivityStarted;
  
      // Step 3: Fetch Current Activity Details (if in session)
      let newActivity = { name: 'No activity in progress', startTime: null };
      if (isInSession) {
        const activityDefinitionResponse = await fetch('/api/activity-definition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activityHash: currentActivityData.currentActivityHash }),
        });
  
        const activityDefinitionData = await activityDefinitionResponse.json();
  
        newActivity = {
          name:
            activityDefinitionData.Response?.displayProperties?.name ||
            'Unknown Activity',
          startTime: currentActivityData.dateActivityStarted,
        };
      }
      setCurrentActivity(newActivity);
  
      // Step 4: Fetch Recent Activity
      const activityHistoryResponse = await fetch('/api/recent-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipType, membershipId, characterId }),
      });
      const activityHistoryData = await activityHistoryResponse.json();
  
      if (
        activityHistoryData.Response &&
        activityHistoryData.Response.activities?.length > 0
      ) {
        const activity = activityHistoryData.Response.activities[0];
        const refId = activity?.activityDetails.referenceId;
  
        const activityDefinitionResponse = await fetch('/api/activity-definition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activityHash: refId }),
        });
        const activityDefinitionData = await activityDefinitionResponse.json();
  
        const mode =
          activityModes[activity?.activityDetails.mode as keyof typeof activityModes] || 'Unknown Mode';
        const duration = `${Math.floor(
          activity?.values.activityDurationSeconds?.basic?.value / 60
        )}m ${
          activity?.values.activityDurationSeconds?.basic?.value % 60
        }s`;
  
        setRecentActivity({
          mode,
          name:
            activityDefinitionData.Response?.displayProperties?.name ||
            'Unknown Activity',
          duration,
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch activity data');
      } else {
        setError('Failed to fetch activity data'); // Fallback for non-error objects
      }
    } finally {
      if (isSearch) {
        setLoading(false); // Turn off loading only for manual search
      }
    }
  };
  
  const handleSearch = async (newBungieName: string) => {
    setSearchPerformed(true);
    setBungieName(newBungieName);
  
    if (fetchIntervalRef.current) {
      clearInterval(fetchIntervalRef.current);
    }
  
    fetchActivityData(newBungieName, true); // Pass true to indicate a manual search
  
    fetchIntervalRef.current = setInterval(() => {
      fetchActivityData(newBungieName); // Auto-fetch without showing the loader
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
      {loading ? (
        <LoadingIndicator /> // Show techno wave loader during search
      ) : (
        searchPerformed && (
          <>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {currentActivity ? (
              <>
                {currentActivity.startTime ? (
                  <TimerContainer
                    activityName={currentActivity.name || ''}
                    startTime={currentActivity.startTime}
                    bungieName={bungieName}
                  />
                ) : (
                  <p className="text-center text-gray-500">{currentActivity.name}</p>
                )}
                {recentActivity && (
                  <ActivityContainer recentActivity={recentActivity} />
                )}
              </>
            ) : (
              <p className="text-center text-gray-500">No activity data available.</p>
            )}
          </>
        )
      )}
    </div>
  );
};

export default HomePage;