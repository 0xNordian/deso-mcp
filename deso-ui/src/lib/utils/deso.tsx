import React from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// DeSo-specific utility functions
export function buildProfilePictureUrl(profilePic?: string, extraData?: Record<string, any>, variant: 'default' | 'nft' | 'highres' = 'default'): string | undefined {
  // Helper to get the first valid value from possible keys
  const getFirstValid = (obj: Record<string, any>, keys: string[]): string | undefined => {
    for (const key of keys) {
      if (obj && obj[key] && typeof obj[key] === 'string' && obj[key].startsWith('http')) {
        return obj[key];
      }
    }
    return undefined;
  };

  const largeProfilePic = getFirstValid(extraData || {}, [
      'LargeProfilePicURL',
      'LargeProfilePicUrl',
      'largeProfilePicURL',
      'largeProfilePicUrl',
    ]);

  const nftProfilePic = extraData?.NFTProfilePictureUrl?.startsWith('http') ? extraData.NFTProfilePictureUrl : undefined;

  // Handle NFT variant
  if (variant === 'nft') {
    return nftProfilePic;
    }

  // Handle High-Res variant
  if (variant === 'highres') {
    return largeProfilePic;
  }

  // Handle Default variant logic
  if (variant === 'default') {
    // 1. Prefer LargeProfilePicURL
    if (largeProfilePic) {
      return largeProfilePic;
    }

    // 2. Fallback to profilePic (which can be a URL or hex-encoded data)
    // 2a. If it's a full URL, return as is
    if (profilePic && profilePic.startsWith('http')) {
      return profilePic;
    }

    // 2b. Handle hex-encoded base64 data URLs from DeSo GraphQL
    if (profilePic && profilePic.startsWith('\\x')) {
      try {
        // Remove the \x prefix and convert hex to string
        const hexString = profilePic.slice(2);
        // Convert hex pairs to bytes
        const bytes = [];
        for (let i = 0; i < hexString.length; i += 2) {
          const hexPair = hexString.substr(i, 2);
          const byte = parseInt(hexPair, 16);
          if (!isNaN(byte)) {
            bytes.push(byte);
          }
        }
        // Convert bytes to string using proper decoding
        let dataUrl = '';
        try {
          // Use TextDecoder for proper UTF-8 decoding
          const uint8Array = new Uint8Array(bytes);
          const decoder = new TextDecoder('utf-8');
          dataUrl = decoder.decode(uint8Array);
        } catch (e) {
          // Fallback to String.fromCharCode
          dataUrl = String.fromCharCode.apply(null, bytes);
        }
        // Verify it's a valid data URL
        if (dataUrl.startsWith('data:image/')) {
          return dataUrl;
        }
      } catch (error) {
        console.error("Failed to decode hex profile picture:", error);
      }
    }
  }

  // If no suitable URL is found for any variant, return undefined.
  return undefined;
}

export function getDisplayName(username?: string, extraData?: Record<string, string>): string {
  const displayName = extraData?.DisplayName;
  return displayName || username || 'Anonymous';
}

export function getUsernameInitial(username?: string): string {
  if (!username) return '?';
  return username.charAt(0).toUpperCase();
}

export function formatDesoAmount(nanos: number): string {
  const deso = nanos / 1e9;
  if (deso < 0.001) return '< 0.001 DESO';
  if (deso < 1) return `${deso.toFixed(3)} DESO`;
  if (deso < 1000) return `${deso.toFixed(2)} DESO`;
  return `${(deso / 1000).toFixed(1)}K DESO`;
}

export function formatCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function isValidPublicKey(publicKey: string): boolean {
  // Basic validation for DeSo public key format
  return /^BC1YL[a-zA-Z0-9]{50,}$/.test(publicKey);
}

export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  return text.match(hashtagRegex) || [];
}

export function extractMentions(text: string): string[] {
  const mentionRegex = /@[a-zA-Z0-9_]+/g;
  return text.match(mentionRegex) || [];
}

export function processPostContent(body: string): {
  text: string;
  hashtags: string[];
  mentions: string[];
} {
  return {
    text: body,
    hashtags: extractHashtags(body),
    mentions: extractMentions(body),
  };
}

/**
 * Truncates a string (like a public key) by keeping the start and end parts
 * and replacing the middle with ellipsis
 * 
 * @param str String to truncate
 * @param startChars Number of characters to keep at the start
 * @param endChars Number of characters to keep at the end
 * @returns Truncated string
 */
export function truncateMiddle(str: string, startChars = 6, endChars = 6): string {
  if (!str) return '';
  
  // If the string is shorter than or equal to the sum of startChars and endChars,
  // just return the original string
  if (str.length <= startChars + endChars) {
    return str;
  }
  
  // Otherwise, truncate the middle
  return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
}

/**
 * Copies text to clipboard and returns a promise that resolves when done
 * 
 * @param text Text to copy to clipboard
 * @returns Promise that resolves when copying is done
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Use the Clipboard API if available and in secure context
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
}

/**
 * Returns the public DeSo endpoint for fetching a user's profile picture by public key.
 * This endpoint is recommended for all DeSo apps and supports a fallback image URL.
 *
 * @param publicKey The user's public key (Base58Check)
 * @param fallbackUrl Optional fallback image URL if the user has no profile picture
 * @returns The full URL to fetch the profile picture
 *
 * Example:
 *   getSingleProfilePictureUrl('BC1YL...', 'https://node.deso.org/assets/img/default_profile_pic.png')
 *   // => 'https://node.deso.org/api/v0/get-single-profile-picture/BC1YL...?fallback=https://node.deso.org/assets/img/default_profile_pic.png'
 */
export function getSingleProfilePictureUrl(publicKey: string, fallbackUrl?: string): string {
  const base = 'https://node.deso.org/api/v0/get-single-profile-picture/' + publicKey;
  if (fallbackUrl) {
    return `${base}?fallback=${encodeURIComponent(fallbackUrl)}`;
  }
  return base;
} 