'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DesoUser } from '@/lib/types';

interface AuthContextType {
  currentUser: DesoUser | null;
  alternateUsers: DesoUser[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (publicKey: string) => Promise<void>;
  error: string | null;
  hasMessagingPermissions: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<DesoUser | null>(null);
  const [alternateUsers, setAlternateUsers] = useState<DesoUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [hasMessagingPermissions, setHasMessagingPermissions] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get user profile information
  const getUserProfile = async (publicKey: string) => {
    try {
      const desoProtocol = await import('deso-protocol');
      const response = await desoProtocol.getSingleProfile({
        PublicKeyBase58Check: publicKey
      });
      
      if (response?.Profile) {
        return {
          username: response.Profile.Username || publicKey.slice(0, 10) + '...',
          profilePic: response.Profile.ExtraData?.LargeProfilePicURL || response.Profile.ExtraData?.ProfilePicURL || undefined,
          description: response.Profile.Description || undefined,
          isVerified: response.Profile.IsVerified || false
        };
      }
    } catch (err) {
      console.warn('⚠️ [AUTH] Failed to fetch profile for:', publicKey.slice(0, 10) + '...', err);
    }
    
    return {
      username: publicKey.slice(0, 10) + '...',
      profilePic: undefined,
      description: undefined,
      isVerified: false
    };
  };

  const checkMessagingPermissions = async () => {
    if (!currentUser || !identity) {
      setHasMessagingPermissions(false);
      return;
    }

    try {
      // Check if user has proper derived key and access level for messaging
      const hasPerms = !!(currentUser.derivedPublicKey && (currentUser.accessLevel || 0) >= 3);
      setHasMessagingPermissions(hasPerms);
      
      console.log('🔑 [AUTH] Messaging permissions check:', {
        hasPerms,
        accessLevel: currentUser.accessLevel,
        hasDerivedKey: !!currentUser.derivedPublicKey
      });
    } catch (err) {
      console.error('❌ [AUTH] Error checking messaging permissions:', err);
      setHasMessagingPermissions(false);
    }
  };

  // Initialize DeSo identity
  useEffect(() => {
    const initializeIdentity = async () => {
      try {
        const desoProtocol = await import('deso-protocol');
        setIdentity(desoProtocol.identity);
        console.log('✅ [AUTH] Identity initialized successfully');
      } catch (err) {
        console.error('❌ [AUTH] Failed to initialize identity:', err);
        setError('Failed to initialize DeSo identity');
        setIsLoading(false);
      }
    };

    initializeIdentity();
  }, []);

  // Subscribe to identity changes (separate useEffect)
  useEffect(() => {
    if (!identity) return;

    const unsubscribe = identity.subscribe(async ({ currentUser, alternateUsers }: { 
      currentUser: any; 
      alternateUsers: any; 
    }) => {
      console.log('🔔 [AUTH] Identity subscription triggered:', { 
        currentUser: currentUser?.publicKey?.slice(0, 10) + '...',
        alternateUsersCount: alternateUsers ? Object.keys(alternateUsers).length : 0
      });

      if (!currentUser) {
        console.log('🔴 [AUTH] No current user, clearing state');
        setCurrentUser(null);
        setAlternateUsers([]);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Update spending limits with the user's public key for proper access group configuration
        const { getTransactionSpendingLimits } = await import('@/lib/deso');
        const { configure } = await import('deso-protocol');
        
        console.log('🔧 [AUTH] Updating spending limits for user:', currentUser.publicKey.slice(0, 10) + '...');
        configure({
          spendingLimitOptions: getTransactionSpendingLimits(currentUser.publicKey)
        });

        // Get user profile
        const profile = await getUserProfile(currentUser.publicKey);
        
        // Check if user has messaging permissions (derived key with proper access level)
        const hasMessagingPerms = currentUser.primaryDerivedKey && 
                                 currentUser.accessLevel >= 3; // Access level 3 or 4 for messaging
        
        console.log('🔑 [AUTH] User permissions:', {
          accessLevel: currentUser.accessLevel,
          hasDerivedKey: !!currentUser.primaryDerivedKey,
          hasMessagingPermissions: hasMessagingPerms
        });

        const user: DesoUser = {
          publicKey: currentUser.publicKey,
          username: profile?.username || currentUser.publicKey.slice(0, 10) + '...',
          profilePic: profile?.profilePic,
          description: profile?.description,
          isVerified: profile?.isVerified || false,
          accessLevel: currentUser.accessLevel,
          derivedPublicKey: currentUser.primaryDerivedKey?.derivedPublicKeyBase58Check
        };

        setCurrentUser(user);
        setHasMessagingPermissions(hasMessagingPerms);
        setIsAuthenticated(true);

        // Handle alternate users
        if (alternateUsers) {
          const altUsers = await Promise.all(
            Object.values(alternateUsers).map(async (altUser: any) => {
              const altProfile = await getUserProfile(altUser.publicKey);
              return {
                publicKey: altUser.publicKey,
                username: altProfile?.username || altUser.publicKey.slice(0, 10) + '...',
                profilePic: altProfile?.profilePic,
                description: altProfile?.description,
                isVerified: altProfile?.isVerified || false,
                accessLevel: altUser.accessLevel,
                derivedPublicKey: altUser.primaryDerivedKey?.derivedPublicKeyBase58Check
              };
            })
          );
          setAlternateUsers(altUsers);
        }

        console.log('✅ [AUTH] User state updated successfully');
      } catch (err) {
        console.error('❌ [AUTH] Error updating user state:', err);
        setError(err instanceof Error ? err.message : 'Failed to update user state');
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [identity]);

  const login = async () => {
    if (!identity) {
      setError('DeSo identity not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('🔵 [AUTH] Starting login process with access level 4 for messaging permissions');
      
      // Login with access level 4 for full messaging permissions (no approval required)
      await identity.login({
        getFreeDeso: true,
        derivedKeyLogin: true, // This is the default and enables messaging
        accessLevelRequest: 4 // Request full access level for messaging
      });
      
      console.log('✅ [AUTH] Login completed with access level 4');
    } catch (err) {
      console.error('❌ [AUTH] Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!identity) {
      setError('DeSo identity not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('🔵 [AUTH] Starting logout process');
      
      await identity.logout();
      setCurrentUser(null);
      setAlternateUsers([]);
      setHasMessagingPermissions(false);
      console.log('✅ [AUTH] Logout completed');
    } catch (err) {
      console.error('❌ [AUTH] Logout failed:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (publicKey: string) => {
    if (!identity) {
      setError('DeSo identity not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('🔵 [AUTH] Switching to user:', publicKey.slice(0, 10) + '...');
      
      await identity.setActiveUser(publicKey);
      
      // Check permissions for the new user
      setTimeout(() => {
        checkMessagingPermissions();
      }, 1000);
      
      console.log('✅ [AUTH] User switch completed');
    } catch (err) {
      console.error('❌ [AUTH] User switch failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch user');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    alternateUsers,
    isAuthenticated,
    isLoading,
    login,
    logout,
    switchUser,
    error,
    hasMessagingPermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 