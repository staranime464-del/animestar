 // src/components/LazyLoader.tsx - UPDATED FOR ANIMESTAR BLUE THEME
import React from 'react';
import Spinner from './Spinner';

interface LazyLoaderProps {
  height?: string;
  text?: string;
}

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  height = 'h-64', 
  text = 'Loading...' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${height} bg-blue-900/20 rounded-lg border border-blue-700/30`}>
      <Spinner className="w-8 h-8 mb-2" color="blue" />
      <p className="text-blue-400/70 text-sm">{text}</p>
    </div>
  );
};

export default LazyLoader;