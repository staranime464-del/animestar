 // components/HomePage.tsx - Professional Dark Blue Theme
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Anime, FilterType, ContentTypeFilter } from '../src/types';
import AnimeCard from './AnimeCard';
import { SkeletonLoader } from './SkeletonLoader';
import { getAnimePaginated, searchAnime, getFeaturedAnime } from '../services/animeService';
import FeaturedAnimeCarousel from '../src/components/FeaturedAnimeCarousel';
import SEO from '../src/components/SEO';

interface Props {
  onAnimeSelect: (anime: Anime) => void;
  searchQuery: string;
  filter: FilterType;
  contentType: ContentTypeFilter;
}

const ANIME_FIELDS =
  'title,thumbnail,releaseYear,status,contentType,subDubStatus,description,genreList';

// Professional gradient borders
const BORDER_COLORS = [
  'from-blue-500 via-cyan-400 to-blue-500',
  'from-indigo-500 via-blue-400 to-indigo-500',
  'from-cyan-400 via-blue-500 to-cyan-400',
  'from-blue-600 via-indigo-400 to-blue-600',
  'from-sky-400 via-blue-500 to-sky-400',
];

// Professional glow colors
const GLOW_COLORS = [
  ['#3B82F6', '#06B6D4', '#3B82F6'],
  ['#6366F1', '#3B82F6', '#6366F1'],
  ['#06B6D4', '#3B82F6', '#06B6D4'],
  ['#2563EB', '#818CF8', '#2563EB'],
  ['#0EA5E9', '#3B82F6', '#0EA5E9'],
];

const HomePage: React.FC<Props> = ({
  onAnimeSelect,
  searchQuery,
  filter,
  contentType
}) => {
  const [localFilter, setLocalFilter] = useState<FilterType>(filter || 'All');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [featuredAnimes, setFeaturedAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentBorderColorIndex, setCurrentBorderColorIndex] = useState(0);
  
  const isMounted = useRef(true);
  const lastSearchQuery = useRef(searchQuery);

  const getSEOData = () => {
    let title = 'Watch Anime Online in Hindi & English | AniMestar';
    let description = 'AniMestar - Watch anime online for free in Hindi Dub, Hindi Sub, and English Sub. HD quality streaming and downloads. Latest anime episodes and movies.';
    let keywords = 'watch anime online, hindi anime, english anime, anime in hindi, anime in english, free anime streaming, anime download, AniMestar';
    
    if (searchQuery.trim()) {
      title = `Search "${searchQuery}" - Watch Anime Online | AniMestar`;
      description = `Search results for "${searchQuery}". Watch anime online in Hindi and English. Free HD streaming.`;
      keywords = `${searchQuery} anime, ${searchQuery} hindi dub, ${searchQuery} english sub, watch ${searchQuery} online`;
    }
    else if (localFilter !== 'All') {
      if (localFilter === 'Hindi Dub') {
        title = 'Watch Hindi Dubbed Anime Online | AniMestar';
        description = 'Watch Hindi dubbed anime online for free. All latest anime in Hindi dub with HD quality. Naruto, One Piece, Demon Slayer and more.';
        keywords = 'hindi dubbed anime, anime in hindi dub, watch hindi dub anime online, naruto hindi dub, one piece hindi dub, free hindi anime';
      } else if (localFilter === 'Hindi Sub') {
        title = 'Watch Hindi Subbed Anime Online | AniMestar';
        description = 'Watch Hindi subbed anime online for free. Latest anime with Hindi subtitles in HD quality.';
        keywords = 'hindi subbed anime, anime in hindi sub, watch hindi sub anime online, anime with hindi subtitles';
      } else if (localFilter === 'English Sub') {
        title = 'Watch English Subbed Anime Online | AniMestar';
        description = 'Watch English subbed anime online for free. Latest anime with English subtitles in HD quality.';
        keywords = 'english subbed anime, anime in english sub, watch english sub anime online, anime with english subtitles';
      }
    }
    else if (contentType !== 'All') {
      if (contentType === 'Movie') {
        title = 'Watch Anime Movies Online | AniMestar';
        description = 'Watch anime movies online for free in Hindi and English. Full length anime movies in HD quality.';
        keywords = 'anime movies, watch anime movies online, hindi anime movies, english anime movies';
      } else if (contentType === 'Manga') {
        title = 'Read Manga Online | AniMestar';
        description = 'Read manga online for free. Latest manga chapters available.';
        keywords = 'read manga online, manga, free manga, manga chapters';
      }
    }
    
    let canonicalUrl = 'https://animestar.com';
    const params = new URLSearchParams();
    
    if (localFilter !== 'All') params.set('filter', localFilter);
    if (contentType !== 'All') params.set('contentType', contentType);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    
    if (params.toString()) canonicalUrl += `?${params.toString()}`;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AniMestar",
      "url": "https://animestar.com",
      "description": "Watch anime online for free in Hindi and English. HD quality streaming and downloads.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://animestar.com?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
    
    return {
      title,
      description,
      keywords,
      canonicalUrl,
      structuredData,
      ogUrl: window.location.href
    };
  };

  const seoData = getSEOData();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBorderColorIndex((prev) => (prev + 1) % BORDER_COLORS.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const fetchFeaturedAnimes = useCallback(async () => {
    try {
      const data = await getFeaturedAnime();
      if (data?.length && isMounted.current) {
        const limited = data.slice(0, 10);
        setFeaturedAnimes(limited);
        localStorage.setItem('featuredAnimes', JSON.stringify(limited));
      }
    } catch {
      const stored = localStorage.getItem('featuredAnimes');
      if (stored && isMounted.current) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setFeaturedAnimes(parsed.slice(0, 10));
        } catch {}
      }
    }
  }, []);

  const getAllContentHeading = useCallback(() => {
    if (isSearching && searchQuery) return `Search: ${searchQuery}`;
    if (contentType !== 'All') return `All ${contentType}`;
    switch (localFilter) {
      case 'Hindi Dub': return 'All Hindi Dub';
      case 'Hindi Sub': return 'All Hindi Sub';
      case 'English Sub': return 'All English Sub';
      default: return 'All Content';
    }
  }, [localFilter, contentType, isSearching, searchQuery]);

  const getAnimeId = (anime: Anime): string => {
    if (anime.id) return anime.id;
    if (anime._id) return anime._id;
    return `${anime.title}-${anime.releaseYear || 'unknown'}`;
  };

  const loadInitialAnime = useCallback(async (isSearch: boolean = false) => {
    if (!isMounted.current) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (isSearch) {
        const data = await searchAnime(searchQuery, ANIME_FIELDS);
        if (data?.length && isMounted.current) {
          setAnimeList(data);
          setHasMore(false);
          setCurrentPage(1);
          setIsSearching(true);
        } else {
          setAnimeList([]);
          setHasMore(false);
        }
      } else {
        const data = await getAnimePaginated(1, 36, ANIME_FIELDS);
        if (data?.length && isMounted.current) {
          setAnimeList(data);
          setHasMore(data.length === 36);
          setCurrentPage(1);
          setIsSearching(false);
        } else {
          setError('No anime found');
        }
      }
    } catch (err) {
      if (isMounted.current) {
        setError(isSearch ? 'Search failed' : 'Failed to load anime');
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [searchQuery]);

  const loadMoreAnime = useCallback(async () => {
    if (isLoadingMore || !hasMore || isSearching) return;
    if (!isMounted.current) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await getAnimePaginated(nextPage, 24, ANIME_FIELDS);

      if (data?.length && isMounted.current) {
        setAnimeList(prev => [...prev, ...data]);
        setCurrentPage(nextPage);
        setHasMore(data.length === 24);
      } else {
        setHasMore(false);
      }
    } catch {
    } finally {
      if (isMounted.current) setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore, isSearching]);

  useEffect(() => {
    if (isMounted.current) {
      loadInitialAnime();
      if (!searchQuery) fetchFeaturedAnimes();
    }
  }, [filter, contentType]);

  useEffect(() => {
    if (!isMounted.current) return;

    const timer = setTimeout(async () => {
      if (searchQuery.trim()) {
        if (searchQuery !== lastSearchQuery.current) {
          await loadInitialAnime(true);
          lastSearchQuery.current = searchQuery;
        }
      } else {
        if (lastSearchQuery.current !== '') {
          loadInitialAnime(false);
          fetchFeaturedAnimes();
          lastSearchQuery.current = '';
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, loadInitialAnime, fetchFeaturedAnimes]);

  const filteredAnime = useMemo(() => {
    if (!animeList.length) return [];
    
    let list = [...animeList];

    if (contentType !== 'All') list = list.filter(a => a.contentType === contentType);
    if (localFilter !== 'All') list = list.filter(a => a.subDubStatus === localFilter);

    const uniqueAnimesMap = new Map<string, Anime>();
    for (const anime of list) {
      const id = getAnimeId(anime);
      if (!uniqueAnimesMap.has(id)) uniqueAnimesMap.set(id, anime);
    }
    
    return Array.from(uniqueAnimesMap.values());
  }, [animeList, localFilter, contentType]);

  const filterButtons = [
    { key: 'All' as FilterType, label: 'All' },
    { key: 'Hindi Dub' as FilterType, label: 'Hindi Dub' },
    { key: 'Hindi Sub' as FilterType, label: 'Hindi Sub' },
    { key: 'English Sub' as FilterType, label: 'English Sub' }
  ];

  const handleFilterChange = (f: FilterType) => setLocalFilter(f);

  useEffect(() => {
    if (isSearching) return;

    const handleScroll = () => {
      if (isLoadingMore || !hasMore) return;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.offsetHeight;
      
      if (scrollTop + windowHeight >= docHeight * 0.8) loadMoreAnime();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, isSearching, loadMoreAnime]);

  useEffect(() => {
    if (isMounted.current) setLocalFilter(filter);
  }, [filter]);

  // Loading State
  if (isLoading && animeList.length === 0) {
    return (
      <>
        <SEO
          title="Loading... | AniMestar"
          description="Watch anime online for free in Hindi and English. HD quality streaming and downloads."
          keywords="anime, watch anime online, hindi anime, english anime"
        />
        <div className="min-h-screen bg-[#0a0f1a] p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        </div>
      </>
    );
  }

  // Error State
  if (error) {
    return (
      <>
        <SEO
          title="Error Loading Anime | AniMestar"
          description="Watch anime online for free in Hindi and English. HD quality streaming and downloads."
          keywords="anime, watch anime online, hindi anime, english anime"
        />
        <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4">
          <div className="text-center bg-[#111827]/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 shadow-2xl">
            <p className="text-blue-400 text-xl mb-4 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        structuredData={seoData.structuredData}
        ogUrl={seoData.ogUrl}
      />
      
      <div className="hidden" itemScope itemType="https://schema.org/WebSite">
        <meta itemProp="name" content="AniMestar" />
        <meta itemProp="description" content="Watch anime online for free in Hindi and English. HD quality streaming and downloads." />
        <meta itemProp="url" content="https://animestar.com" />
      </div>
      
      <div className="min-h-screen bg-[#0a0f1a]">
        <style>{`
          @keyframes borderGlow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          @keyframes cardFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .card-wrapper:hover .card-glow {
            opacity: 0.8;
          }
          .card-wrapper:hover .card-content {
            transform: translateY(-4px);
            border-color: rgba(59, 130, 246, 0.3);
          }
          .filter-scroll::-webkit-scrollbar {
            display: none;
          }
          .filter-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-8">

          {/* Featured Section */}
          {!searchQuery && !isSearching && featuredAnimes.length > 0 && (
            <div className="mb-8 lg:mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-6 tracking-tight">
                Latest Content
              </h2>
              <FeaturedAnimeCarousel
                featuredAnimes={featuredAnimes}
                onAnimeSelect={onAnimeSelect}
              />
            </div>
          )}

          {/* Mobile Filter Buttons */}
          {!isSearching && (
            <div className="mb-4 lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 filter-scroll">
                {filterButtons.map(btn => (
                  <button
                    key={btn.key}
                    onClick={() => handleFilterChange(btn.key)}
                    className={`
                      px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300
                      whitespace-nowrap flex-shrink-0
                      ${localFilter === btn.key
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-[#1a2235] text-gray-300 hover:bg-[#243049] border border-gray-700/50'
                      }
                    `}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredAnime.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-[#111827]/80 backdrop-blur-xl rounded-2xl p-10 max-w-md mx-auto border border-gray-800/50 shadow-2xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {searchQuery ? 'No Results Found' : 'No Content'}
                </h2>
                <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                {!searchQuery && localFilter !== 'All' && (
                  <button
                    onClick={() => handleFilterChange('All')}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25"
                  >
                    Show All
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Section Heading */}
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 tracking-tight">
                {getAllContentHeading()}
              </h2>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {filteredAnime.map((anime, i) => (
                  <div 
                    key={`${getAnimeId(anime)}-${i}`}
                    className="card-wrapper group relative"
                  >
                    {/* Glow Effect */}
                    <div 
                      className="card-glow absolute -inset-[1px] rounded-xl opacity-0 blur-sm transition-all duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${GLOW_COLORS[currentBorderColorIndex][0]}, ${GLOW_COLORS[currentBorderColorIndex][1]}, ${GLOW_COLORS[currentBorderColorIndex][2]})`,
                      }}
                    />
                    
                    {/* Card Content */}
                    <div 
                      className="card-content relative rounded-xl bg-[#111827] border border-gray-800/50 overflow-hidden transition-all duration-300"
                    >
                      {/* Gradient Border on Hover */}
                      <div 
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${BORDER_COLORS[currentBorderColorIndex]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px]`}
                      >
                        <div className="w-full h-full rounded-xl bg-[#111827]" />
                      </div>
                      
                      {/* Inner Content */}
                      <div className="relative p-1.5">
                        <AnimeCard
                          anime={anime}
                          onClick={onAnimeSelect}
                          index={i}
                          showStatus={true}
                        />
                      </div>
                      
                      {/* Subtle Top Gradient */}
                      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent pointer-events-none rounded-t-xl" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && !isSearching && !searchQuery && (
                <div className="text-center mt-10">
                  <button
                    onClick={loadMoreAnime}
                    disabled={isLoadingMore}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-10 py-4 rounded-xl font-semibold text-base shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}

              {/* Loading Skeletons */}
              {isLoadingMore && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mt-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={`skeleton-${i}`} 
                      className="rounded-xl bg-[#111827] border border-gray-800/50 p-1.5"
                    >
                      <SkeletonLoader />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;