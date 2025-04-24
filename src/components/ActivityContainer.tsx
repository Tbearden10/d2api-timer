import React from "react";

interface ActivityContainerProps {
  recentActivity: { mode: string; name: string; duration: string } | null;
}

const ActivityContainer: React.FC<ActivityContainerProps> = ({ recentActivity }) => {
  if (!recentActivity) {
    return null; // Render nothing if no recent activity is passed
  }

  return (
    <div>
      <div>{recentActivity.mode}</div>
      <div>{recentActivity.name}</div>
      <div>{recentActivity.duration}</div>
    </div>
  );
};

export default ActivityContainer;