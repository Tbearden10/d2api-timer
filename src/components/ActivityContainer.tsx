import React from "react";
import Activity from "./Activity";

interface ActivityContainerProps {
  recentActivity: {
    mode: string;
    name: string;
    duration: string;
    date: Date; // Add date property
    completed: boolean;
    pgcrImage?: string; // Optional background image URL
  };
}

const ActivityContainer: React.FC<ActivityContainerProps> = ({ recentActivity }) => {
  return (
    <div className="activity-container">
      <Activity
        activityName={recentActivity.name}
        activityMode={recentActivity.mode}
        activityDuration={recentActivity.duration}
        activityDate={recentActivity.date} // Pass the date
        completed={recentActivity.completed}
        pgcrImage={recentActivity.pgcrImage} // Pass the image URL
      />
    </div>
  );
};

export default ActivityContainer;