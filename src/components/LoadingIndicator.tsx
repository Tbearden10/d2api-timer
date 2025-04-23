import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="loading-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <style jsx>{`
        .loading-spinner {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }
        .loading-spinner div {
          position: absolute;
          width: 16px;
          height: 16px;
          background: #4a90e2;
          border-radius: 50%;
          animation: loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }
        .loading-spinner div:nth-child(1) {
          top: 8px;
          left: 8px;
          animation-delay: -0.45s;
        }
        .loading-spinner div:nth-child(2) {
          top: 8px;
          left: 32px;
          animation-delay: -0.3s;
        }
        .loading-spinner div:nth-child(3) {
          top: 32px;
          left: 8px;
          animation-delay: -0.15s;
        }
        .loading-spinner div:nth-child(4) {
          top: 32px;
          left: 32px;
        }
        @keyframes loading-spinner {
          0%, 100% {
            transform: scale(0);
          }
          50% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;