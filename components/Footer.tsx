 // components/Footer.tsx  
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface SocialMedia {
  platform: string;
  url: string;
  isActive: boolean;
  icon: string;
  displayName: string;
}

const Footer: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([
    // ✅ Default hardcoded links for Animestar
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/animestar',
      isActive: true,
      icon: 'facebook',
      displayName: 'Facebook'
    },
    {
      platform: 'instagram',
      url: 'https://www.instagram.com/animestar',
      isActive: true,
      icon: 'instagram',
      displayName: 'Instagram'
    },
    {
      platform: 'telegram',
      url: 'https://t.me/animestar',
      isActive: true,
      icon: 'telegram',
      displayName: 'Telegram'
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Animestar
  const API_BASE = 'https://animestar.onrender.com';

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${API_BASE}/api/social`, {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const activeLinks = response.data.filter((link: SocialMedia) => link.isActive);
        if (activeLinks.length > 0) {
          setSocialLinks(activeLinks);
        }
      }
    } catch (error: any) {
      console.log('Using default social links');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLinkClick = async (type: string) => {
    if (isNavigating) return;
   
    setIsNavigating(true);
   
    let newUrl = window.location.origin;
   
    switch(type) {
      case 'home':
        newUrl = window.location.origin + '/';
        break;
      case 'hindi-dub':
        newUrl = window.location.origin + '/?filter=Hindi+Dub';
        break;
      case 'hindi-sub':
        newUrl = window.location.origin + '/?filter=Hindi+Sub';
        break;
      case 'english-sub':
        newUrl = window.location.origin + '/?filter=English+Sub';
        break;
      case 'movies':
        newUrl = window.location.origin + '/?contentType=Movie';
        break;
      
      case 'anime-list':
        navigate('/anime');
        setTimeout(() => setIsNavigating(false), 800);
        return;
      default:
        newUrl = window.location.origin + '/';
    }
    
    window.location.href = newUrl;
    setTimeout(() => setIsNavigating(false), 1500);
  };

  const handlePageNavigation = async (path: string) => {
    if (isNavigating) return;
   
    setIsNavigating(true);
   
    if (location.pathname !== path) {
      navigate(path);
    }
   
    setTimeout(() => setIsNavigating(false), 800);
  };

  const NavigationLoader = () => (
    <div className="fixed inset-0 bg-[#636363]/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#60CC3F] mx-auto mb-4"></div>
        <h3 className="text-white text-xl font-semibold mb-2">Loading Animestar</h3>
        <p className="text-gray-300">Preparing your content...</p>
      </div>
    </div>
  );

  const SocialIcon = ({ platform, className = "w-6 h-6" }: { platform: string; className?: string }) => {
    switch (platform) {
      case 'facebook':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'telegram':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.139l-1.671 7.894c-.236 1.001-.837 1.248-1.697.775l-4.688-3.454-2.26 2.178c-.249.249-.459.459-.935.459l.336-4.773 8.665-5.515c.387-.247.741-.112.45.141l-7.07 6.389-3.073-.967c-1.071-.336-1.092-1.071.223-1.585l12.18-4.692c.892-.336 1.674.223 1.383 1.383z"/>
          </svg>
        );
      default:
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
          </svg>
        );
    }
  };

  return (
    <>
      {isNavigating && <NavigationLoader />}
     
      {/* DARK GRAY BACKGROUND WITH GREEN TOP BORDER */}
      <footer className="bg-[#636363] border-t-2 border-[#60CC3F]">
        <div className="container mx-auto py-10 px-4 lg:px-6">
          {/* Main Footer Content - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#60CC3F] to-[#4CAF50] rounded-xl">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <h3 className="text-2xl font-bold">
                    <span className="text-white">Anime</span>
                    <span className="text-[#60CC3F]">Star</span>
                  </h3>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 max-w-md text-center md:text-left">
                  Your ultimate anime destination. Watch HD quality anime in Hindi & English for free.
                </p>
                
                {/* Social Media Links */}
                <div className="flex justify-center md:justify-start space-x-3">
                  {socialLinks.map(link => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="group bg-[#4A4A4A] hover:bg-[#60CC3F] text-gray-300 hover:text-white p-2.5 rounded-lg transition-all duration-300 border border-gray-600 hover:border-[#60CC3F]"
                      title={`Follow us on ${link.displayName}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(link.url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <SocialIcon platform={link.platform} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-semibold mb-4 text-lg border-b border-[#60CC3F]/30 pb-2">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => handleQuickLinkClick('home')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  Home
                </button>
                <button
                  onClick={() => handleQuickLinkClick('hindi-dub')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  Hindi Dub
                </button>
                <button
                  onClick={() => handleQuickLinkClick('hindi-sub')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  Hindi Sub
                </button>
                <button
                  onClick={() => handleQuickLinkClick('english-sub')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  English Sub
                </button>
              </div>
            </div>
            
            {/* Content Categories */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-semibold mb-4 text-lg border-b border-[#60CC3F]/30 pb-2">Categories</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => handleQuickLinkClick('movies')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  Movies
                </button>
                <button
                  onClick={() => handleQuickLinkClick('anime-list')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  Anime List
                </button>
                <button
                  onClick={() => handlePageNavigation('/contact')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  Contact Us
                </button>
                <button
                  onClick={() => handlePageNavigation('/dmca')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  Report Content
                </button>
              </div>
            </div>
            
            {/* Legal Links */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-semibold mb-4 text-lg border-b border-[#60CC3F]/30 pb-2">Legal</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => handlePageNavigation('/terms')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  Terms & Conditions
                </button>
                <button
                  onClick={() => handlePageNavigation('/privacy')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => handlePageNavigation('/dmca')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  DMCA
                </button>
                <button
                  onClick={() => handlePageNavigation('/contact')}
                  className="block text-gray-300 hover:text-[#60CC3F] transition-colors py-1 text-left font-medium disabled:opacity-50 hover:pl-2 transition-all"
                  disabled={isNavigating}
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-600 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-center md:text-left">
                <p className="text-gray-300 text-sm">
                  &copy; {new Date().getFullYear()} Animestar. All Rights Reserved.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Watch anime online in HD quality for free
                </p>
              </div>
              
              {/* Disclaimer */}
              <div className="text-center md:text-right max-w-md">
                <p className="text-gray-400 text-xs">
                  Disclaimer: This site does not host any files. All content is provided by third-party servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;