import React from "react";

interface ActivityProps {
  activityName: string;
  activityMode: string;
  activityDuration: string;
  activityDate: Date; // Add date property
  completed: boolean;
  pgcrImage?: string; // Optional background image URL
}

const Activity: React.FC<ActivityProps> = ({
  activityName,
  activityMode,
  activityDuration,
  activityDate,
  completed,
  pgcrImage,
}) => {
  // Helper function to format duration

  return (
    <div
      className="activity"
      style={{
        backgroundImage: pgcrImage
          ? `url(https://www.bungie.net${pgcrImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Darker overlay for better text contrast */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay
        }}
      ></div>

      {/* Content */}
      <div
        style={{
          position: "relative", // Ensure content is above the overlay
          zIndex: 1,
          color: "#ffffff", // Bright white text
          textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)", // Subtle text shadow
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1
          className="activity-name"
          style={{
            fontSize: "1.4rem",
            fontWeight: "bold", // Increase font weight
            marginBottom: "8px",
          }}
        >
          {activityName || "Unknown Activity"}
        </h1>
        <hr className="divider" />
        <div style={{ display: "flex", gap: "5px", fontSize: "1rem" }}>
          <p>{activityMode}</p>
          <span>|</span>
          <p style={{ color: completed ? "#4caf50" : "#f44336" }}>
            {activityDuration}
          </p>
        </div>
        {/* Add Date */}
        <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "#ccc" }}>
          {activityDate.toLocaleString()} {/* Format the date */}
        </p>
      </div>
    </div>
  );
};

export default Activity;