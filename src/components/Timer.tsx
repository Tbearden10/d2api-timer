import React, { useState, useEffect } from "react";

interface TimerProps {
  startTime: string | null;
  activityName: string;
  bungieName: string;
}

const Timer: React.FC<TimerProps> = ({ startTime, activityName, bungieName }) => {
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!startTime) {
      setElapsedTime("00:00:00");
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

  return (
    <div>
      <h1>{elapsedTime}</h1>
      <p>{activityName || "Activity"}</p>
      <p>{bungieName}</p>
    </div>
  );
};

export default Timer;