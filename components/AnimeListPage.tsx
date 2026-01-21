 // components/AnimeListPage.tsx - UPDATED WITH # FILTER
import React, { useState, useEffect, useMemo } from 'react';
import type { Anime, FilterType } from '../src/types';
import { getAllAnime } from '../services/animeService';
import Spinner from './Spinner';
import SEO from '../src/components/SEO';

interface AnimeListPageProps {
  onAnimeSelect: (anime: Anime) => void;
}

const AnimeListPage: React.FC<AnimeListPageProps> = ({ onAnimeSelect }) => {
  const [allAnime, setAllAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllAnime();
        setAllAnime(data);
      } catch (err) {
        setError('Failed to fetch anime data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnime();
  }, []);

  const sortedAndFilteredAnime = useMemo(() => {
    let result = allAnime;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(anime => 
        anime.title.toLowerCase().includes(query)
      );
    }
    
    // Apply alphabetical filter
    if (selectedLetter !== 'All') {
      if (selectedLetter === '#') {
        // Show anime that don't start with A-Z
        result = result.filter(anime => {
          const firstChar = anime.title.charAt(0).toUpperCase();
          return !/[A-Z]/.test(firstChar);
        });
      } else {
        // Show anime starting with the selected letter
        result = result.filter(anime => 
          anime.title.charAt(0).toUpperCase() === selectedLetter
        );
      }
    }
    
    return result.sort((a, b) => a.title.localeCompare(b.title));
  }, [allAnime, selectedLetter, searchQuery]);

  // Effect to manage the filtering loading indicator for a smoother UX
  useEffect(() => {
    if (isFiltering) {
      const timer = setTimeout(() => setIsFiltering(false), 300);
      return () => clearTimeout(timer);
    }
  }, [sortedAndFilteredAnime, isFiltering]);

  const handleLetterChange = (letter: string) => {
    if (letter !== selectedLetter) {
      setIsFiltering(true);
      setSelectedLetter(letter);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsFiltering(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsFiltering(true);
  };

  const clearAlphabetFilter = () => {
    setSelectedLetter('All');
    setIsFiltering(true);
  };

  // Generate A-Z letters, #, and All
  const alphabetOptions = ['All', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  // ✅ GENERATE SEO DATA FOR ANIME LIST PAGE
  const getSEOData = () => {
    let title = 'Anime List | AnimeStar';
    let description = 'Browse complete A-Z alphabetical list of all anime available. Watch anime online for free in HD quality.';
    let keywords = 'anime list, A-Z anime, all anime, anime alphabetical list, watch anime online, anime collection';
    
    // Customize based on selected letter
    if (selectedLetter !== 'All') {
      if (selectedLetter === '#') {
        title = `Anime Starting with Numbers/Symbols | AnimeStar`;
        description = `Browse anime titles starting with numbers and symbols. Complete list of non-alphabetic anime to watch online for free.`;
        keywords = `numbers anime, symbols anime, non-alphabetic anime, anime starting with numbers`;
      } else {
        title = `Anime Starting with ${selectedLetter} | AnimeStar`;
        description = `Browse anime titles starting with letter ${selectedLetter}. Complete alphabetical list of anime to watch online for free.`;
        keywords = `${selectedLetter} anime, anime starting with ${selectedLetter}, alphabetical anime list ${selectedLetter}`;
      }
    }
    
    // Customize based on search query
    if (searchQuery.trim()) {
      title = `Search Results for "${searchQuery}" | AnimeStar`;
      description = `Search results for "${searchQuery}". Find and watch anime matching your search.`;
      keywords = `${searchQuery} anime, search anime, find anime ${searchQuery}`;
    }
    
    // Generate canonical URL
    let canonicalUrl = 'https://animestar.in/anime';
    const params = new URLSearchParams();
    
    if (selectedLetter !== 'All') {
      params.set('letter', selectedLetter);
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    
    if (params.toString()) {
      canonicalUrl += `?${params.toString()}`;
    }
    
    // Generate structured data for search results
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": sortedAndFilteredAnime.slice(0, 20).map((anime, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "TVSeries",
          "name": anime.title,
          "url": `https://animestar.in/detail/${anime.slug || anime.id}`,
          "description": anime.description || `Watch ${anime.title} online`,
          "genre": anime.genreList || ["Anime"]
        }
      }))
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

  // Get count of anime starting with numbers/symbols
  const nonAlphabeticCount = useMemo(() => {
    return allAnime.filter(anime => {
      const firstChar = anime.title.charAt(0).toUpperCase();
      return !/[A-Z]/.test(firstChar);
    }).length;
  }, [allAnime]);

  return (
    <>
      {/* ✅ SEO COMPONENT ADDED HERE */}
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        structuredData={seoData.structuredData}
        ogUrl={seoData.ogUrl}
      />
    
      <div className="min-h-screen bg-[#636363]">
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-white border-l-4 border-[#60CC3F] pl-4">
              Anime List
              {selectedLetter !== 'All' && (
                <span className="text-[#60CC3F] ml-2">
                  {selectedLetter === '#' ? '(Numbers/Symbols)' : `(Letter: ${selectedLetter})`}
                </span>
              )}
              {searchQuery && <span className="text-[#60CC3F] ml-2">- Search: "{searchQuery}"</span>}
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2.5 bg-[#5a5a5a] border border-[#60CC3F]/50 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#60CC3F] focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#60CC3F] hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* A-Z Alphabet Filter with # */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {alphabetOptions.map(letter => (
                <button
                  key={letter}
                  onClick={() => handleLetterChange(letter)}
                  className={`
                    flex items-center justify-center rounded-lg transition-all duration-300 
                    font-medium text-sm md:text-base relative
                    ${letter === 'All' 
                      ? 'w-16 md:w-20 h-8 md:h-10' 
                      : 'w-8 h-8 md:w-10 md:h-10'
                    }
                    ${selectedLetter === letter
                      ? 'bg-[#60CC3F] text-white shadow-lg shadow-[#60CC3F]/30 scale-105'
                      : 'bg-[#5a5a5a] text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  title={letter === '#' ? `Anime starting with numbers/symbols (${nonAlphabeticCount})` : letter}
                >
                  {letter}
                  
                  {/* Show count for # filter */}
                  {letter === '#' && nonAlphabeticCount > 0 && (
                    <span className={`absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 text-xs flex items-center justify-center rounded-full ${
                      selectedLetter === '#' 
                        ? 'bg-white text-[#60CC3F]' 
                        : 'bg-[#60CC3F] text-white'
                    }`}>
                      {nonAlphabeticCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Selected Filter Indicator */}
            {selectedLetter !== 'All' && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-2 bg-[#4A4A4A] text-gray-300 px-4 py-2 rounded-lg border border-[#60CC3F]/30">
                  <span className="text-[#60CC3F] font-bold">Showing:</span> 
                  {selectedLetter === '#' 
                    ? 'Anime starting with numbers/symbols'
                    : `Anime starting with letter "${selectedLetter}"`
                  }
                  <button
                    onClick={clearAlphabetFilter}
                    className="ml-2 text-[#60CC3F] hover:text-white transition-colors"
                    title="Clear filter"
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}
          </div>
          
          {/* Info Box for # Filter */}
          {selectedLetter === '#' && (
            <div className="mb-4 p-3 bg-[#4A4A4A] border border-[#60CC3F]/30 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 text-[#60CC3F] flex-shrink-0">ℹ️</div>
                <div>
                  <p className="text-sm text-gray-300">
                    This section shows anime titles that start with:
                  </p>
                  <ul className="text-xs text-gray-400 mt-1 ml-4 list-disc">
                    <li>Numbers (0-9)</li>
                    <li>Symbols (!, @, #, $, etc.)</li>
                    <li>Special characters</li>
                    <li>Non-English characters</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* ✅ SEO Description - Hidden from UI but visible to search engines */}
          <div className="hidden" itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="name" content={seoData.title} />
            <meta itemProp="description" content={seoData.description} />
            <meta itemProp="numberOfItems" content={sortedAndFilteredAnime.length.toString()} />
          </div>
          
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          )}
          {error && <p className="text-center text-red-400">{error}</p>}
          
          {!isLoading && !error && (
            <div className="bg-[#5a5a5a] rounded-xl shadow-lg relative min-h-[300px] border border-[#60CC3F]/30">
              {isFiltering && (
                <div className="absolute inset-0 bg-[#636363]/80 flex justify-center items-center z-10 rounded-xl animate-fade-in">
                  <Spinner />
                </div>
              )}
              <ul className={`divide-y divide-gray-600 transition-opacity duration-300 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
                {sortedAndFilteredAnime.length > 0 ? (
                  sortedAndFilteredAnime.map(anime => (
                    <li key={anime.id} itemScope itemType="https://schema.org/TVSeries">
                      <button 
                        onClick={() => onAnimeSelect(anime)}
                        className="w-full text-left p-4 flex items-center hover:bg-[#636363] transition-all duration-200 group hover:pl-5"
                      >
                        {/* First character highlight */}
                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#4A4A4A] text-[#60CC3F] font-bold mr-3">
                          {anime.title.charAt(0).toUpperCase()}
                        </div>
                        
                        {/* Anime title with hover effect */}
                        <span className="text-gray-200 group-hover:text-white transition-colors pr-2 text-sm md:text-base break-words flex-1 min-w-0">
                          {anime.title}
                        </span>
                        
                        {/* Content Type badge */}
                        {anime.contentType && anime.contentType !== 'Anime' && (
                          <span className="text-xs text-gray-300 bg-gray-700/50 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                            {anime.contentType}
                          </span>
                        )}
                        
                        {/* Dub/Sub badge - GREEN */}
                        <span className="text-xs text-white bg-[#60CC3F] px-2.5 py-1 rounded-full flex-shrink-0 ml-2 font-medium">
                          {anime.subDubStatus || 'Unknown'}
                        </span>
                        
                        {/* Release Year */}
                        {anime.releaseYear && (
                          <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                            {anime.releaseYear}
                          </span>
                        )}
                        
                        {/* Hidden SEO data */}
                        <meta itemProp="name" content={anime.title} />
                        <link itemProp="url" href={`https://animestar.in/detail/${anime.slug || anime.id}`} />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#60CC3F]/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#60CC3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {searchQuery 
                        ? `No anime found matching "${searchQuery}"`
                        : selectedLetter === '#'
                          ? 'No anime found starting with numbers/symbols'
                          : selectedLetter !== 'All'
                            ? `No anime found starting with letter "${selectedLetter}"`
                            : 'No anime found'
                      }
                    </h3>
                    <p className="text-gray-400">
                      {selectedLetter !== 'All' 
                        ? 'Try selecting a different letter or clear the filter'
                        : 'Try searching for different anime'
                      }
                    </p>
                    <div className="mt-4 flex gap-2 justify-center">
                      {searchQuery && (
                        <button
                          onClick={clearSearch}
                          className="bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#388E3C] text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-[#60CC3F]/25"
                        >
                          Clear Search
                        </button>
                      )}
                      {selectedLetter !== 'All' && (
                        <button
                          onClick={clearAlphabetFilter}
                          className="bg-[#5a5a5a] hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-gray-600"
                        >
                          Clear Letter Filter
                        </button>
                      )}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {/* Results Count */}
          {!isLoading && !error && sortedAndFilteredAnime.length > 0 && (
            <div className="mt-4 text-center text-gray-400 text-sm">
              Showing {sortedAndFilteredAnime.length} anime
              {selectedLetter !== 'All' && (
                selectedLetter === '#'
                  ? ' starting with numbers/symbols'
                  : ` starting with letter "${selectedLetter}"`
              )}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}
          
          {/* ✅ Structured Data for Breadcrumb */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://animestar.in"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Anime List",
                  "item": window.location.href
                }
              ]
            })}
          </script>
        </div>
      </div>
    </>
  );
};

export default AnimeListPage;