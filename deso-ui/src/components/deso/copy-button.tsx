'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils/deso';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface CopyButtonProps {
  textToCopy: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CopyButton({ textToCopy, size = 'md', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className={`p-1 text-gray-400 hover:text-gray-600 focus:outline-none ${className}`}
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className={`${iconSizes[size]} text-green-500`} />
            ) : (
              <Copy className={iconSizes[size]} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 