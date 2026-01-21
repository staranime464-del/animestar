 // components/AnimeCard.tsx 
import React from 'react';
import type { Anime } from '../src/types';
import { PlayIcon } from './icons/PlayIcon';

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
  index: number;
  showStatus?: boolean;
}

// Fallback image (public folder)
const FALLBACK_IMAGE = '/favicon.ico';

// Optimize Cloudinary images safely
const optimizeImageUrl = (
  url: string | undefined,
  width: number,
  height: number
): string => {
  if (!url) return FALLBACK_IMAGE;
  if (!url.includes('cloudinary.com')) return url;

  try {
    const [base, rest] = url.split('/upload/');
    if (!rest) return url;

    const imagePath = rest.split('/').slice(1).join('/');
    return `${base}/upload/f_webp,q_auto:good,w_${width},h_${height},c_fill/${imagePath}`;
  } catch {
    return url;
  }
};

const generateSrcSet = (
  url: string | undefined,
  w: number,
  h: number
): string | undefined => {
  if (!url || !url.includes('cloudinary.com')) return undefined;

  try {
    const [base, rest] = url.split('/upload/');
    if (!rest) return undefined;

    const imagePath = rest.split('/').slice(1).join('/');

    return `
      ${base}/upload/f_webp,q_auto:good,w_${w},h_${h},c_fill/${imagePath} ${w}w,
      ${base}/upload/f_webp,q_auto:good,w_${w * 2},h_${h * 2},c_fill/${imagePath} ${w * 2}w
    `;
  } catch {
    return undefined;
  }
};

const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onClick,
  index,
  showStatus = false,
}) => {
  // 🔐 HARD SAFETY
  if (!anime) return null;

  const width = 193;
  const height = 289;

  const imgSrc = optimizeImageUrl(anime.thumbnail, width, height);
  const imgSrcSet = generateSrcSet(anime.thumbnail, width, height);

  // Status text color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#4CAF50] text-white'; // Darker green
      case 'Ongoing':
        return 'bg-[#FF9800] text-white'; // Orange for ongoing
      case 'Upcoming':
        return 'bg-[#2196F3] text-white'; // Blue for upcoming
      default:
        return 'bg-[#60CC3F] text-white'; // Default green
    }
  };

  // Content Type color helper
  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'Movie':
        return 'bg-[#9C27B0] text-white'; // Purple for movies
      case 'Manga':
        return 'bg-[#FF5722] text-white'; // Orange for manga
      case 'Anime':
      default:
        return 'bg-[#60CC3F] text-white'; // Green for anime
    }
  };

  // Handle click to ensure slug navigation
  const handleCardClick = () => {
    // Check if anime has slug
    if (!anime.slug) {
      console.error('Anime slug is missing:', anime.title);
      // Fallback to ID only for development, but this should not happen in production
      if (anime._id || anime.id) {
        console.warn('Falling back to ID navigation (temporary):', anime._id || anime.id);
      }
    }
    onClick(anime);
  };

  return (
    <div
      className="
        anime-card group relative overflow-hidden rounded-lg shadow-lg
        cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-800/40
        w-full
        h-[240px] sm:h-[260px] md:h-[280px] lg:h-[300px]
        card-load-animate
      "
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${anime.title ?? 'anime'}`}
    >
      {/* Image */}
      <div className="w-full h-full relative">
        <img
          src={imgSrc}
          srcSet={imgSrcSet}
          alt={anime.title || 'Anime'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          width={width}
          height={height}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {/* Content Type Badge - Top Left */}
        {anime.contentType && (
          <div className="absolute top-2 left-2 z-10">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getContentTypeColor(anime.contentType)}`}>
              {anime.contentType}
            </span>
          </div>
        )}

        {/* Dub/Sub Badge - Top Right (ALL GREEN NOW) */}
        {anime.subDubStatus && (
          <div className="absolute top-2 right-2 z-10">
            <span className="rounded-full bg-[#60CC3F] px-2 py-0.5 text-[10px] font-bold text-white">
              {anime.subDubStatus}
            </span>
          </div>
        )}

        {/* Status Badge - Bottom Left (GREEN for Completed) */}
        {anime.status && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusColor(anime.status)}`}>
              {anime.status}
            </span>
          </div>
        )}

        {/* Release Year - Bottom Right */}
        {anime.releaseYear && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-gray-200">
              {anime.releaseYear}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-2">
            {anime.title || 'Untitled Anime'}
          </h3>

          {/* Genre List (if available) */}
          {anime.genreList && anime.genreList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {anime.genreList.slice(0, 2).map((genre, idx) => (
                <span 
                  key={idx} 
                  className="text-[9px] text-gray-300 bg-gray-800/50 px-1 py-0.5 rounded"
                >
                  {genre}
                </span>
              ))}
              {anime.genreList.length > 2 && (
                <span className="text-[9px] text-gray-400">+{anime.genreList.length - 2}</span>
              )}
            </div>
          )}
        </div>

        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
          <PlayIcon className="w-10 h-10 text-white" />
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
