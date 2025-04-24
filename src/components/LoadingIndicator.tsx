// components/LoadingIndicator.tsx
import { PacmanLoader } from 'react-spinners';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <PacmanLoader color="#FE0932" size={40} />
    </div>
  );
};

export default LoadingIndicator;
