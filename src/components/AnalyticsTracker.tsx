// animebing/src/components/AnalyticsTracker.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // GA4 pageview  
    if (typeof window.gtag === 'function') {
      const pagePath = location.pathname + location.search;
      
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: document.title,
        page_location: window.location.href
      });
      if (import.meta.env.DEV) {
        console.log('📊 GA4 Page View Tracked:', {
          path: pagePath,
          title: document.title,
          location: window.location.href
        });
      }
    }
  }, [location]);  

  return null; 
};

export default AnalyticsTracker;