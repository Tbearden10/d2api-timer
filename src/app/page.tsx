'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingIndicator from '../components/LoadingIndicator';
import SearchBar from '../components/SearchBar';
import CurrentActivity from '../components/CurrentActivity';
import ActivityList from '@/components/ActivityList';
import { useRef, useEffect } from 'react';

const REFRESH_INTERVAL_MS = 5000; // Refresh every 30 seconds

const pvpModes: string[] = [];
const pveModes: string[] = [];
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

export default function HomePage() {
  const [currentActivity, setCurrentActivity] = useState<{ name: string; startTime?: string } | null>(null);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [loadingCurrentActivity, setLoadingCurrentActivity] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const membershipRef = useRef<{ membershipType: number | null; membershipId: string | null }>({
    membershipType: null,
    membershipId: null,
  });

  const handleSearch = async (bungieName: string) => {
    setError('');
    setCurrentActivity(null);
    setActivityList([]);

    try {
      setLoadingCurrentActivity(true);
      const response = await fetch('/api/bungie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bungieName }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch memberships');
      }

      const data = await response.json();

      if (!data || !data.Response || data.Response.length === 0) {
        throw new Error('No valid memberships found');
      }

      const membershipType = data.Response[0].membershipType;
      const membershipId = data.Response[0].membershipId;

      await fetchCurrentActivity(membershipType, membershipId);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingCurrentActivity(false);
    }
  };


  const fetchCurrentActivity = async (membershipType: number, membershipId: string) => {
    setError('');
  
    try {
      setLoadingCurrentActivity(true);
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipType, membershipId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
  
      const profileData = await response.json();
  
      const characters = Object.values(profileData.Response.characters.data);
      characters.sort((a, b) => new Date(b.dateLastPlayed).getTime() - new Date(a.dateLastPlayed).getTime());
      const mostRecentCharacter = characters[0];
      const currentActivityData = profileData.Response.characterActivities.data[mostRecentCharacter.characterId];
      const isInSession = currentActivityData.currentActivityHash !== 0 && currentActivityData.dateActivityStarted;
  
      if (isInSession) {
        const activityResponse = await fetch('/api/activity-definition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activityHash: currentActivityData.currentActivityHash }),
        });
  
        if (!activityResponse.ok) {
          throw new Error('Failed to fetch activity definition');
        }
  
        const activityData = await activityResponse.json();
        const activityName =
          currentActivityData.currentActivityHash === 82913930
            ? 'Orbit'
            : activityData.Response?.originalDisplayProperties?.name || 'Unknown Activity';
  
        const newStartTime = currentActivityData.dateActivityStarted || '';
  
        // Only update the current activity if the startTime is new
        if (!currentActivity || currentActivity.startTime !== newStartTime) {
          setCurrentActivity({
            name: activityName,
            startTime: newStartTime,
          });
  
          // Fetch activity list only if the startTime changes
          fetchActivityHistory(membershipType, membershipId, mostRecentCharacter.characterId, newStartTime);
        }
      } else {
        // Handle case where no session is active
        if (!currentActivity || currentActivity.name !== 'Unknown Activity') {
          setCurrentActivity({ name: 'Unknown Activity' });
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingCurrentActivity(false);
    }
  };

  const fetchActivityHistory = async (
    membershipType: number,
    membershipId: string,
    characterId: string,
    newStartTime: string
  ) => {
    try {
      const response = await fetch('/api/activity-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipType, membershipId, characterId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity history');
      }

      const activityHistoryData = await response.json();

      if (!activityHistoryData.Response || !activityHistoryData.Response.activities) {
        throw new Error('No activity history found');
      }

      const allActivities = await Promise.all(
        activityHistoryData.Response.activities.map(async (activity: any) => {
          const activityResponse = await fetch('/api/activity-definition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activityHash: activity.activityDetails.referenceId }),
          });

          if (!activityResponse.ok) {
            return {
              name: 'Unknown Activity',
              startTime: activity.period,
              mode: 'Unknown Mode',
              duration: 'Unknown Duration',
              highlightColor: 'gray',
              pgcrLink: '#',
            };
          }

          const activityData = await activityResponse.json();

          const activityDurationSeconds = activity.values.activityDurationSeconds?.basic?.value || 0;
          const totalHours = Math.floor(activityDurationSeconds / 3600);
          const totalMinutes = Math.floor((activityDurationSeconds % 3600) / 60);
          const totalSeconds = activityDurationSeconds % 60;

          const totalTimeText =
            totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m ${totalSeconds}s`;

          return {
            name: activityData.Response?.originalDisplayProperties?.name || 'Unknown Activity',
            startTime: activity.period,
            mode: activityModes[activity.activityDetails.mode] || 'Unknown Mode',
            duration: totalTimeText,
            highlightColor: activity.values.completed?.basic?.value === 1 ? '#28a745' : '#dc3545',
            pgcrLink: `https://www.bungie.net/en/PGCR/${activity.activityDetails.instanceId}`,
          };
        })
      );

      if (JSON.stringify(activityList) !== JSON.stringify(allActivities)) {
        setActivityList(allActivities);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetState = () => {
    setCurrentActivity(null);
    setActivityList([]);
    setError('');
  };

  return (
    <div className="flex flex-col min-h-screen gap-4">
      <Header onReset={resetState} />
      <main className="flex-grow container mx-auto flex flex-col gap-4">
        <SearchBar onSearch={handleSearch} />
        {loadingCurrentActivity && <LoadingIndicator />}
        {!loadingCurrentActivity && error && <p className="text-center text-red-500">{error}</p>}
        {!loadingCurrentActivity && currentActivity && (
          <CurrentActivity activityName={currentActivity.name} activityStartTime={currentActivity.startTime || ''} />
        )}
        {loadingHistory && <LoadingIndicator />}
        {!loadingHistory && activityList.length > 0 && <ActivityList activities={activityList} />}
      </main>
      <Footer />
    </div>
  );
}