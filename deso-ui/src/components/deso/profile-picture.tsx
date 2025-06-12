'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle } from 'lucide-react';
import { useProfilePicture } from '@/hooks/useProfile';
import { cn, buildProfilePictureUrl, getUsernameInitial } from '@/lib/utils/deso';
import { ProfilePictureSchema } from '@/lib/schemas/deso';
import type { ProfilePictureProps } from '@/lib/schemas/deso';

// Size configurations
const sizeConfig = {
  xs: { avatar: 'h-6 w-6', badge: 'h-3 w-3', text: 'text-xs' },
  sm: { avatar: 'h-8 w-8', badge: 'h-4 w-4', text: 'text-sm' },
  md: { avatar: 'h-10 w-10', badge: 'h-5 w-5', text: 'text-base' },
  lg: { avatar: 'h-12 w-12', badge: 'h-6 w-6', text: 'text-lg' },
  xl: { avatar: 'h-16 w-16', badge: 'h-8 w-8', text: 'text-xl' },
} as const;

interface ProfilePictureComponentProps extends Partial<Omit<ProfilePictureProps, 'profilePic'>> {
  publicKey: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showVerification?: boolean;
  className?: string;
  onClick?: () => void;
  lazy?: boolean;
  variant?: 'default' | 'nft';
}

export function ProfilePicture({
  publicKey,
  size = 'md',
  showVerification = false,
  className,
  onClick,
  lazy = true,
  variant = 'default',
  ...props
}: ProfilePictureComponentProps) {
  // Validate props
  const validatedProps = ProfilePictureSchema.parse({
    size,
    showVerification,
    className,
    ...props,
  });

  // Fetch profile picture data using Apollo Client
  const { data, loading, error } = useProfilePicture(publicKey);

  // Extract account data from Apollo Client response
  const profile = data?.accountByPublicKey;

  const sizeClasses = sizeConfig[validatedProps.size];
  
  // Choose between regular profile pic and NFT profile pic
  const isNFT = variant === 'nft';
  const profilePicUrl = isNFT 
    ? profile?.extraData?.NFTProfilePictureUrl 
    : buildProfilePictureUrl(profile?.profilePic);
  
  const fallbackInitial = getUsernameInitial(profile?.username);
  const isVerified = profile?.extraData?.isVerified === 'true' || false;

  // Loading state
  if (loading) {
    return (
      <div className={cn('relative inline-block', className)}>
        <Skeleton className={cn(
          'rounded-full',
          isNFT && 'nft-hexagon',
          sizeClasses.avatar
        )} />
      </div>
    );
  }

  // Error state - show fallback
  if (error) {
    return (
      <div className={cn('relative inline-block', className)}>
        <div 
          className={cn(
            'flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-md',
            isNFT ? 'nft-avatar nft-hexagon bg-gradient-to-br from-blue-500 to-purple-600' : 'rounded-full bg-gradient-to-br from-blue-500 to-purple-600',
            sizeClasses.avatar,
            onClick && 'cursor-pointer'
          )}
          onClick={onClick}
        >
          <span className={cn('text-white font-semibold', sizeClasses.text)}>
            ?
          </span>
        </div>
        
        {/* Verification Badge */}
        {validatedProps.showVerification && isVerified && (
          <Badge 
            variant="secondary" 
            className={cn(
              'absolute -bottom-1 -right-1 p-0 rounded-full bg-blue-500 hover:bg-blue-600 border-2 border-white',
              sizeClasses.badge
            )}
          >
            <CheckCircle className="h-full w-full text-white" />
          </Badge>
        )}
      </div>
    );
  }

  // NFT variant with hexagon shape
  if (isNFT) {
    return (
      <div className={cn('relative inline-block', className)}>
        <div 
          className={cn(
            'nft-avatar relative cursor-pointer border-background bg-background border-0',
            sizeClasses.avatar,
            'transition-all duration-200 hover:scale-105 hover:shadow-md',
            onClick && 'cursor-pointer'
          )}
          onClick={onClick}
          style={{ marginTop: '-4px' }}
        >
          <div 
            className="nft-hex-background absolute"
            style={{
              width: `calc(${sizeClasses.avatar.includes('h-6') ? '24px' : 
                           sizeClasses.avatar.includes('h-8') ? '32px' :
                           sizeClasses.avatar.includes('h-10') ? '40px' :
                           sizeClasses.avatar.includes('h-12') ? '48px' : '64px'} - 8px)`,
              height: `calc(${sizeClasses.avatar.includes('h-6') ? '24px' : 
                            sizeClasses.avatar.includes('h-8') ? '32px' :
                            sizeClasses.avatar.includes('h-10') ? '40px' :
                            sizeClasses.avatar.includes('h-12') ? '48px' : '64px'} - 8px)`,
              top: '4px',
              left: '4px'
            }}
          >
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt={`${profile?.username || 'User'}'s NFT profile picture`}
                loading={lazy ? 'lazy' : 'eager'}
                className="absolute min-h-full min-w-full object-cover nft-hexagon"
              />
            ) : (
              <div className="absolute min-h-full min-w-full bg-gradient-to-br from-blue-500 to-purple-600 nft-hexagon flex items-center justify-center">
                <span className={cn('text-white font-semibold', sizeClasses.text)}>
                  {fallbackInitial}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Verification Badge */}
        {validatedProps.showVerification && isVerified && (
          <Badge 
            variant="secondary" 
            className={cn(
              'absolute -bottom-1 -right-1 p-0 rounded-full bg-blue-500 hover:bg-blue-600 border-2 border-white transition-all duration-200',
              sizeClasses.badge
            )}
          >
            <CheckCircle className="h-full w-full text-white" />
          </Badge>
        )}
      </div>
    );
  }

  // Default circular variant
  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar 
        className={cn(
          sizeClasses.avatar,
          'transition-all duration-200 hover:scale-105 hover:shadow-md',
          onClick && 'cursor-pointer'
        )}
        onClick={onClick}
      >
        <AvatarImage 
          src={profilePicUrl} 
          alt={`${profile?.username || 'User'}'s profile picture`}
          loading={lazy ? 'lazy' : 'eager'}
          className="object-cover"
        />
        <AvatarFallback className={cn('bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold', sizeClasses.text)}>
          {fallbackInitial}
        </AvatarFallback>
      </Avatar>
      
      {/* Verification Badge */}
      {validatedProps.showVerification && isVerified && (
        <Badge 
          variant="secondary" 
          className={cn(
            'absolute -bottom-1 -right-1 p-0 rounded-full bg-blue-500 hover:bg-blue-600 border-2 border-white transition-all duration-200',
            sizeClasses.badge
          )}
        >
          <CheckCircle className="h-full w-full text-white" />
        </Badge>
      )}
    </div>
  );
}

// Export with display name for debugging
ProfilePicture.displayName = 'ProfilePicture'; 