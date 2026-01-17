  // components/AnimeCard.tsx – CLOUDINARY SAFE & HOME PAGE FIXED
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
      onClick={() => onClick(anime)}
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

        {/* Status */}
        {showStatus && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-slate-900/80 text-white text-[11px] px-2 py-0.5 rounded-md">
              {anime.contentType || 'Anime'}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-2">
            {anime.title || 'Untitled Anime'}
          </h3>

          <div className="flex justify-between items-center mt-1">
            <span className="text-slate-300 text-xs">
              {anime.releaseYear || ''}
            </span>
            <span className="text-[10px] bg-slate-800/80 text-slate-200 px-1.5 py-0.5 rounded">
              {anime.subDubStatus || ''}
            </span>
          </div>
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
