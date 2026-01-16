 // src/components/admin/SearchableDropdown.tsx - COMPLETE SEARCHABLE DROPDOWN WITH ANIMESTAR BLUE THEME
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
          placeholder="Type to search anime..."
          className="w-full bg-blue-800/50 border border-blue-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
        />
        
        {/* Clear Button */}
        {selectedAnime && (
          <button
            onClick={clearSelection}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-blue-800/90 border border-blue-600 rounded-lg shadow-lg max-h-60 overflow-y-auto backdrop-blur-sm">
          {loading ? (
            <div className="p-4 text-center text-blue-300">
              Loading animes...
            </div>
          ) : filteredAnimes.length === 0 ? (
            <div className="p-4 text-center text-blue-300">
              {searchTerm ? 'No animes found' : 'No animes available'}
            </div>
          ) : (
            filteredAnimes.map(anime => (
              <button
                key={anime.id}
                onClick={() => handleSelect(anime)}
                className={`w-full text-left px-4 py-3 hover:bg-blue-700 transition-colors ${
                  selectedAnime?.id === anime.id ? 'bg-blue-600 text-white' : 'text-blue-200'
                }`}
              >
                <div className="font-medium">{anime.title}</div>
                <div className="text-sm text-blue-300">
                  {anime.episodes?.length || 0} episodes • {anime.status}
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Selected Anime Info */}
      {selectedAnime && !isOpen && (
        <div className="mt-2 p-3 bg-blue-800/30 rounded-lg border border-blue-600">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-white">{selectedAnime.title}</h4>
              <p className="text-blue-300 text-sm">
                {selectedAnime.episodes?.length || 0} episodes • {selectedAnime.status}
              </p>
            </div>
            <button
              onClick={clearSelection}
              className="text-blue-300 hover:text-white transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;