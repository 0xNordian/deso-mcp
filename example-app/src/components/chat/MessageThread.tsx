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
    lastRefresh,
    newMessageCount,
    clearNewMessageCount
  } = useMessages(recipient.publicKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear new message count when viewing this conversation
  useEffect(() => {
    if (newMessageCount > 0) {
      // Clear count after a short delay to let user see the notification
      const timer = setTimeout(() => {
        clearNewMessageCount();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [newMessageCount, clearNewMessageCount]);

  // Log when recipient changes for debugging
  useEffect(() => {
    console.log('🎯 MessageThread: Recipient changed to:', {
      username: recipient.username,
      publicKey: recipient.publicKey.slice(0, 10) + '...'
    });
  }, [recipient]);

  const handleSendMessage = async (messageText: string): Promise<boolean> => {
    const success = await sendMessage({
      recipientPublicKey: recipient.publicKey,
      messageText
    });
    
    if (!success) {
      console.error('Failed to send message');
    }
    
    return success;
  };

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">Please log in to view messages</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ←
          </button>
          
          <div className="flex items-center space-x-3">
            {recipient.profilePic ? (
              <img
                src={recipient.profilePic}
                alt={recipient.username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {recipient.username.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-semibold text-white">{recipient.username}</h2>
                {recipient.isVerified && (
                  <span className="text-blue-400">✓</span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>{recipient.publicKey.slice(0, 10)}...</span>
                {isPolling && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* New message notification */}
          {newMessageCount > 0 && (
            <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold animate-bounce">
              +{newMessageCount} new
            </div>
          )}
          
          {/* Status indicators */}
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            {loading && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Loading...</span>
              </div>
            )}
            
            {lastRefresh && (
              <span>
                Updated {new Date(lastRefresh).toLocaleTimeString()}
              </span>
            )}
          </div>

          <button
            onClick={refreshMessages}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh messages"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {messages.length === 0 && !loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-2">No messages yet</div>
              <div className="text-gray-500 text-sm">Start the conversation!</div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={`${message.timestampNanos}-${message.senderPublicKey}-${message.messageText.slice(0, 10)}`}
              message={message}
              currentUserPublicKey={currentUser.publicKey}
            />
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-700 p-4">
        <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
} 