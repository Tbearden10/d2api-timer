import React from "react";

interface ErrorContainerProps {
  message: string;
}

const ErrorContainer: React.FC<ErrorContainerProps> = ({ message }) => {
  return (
    <div className="error-container">
      <p>{message}</p>
    </div>
  );
};

export default ErrorContainer;