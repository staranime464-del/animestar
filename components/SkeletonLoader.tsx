 // components/SkeletonLoader.tsx  
import React from 'react';

// type prop optional
interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'text' | 'image';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'card', count = 1 }) => {
  const SkeletonCard = () => (
    <div className="bg-[#4A4A4A] rounded-xl overflow-hidden animate-pulse border border-gray-600/50">
      <div className="aspect-[2/3] bg-gradient-to-br from-gray-600/30 to-gray-700/30"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-3/4"></div>
        <div className="h-3 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-1/2"></div>
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-12 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full"></div>
          <div className="h-6 w-16 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-[#4A4A4A] rounded-xl animate-pulse border border-gray-600/50">
          <div className="h-14 w-14 bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-lg"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-1/2"></div>
            <div className="flex gap-2">
              <div className="h-5 w-10 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full"></div>
              <div className="h-5 w-14 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SkeletonText = () => (
    <div className="space-y-3 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-full"></div>
          <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-5/6"></div>
          <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-4/6"></div>
        </div>
      ))}
    </div>
  );

  const SkeletonImage = () => (
    <div className="bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl animate-pulse aspect-[2/3] border border-gray-600/50"></div>
  );

  switch (type) {
    case 'card':
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(count)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    case 'list':
      return <SkeletonList />;
    case 'text':
      return <SkeletonText />;
    case 'image':
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(count)].map((_, i) => (
            <SkeletonImage key={i} />
          ))}
        </div>
      );
    default:
      return <SkeletonCard />;
  }
};

// Skeleton without type prop (for HomePage)
export const SimpleSkeleton: React.FC = () => (
  <div className="bg-[#4A4A4A] rounded-xl overflow-hidden animate-pulse border border-gray-600/50">
    <div className="aspect-[2/3] bg-gradient-to-br from-gray-600/30 to-gray-700/30"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-3/4"></div>
      <div className="h-3 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-1/2"></div>
      <div className="flex gap-2 mt-2">
        <div className="h-6 w-12 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full"></div>
        <div className="h-6 w-16 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full"></div>
      </div>
    </div>
  </div>
);

// Skeleton for anime detail page
export const AnimeDetailSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="relative -mx-4 -mt-8 mb-8">
      <div className="absolute inset-0 overflow-hidden h-[450px] bg-gradient-to-b from-[#4A4A4A] to-[#636363]"></div>
      <div className="relative container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1 lg:col-span-1">
            <div className="w-full h-96 bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl border border-gray-600/50"></div>
          </div>
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            <div className="h-10 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-3/4"></div>
            <div className="h-6 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-1/4"></div>
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full w-24"></div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-5/6"></div>
              <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-4/6"></div>
            </div>
            {/* Episode List Skeleton */}
            <div className="mt-8">
              <div className="h-8 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-[#4A4A4A] rounded-lg p-4 border border-gray-600/50">
                    <div className="h-6 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-1/2 mx-auto mt-2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton for Featured Carousel
export const CarouselSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="flex gap-6 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[300px]">
          <div className="bg-[#4A4A4A] rounded-xl overflow-hidden border border-gray-600/50">
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-600/30 to-gray-700/30"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-3/4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full"></div>
                <div className="h-6 w-20 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);