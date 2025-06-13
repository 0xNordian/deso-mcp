'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle } from 'lucide-react';
import { useUsername } from '@/hooks/useProfile';
import { cn, getDisplayName, truncateText } from '@/lib/utils/deso';
import { UsernameDisplaySchema } from '@/lib/schemas/deso';
import type { UsernameDisplayProps } from '@/lib/schemas/deso';
import { CopyButton } from './copy-button';
import { VerificationBadge } from './verification-badge';

interface UsernameDisplayComponentProps extends Partial<Omit<UsernameDisplayProps, 'username' | 'displayName'>> {
  publicKey: string;
  isVerified?: boolean;
  showVerification?: boolean;
  truncate?: boolean;
  maxLength?: number;
  className?: string;
  onClick?: () => void;
  showCopyButton?: boolean;
  linkToProfile?: boolean;
}

export function UsernameDisplay({
  publicKey,
  isVerified = false,
  showVerification = true,
  truncate = false,
  maxLength = 20,
  className,
  onClick,
  showCopyButton = false,
  linkToProfile = false,
  ...props
}: UsernameDisplayComponentProps) {
  // Validate props
  const validatedProps = UsernameDisplaySchema.parse({
    isVerified,
    showVerification,
    truncate,
    maxLength,
    className,
    ...props,
  });

  // Fetch username data using Apollo Client
  const { data, loading, error } = useUsername(publicKey);

  console.log('👤 UsernameDisplay component render:', {
    publicKey,
    loading,
    error: error?.message,
    hasData: !!data
  });

  // Extract account data from Apollo Client response
  const profile = data?.accountByPublicKey;

  console.log('👤 UsernameDisplay extracted profile:', {
    hasProfile: !!profile,
    username: profile?.username,
    hasExtraData: !!profile?.extraData,
    extraDataKeys: profile?.extraData ? Object.keys(profile.extraData) : []
  });

  // Parse extraData if it exists
  const extraData = profile?.extraData || {};

  const username = profile?.username;
  const displayName = extraData?.DisplayName;
  const verified = extraData?.IsVerified === 'true' || validatedProps.isVerified;

  console.log('👤 UsernameDisplay processed data:', {
    username,
    displayName,
    verified,
    hasDisplayName: !!displayName,
    willShowError: !!error || !username,
    extraData
  });

  // Handle click
  const handleClick = () => {
    if (linkToProfile && username) {
      // Navigate to profile (you can customize this based on your routing)
      window.open(`https://diamondapp.com/u/${username}`, '_blank');
    } else if (onClick) {
      onClick();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Skeleton className="h-4 w-20" />
        {validatedProps.showVerification && <Skeleton className="h-4 w-4 rounded-full" />}
      </div>
    );
  }

  // Error state
  if (error || !username) {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
        <span className="text-sm">{username || ''}</span>
      </div>
    );
  }

  // Prepare display text
  const displayText = displayName ?? username ?? '';
  const maxLen = validatedProps.maxLength || 20;
  const secondaryText = displayText !== username ? `@${username}` : null;
  const secondaryDisplayText = secondaryText && validatedProps.truncate 
    ? truncateText(secondaryText, maxLen) 
    : secondaryText;

  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-2', className)}>
        <div 
          className={cn(
            'flex flex-col',
            (onClick || linkToProfile) && 'cursor-pointer hover:opacity-80 transition-opacity'
          )}
          onClick={handleClick}
        >
          {/* Primary name (display name or username) */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">
              {displayText}
            </span>
            
            {/* Verification Badge */}
            {validatedProps.showVerification && verified && (
              <VerificationBadge isVerified={true} size="sm" />
            )}
          </div>
          
          {/* Secondary text (username if display name exists) */}
          {secondaryText && (
            <span className="text-sm text-muted-foreground">
              {secondaryDisplayText}
            </span>
          )}
        </div>

        {/* Copy Button */}
        {showCopyButton && username && (
          <CopyButton textToCopy={username} size="sm" />
        )}
      </div>
    </TooltipProvider>
  );
}

// Export with display name for debugging
UsernameDisplay.displayName = 'UsernameDisplay'; 