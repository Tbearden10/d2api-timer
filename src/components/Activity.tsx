import React from "react";

interface ActivityProps {
  activityName: string;
  activityMode: string;
  activityDuration: string;
  completed: boolean;
}

const Activity: React.FC<ActivityProps> = ({
  activityName,
  activityMode,
  activityDuration,
  completed,
}) => {
  return (
    <div>
      <h1>{activityName || "Unknown Activity"}</h1>
      <hr className="divider" />
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <p>{activityMode}</p>
        <span>|</span>
        <p style={{ color: completed ? "green" : "red" }}>{activityDuration}</p>
      </div>
    </div>
  );
};

export default Activity;