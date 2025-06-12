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
      console.log('🔍 Decoding hex string:', { 
        originalLength: profilePic.length, 
        hexLength: hexString.length,
        first50: hexString.substring(0, 50) 
      });
      
      // Convert hex pairs to bytes
      const bytes = [];
      for (let i = 0; i < hexString.length; i += 2) {
        const hexPair = hexString.substr(i, 2);
        const byte = parseInt(hexPair, 16);
        if (!isNaN(byte)) {
          bytes.push(byte);
        }
      }
      
      console.log('🔍 Converted to bytes:', { 
        byteCount: bytes.length,
        first10: bytes.slice(0, 10) 
      });
      
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
      
      console.log('🔍 Decoded data URL:', { 
        length: dataUrl.length,
        prefix: dataUrl.substring(0, 50),
        isValidDataUrl: dataUrl.startsWith('data:image/')
      });
      
      // Verify it's a valid data URL
      if (dataUrl.startsWith('data:image/')) {
        return dataUrl;
      } else {
        console.warn('Decoded string is not a valid data URL:', dataUrl.substring(0, 100));
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