 // App.tsx - WITH 404 ERROR PAGE
// ✅ SECRET CODE "anime201" -> ADMIN LOGIN -> ADMIN DASHBOARD
// ✅ NO URL CHANGE, NO SECRET CODE HINT, DIRECT ACCESS BLOCKED
// ✅ 404 ERROR PAGE FOR UNDEFINED ROUTES

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useSearchParams, Navigate } from 'react-router-dom';
import type { Anime, FilterType, ContentType, ContentTypeFilter } from './src/types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AnimeListPage from './components/AnimeListPage';
import DownloadRedirectPage from './components/DownloadRedirectPage';
import ScrollToTopButton from './components/ScrollToTopButton';
import Spinner from './components/Spinner';
import AdminLogin from './src/components/admin/AdminLogin';
import AdminDashboard from './src/components/admin/AdminDashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import DMCA from './components/DMCA';
import TermsAndConditions from './components/TermsAndConditions';
import Contact from './components/Contact';
import AnalyticsTracker from './src/components/AnalyticsTracker';
import AnimeDetailWrapper from './components/AnimeDetailWrapper';

// ✅ ENUMS FOR VIEW MANAGEMENT
enum AppView {
  HOME = 'home',
  ANIME_LIST = 'list',
  ANIME_DETAIL = 'detail',
  PRIVACY = 'privacy',
  DMCA = 'dmca',
  TERMS = 'terms',
  CONTACT = 'contact',
  DOWNLOAD = 'download',
  ADMIN_LOGIN = 'admin_login',
  ADMIN_DASHBOARD = 'admin_dashboard',
  NOT_FOUND = 'not_found'
}

// ✅ 404 NOT FOUND COMPONENT
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#60CC3F]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#4CAF50]/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full opacity-20 blur-2xl"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full opacity-30"></div>
              <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-[#636363] to-[#4A4A4A] rounded-full border-4 border-red-500 flex items-center justify-center shadow-2xl">
                <span className="text-5xl font-bold text-red-500">!</span>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-500/20 rounded-full animate-bounce"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500/20 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-red-500/20 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>

        {/* Error Message */}
        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-300 mb-8 text-lg">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="group relative px-8 py-4 bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] text-white font-bold rounded-xl hover:from-[#4CAF50] hover:to-[#3d8b40] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#60CC3F]/30 active:scale-95 overflow-hidden"
        >
          {/* Button background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          <span className="relative flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Back to Home
          </span>
        </button>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-gradient-to-br from-[#636363]/20 to-[#4A4A4A]/20 backdrop-blur-sm rounded-2xl border border-white/10">
          <h3 className="text-white font-bold mb-3 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-[#60CC3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Quick Links
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/anime')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Anime List
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [contentType, setContentType] = useState<ContentTypeFilter>('All');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  // ✅ SECRET CODE STATES (HIDDEN - NO VISUAL HINT)
  const [typedText, setTypedText] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // ✅ SEARCH DEBOUNCE REF
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ DUMMY FUNCTIONS FOR HEADER
  const dummyFilterFunction = (filter: 'Hindi Dub' | 'Hindi Sub' | 'English Sub') => {};
  const dummyContentTypeFunction = (contentType: ContentType) => {};

  // ✅ INITIALIZE APP
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
       
        const token = localStorage.getItem('adminToken');
        const username = localStorage.getItem('adminUsername');
        
        if (token && username) {
          setIsAdminAuthenticated(true);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('App initialization error:', error);
        }
      } finally {
        setIsAppLoading(false);
      }
    };
    initializeApp();
  }, []);

  // ✅ ADMIN LOGIN HANDLER
  const handleAdminLogin = (token: string, username: string) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUsername', username);
    setIsAdminAuthenticated(true);
    
    // ✅ Change view to ADMIN_DASHBOARD (without URL change)
    setCurrentView(AppView.ADMIN_DASHBOARD);
  };

  // ✅ ADMIN LOGOUT HANDLER
  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    setIsAdminAuthenticated(false);
    
    // ✅ Change view back to HOME (without URL change)
    setCurrentView(AppView.HOME);
    navigate('/');
  };

  // ✅ SECRET CODE KEYBOARD LISTENER (HIDDEN - NO VISUAL HINT)
  // ✅ CHANGED: "2007harsh" to "anime201"
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const newTypedText = (typedText + e.key).toLowerCase();
        setTypedText(newTypedText);
        
        // ✅ CHANGED: Check for secret code "anime201" instead of "2007harsh"
        if (newTypedText.includes('anime201')) {
          e.preventDefault();
          
          // ✅ Set view to ADMIN_LOGIN (without URL change)
          setCurrentView(AppView.ADMIN_LOGIN);
          setTypedText('');
        }
        
        // Reset typing after 3 seconds
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
          setTypedText('');
        }, 3000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [typedText]);

  // ✅ SYNC URL WITH CURRENT VIEW ON PAGE LOAD/NAVIGATION
  useEffect(() => {
    // Detect current view from URL
    const path = location.pathname;
    
    if (path === '/') {
      setCurrentView(AppView.HOME);
    } else if (path.startsWith('/detail/')) {
      setCurrentView(AppView.ANIME_DETAIL);
    } else if (path === '/anime') {
      setCurrentView(AppView.ANIME_LIST);
    } else if (path === '/privacy') {
      setCurrentView(AppView.PRIVACY);
    } else if (path === '/dmca') {
      setCurrentView(AppView.DMCA);
    } else if (path === '/terms') {
      setCurrentView(AppView.TERMS);
    } else if (path === '/contact') {
      setCurrentView(AppView.CONTACT);
    } else if (path === '/download' || path === '/download-redirect') {
      setCurrentView(AppView.DOWNLOAD);
    } else {
      // ✅ Set NOT_FOUND for undefined routes (including /admin/*)
      setCurrentView(AppView.NOT_FOUND);
    }
    // Admin views are handled separately and don't change URL
  }, [location.pathname]);

  // ✅ ANIME SELECT HANDLER - SYNC STATE WITH ROUTER
  const handleAnimeSelect = (anime: Anime) => {
    if (anime.slug) {
      navigate(`/detail/${anime.slug}`);
      // Don't set currentView here - let useEffect handle it from URL change
      window.scrollTo(0, 0);
    }
  };

  // ✅ NAVIGATION HANDLER
  const handleNavigate = (destination: 'home' | 'list') => {
    if (destination === 'list') {
      navigate('/anime');
    } else {
      navigate('/');
    }
    // Don't set currentView here - let useEffect handle it from URL change
  };

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
    searchDebounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      
      if (query.trim()) {
        params.set('search', query.trim());
      } else {
        params.delete('search');
      }
      
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.pushState({}, '', newUrl);
    }, 400);
  }, []);

  // ✅ RENDER CURRENT VIEW
  const renderCurrentView = () => {
    // ✅ ADMIN VIEWS DON'T SHOW HEADER/FOOTER
    if (currentView === AppView.ADMIN_LOGIN) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    
    if (currentView === AppView.ADMIN_DASHBOARD) {
      if (isAdminAuthenticated) {
        return <AdminDashboard onLogout={handleAdminLogout} />;
      } else {
        navigate('/');
        return null;
      }
    }
    
    // ✅ NOT FOUND PAGE
    if (currentView === AppView.NOT_FOUND) {
      return <NotFoundPage />;
    }
    
    // ✅ ALL OTHER VIEWS SHOW HEADER/FOOTER WITH ROUTES
    return (
      <>
        <Header 
          onSearchChange={handleSearchChange} 
          searchQuery={searchQuery}
          onNavigate={handleNavigate}
          onFilterAndNavigateHome={dummyFilterFunction}
          onContentTypeNavigate={dummyContentTypeFunction}
        />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <HomePage 
                onAnimeSelect={handleAnimeSelect} 
                searchQuery={searchQuery} 
                filter={filter}
                contentType={contentType}
              />
            } />
            <Route path="/anime" element={
              <AnimeListPage onAnimeSelect={handleAnimeSelect} />
            } />
            <Route path="/detail/:slug" element={<AnimeDetailWrapper />} />
            <Route path="/download" element={<DownloadRedirectPage />} />
            <Route path="/download-redirect" element={<DownloadRedirectPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/contact" element={<Contact />} />
            {/* ✅ CATCH-ALL ROUTE FOR 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTopButton />
      </>
    );
  };

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-[#636363] flex flex-col items-center justify-center p-4">
        <div className="text-center relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#60CC3F]/10 blur-3xl rounded-full"></div>
          </div>
          
          <div className="relative mb-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute -inset-6 bg-[#60CC3F]/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#60CC3F] to-[#4CAF50] rounded-full blur-xl"></div>
                <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-br from-[#636363] to-[#4A4A4A] rounded-2xl border-2 border-[#60CC3F] shadow-2xl">
                  <span className="text-4xl text-[#60CC3F] font-bold">A</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-white tracking-tight mb-3">
                ANIMESTAR
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-[#60CC3F] rounded-full animate-pulse"></div>
                <p className="text-lg font-light tracking-widest">YOUR ANIME DESTINATION</p>
                <div className="w-2 h-2 bg-[#60CC3F] rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="w-64 h-1.5 bg-[#4A4A4A] rounded-full overflow-hidden mx-auto mb-8">
              <div className="h-full bg-gradient-to-r from-[#60CC3F] via-[#4CAF50] to-[#60CC3F] animate-loadingBar"></div>
            </div>
          </div>
          
          <style>{`
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .animate-loadingBar {
              animation: loadingBar 1.5s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#636363] text-white min-h-screen font-sans">
      <AnalyticsTracker />
      
      {/* ✅ NO SECRET CODE HINT - COMPLETELY REMOVED */}
      
      {/* ✅ RENDER CURRENT VIEW */}
      {renderCurrentView()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

export default App;