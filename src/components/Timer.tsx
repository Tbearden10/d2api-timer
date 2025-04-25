import React, { useState, useEffect, useRef } from "react";

interface TimerProps {
  startTime: string | null;
  activityName: string;
  bungieName: string;
}

const Timer: React.FC<TimerProps> = ({ startTime, activityName, bungieName }) => {
  const [elapsedTime, setElapsedTime] = useState("00:00.000");
  const animationFrameRef = useRef<number | null>(null);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400); // Calculate days
    const hours = Math.floor((totalSeconds % 86400) / 3600); // Calculate hours after days
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Calculate minutes after hours
    const seconds = Math.floor(totalSeconds % 60); // Calculate remaining seconds
    const ms = milliseconds % 1000; // Calculate remaining milliseconds

    if (days > 0) {
      // Include days if greater than 0
      return `${days.toString().padStart(2, "0")}:${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
    } else if (hours > 0) {
      // Include hours if greater than 0
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms
        .toString()
        .padStart(3, "0")}`;
    } else {
      // Only include minutes and seconds if no hours or days
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
    }
  };

  useEffect(() => {
    if (!startTime) {
      setElapsedTime("00:00.000"); // Reset timer to 0 if no activity
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