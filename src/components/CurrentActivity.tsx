'use client';

import Timer from './Timer';

interface CurrentActivityProps {
  activityName: string;
  activityStartTime: string;
}

export default function CurrentActivity({ activityName, activityStartTime }: CurrentActivityProps) {
  return (
    <div className="p-6 transparent-bg shadow-lg rounded-lg text-center">
      <h2 className="text-xl font-bold mb-4 text-gray-200">Current Activity</h2>
      <p className="text-lg mb-4 text-gray-300">
        <strong></strong> {activityName || 'Orbit'}
      </p>
      <div className="flex justify-center">
        <Timer startTime={activityStartTime} />
      </div>
    </div>
  );
}