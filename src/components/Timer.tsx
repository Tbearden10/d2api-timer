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
      setElapsedTime("00:00:00.000");
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
      {startTime ? (
        <>
          <h1>{elapsedTime}</h1>
          <hr style={{ width: "80%", margin: "10px auto", backgroundColor: "#444", height: "1px", border: "none" }} />
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <p>{activityName || "Unknown Space"}</p>
            <span>|</span>
            <p>{bungieName}</p>
          </div>
        </>
      ) : (
        <p>It seems like there is no ongoing activity right now.</p>
      )}
    </div>
  );
};

export default Timer;