'use client';

import React, { useEffect } from 'react';
import { ProfilePicture } from './profile-picture';
import { UsernameDisplay } from './username-display';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils/deso';
import { Skeleton } from '@/components/ui/skeleton';

export interface UserInfoProps {
  publicKey: string;
  pictureSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showVerification?: boolean;
  showDisplayName?: boolean;
  showCopyButton?: boolean;
  truncate?: boolean;
  maxLength?: number;
  className?: string;
  displayNameClassName?: string;
  usernameClassName?: string;
  layout?: 'row' | 'column';
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

export function UserInfo({
  publicKey,
  pictureSize = 'md',
  showVerification = true,
  showDisplayName = true,
  showCopyButton = false,
  truncate = false,
  maxLength,
  className,
  displayNameClassName,
  usernameClassName,
  layout = 'row',
  gap = 'md',
}: UserInfoProps) {
  const { profile, loading, error, username, displayName } = useProfile(publicKey);
  
  // Use username as fallback for displayName when displayName is not available
  const nameToDisplay = displayName || username;
  
  useEffect(() => {
    console.log('UserInfo data:', {
      publicKey,
      profile,
      displayName,
      username,
      extraData: profile?.extraData,
      showDisplayName
    });
  }, [publicKey, profile, displayName, username, showDisplayName]);
  
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
        <Skeleton className={`rounded-full ${pictureSize === 'xs' ? 'w-6 h-6' : pictureSize === 'sm' ? 'w-8 h-8' : pictureSize === 'lg' ? 'w-12 h-12' : pictureSize === 'xl' ? 'w-16 h-16' : 'w-10 h-10'}`} />
        <div className={textContainerClasses}>
          {showDisplayName && <Skeleton className="h-4 w-20 mb-1" />}
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={containerClasses}>
        <div className={`bg-gray-200 rounded-full flex items-center justify-center ${pictureSize === 'xs' ? 'w-6 h-6' : pictureSize === 'sm' ? 'w-8 h-8' : pictureSize === 'lg' ? 'w-12 h-12' : pictureSize === 'xl' ? 'w-16 h-16' : 'w-10 h-10'}`}>
          <span className="text-gray-400">?</span>
        </div>
        <div className={textContainerClasses}>
          {showDisplayName && <div className="text-sm text-gray-500">{username || ''}</div>}
          <div className="text-xs text-gray-400">@{username || ''}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <ProfilePicture publicKey={publicKey} size={pictureSize} />
      <div className={textContainerClasses}>
        {showDisplayName && (
          <div className={cn("font-medium text-gray-900", displayNameClassName)}>
            {displayName ?? username ?? ''}
          </div>
        )}
        <UsernameDisplay 
          publicKey={publicKey}
          showVerification={showVerification}
          showCopyButton={showCopyButton}
          truncate={truncate}
          maxLength={maxLength}
          className={cn("text-sm text-gray-500", usernameClassName)}
        />
      </div>
    </div>
  );
} 