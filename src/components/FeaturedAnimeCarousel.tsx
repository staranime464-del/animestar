 // src/components/FeaturedAnimeCarousel.tsx  
import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { Anime } from '../types';
import type { Swiper as SwiperType } from 'swiper';

interface Props {
  featuredAnimes: Anime[];
  onAnimeSelect: (anime: Anime) => void;
}

const optimizeImageUrl = (url: string, width: number, height: number): string => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  try {
    const baseUrl = url.split('/upload/')[0];
    const rest = url.split('/upload/')[1];
    const imagePath = rest.split('/').slice(1).join('/');
    
    return `${baseUrl}/upload/f_webp,q_auto:best,w_${width},h_${height},c_fill,g_auto/${imagePath}`;
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return url;
  }
};

const FeaturedAnimeCarousel: React.FC<Props> = ({ featuredAnimes, onAnimeSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  if (!featuredAnimes || featuredAnimes.length === 0) {
    return null;
  }

  const currentAnime = featuredAnimes[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredAnimes.length);
  }, [featuredAnimes.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredAnimes.length) % featuredAnimes.length);
  }, [featuredAnimes.length]);

  // Auto-play for featured banner - 5 SECONDS
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, nextSlide]);

  const themeColors = {
    // Dark Colors
    darkBg: '#0A0F14',
    darkCard: '#111826',
    darkBorder: '#1F2937',
    
    // Green Colors
    greenPrimary: '#60CC3F',
    greenSecondary: '#4CAF50',
    greenTertiary: '#388E3C',
    greenLight: '#90EE90',
    greenBright: '#7CFC00',
    
    // Accent Colors
    accentPurple: '#9D4EDD',
    accentBlue: '#3B82F6',
    accentRed: '#EF4444',
  };

  // Helper function to get badge colors
  const getBadgeColors = (type: string | undefined, value: string | undefined) => {
    const stringValue = value || '';
    
    if (type === 'status') {
      if (stringValue === "Ongoing" || stringValue === "ongoing") {
        return {
          bg: 'rgba(96, 204, 63, 0.15)',
          text: '#60CC3F',
          border: 'rgba(96, 204, 63, 0.3)'
        };
      } else {
        return {
          bg: 'rgba(17, 24, 38, 0.7)',
          text: '#90EE90',
          border: 'rgba(144, 238, 144, 0.2)'
        };
      }
    }
    
    if (type === 'subDubStatus') {
      if (stringValue.toLowerCase().includes('hindi') && stringValue.toLowerCase().includes('dub')) {
        return {
          bg: 'rgba(96, 204, 63, 0.15)',
          text: '#7CFC00',
          border: 'rgba(96, 204, 63, 0.3)'
        };
      } else if (stringValue.toLowerCase().includes('hindi') && stringValue.toLowerCase().includes('sub')) {
        return {
          bg: 'rgba(76, 175, 80, 0.15)',
          text: '#60CC3F',
          border: 'rgba(76, 175, 80, 0.3)'
        };
      } else if (stringValue.toLowerCase().includes('english')) {
        return {
          bg: 'rgba(56, 142, 60, 0.15)',
          text: '#90EE90',
          border: 'rgba(56, 142, 60, 0.3)'
        };
      }
    }
    
    return {
      bg: 'rgba(17, 24, 38, 0.7)',
      text: '#60CC3F',
      border: 'rgba(96, 204, 63, 0.2)'
    };
  };

  return (
    <div className="mb-8 lg:mb-12">
      {/* ============ CLEANED BANNER DESIGN ============ */}
      
      {/* MOBILE BANNER */}
      <div className="block md:hidden">
        <div 
          className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(96,204,63,0.1),transparent_50%)]"></div>
          </div>
          
          <div className="relative p-4 h-[280px]">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={optimizeImageUrl(currentAnime.thumbnail, 600, 400)}
                alt={currentAnime.title}
                className="w-full h-full object-cover opacity-20"
                loading="lazy"
              />
              <div className="absolute inset-0 mix-blend-overlay opacity-30">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-purple-500/10 to-blue-500/10"></div>
              </div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Top Bar - REMOVED 02/08 TEXT */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                  <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                    Featured Anime
                  </span>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 flex flex-col justify-center">
                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
                  {currentAnime.title}
                </h2>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentAnime.status && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30 bg-green-500/10 text-green-400">
                      {currentAnime.status}
                    </span>
                  )}
                  {currentAnime.subDubStatus && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/30 bg-blue-500/10 text-blue-400">
                      {currentAnime.subDubStatus}
                    </span>
                  )}
                </div>
                
                {/* Description */}
                {currentAnime.description && (
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {currentAnime.description}
                  </p>
                )}
                
                {/* Watch Button */}
                <button
                  onClick={() => onAnimeSelect(currentAnime)}
                  className="group relative overflow-hidden w-full py-3 px-4 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-sm shadow-lg transition-all duration-300 active:scale-95"
                >
                  <span className="relative z-10">Watch Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:bg-green-500/20 hover:border-green-500/30 transition-all"
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:bg-green-500/20 hover:border-green-500/30 transition-all"
                  aria-label="Next"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PC BANNER */}
      <div className="hidden md:block">
        <div 
          className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Effects */}
          <div className="absolute inset-0">
            {/* Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative p-8 h-[500px] flex items-center">
            {/* Left Content */}
            <div className="flex-1 pr-12 relative z-20">
              {/* Featured Tag - REMOVED 02/08 TEXT */}
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                <span className="text-sm font-semibold text-green-400 uppercase tracking-widest">
                  Featured Anime
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                {currentAnime.title}
              </h1>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {currentAnime.status && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold border border-green-500/30 bg-green-500/10 text-green-400 backdrop-blur-sm">
                    {currentAnime.status}
                  </span>
                )}
                {currentAnime.subDubStatus && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold border border-blue-500/30 bg-blue-500/10 text-blue-400 backdrop-blur-sm">
                    {currentAnime.subDubStatus}
                  </span>
                )}
                {currentAnime.contentType && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-400 backdrop-blur-sm">
                    {currentAnime.contentType}
                  </span>
                )}
              </div>
              
              {/* Description */}
              {currentAnime.description && (
                <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl">
                  {currentAnime.description}
                </p>
              )}
              
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
                {currentAnime.releaseYear && (
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Release Year</div>
                    <div className="text-green-400 font-semibold">{currentAnime.releaseYear}</div>
                  </div>
                )}
                {currentAnime.genreList && currentAnime.genreList.length > 0 && (
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Genres</div>
                    <div className="text-green-400 font-semibold truncate">{currentAnime.genreList.slice(0, 2).join(', ')}</div>
                  </div>
                )}
              </div>
              
              {/* Action Buttons - REMOVED DETAILS BUTTON */}
              <div className="flex gap-4">
                <button
                  onClick={() => onAnimeSelect(currentAnime)}
                  className="group relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Watch Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              </div>
            </div>
            
            {/* Right Image - Floating Card */}
            <div className="relative w-[400px] h-[360px]">
              {/* Floating Image Container */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-2xl"></div>
                
                {/* Main Image */}
                <div className="relative h-full rounded-2xl overflow-hidden border-2 border-green-500/30 shadow-2xl group">
                  <img
                    src={optimizeImageUrl(currentAnime.thumbnail, 500, 400)}
                    alt={currentAnime.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                  
                  {/* Corner Accents */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-green-500"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-green-500"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-green-500"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-green-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="absolute bottom-8 left-8 flex gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:bg-green-500/20 hover:border-green-500/30 transition-all hover:scale-110"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:bg-green-500/20 hover:border-green-500/30 transition-all hover:scale-110"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          {/* Progress Dots */}
          <div className="absolute bottom-8 right-8 flex gap-2">
            {featuredAnimes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-gradient-to-r from-green-500 to-green-400" : "bg-gray-700 hover:bg-gray-600"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ============ REMOVED LATEST ANIME SECTION ============ */}
      
    </div>
  );
};

export default FeaturedAnimeCarousel;