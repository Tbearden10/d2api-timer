import React from "react";

interface GearButtonProps {
  onClick: () => void;
}

const gearButtonStyle: React.CSSProperties = {
  position: "fixed",
  top: "10px",
  left: "10px",
  backgroundColor: "#000", // Black background
  border: "none",
  borderRadius: "50%", // Circular button
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  zIndex: 1000,
  touchAction: "none", // Ensure no mobile touch interference
};

const GearButton: React.FC<GearButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={gearButtonStyle}
    aria-label="Toggle background controller"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      width="24"
      height="24"
    >
      <path d="M12 1a2 2 0 0 1 2 2v1.09a7.001 7.001 0 0 1 3.91 3.91H19a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1.09a7.001 7.001 0 0 1-3.91 3.91V21a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.09a7.001 7.001 0 0 1-3.91-3.91H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h1.09a7.001 7.001 0 0 1 3.91-3.91V3a2 2 0 0 1 2-2h2zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
    </svg>
  </button>
);

export default GearButton;
