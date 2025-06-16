import * as React from 'react';
import { ImageIcon, PlayCircle, ImagesIcon, LucideIcon, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostEngagement } from './post-engagement';

export type MediaType = 'image' | 'video' | 'audio' | 'carousel';

interface MediaCardProps {
  imageUrl: string;
  mediaType: MediaType;
  viewCount: number;
  onClick?: () => void;
  className?: string;
}

const mediaTypeConfig: {
  [key in MediaType]: {
    Icon: LucideIcon;
  };
} = {
  image: { Icon: ImageIcon },
  video: { Icon: PlayCircle },
  audio: { Icon: Music },
  carousel: { Icon: ImagesIcon },
};

export const MediaCard = ({
  imageUrl,
  mediaType,
  viewCount,
  onClick,
  className,
}: MediaCardProps) => {
  const { Icon } = mediaTypeConfig[mediaType];

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative aspect-square w-full overflow-hidden shadow-md transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
    >
      <img
        src={imageUrl}
        alt="Media content"
        className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="absolute bottom-4 left-4 z-10">
        <Icon className="h-5 w-5 text-white drop-shadow-md" />
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <PostEngagement
          variant="view"
          count={viewCount}
          className="text-white drop-shadow-md"
        />
      </div>
    </button>
  );
}; 