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
      <hr className="divider" /> {/* Add a small line */}
      <div className="meta-content">
        <p className="activity-name">{recentActivity.name}</p>
        <span className="separator">|</span>
        <p className="activity-mode">{recentActivity.mode}</p>
        <span className="separator">|</span>
        <p className="activity-duration">{recentActivity.duration}</p>
      </div>
    </div>
  );
};

export default ActivityContainer;