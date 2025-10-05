import React from 'react';

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-5">
        {/* Category badge */}
        <div className="h-6 w-20 bg-gray-200 rounded-full mb-2" />

        {/* Title */}
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/2" />

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
};

export const EventGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
};
