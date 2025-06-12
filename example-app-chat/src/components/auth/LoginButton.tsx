'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

export function LoginButton() {
  const { currentUser, alternateUsers, isAuthenticated, isLoading, login, logout, switchUser, error } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={login}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {isLoading ? 'Connecting...' : 'Login with DeSo'}
        </button>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {currentUser?.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {currentUser?.username}
            </span>
            <span className="text-xs text-gray-500">
              {currentUser?.publicKey.slice(0, 8)}...
            </span>
          </div>
        </div>

        {alternateUsers.length > 0 && (
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            title="Switch User"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        <button
          onClick={logout}
          disabled={isLoading}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>

      {showUserMenu && alternateUsers.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Switch Account</h3>
          </div>
          
          <div className="py-2">
            <div className="px-3 py-2 bg-purple-50 border-l-4 border-purple-600">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {currentUser?.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {currentUser?.username}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentUser?.publicKey.slice(0, 12)}... (Current)
                  </div>
                </div>
              </div>
            </div>
            
            {alternateUsers.map((user) => (
              <button
                key={user.publicKey}
                onClick={() => {
                  switchUser(user.publicKey);
                  setShowUserMenu(false);
                }}
                disabled={isLoading}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.publicKey.slice(0, 12)}...
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => {
                login();
                setShowUserMenu(false);
              }}
              className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              + Add Another Account
            </button>
          </div>
        </div>
      )}
      
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
      
      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
} 