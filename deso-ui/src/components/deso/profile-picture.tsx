'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfilePicture } from '@/hooks/useProfile';
import { cn, getUsernameInitial, getSingleProfilePictureUrl } from '@/lib/utils/deso';

// Size configurations
const sizeConfig = {
  xs: { avatar: 'h-6 w-6', text: 'text-xs' },
  sm: { avatar: 'h-8 w-8', text: 'text-sm' },
  md: { avatar: 'h-10 w-10', text: 'text-base' },
  lg: { avatar: 'h-12 w-12', text: 'text-lg' },
  xl: { avatar: 'h-16 w-16', text: 'text-xl' },
} as const;

interface ProfilePictureComponentProps {
  publicKey: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  lazy?: boolean;
  variant?: 'default' | 'nft' | 'highres';
}

export function ProfilePicture({
  publicKey,
  size = 'md',
  className,
  onClick,
  lazy = true,
  variant = 'default',
}: ProfilePictureComponentProps) {
  const { data, loading, error } = useProfilePicture(publicKey);
  const profile = data?.accountByPublicKey;
  const extraData = profile?.extraData || {};
  const sizeClasses = sizeConfig[size];

  let profilePicUrl: string | undefined;

  // Select the correct URL based on the variant
  if (variant === 'nft') {
    profilePicUrl = extraData.NFTProfilePictureUrl;
  } else if (variant === 'highres') {
    profilePicUrl = extraData.LargeProfilePicURL;
  } else {
    profilePicUrl = getSingleProfilePictureUrl(publicKey);
  }

  const fallbackInitial = getUsernameInitial(profile?.username);
  const isNftClass = variant === 'nft' ? 'nft-hexagon' : 'rounded-full';

  // Loading State
  if (loading) {
    return (
      <Skeleton
        className={cn(
          'relative inline-block',
          isNftClass,
          sizeClasses.avatar,
          className
        )}
      />
    );
  }

  // Error or No-URL Fallback State
  if (error || !profilePicUrl) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600',
          isNftClass,
          sizeClasses.avatar,
          className
        )}
        onClick={onClick}
      >
        <span className={cn('text-white font-semibold', sizeClasses.text)}>
          {error ? '?' : fallbackInitial}
        </span>
      </div>
    );
  }

  // Success State
  return (
    <Avatar
      className={cn(sizeClasses.avatar, isNftClass, className)}
      onClick={onClick}
    >
      <AvatarImage
        src={profilePicUrl}
        alt={`${profile?.username || 'User'}'s profile picture`}
        loading={lazy ? 'lazy' : 'eager'}
        className={cn('object-cover', isNftClass)}
      />
      <AvatarFallback
        className={cn(
          'bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold',
          isNftClass
        )}
      >
        {fallbackInitial}
      </AvatarFallback>
    </Avatar>
  );
}

// Export with display name for debugging
ProfilePicture.displayName = 'ProfilePicture'; 