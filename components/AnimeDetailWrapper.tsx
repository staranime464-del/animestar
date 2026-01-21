 // components/AnimeDetailWrapper.tsx - DARK GRAY + GREEN THEME

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnimeDetailPage from './AnimeDetailPage';
import { getAnimeBySlug } from '../services/animeService'; // 
import { AnimeDetailSkeleton } from './SkeletonLoader';
import type { Anime } from '../src/types';

const AnimeDetailWrapper: React.FC = () => {
  // Use 'slug' instead of 'idOrSlug'
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      // Check for slug instead of idOrSlug
      if (!slug) {
        setError('Invalid anime slug');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching anime with slug:', slug);
        
        // Fetch anime by Slug ONLY
        const animeData = await getAnimeBySlug(slug);
        
        if (!animeData) {
          console.log('❌ Anime not found with slug:', slug);
          setError('Anime not found');
          setAnime(null);
        } else {
          console.log('✅ Anime found:', animeData.title);
          setAnime(animeData);
        }
      } catch (err) {
        console.error('❌ Error fetching anime by slug:', err);
        setError('Failed to load anime details. Please try again.');
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [slug]); // Dependency changed to slug

  const handleBack = () => {
    navigate(-1);
  };

  // Show loading skeleton
  if (loading) {
    return <AnimeDetailSkeleton />;
  }

  // Show error message
  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[#636363]">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleBack}
            className="mb-6 px-4 py-2.5 bg-[#4A4A4A] text-white rounded-lg hover:bg-[#5a5a5a] transition-colors border border-gray-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
          
          <div className="text-center py-16">
            <div className="bg-[#4A4A4A] rounded-2xl p-8 md:p-12 max-w-md mx-auto border border-gray-600/50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center border border-[#FF6B6B]/30">
                <svg className="w-8 h-8 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">Anime Not Found</h1>
              <p className="text-gray-300 mb-6">{error || 'The anime you are looking for does not exist.'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-[#4A4A4A] hover:bg-[#5a5a5a] text-white rounded-lg transition-colors border border-gray-600"
                >
                  Go Back
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-[#60CC3F] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#60CC3F] text-white rounded-lg transition-all border border-[#60CC3F]"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pass data to AnimeDetailPage
  return (
    <AnimeDetailPage
      anime={anime}
      onBack={handleBack}
      isLoading={loading}
    />
  );
};

export default AnimeDetailWrapper;