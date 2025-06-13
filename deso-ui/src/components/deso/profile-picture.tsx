'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfilePicture } from '@/hooks/useProfile';
import { cn, getUsernameInitial, getSingleProfilePictureUrl, buildProfilePictureUrl } from '@/lib/utils/deso';

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

  // Robust logic: use buildProfilePictureUrl utility for all variants
  const initialProfilePicUrl = buildProfilePictureUrl(profile?.profilePic, extraData, variant) || getSingleProfilePictureUrl(publicKey);
  const [imgSrc, setImgSrc] = useState<string | undefined>(initialProfilePicUrl);
  const [triedFallback, setTriedFallback] = useState(false);

  // If the profile or extraData changes, reset the image source and fallback state
  useEffect(() => {
    setImgSrc(initialProfilePicUrl);
    setTriedFallback(false);
  }, [initialProfilePicUrl]);

  // Debug logging for live data troubleshooting
  console.log('[ProfilePicture] profile:', profile);
  console.log('[ProfilePicture] extraData:', extraData);
  console.log('[ProfilePicture] imgSrc:', imgSrc);

  // Fallback initial: use username, else first letter of publicKey, else '?'
  const fallbackInitial = profile?.username
    ? getUsernameInitial(profile.username)
    : publicKey
      ? publicKey[0].toUpperCase()
      : '?';

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
  if (error || !imgSrc) {
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

  // Fallback logic for image load error
  const handleImgError = () => {
    if (!triedFallback) {
      setImgSrc(getSingleProfilePictureUrl(publicKey));
      setTriedFallback(true);
    } else {
      setImgSrc(undefined); // This will show the fallback avatar
    }
  };

  // Success State
  return (
    <Avatar
      className={cn(sizeClasses.avatar, isNftClass, className)}
      onClick={onClick}
    >
      <AvatarImage
        src={imgSrc}
        alt={`${profile?.username || 'User'}'s profile picture`}
        loading={lazy ? 'lazy' : 'eager'}
        className={cn('object-cover', isNftClass)}
        onError={handleImgError}
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