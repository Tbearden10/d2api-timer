import React from "react";

interface ActivityContainerProps {
  recentActivity: { mode: string; name: string; duration: string } | null;
}

const ActivityContainer: React.FC<ActivityContainerProps> = ({ recentActivity }) => {
  if (!recentActivity) {
    return null; // Render nothing if no recent activity is passed
  }

  return (
    <div className="activity-container">
      <h1>Recent Activity</h1>
      <p>Mode: {recentActivity.mode}</p>
      <p>Name: {recentActivity.name}</p>
      <p>Duration: {recentActivity.duration}</p>
    </div>
  );
};

export default ActivityContainer;