 // src/components/admin/SearchableDropdown.tsx  
import React, { useState, useRef, useEffect } from 'react';
import type { Anime } from '../../types';

interface SearchableDropdownProps {
  animes: Anime[];
  selectedAnime: Anime | null;
  onAnimeSelect: (anime: Anime | null) => void;
  loading?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  animes,
  selectedAnime,
  onAnimeSelect,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter animes based on search
  const filteredAnimes = animes.filter(anime =>
    anime.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (anime: Anime) => {
    onAnimeSelect(anime);
    setSearchTerm(anime.title);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const clearSelection = () => {
    onAnimeSelect(null);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Type to search anime, manga, or movies..."
          className="w-full bg-[#636363] border border-gray-600 text-white rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#60CC3F] focus:border-transparent transition-colors placeholder-gray-500 text-base"
        />
        
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={clearSelection}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#5a5a5a] rounded"
            title="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#4A4A4A] border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto backdrop-blur-sm">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-[#60CC3F]"></div>
                Loading content...
              </div>
            </div>
          ) : filteredAnimes.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchTerm ? 'No content found matching your search' : 'No content available'}
            </div>
          ) : (
            <div>
              <div className="px-3 py-2 border-b border-gray-600 bg-[#636363]">
                <p className="text-xs text-gray-400">
                  Found {filteredAnimes.length} item{filteredAnimes.length !== 1 ? 's' : ''}
                </p>
              </div>
              {filteredAnimes.map(anime => (
                <button
                  key={anime.id}
                  onClick={() => handleSelect(anime)}
                  className={`w-full text-left px-4 py-3 hover:bg-[#636363] transition-colors border-b border-gray-600/50 last:border-b-0 ${
                    selectedAnime?.id === anime.id ? 'bg-[#636363] text-white' : 'text-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    {anime.thumbnail && (
                      <div className="flex-shrink-0 w-10 h-14 rounded overflow-hidden">
                        <img 
                          src={anime.thumbnail} 
                          alt={anime.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate text-base">{anime.title}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${
                              anime.contentType === 'Anime' ? 'bg-[#60CC3F]' :
                              anime.contentType === 'Movie' ? 'bg-[#9C27B0]' :
                              'bg-[#FF5722]'
                            }`}></span>
                            {anime.contentType || 'Content'}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {anime.releaseYear || 'N/A'}
                          </span>
                          <span className="px-1.5 py-0.5 bg-[#636363] text-gray-400 rounded text-xs border border-gray-600">
                            {anime.subDubStatus || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Additional Info */}
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <span>Episodes: {anime.episodes?.length || 0}</span>
                        <span className="text-gray-600">•</span>
                        <span>Status: {anime.status || 'Unknown'}</span>
                      </div>
                    </div>
                    
                    {/* Selected Indicator */}
                    {selectedAnime?.id === anime.id && (
                      <div className="flex-shrink-0 text-[#60CC3F]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
              
              {/* Footer */}
              <div className="px-3 py-2 border-t border-gray-600 bg-[#636363]">
                <p className="text-xs text-gray-500 text-center">
                  Use ↑ ↓ keys to navigate, Enter to select
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Content Info - Always show when something is selected */}
      {selectedAnime && (
        <div className="mt-3 p-3 bg-[#4A4A4A] rounded-lg border border-gray-600">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                {selectedAnime.thumbnail && (
                  <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden">
                    <img 
                      src={selectedAnime.thumbnail} 
                      alt={selectedAnime.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white text-base">{selectedAnime.title}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      selectedAnime.contentType === 'Anime' ? 'bg-[#60CC3F]/20 text-[#60CC3F] border border-[#60CC3F]/30' :
                      selectedAnime.contentType === 'Movie' ? 'bg-[#9C27B0]/20 text-[#9C27B0] border border-[#9C27B0]/30' :
                      'bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30'
                    }`}>
                      {selectedAnime.contentType}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                    <span>Episodes: {selectedAnime.episodes?.length || 0}</span>
                    <span className="text-gray-600">•</span>
                    <span>{selectedAnime.releaseYear || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="ml-2 text-sm bg-[#636363] hover:bg-[#5a5a5a] text-gray-300 hover:text-white px-3 py-1.5 rounded transition-colors border border-gray-600 whitespace-nowrap"
            >
              Change
            </button>
          </div>
          
          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-600">
            <div className="text-sm">
              <span className="text-gray-500">Status:</span>
              <span className="ml-1 text-gray-300">{selectedAnime.status || 'Unknown'}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Audio:</span>
              <span className="ml-1 text-gray-300">{selectedAnime.subDubStatus || 'Unknown'}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Genres:</span>
              <span className="ml-1 text-gray-300 truncate">
                {selectedAnime.genreList?.slice(0, 2).join(', ') || 'None'}
                {selectedAnime.genreList && selectedAnime.genreList.length > 2 && '...'}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Rating:</span>
              <span className="ml-1 text-gray-300">{selectedAnime.rating || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;