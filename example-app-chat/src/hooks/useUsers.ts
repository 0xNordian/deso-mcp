import { useState, useCallback } from 'react';
import { DesoUser } from '@/lib/types';

// Enhanced logging helper
const log = {
  info: (message: string, data?: any) => console.log(`🔵 [USER_SEARCH] ${message}`, data || ''),
  success: (message: string, data?: any) => console.log(`✅ [USER_SEARCH] ${message}`, data || ''),
  error: (message: string, error?: any) => console.error(`❌ [USER_SEARCH] ${message}`, error || ''),
  warn: (message: string, data?: any) => console.warn(`⚠️ [USER_SEARCH] ${message}`, data || ''),
  debug: (message: string, data?: any) => console.log(`🔍 [USER_SEARCH] ${message}`, data || '')
};

export function useUsers() {
  const [searchResults, setSearchResults] = useState<DesoUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUserByUsername = useCallback(async (username: string): Promise<DesoUser | null> => {
    log.info(`Starting user search for: ${username}`);
    
    if (!username.trim()) {
      const errorMsg = 'Username is required';
      log.error('Search failed - no username provided');
      setError(errorMsg);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      log.debug('Making direct API call to get-single-profile');
      
      // Try direct API call with multiple fallback approaches
      const requestBody = {
        Username: username.trim(),
        NoErrorOnMissing: true
      };
      
      log.debug('Request payload', requestBody);
      
      const response = await fetch('https://node.deso.org/api/v0/get-single-profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      log.debug(`API response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 404) {
          log.warn(`User "${username}" not found (404)`);
          return null;
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      // Check if response has content before parsing JSON
      const responseText = await response.text();
      if (!responseText.trim()) {
        log.warn(`Empty response for username: ${username}`);
        return null;
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        log.error('Failed to parse JSON response', {
          username,
          responseText: responseText.slice(0, 100) + '...',
          parseError
        });
        throw new Error('Invalid response format from DeSo API');
      }

      log.debug('API response data', {
        hasProfile: !!data?.Profile,
        username: data?.Profile?.Username,
        publicKey: data?.Profile?.PublicKeyBase58Check ? data.Profile.PublicKeyBase58Check.slice(0, 10) + '...' : 'No key'
      });

      if (data?.Profile) {
        const user: DesoUser = {
          publicKey: data.Profile.PublicKeyBase58Check,
          username: data.Profile.Username,
          profilePic: data.Profile.ProfilePic || undefined,
          description: data.Profile.Description || undefined,
          isVerified: data.Profile.IsVerified || false,
        };
        
        log.success('User found and converted', {
          username: user.username,
          publicKey: user.publicKey.slice(0, 10) + '...',
          hasProfilePic: !!user.profilePic,
          hasDescription: !!user.description,
          isVerified: user.isVerified
        });
        
        return user;
      }
      
      log.warn(`No profile found for username: ${username}`);
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search user';
      log.error('User search failed', {
        username,
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined
      });
      
      // Provide more user-friendly error messages
      let userFriendlyError = errorMessage;
      if (errorMessage.includes('404') || errorMessage.includes('could not find profile')) {
        userFriendlyError = `User "${username}" not found on DeSo`;
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        userFriendlyError = 'Network error - please try again';
      } else if (errorMessage.includes('API request failed')) {
        userFriendlyError = 'DeSo API temporarily unavailable';
      } else if (errorMessage.includes('Invalid response format')) {
        userFriendlyError = 'DeSo API returned invalid data - please try again';
      }
      
      setError(userFriendlyError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchUsers = useCallback(async (query: string): Promise<DesoUser[]> => {
    log.info(`Starting user search with query: ${query}`);
    
    if (!query.trim()) {
      log.debug('Empty query, clearing results');
      setSearchResults([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Search for user by exact username first
      const user = await searchUserByUsername(query);
      const results = user ? [user] : [];
      
      log.success('Search completed', {
        query,
        resultsCount: results.length,
        users: results.map(u => ({ username: u.username, publicKey: u.publicKey.slice(0, 10) + '...' }))
      });
      
      setSearchResults(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search users';
      log.error('Users search failed', {
        query,
        error: err,
        message: errorMessage
      });
      
      setError(errorMessage);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [searchUserByUsername]);

  const clearSearch = useCallback(() => {
    log.debug('Clearing search results');
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchUserByUsername,
    searchUsers,
    clearSearch,
  };
} 