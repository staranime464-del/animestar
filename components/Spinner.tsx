 // components/Spinner.tsx  
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'green' | 'white' | 'gray' | 'light-green';
  text?: string;
  className?: string;
  showLogo?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'green',
  text,
  className = '',
  showLogo = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20'
  };

  const colorClasses = {
    green: 'text-[#60CC3F]',
    'light-green': 'text-[#4CAF50]',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  const textColorClasses = {
    green: 'text-[#60CC3F]',
    'light-green': 'text-[#4CAF50]',
    white: 'text-white',
    gray: 'text-gray-300'
  };

  const spinnerContent = showLogo ? (
    <div className="relative">
      {/* Logo Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[#60CC3F] to-[#4CAF50] rounded-full blur-xl opacity-20 animate-pulse"></div>
      
      {/* Logo Container */}
      <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#636363] to-[#4A4A4A] rounded-2xl border-2 border-[#60CC3F] shadow-2xl">
        <span className="text-3xl text-[#60CC3F] font-bold">A</span>
      </div>
      
      {/* Loading Ring */}
      <div className="absolute -inset-4">
        <div className="absolute inset-0 border-4 border-transparent border-t-[#60CC3F] border-r-[#60CC3F]/50 rounded-full animate-spin"></div>
      </div>
    </div>
  ) : (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {spinnerContent}
      
      {text && (
        <p className={`mt-3 text-center ${textColorClasses[color]} text-sm animate-pulse font-medium`}>
          {text}
        </p>
      )}
      
      {/* Optional Loading Bar */}
      {showLogo && !text && (
        <div className="mt-6 w-32 h-1.5 bg-[#4A4A4A] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#60CC3F] via-[#4CAF50] to-[#60CC3F] animate-loadingBar"></div>
        </div>
      )}
    </div>
  );
};

// the animation style  
const SpinnerStyles: React.FC = () => (
  <style>{`
    @keyframes loadingBar {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-loadingBar {
      animation: loadingBar 1.5s ease-in-out infinite;
    }
  `}</style>
);

export default Spinner;
export { SpinnerStyles };