import React, { useState, useEffect } from 'react';

interface TimerProps {
  startTime: string | null;
}

const Timer: React.FC<TimerProps> = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState('...');

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    let timeString = '';
    if (hrs > 0) {
      timeString += `${hrs}hr `;
    }
    timeString += `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    return timeString;
  };

  useEffect(() => {
    if (!startTime) {
      setElapsedTime('...');
      return;
    }

    const start = new Date(startTime).getTime();
    const updateElapsed = () => {
      const now = Date.now();
      const seconds = Math.floor((now - start) / 1000);
      setElapsedTime(formatTime(seconds));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return <p id="timer">{elapsedTime}</p>;
};

export default Timer;