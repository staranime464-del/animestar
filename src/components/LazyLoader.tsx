 // src/components/LazyLoader.tsx  
import React from 'react';
import Spinner from '../../components/Spinner';

interface LazyLoaderProps {
  height?: string;
  text?: string;
  showLogo?: boolean;
}

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  height = 'h-64', 
  text = 'Loading...',
  showLogo = false
}) => {
  return (
    <>
      {/* Loading Styles */}
      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loadingBar {
          animation: loadingBar 1.5s ease-in-out infinite;
        }
      `}</style>
      
      <div className={`flex flex-col items-center justify-center ${height} bg-[#4A4A4A] rounded-xl border border-gray-600/50 p-8`}>
        <Spinner 
          size="lg" 
          color="green"
          text={text}
          showLogo={showLogo}
        />
        {showLogo && (
          <div className="mt-4 w-48 h-1.5 bg-[#4A4A4A] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#60CC3F] via-[#4CAF50] to-[#60CC3F] animate-loadingBar"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default LazyLoader;