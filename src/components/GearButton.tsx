import React from "react";
import Image from "next/image";

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
    <Image
      src="/gear-icon.svg" // Path to your gear icon
      alt="Gear Icon"
      style={{ width: "24px", height: "24px", filter: "invert(1)" }} // Adjust size as needed
    />
  </button>
);

export default GearButton;
