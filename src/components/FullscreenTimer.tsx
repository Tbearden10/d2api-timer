import React from "react";
import Timer from "./Timer";

interface FullscreenTimerProps {
  activityName: string;
  startTime: string | null;
  bungieName: string;
}

const FullscreenTimer: React.FC<FullscreenTimerProps> = ({
  activityName,
  startTime,
  bungieName,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{bungieName}</h1>
      <Timer
        startTime={startTime}
        activityName={activityName}
        bungieName={bungieName}
      />
    </div>
  );
};

export default FullscreenTimer;