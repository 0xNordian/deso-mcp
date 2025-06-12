'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { DesoUser } from '@/lib/types';

interface UserSearchProps {
  onUserSelect: (user: DesoUser) => void;
  placeholder?: string;
}

export function UserSearch({ onUserSelect, placeholder = "Search by username..." }: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { searchResults, loading, error, searchUsers, clearSearch } = useUsers();

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      clearSearch();
      return;
    }
    
    searchUsers(debouncedQuery);
  }, [debouncedQuery, searchUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleUserClick = (user: DesoUser) => {
    onUserSelect(user);
    setQuery('');
    setDebouncedQuery('');
    clearSearch();
  };



  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {searchResults.map((user) => (
            <button
              key={user.publicKey}
              onClick={() => handleUserClick(user)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left"
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.username || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {(user.username || user.publicKey)?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">
                    {user.username || `${user.publicKey.slice(0, 10)}...`}
                  </span>
                  {user.isVerified && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {user.description && (
                  <p className="text-sm text-gray-500 truncate">
                    {user.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 truncate">
                  {user.publicKey.slice(0, 20)}...
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {debouncedQuery && !loading && searchResults.length === 0 && !error && (
        <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
          No users found with username "{debouncedQuery}"
        </div>
      )}
    </div>
  );
} 