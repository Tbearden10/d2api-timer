'use client';

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


import React, { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import TimerContainer from '../components/TimerContainer';
import LoadingIndicator from '../components/LoadingIndicator';

const REFRESH_INTERVAL_MS = 30000; // Auto-fetch every 30 seconds

const HomePage: React.FC = () => {
  const [currentActivity, setCurrentActivity] = useState<{ name: string | null; startTime: string | null }>({
    name: null,
    startTime: null,
  });
  const [recentActivity, setRecentActivity] = useState<{ mode: string; name: string; duration: string } | null>(null);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchActivityData = async (bungieName: string) => {
    try {
      // Step 1: Resolve Bungie ID
      const searchResponse = await fetch('/api/bungie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bungieName }),
      });
  
      let searchData;
      try {
        searchData = await searchResponse.json();
      } catch {
        throw new Error('Failed to parse Bungie search response');
      }
  
      if (!searchData.membershipId || !searchData.membershipType) {
        throw new Error('Player not found');
      }
  
      const { membershipId, membershipType } = searchData;
  
      // Step 2: Fetch Profile Data
      const profileResponse = await fetch('/api/current-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipType, membershipId }),
      });
  
      let profileData;
      try {
        profileData = await profileResponse.json();
      } catch {
        throw new Error('Failed to parse profile response');
      }
  
      const characters = Object.values(profileData.Response.characters.data) as Array<{ dateLastPlayed: string; characterId: string }>;
      characters.sort((a, b) => new Date(b.dateLastPlayed).getTime() - new Date(a.dateLastPlayed).getTime());
      const mostRecentCharacter = characters[0];
      const currentActivityData = profileData.Response.characterActivities.data[mostRecentCharacter.characterId];
      const isInSession = currentActivityData.currentActivityHash !== 0 && currentActivityData.dateActivityStarted;
  
      // Step 3: Parallelize Current Activity and Recent Activity Fetches
      const [currentActivityResult, recentActivityResult] = await Promise.all([
        (async () => {
          if (isInSession) {
            const activityResponse = await fetch('/api/activity-definition', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ activityHash: currentActivityData.currentActivityHash }),
            });
  
            let activityData;
            try {
              activityData = await activityResponse.json();
            } catch {
              throw new Error('Failed to parse activity definition response');
            }
  
            let name = activityData.name || 'Unknown Activity';
            if (activityData.hash === 82913930) {
              name = 'Orbit';
            }
  
            return {
              name,
              startTime: currentActivityData.dateActivityStarted,
            };
          } else {
            return {
              name: 'No activity in progress',
              startTime: null,
            };
          }
        })(),
        (async () => {
          const activityHistoryResponse = await fetch('/api/recent-activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ membershipType, membershipId, characterId: mostRecentCharacter.characterId }),
          });
  
          let activityHistoryData;
          try {
            activityHistoryData = await activityHistoryResponse.json();
          } catch {
            throw new Error('Failed to parse recent activity response');
          }
  
          if (activityHistoryData.Response.activities && activityHistoryData.Response.activities.length > 0) {
            const refId = activityHistoryData.Response.activities[0]?.activityDetails.referenceId;
  
            const activityDefinitionResponse = await fetch('/api/activity-definition', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ activityHash: refId }),
            });
  
            let activityDefinitionData;
            try {
              activityDefinitionData = await activityDefinitionResponse.json();
            } catch {
              throw new Error('Failed to parse activity definition response');
            }
  
            const name = activityDefinitionData.name || 'Unknown Activity';
            const modeKey = activityHistoryData.Response.activities[0]?.activityDetails.mode as keyof typeof activityModes;
            const mode = activityModes[modeKey] || 'Unknown Mode';
  
            const recentDurationSeconds = activityHistoryData.Response.activities[0]?.values.activityDurationSeconds?.basic?.value || 0;
            const totalMinutes = Math.floor(recentDurationSeconds / 60);
            const totalSeconds = recentDurationSeconds % 60;
            const duration = `${totalMinutes}m ${totalSeconds}s`;
  
            return {
              mode,
              name,
              duration,
            };
          }
          return null;
        })(),
      ]);
  
    setCurrentActivity(currentActivityResult);
    setRecentActivity(recentActivityResult);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch activity data');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleSearch = async (newBungieName: string) => {
    setSearchPerformed(false); // Clear previous search state
    setError(''); // Clear any previous errors
    setCurrentActivity({ name: null, startTime: null }); // Clear current activity
    setRecentActivity(null); // Clear recent activity

    if (fetchIntervalRef.current) {
      clearInterval(fetchIntervalRef.current);
    }
  
    setSearchPerformed(true); // Trigger loading state
    await fetchActivityData(newBungieName);
  
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
      {searchPerformed ? (
        <>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!currentActivity.name && !recentActivity ? (
            <LoadingIndicator /> // Show loading indicator while fetching data
          ) : (
            <>
              {currentActivity.startTime ? (
                <TimerContainer
                  activityName={currentActivity.name || ''}
                  startTime={currentActivity.startTime}
                />
              ) : (
                <p className="text-center text-gray-500">{currentActivity.name}</p>
              )}
              {recentActivity && (
                <div className="text-center mt-4">
                  <p className="text-gray-500">Most Recent Activity:</p>
                  <p className="text-gray-700">
                    {recentActivity.mode} - {recentActivity.name} ({recentActivity.duration})
                  </p>
                </div>
              )}
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default HomePage;