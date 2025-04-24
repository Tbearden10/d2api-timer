import React, { useState, useEffect, useRef } from "react";

interface TimerProps {
  startTime: string | null;
  activityName: string;
  bungieName: string;
}

const Timer: React.FC<TimerProps> = ({ startTime, activityName, bungieName }) => {
  const [elapsedTime, setElapsedTime] = useState("00:00:00.000");
  const animationFrameRef = useRef<number | null>(null);

  const formatTime = (milliseconds: number) => {
    const hrs = Math.floor(milliseconds / 3600000);
    const mins = Math.floor((milliseconds % 3600000) / 60000);
    const secs = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms
      .toString()
      .padStart(3, "0")}`;
  };

  useEffect(() => {
    if (!startTime) {
      setElapsedTime("00:00:00.000"); // Reset timer to 0 if no activity
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current); // Stop any ongoing animation
      }
      return;
    }

    const start = new Date(startTime).getTime();

    const updateElapsed = () => {
      const now = Date.now();
      const milliseconds = now - start;
      setElapsedTime(formatTime(milliseconds));
      animationFrameRef.current = requestAnimationFrame(updateElapsed); // Schedule the next frame
    };

    updateElapsed(); // Start the animation loop

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current); // Clean up on unmount
      }
    };
  }, [startTime]);

  return (
    <div>
      <h1 className="timer">{elapsedTime}</h1>
      <hr className="divider" />
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <p>{activityName || "Not in Activity"}</p>
        <span>|</span>
        <p>{bungieName}</p>
      </div>
    </div>
  );
};

export default Timer;