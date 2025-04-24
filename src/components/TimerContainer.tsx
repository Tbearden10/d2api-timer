import React from "react";
import Timer from "./Timer";

interface TimerContainerProps {
  activityName: string;
  startTime: string | null;
  bungieName: string;
}

const TimerContainer: React.FC<TimerContainerProps> = ({
  activityName,
  startTime,
  bungieName,
}) => {
  return (
    <div className="timer-container">
      <Timer
        startTime={startTime}
        activityName={activityName}
        bungieName={bungieName}
      />
    </div>
  );
};

export default TimerContainer;