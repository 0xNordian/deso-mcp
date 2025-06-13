'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils/deso';

type AspectRatio = '16:9' | '3:1' | '2:1' | '4:3';
type GradientColor = 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'random';

interface ProfileCoverPhotoProps {
  publicKey: string;
  aspectRatio?: AspectRatio;
  fallbackGradient?: GradientColor;
  showOverlay?: boolean;
  overlayOpacity?: number;
  enableParallax?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Aspect ratio configurations
const aspectRatioConfig = {
  '16:9': 'aspect-video',
  '3:1': 'aspect-[3/1]',
  '2:1': 'aspect-[2/1]',
  '4:3': 'aspect-[4/3]',
} as const;

// Gradient configurations
const gradientConfig = {
  blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
  purple: 'bg-gradient-to-br from-purple-400 to-purple-600',
  pink: 'bg-gradient-to-br from-pink-400 to-pink-600',
  green: 'bg-gradient-to-br from-green-400 to-green-600',
  orange: 'bg-gradient-to-br from-orange-400 to-orange-600',
  random: 'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400',
} as const;

export function ProfileCoverPhoto({
  publicKey,
  aspectRatio = '16:9',
  fallbackGradient = 'blue',
  showOverlay = false,
  overlayOpacity = 0.3,
  enableParallax = false,
  className,
  children,
}: ProfileCoverPhotoProps) {
  // Fetch profile data using Apollo Client
  const { profile, loading, error } = useProfile(publicKey);

  // Use FeaturedImageURL from extraData for the cover photo
  const featuredImage = profile?.extraData?.FeaturedImageURL;
  const aspectClass = aspectRatioConfig[aspectRatio];
  const gradientClass = gradientConfig[fallbackGradient];

  // Loading state
  if (loading) {
    return (
      <div className={cn('relative w-full overflow-hidden rounded-lg', aspectClass, className)}>
        <Skeleton className="absolute inset-0" />
      </div>
    );
  }

  // Error state or no cover photo - show gradient fallback
  if (error || !featuredImage) {
    return (
      <div 
        className={cn(
          'relative w-full overflow-hidden rounded-lg',
          aspectClass,
          gradientClass,
          className
        )}
      >
        {/* Overlay */}
        {showOverlay && (
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        )}
        
        {/* Content */}
        {children && (
          <div className="relative z-10 h-full">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'relative w-full overflow-hidden rounded-lg',
        aspectClass,
        className
      )}
    >
      {/* Background Image */}
      <div
        className={cn(
          'absolute inset-0 bg-cover bg-center bg-no-repeat',
          enableParallax && 'bg-fixed'
        )}
        style={{
          backgroundImage: `url(${featuredImage})`,
        }}
      />
      
      {/* Overlay */}
      {showOverlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Content */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  );
}

// Export with display name for debugging
ProfileCoverPhoto.displayName = 'ProfileCoverPhoto'; 