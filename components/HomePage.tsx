 // components/HomePage.tsx  
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
  
  const isMounted = useRef(true);
  const lastSearchQuery = useRef(searchQuery);

  const getSEOData = () => {
    let title = 'Watch Anime Online in Hindi & English | Animestar';
    let description = 'Animestar - Watch anime online for free in Hindi Dub, Hindi Sub, and English Sub. HD quality streaming and downloads. Latest anime episodes and movies.';
    let keywords = 'watch anime online, hindi anime, english anime, anime in hindi, anime in english, free anime streaming, anime download, Animestar';
    
    if (searchQuery.trim()) {
      title = `Search "${searchQuery}" - Watch Anime Online | Animestar`;
      description = `Search results for "${searchQuery}". Watch anime online in Hindi and English. Free HD streaming.`;
      keywords = `${searchQuery} anime, ${searchQuery} hindi dub, ${searchQuery} english sub, watch ${searchQuery} online`;
    }
    else if (localFilter !== 'All') {
      if (localFilter === 'Hindi Dub') {
        title = 'Watch Hindi Dubbed Anime Online | Animestar';
        description = 'Watch Hindi dubbed anime online for free. All latest anime in Hindi dub with HD quality. Naruto, One Piece, Demon Slayer and more.';
        keywords = 'hindi dubbed anime, anime in hindi dub, watch hindi dub anime online, naruto hindi dub, one piece hindi dub, free hindi anime';
      } else if (localFilter === 'Hindi Sub') {
        title = 'Watch Hindi Subbed Anime Online | Animestar';
        description = 'Watch Hindi subbed anime online for free. Latest anime with Hindi subtitles in HD quality.';
        keywords = 'hindi subbed anime, anime in hindi sub, watch hindi sub anime online, anime with hindi subtitles';
      } else if (localFilter === 'English Sub') {
        title = 'Watch English Subbed Anime Online | Animestar';
        description = 'Watch English subbed anime online for free. Latest anime with English subtitles in HD quality.';
        keywords = 'english subbed anime, anime in english sub, watch english sub anime online, anime with english subtitles';
      }
    }
    else if (contentType !== 'All') {
      if (contentType === 'Movie') {
        title = 'Watch Anime Movies Online | Animestar';
        description = 'Watch anime movies online for free in Hindi and English. Full length anime movies in HD quality.';
        keywords = 'anime movies, watch anime movies online, hindi anime movies, english anime movies';
      } else if (contentType === 'Manga') {
        title = 'Read Manga Online | Animestar';
        description = 'Read manga online for free. Latest manga chapters available.';
        keywords = 'read manga online, manga, free manga, manga chapters';
      }
    }
    
    let canonicalUrl = 'https://animestar.in';
    const params = new URLSearchParams();
    
    if (localFilter !== 'All') params.set('filter', localFilter);
    if (contentType !== 'All') params.set('contentType', contentType);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    
    if (params.toString()) canonicalUrl += `?${params.toString()}`;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Animestar",
      "url": "https://animestar.in",
      "description": "Watch anime online for free in Hindi and English. HD quality streaming and downloads.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://animestar.in?search={search_term_string}",
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
      default: return 'All Anime'; // Changed from 'All Content' to 'All Anime'
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
          title="Anime | Animestar"
          description="Watch anime online for free in Hindi and English. HD quality streaming and downloads."
          keywords="anime, watch anime online, hindi anime, english anime"
        />
        <div className="min-h-screen bg-[#636363] p-4">
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
          title="Anime | Animestar"
          description="Watch anime online for free in Hindi and English. HD quality streaming and downloads."
          keywords="anime, watch anime online, hindi anime, english anime"
        />
        <div className="min-h-screen bg-[#636363] flex items-center justify-center p-4">
          <div className="text-center bg-[#4A4A4A] rounded-2xl p-8 border-2 border-[#60CC3F] shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#60CC3F]/10 flex items-center justify-center border border-[#60CC3F]/30">
              <svg className="w-8 h-8 text-[#60CC3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Content</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#388E3C] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-[#60CC3F]/25 border border-[#60CC3F]"
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
        <meta itemProp="name" content="Animestar" />
        <meta itemProp="description" content="Watch anime online for free in Hindi and English. HD quality streaming and downloads." />
        <meta itemProp="url" content="https://animestar.in" />
      </div>
      
      <div className="min-h-screen bg-[#636363]">
        <style>{`
          .filter-scroll::-webkit-scrollbar {
            display: none;
          }
          .filter-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-8">

          {/* Featured Section - Changed from "Latest" to "Latest Anime" */}
          {!searchQuery && !isSearching && featuredAnimes.length > 0 && (
            <div className="mb-8 lg:mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-6 tracking-tight border-b-2 border-[#60CC3F]/50 pb-2">
                Latest Anime {/* Changed from "Latest" to "Latest Anime" */}
              </h2>
              <FeaturedAnimeCarousel
                featuredAnimes={featuredAnimes}
                onAnimeSelect={onAnimeSelect}
              />
            </div>
          )}

          {/* No Results */}
          {filteredAnime.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-[#4A4A4A] rounded-2xl p-10 max-w-md mx-auto border-2 border-[#60CC3F]/50 shadow-2xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#60CC3F]/10 flex items-center justify-center border border-[#60CC3F]/30">
                  <svg className="w-8 h-8 text-[#60CC3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {searchQuery ? 'No Results Found' : 'No Content'}
                </h2>
                <p className="text-gray-300 mb-6">Try adjusting your search or filters</p>
                {!searchQuery && localFilter !== 'All' && (
                  <button
                    onClick={() => setLocalFilter('All')}
                    className="bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#388E3C] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-[#60CC3F]/25 border border-[#60CC3F]"
                  >
                    Show All Content
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Section Heading */}
              <div className="mb-6 border-b-2 border-[#60CC3F]/50 pb-3">
                <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {getAllContentHeading()} {/* Now returns "All Anime" by default */}
                </h2>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {filteredAnime.map((anime, i) => (
                  <div 
                    key={`${getAnimeId(anime)}-${i}`}
                    className="group relative"
                  >
                    <div className="relative rounded-xl overflow-hidden transition-all duration-300 group-hover:transform group-hover:-translate-y-1">
                      <AnimeCard
                        anime={anime}
                        onClick={onAnimeSelect}
                        index={i}
                        showStatus={true}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && !isSearching && !searchQuery && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMoreAnime}
                    disabled={isLoadingMore}
                    className="bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#388E3C] text-white px-12 py-4 rounded-xl font-semibold text-base shadow-2xl shadow-[#60CC3F]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-[#60CC3F] hover:shadow-3xl hover:shadow-[#60CC3F]/40"
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Loading More...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Load More Content
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Loading Skeletons */}
              {isLoadingMore && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 mt-8">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={`skeleton-${i}`} 
                      className="rounded-xl bg-[#4A4A4A] p-2 border border-gray-600"
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