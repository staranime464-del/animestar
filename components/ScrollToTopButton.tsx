 import React, { useState, useEffect } from 'react';
import { UpArrowIcon } from './icons/UpArrowIcon';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="
            bg-gradient-to-br from-[#4A4A4A] to-[#636363] 
            hover:from-[#60CC3F] hover:to-[#4CAF50] 
            text-white rounded-full p-3 
            shadow-lg shadow-black/30 
            transition-all duration-300 ease-in-out 
            transform hover:scale-110 
            focus:outline-none focus:ring-2 focus:ring-[#60CC3F]/50
            animate-fade-in
            border border-gray-600 hover:border-[#60CC3F]
          "
          aria-label="Scroll to top"
        >
          <UpArrowIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;