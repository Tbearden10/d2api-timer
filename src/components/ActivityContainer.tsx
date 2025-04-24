import React from "react";
import Activity from "./Activity";

interface ActivityContainerProps {
  recentActivity: {
    mode: string;
    name: string;
    duration: string;
    completed: boolean;
  };
}

const ActivityContainer: React.FC<ActivityContainerProps> = ({ recentActivity }) => {
  return (
    <div className="activity-container">
      <Activity
        activityName={recentActivity.name}
        activityMode={recentActivity.mode}
        activityDuration={recentActivity.duration}
        completed={recentActivity.completed}
      />
    </div>
  );
};

export default ActivityContainer;