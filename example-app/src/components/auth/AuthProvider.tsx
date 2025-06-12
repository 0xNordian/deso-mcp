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

  // Initialize DeSo identity
  useEffect(() => {
    const initializeIdentity = async () => {
      try {
        const desoProtocol = await import('deso-protocol');
        setIdentity(desoProtocol.identity);
        
        // Subscribe to identity changes
        desoProtocol.identity.subscribe(({ event, currentUser: identityUser, alternateUsers: identityAlternateUsers }: any) => {
          console.log('🔵 [AUTH] Identity event:', event);
          
          if (!identityUser && !identityAlternateUsers) {
            console.log('🔵 [AUTH] No users found, clearing state');
            setCurrentUser(null);
            setAlternateUsers([]);
            setIsLoading(false);
            return;
          }

          if (identityUser) {
            const user: DesoUser = {
              publicKey: identityUser.publicKey,
              username: identityUser.publicKey.slice(0, 10) + '...',
              profilePic: undefined,
              description: undefined,
              isVerified: false
            };
            
            console.log('✅ [AUTH] Current user updated:', {
              username: user.username,
              publicKey: user.publicKey.slice(0, 10) + '...'
            });
            
            setCurrentUser(user);
          }

          if (identityAlternateUsers && Array.isArray(identityAlternateUsers)) {
            const alternates: DesoUser[] = identityAlternateUsers.map((altUser: any) => ({
              publicKey: altUser.publicKey,
              username: altUser.publicKey.slice(0, 10) + '...',
              profilePic: undefined,
              description: undefined,
              isVerified: false
            }));
            
            console.log('🔵 [AUTH] Alternate users updated:', alternates.length);
            setAlternateUsers(alternates);
          }

          setIsLoading(false);
        });
        
      } catch (err) {
        console.error('❌ [AUTH] Failed to initialize identity:', err);
        setError('Failed to initialize DeSo identity');
        setIsLoading(false);
      }
    };

    initializeIdentity();
  }, []);

  const login = async () => {
    if (!identity) {
      setError('DeSo identity not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('🔵 [AUTH] Starting login process');
      
      await identity.login();
      console.log('✅ [AUTH] Login completed');
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
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    switchUser,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 