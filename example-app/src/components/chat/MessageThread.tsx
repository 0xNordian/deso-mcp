'use client';

import React, { useEffect, useRef } from 'react';
import { DesoUser } from '@/lib/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { useMessages } from '@/hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface MessageThreadProps {
  recipient: DesoUser;
  onBack?: () => void;
}

export function MessageThread({ recipient, onBack }: MessageThreadProps) {
  const { currentUser } = useAuth();
  const { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    refreshMessages, 
    isPolling, 
    lastRefresh 
  } = useMessages(recipient.publicKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    console.log('🎯 MessageThread: Attempting to send message:', {
      to: recipient.username || recipient.publicKey.slice(0, 10) + '...',
      length: messageText.length
    });
    
    return await sendMessage({
      recipientPublicKey: recipient.publicKey,
      messageText
    });
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh requested');
    refreshMessages();
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Please log in to start messaging</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <div className="flex items-center gap-3 flex-1">
          {recipient.profilePic ? (
            <img
              src={recipient.profilePic}
              alt={recipient.username || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              {(recipient.username || recipient.publicKey)?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {recipient.username || `${recipient.publicKey.slice(0, 10)}...`}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{recipient.description || 'DeSo User'}</span>
              {isPolling && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Live</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          title="Refresh messages"
        >
          <svg 
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 chat-messages">
        {loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
              <span>Loading messages...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <div className="text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && messages.length === 0 && !error && (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <div className="mb-2">
                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm">No messages yet</p>
              <p className="text-xs">Start the conversation!</p>
              <div className="mt-2 text-xs text-gray-400">
                Last checked: {lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : 'Never'}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            currentUserPublicKey={currentUser.publicKey}
          />
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={loading}
        placeholder={`Message ${recipient.username || 'user'}...`}
      />

      {/* Debug Info */}
      <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 border-t">
        <div className="flex justify-between items-center">
          <span>
            {isPolling ? '🟢 Live updates' : '🔴 Polling stopped'} • 
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
          <span>
                            Last refresh: {lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
} 