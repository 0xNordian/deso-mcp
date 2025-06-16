import * as React from 'react';
import { MediaCard, MediaType } from './media-card';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  imageUrl: string;
  mediaType: MediaType;
  viewCount: number;
}

interface MediaGalleryProps {
  mediaItems: MediaItem[];
  onMediaClick?: (id: string) => void;
  className?: string;
}

export const MediaGallery = ({
  mediaItems,
  onMediaClick,
  className,
}: MediaGalleryProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-0.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
        className
      )}
    >
      {mediaItems.map((item) => (
        <MediaCard
          key={item.id}
          imageUrl={item.imageUrl}
          mediaType={item.mediaType}
          viewCount={item.viewCount}
          onClick={() => onMediaClick?.(item.id)}
        />
      ))}
    </div>
  );
}; 