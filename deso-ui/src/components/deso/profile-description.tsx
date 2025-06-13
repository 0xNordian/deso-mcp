'use client';

import React, { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface ProfileDescriptionProps {
  publicKey: string;
  className?: string;
  lineClamp?: number;
  showMoreText?: string;
  showLessText?: string;
}

export const ProfileDescription = ({
  publicKey,
  className,
  lineClamp,
  showMoreText = 'Show more',
  showLessText = 'Show less',
}: ProfileDescriptionProps) => {
  const { profile, loading, error } = useProfile(publicKey);
  const [isExpanded, setIsExpanded] = useState(false);

  const description = profile?.description || '';

  // Only apply truncation logic if lineClamp is provided.
  const shouldTruncate =
    !!lineClamp && description.length > lineClamp * 50;

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-24 rounded"></div>
    );
  }

  if (error || !description) {
    return null;
  }

  const isCurrentlyClamped = shouldTruncate && !isExpanded;

  const style =
    isCurrentlyClamped && lineClamp
      ? {
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical' as const,
          WebkitLineClamp: lineClamp,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }
      : {};

  return (
    <div className={cn('relative', className)}>
      <div style={style}>{description}</div>
      {shouldTruncate && (
        <Button
          variant="link"
          className="p-0 h-auto text-sm underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? showLessText : showMoreText}
        </Button>
      )}
    </div>
  );
}; 