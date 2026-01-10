import React from 'react';
import { cn } from '../../utils/cn';

/**
 * LoadingSkeleton Component - Animated skeleton loader for content placeholders
 * Following design reference loading state patterns
 */
const LoadingSkeleton = ({ 
  variant = 'text',
  width = '100%',
  height,
  count = 1,
  className = '',
  containerClassName = ''
}) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'h-48 rounded-2xl',
  };

  const defaultHeights = {
    text: '1rem',
    title: '2rem',
    circular: width,
    rectangular: '12rem',
    card: '12rem',
  };

  const skeletonHeight = height || defaultHeights[variant];

  const Skeleton = () => (
    <div
      className={cn(
        'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200',
        'animate-pulse bg-[length:200%_100%]',
        variants[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof skeletonHeight === 'number' ? `${skeletonHeight}px` : skeletonHeight,
      }}
    />
  );

  return (
    <div className={cn('space-y-3', containerClassName)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  );
};

/**
 * Pre-configured skeleton variants for common use cases
 */
export const CardSkeleton = () => (
  <div className="card p-4 space-y-3">
    <LoadingSkeleton variant="rectangular" height="12rem" />
    <LoadingSkeleton variant="title" width="70%" />
    <LoadingSkeleton variant="text" count={2} />
    <div className="flex gap-2 mt-4">
      <LoadingSkeleton width="80px" height="32px" />
      <LoadingSkeleton width="80px" height="32px" />
    </div>
  </div>
);

export const ListItemSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <LoadingSkeleton variant="circular" width="48px" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" width="60%" />
          <LoadingSkeleton variant="text" width="40%" />
        </div>
      </div>
    ))}
  </div>
);

export const GridSkeleton = ({ count = 6, columns = 3 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default LoadingSkeleton;
