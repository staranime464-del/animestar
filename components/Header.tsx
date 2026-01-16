 // components/Header.tsx - Professional Dark Blue Theme
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { FilterType, ContentType } from '../src/types';
import { SearchIcon } from './icons/SearchIcon';
import { MenuIcon } from './icons/MenuIcon';
import { CloseIcon } from './icons/CloseIcon';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onNavigate: (destination: 'home' | 'list') => void;
  onFilterAndNavigateHome: (filter: 'Hindi Dub' | 'Hindi Sub' | 'English Sub') => void;
  onContentTypeNavigate: (contentType: ContentType) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearchChange, 
  searchQuery, 
  onNavigate, 
  onFilterAndNavigateHome, 
  onContentTypeNavigate 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchInputChange = useCallback((value: string) => {
    setLocalSearchQuery(value);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  }, [onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    onSearchChange('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (isMobileSearchOpen) {
        setIsMobileSearchOpen(false);
      }
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  const handleNavClick = (destination: 'home' | 'list') => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    if (destination === 'list') {
      onNavigate('list');
    } else {
      onNavigate('home');
    }
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
    setTimeout(() => setIsNavigating(false), 800);
  };

  const handleFilterClick = (filter: 'Hindi Dub' | 'Hindi Sub' | 'English Sub') => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    window.location.href = `${window.location.origin}/?filter=${encodeURIComponent(filter)}`;
    setIsMenuOpen(false);
    setTimeout(() => setIsNavigating(false), 1500);
  };

  const handleContentTypeClick = (contentType: ContentType) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    window.location.href = `${window.location.origin}/?contentType=${encodeURIComponent(contentType)}`;
    setIsMenuOpen(false);
    setTimeout(() => setIsNavigating(false), 1500);
  };

  const toggleMobileSearch = () => {
    const newState = !isMobileSearchOpen;
    setIsMobileSearchOpen(newState);
    setIsMenuOpen(false);
    
    if (newState) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  };

  const NavigationLoader = () => (
    isNavigating ? (
      <div className="fixed inset-0 bg-[#0a0f1a]/98 backdrop-blur-xl z-[9999] flex items-center justify-center">
        <div className="text-center relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full"></div>
          </div>
          
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl"></div>
                  <div className="absolute inset-1 bg-[#111827] rounded-xl"></div>
                  <span className="relative text-2xl text-blue-400 font-bold">A</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                ANIMESTAR
              </h1>
              <p className="text-gray-400 text-sm mt-2 font-light tracking-widest">LOADING</p>
            </div>
          </div>
          
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 animate-loadingBar"></div>
          </div>
        </div>
      </div>
    ) : null
  );

  return (
    <>
      <NavigationLoader />
      
      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loadingBar {
          animation: loadingBar 1.5s ease-in-out infinite;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      
      <header 
        ref={headerRef}
        className={`
          fixed top-0 left-0 right-0 z-40 transition-all duration-300
          ${isScrolled 
            ? 'bg-[#0a0f1a]/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-gray-800/50 py-2' 
            : 'bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-gray-800/30 py-3'
          }
        `}
      >
        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <button 
              onClick={() => handleNavClick('home')} 
              className="flex items-center space-x-3 group relative"
              disabled={isNavigating}
            >
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              
              <div className="relative">
                <h1 className="relative text-2xl lg:text-3xl font-bold tracking-tight">
                  <span className="text-white">Anime</span>
                  <span className="text-blue-400">Star</span>
                </h1>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              <div className="flex items-center space-x-1 bg-[#111827]/80 backdrop-blur-sm rounded-xl px-2 py-2 border border-gray-800/50">
                <button 
                  onClick={() => handleNavClick('home')} 
                  className="px-5 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a2235] transition-all duration-300 font-medium text-sm disabled:opacity-50"
                  disabled={isNavigating}
                >
                  Home
                </button>
                
                <div className="h-6 w-px bg-gray-700/50"></div>
                
                <button 
                  onClick={() => handleFilterClick('Hindi Dub')} 
                  className="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a2235] transition-all duration-300 font-medium text-xs disabled:opacity-50"
                  disabled={isNavigating}
                >
                  <div className="flex flex-col items-center leading-tight">
                    <span>Hindi</span>
                    <span className="text-gray-500 text-[10px]">Dub</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleFilterClick('Hindi Sub')} 
                  className="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a2235] transition-all duration-300 font-medium text-xs disabled:opacity-50"
                  disabled={isNavigating}
                >
                  <div className="flex flex-col items-center leading-tight">
                    <span>Hindi</span>
                    <span className="text-gray-500 text-[10px]">Sub</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleFilterClick('English Sub')} 
                  className="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a2235] transition-all duration-300 font-medium text-xs disabled:opacity-50"
                  disabled={isNavigating}
                >
                  <div className="flex flex-col items-center leading-tight">
                    <span>English</span>
                    <span className="text-gray-500 text-[10px]">Sub</span>
                  </div>
                </button>
                
                <div className="h-6 w-px bg-gray-700/50"></div>
                
                <button 
                  onClick={() => handleContentTypeClick('Movie')} 
                  className="px-4 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a2235] transition-all duration-300 font-medium text-sm disabled:opacity-50"
                  disabled={isNavigating}
                >
                  Movie
                </button>
                
                <button 
                  onClick={() => handleContentTypeClick('Manga')} 
                  className="px-4 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a2235] transition-all duration-300 font-medium text-sm disabled:opacity-50"
                  disabled={isNavigating}
                >
                  Manga
                </button>
                
                <div className="h-6 w-px bg-gray-700/50"></div>
                
                <button 
                  onClick={() => handleNavClick('list')} 
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 font-semibold text-sm disabled:opacity-50"
                  disabled={isNavigating}
                >
                  Anime List
                </button>
              </div>
            </nav>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center">
              <div className="relative">
                <div className="flex items-center">
                  <div className="absolute left-4">
                    <SearchIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search anime, manga, movies..."
                    value={localSearchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-64 xl:w-72 bg-[#111827] border border-gray-700/50 text-white placeholder-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 pl-12 pr-10 py-2.5 transition-all duration-300 focus:w-80"
                    disabled={isNavigating}
                  />
                  {localSearchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 text-gray-400 hover:text-white transition-colors"
                      type="button"
                      disabled={isNavigating}
                      aria-label="Clear search"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center space-x-2">
              <button 
                onClick={toggleMobileSearch}
                className="p-2.5 rounded-xl bg-[#111827] text-gray-400 hover:text-white hover:bg-[#1a2235] disabled:opacity-50 transition-all duration-300 border border-gray-800/50"
                disabled={isNavigating}
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2.5 rounded-xl bg-[#111827] text-gray-400 hover:text-white hover:bg-[#1a2235] disabled:opacity-50 transition-all duration-300 border border-gray-800/50"
                disabled={isNavigating}
                aria-label="Menu"
              >
                {isMenuOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="lg:hidden mt-4 animate-slideDown">
              <div className="relative">
                <div className="flex items-center">
                  <div className="absolute left-4">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search anime, manga, movies..."
                    value={localSearchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-[#111827] border border-gray-700/50 text-white placeholder-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 pl-12 pr-10 py-3 transition-all duration-300"
                    autoFocus
                    disabled={isNavigating}
                  />
                  {localSearchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-10 text-gray-400 hover:text-white transition-colors"
                      type="button"
                      disabled={isNavigating}
                      aria-label="Clear search"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="absolute right-3 text-gray-400 hover:text-white transition-colors"
                    type="button"
                    disabled={isNavigating}
                    aria-label="Close search"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0a0f1a]/98 backdrop-blur-xl shadow-2xl shadow-black/30 animate-fadeIn border-t border-gray-800/50 mt-2">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    AnimeStar
                  </h3>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg bg-[#111827] text-gray-400 hover:text-white transition-colors border border-gray-800/50"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                <button 
                  onClick={() => handleNavClick('home')} 
                  className="w-full px-4 py-3 rounded-xl bg-[#111827] text-gray-300 hover:bg-[#1a2235] hover:text-white transition-all duration-300 font-medium disabled:opacity-50 border border-gray-800/50 flex items-center justify-between"
                  disabled={isNavigating}
                >
                  <span className="font-semibold">Home</span>
                  <span className="text-gray-600">→</span>
                </button>
                
                <div className="pt-4">
                  <h4 className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3 px-2">Content Type</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleFilterClick('Hindi Dub')} 
                      className="w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-[#111827] hover:text-white transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-between"
                      disabled={isNavigating}
                    >
                      <span>Hindi Dub</span>
                      <span className="text-gray-600">→</span>
                    </button>
                    
                    <button 
                      onClick={() => handleFilterClick('Hindi Sub')} 
                      className="w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-[#111827] hover:text-white transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-between"
                      disabled={isNavigating}
                    >
                      <span>Hindi Sub</span>
                      <span className="text-gray-600">→</span>
                    </button>
                    
                    <button 
                      onClick={() => handleFilterClick('English Sub')} 
                      className="w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-[#111827] hover:text-white transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-between"
                      disabled={isNavigating}
                    >
                      <span>English Sub</span>
                      <span className="text-gray-600">→</span>
                    </button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3 px-2">Categories</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleContentTypeClick('Movie')} 
                      className="w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-[#111827] hover:text-white transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-between"
                      disabled={isNavigating}
                    >
                      <span>Movie</span>
                      <span className="text-gray-600">→</span>
                    </button>
                    
                    <button 
                      onClick={() => handleContentTypeClick('Manga')} 
                      className="w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-[#111827] hover:text-white transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-between"
                      disabled={isNavigating}
                    >
                      <span>Manga</span>
                      <span className="text-gray-600">→</span>
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-800/50">
                  <button 
                    onClick={() => handleNavClick('list')} 
                    className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
                    disabled={isNavigating}
                  >
                    <span>Anime List</span>
                    <span>→</span>
                  </button>
                </div>
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-800/30">
                <p className="text-center text-xs text-gray-600 font-light">
                  AnimeStar
                </p>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Header;