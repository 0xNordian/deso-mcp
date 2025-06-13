'use client';

import React, { useEffect } from 'react';
import { UsernameDisplay } from './username-display';
import { useProfile } from '@/hooks/useProfile';
import { cn, truncateMiddle } from '@/lib/utils/deso';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfilePicture } from './profile-picture';
import { CopyButton } from './copy-button';

export interface UserPublicKeyProps {
  publicKey: string;
  pictureSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showPicture?: boolean;
  showUsername?: boolean;
  showDisplayName?: boolean;
  showVerification?: boolean;
  showCopyButton?: boolean;
  startChars?: number;
  endChars?: number;
  className?: string;
  displayNameClassName?: string;
  usernameClassName?: string;
  publicKeyClassName?: string;
  layout?: 'row' | 'column';
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

export function UserPublicKey({
  publicKey,
  pictureSize = 'md',
  showPicture = true,
  showUsername = true,
  showDisplayName = false,
  showVerification = true,
  showCopyButton = true,
  startChars = 6,
  endChars = 6,
  className,
  displayNameClassName,
  usernameClassName,
  publicKeyClassName,
  layout = 'row',
  gap = 'md',
}: UserPublicKeyProps) {
  const { profile, loading, error, username, displayName } = useProfile(publicKey);
  
  // Use username as fallback for displayName when displayName is not available
  const nameToDisplay = displayName || username;
  
  useEffect(() => {
    console.log('UserPublicKey data:', {
      publicKey,
      profile,
      displayName,
      username,
      extraData: profile?.extraData,
      showDisplayName
    });
  }, [publicKey, profile, displayName, username, showDisplayName]);
  
  const truncatedPublicKey = truncateMiddle(publicKey, startChars, endChars);
  
  const gapClasses = {
    'none': '',
    'sm': layout === 'row' ? 'gap-1' : 'gap-0.5',
    'md': layout === 'row' ? 'gap-2' : 'gap-1',
    'lg': layout === 'row' ? 'gap-3' : 'gap-1.5',
  };
  
  const containerClasses = cn(
    'flex items-center',
    layout === 'column' && 'flex-col',
    gapClasses[gap],
    className
  );
  
  const textContainerClasses = cn(
    layout === 'column' && 'flex flex-col items-center text-center',
    layout === 'row' && 'flex flex-col justify-center'
  );

  // Loading state
  if (loading) {
    return (
      <div className={containerClasses}>
        {showPicture && (
          <Skeleton className={`rounded-full ${pictureSize === 'xs' ? 'w-6 h-6' : pictureSize === 'sm' ? 'w-8 h-8' : pictureSize === 'lg' ? 'w-12 h-12' : pictureSize === 'xl' ? 'w-16 h-16' : 'w-10 h-10'}`} />
        )}
        <div className={textContainerClasses}>
          {showDisplayName && <Skeleton className="h-4 w-20 mb-1" />}
          {showUsername && <Skeleton className="h-3 w-16 mb-1" />}
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={containerClasses}>
        {showPicture && (
          <div className={`bg-gray-200 rounded-full flex items-center justify-center ${pictureSize === 'xs' ? 'w-6 h-6' : pictureSize === 'sm' ? 'w-8 h-8' : pictureSize === 'lg' ? 'w-12 h-12' : pictureSize === 'xl' ? 'w-16 h-16' : 'w-10 h-10'}`}>
            <span className="text-gray-400">?</span>
          </div>
        )}
        <div className={textContainerClasses}>
          {showDisplayName && <div className="text-sm text-gray-500">{username || ''}</div>}
          {showUsername && <div className="text-xs text-gray-400">@{username || ''}</div>}
          <div className="text-xs text-gray-400">{truncatedPublicKey}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {showPicture && <ProfilePicture publicKey={publicKey} size={pictureSize} />}
      <div className={textContainerClasses}>
        {showDisplayName && (
          <div className={cn("font-medium text-gray-900", displayNameClassName)}>
            {displayName ?? username ?? ''}
          </div>
        )}
        {showUsername && (
          <UsernameDisplay 
            publicKey={publicKey}
            showVerification={showVerification}
            showCopyButton={false}
            className={cn("text-sm text-gray-500", usernameClassName)}
          />
        )}
        <div className="flex items-center">
          <span className={cn("text-xs text-gray-500", publicKeyClassName)}>
            {truncatedPublicKey}
          </span>
          {showCopyButton && (
            <CopyButton textToCopy={publicKey} size="sm" className="ml-1" />
          )}
        </div>
      </div>
    </div>
  );
} 