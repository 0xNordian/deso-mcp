import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// DeSo-specific utility functions
export function buildProfilePictureUrl(profilePic?: string): string | undefined {
  if (!profilePic) return undefined;
  
  // If it's already a full URL, return as is
  if (profilePic.startsWith('http')) {
    return profilePic;
  }
  
  // Handle hex-encoded base64 data URLs from DeSo GraphQL
  if (profilePic.startsWith('\\x')) {
    try {
      // Remove the \x prefix and convert hex to string
      const hexString = profilePic.slice(2);
      const bytes = [];
      for (let i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
      }
      const dataUrl = String.fromCharCode.apply(null, bytes);
      
      // Verify it's a valid data URL
      if (dataUrl.startsWith('data:image/')) {
        return dataUrl;
      }
    } catch (error) {
      console.warn('Failed to decode hex-encoded profile picture:', error);
    }
  }
  
  // If it's a relative path, build the full URL
  return `https://node.deso.org/api/v0/get-single-profile-picture/${profilePic}`;
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