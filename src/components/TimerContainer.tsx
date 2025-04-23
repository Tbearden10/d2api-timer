import React from 'react';
import Timer from './Timer';

interface TimerContainerProps {
  activityName: string;
  startTime: string | null;
}

const TimerContainer: React.FC<TimerContainerProps> = ({ activityName, startTime }) => {
  if (!activityName || !startTime) {
    return null; // Don't render if no valid data
  }

  return (
    <div id="timer-container">
      <Timer startTime={startTime} />
      <p id="activityname">{activityName}</p>
    </div>
  );
};

export default TimerContainer;