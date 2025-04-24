import React from "react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="techno-loader-container flex flex-col items-center justify-center">
      <div className="techno-line-wave flex gap-2">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;