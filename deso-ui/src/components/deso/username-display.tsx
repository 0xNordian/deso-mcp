'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, Copy, Check } from 'lucide-react';
import { useUsername } from '@/hooks/useProfile';
import { cn, getDisplayName, truncateText } from '@/lib/utils/deso';
import { UsernameDisplaySchema } from '@/lib/schemas/deso';
import type { UsernameDisplayProps } from '@/lib/schemas/deso';

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
  const [copied, setCopied] = useState(false);
  
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

  // Extract account data from Apollo Client response
  const profile = data?.accountByPublicKey;

  const username = profile?.username;
  const displayName = getDisplayName(username, profile?.extraData);
  const verified = profile?.extraData?.isVerified === 'true' || validatedProps.isVerified;

  // Handle copy to clipboard
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (username) {
      await navigator.clipboard.writeText(username);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
        <span className="text-sm">Anonymous</span>
      </div>
    );
  }

  // Prepare display text
  const primaryText = displayName !== username ? displayName : username;
  const secondaryText = displayName !== username ? `@${username}` : null;
  const maxLen = validatedProps.maxLength || 20;
  const displayText = validatedProps.truncate ? truncateText(primaryText, maxLen) : primaryText;
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="p-0 h-4 w-4 rounded-full bg-blue-500 hover:bg-blue-600">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Verified account</p>
                </TooltipContent>
              </Tooltip>
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
        {showCopyButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy username'}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

// Export with display name for debugging
UsernameDisplay.displayName = 'UsernameDisplay'; 