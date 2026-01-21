 // components/Spinner.tsx  
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'green' | 'white' | 'blue' | 'red' | 'purple' | 'orange';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'green',
  text,
  className = '',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  };

  const colorClasses = {
    green: 'text-anime-green-400 border-t-anime-green-400',
    white: 'text-white border-t-white',
    blue: 'text-anime-blue-400 border-t-anime-blue-400',
    red: 'text-anime-red-400 border-t-anime-red-400',
    purple: 'text-anime-purple-400 border-t-anime-purple-400',
    orange: 'text-anime-orange-400 border-t-anime-orange-400'
  };

  const textColorClasses = {
    green: 'text-anime-green-400',
    white: 'text-white',
    blue: 'text-anime-blue-400',
    red: 'text-anime-red-400',
    purple: 'text-anime-purple-400',
    orange: 'text-anime-orange-400'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer ring with gradient */}
        <div 
          className={`${sizeClasses[size]} rounded-full border border-gray-600 animate-spin ${
            colorClasses[color]
          }`}
          style={{
            animationDuration: '1s',
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        ></div>
        
        {/* Inner dot for better visibility */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-1/3 h-1/3 rounded-full ${colorClasses[color].split(' ')[0]}/30`}></div>
        </div>
      </div>
      {text && (
        <p className={`mt-3 text-sm font-medium animate-pulse-soft ${textColorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-gray-600/90 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;