'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

interface DebugPanelProps {
  conversations: any[];
  messages: any[];
  loading: boolean;
  error: string | null;
  isPolling: boolean;
  lastRefresh: number | null;
}

export default function DebugPanel({
  conversations,
  messages,
  loading,
  error,
  isPolling,
  lastRefresh
}: DebugPanelProps) {
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
        >
          🔍 Debug
        </button>
      </div>
    );
  }

  const debugInfo = {
    user: {
      isAuthenticated: !!currentUser,
      username: currentUser?.username || 'Not logged in',
      publicKey: currentUser?.publicKey ? currentUser.publicKey.slice(0, 10) + '...' : 'None'
    },
    messaging: {
      conversationsCount: conversations.length,
      messagesCount: messages.length,
      loading,
      hasError: !!error,
      errorMessage: error,
      isPolling,
      lastRefresh: lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : 'Never'
    },
    conversations: conversations.map(conv => ({
      id: conv.id.slice(0, 10) + '...',
      username: conv.otherUsername,
      hasProfilePic: !!conv.otherUserProfilePic,
      lastMessage: conv.lastMessage.slice(0, 30) + '...'
    })),
    messages: messages.slice(-5).map(msg => ({
      id: msg.id.slice(0, 10) + '...',
      isFromSender: msg.isFromSender,
      isEncrypted: msg.isEncrypted,
      messagePreview: msg.messageText.slice(0, 30) + '...',
      timestamp: new Date(Number(msg.timestampNanos) / 1000000).toLocaleTimeString()
    }))
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white p-4 rounded-lg max-w-md max-h-96 overflow-y-auto text-xs border border-gray-600">
      <div className="flex justify-between items-center mb-3 sticky top-0 bg-gray-800">
        <h3 className="font-semibold text-purple-400">🔍 Debug Panel</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* User Info */}
        <div>
          <h4 className="font-medium text-green-400 mb-1">👤 User</h4>
          <div className="pl-2">
            <div>Status: {debugInfo.user.isAuthenticated ? '✅ Authenticated' : '❌ Not logged in'}</div>
            <div>Username: {debugInfo.user.username}</div>
            <div>Key: {debugInfo.user.publicKey}</div>
          </div>
        </div>

        {/* Messaging Status */}
        <div>
          <h4 className="font-medium text-blue-400 mb-1">💬 Messaging</h4>
          <div className="pl-2">
            <div>Conversations: {debugInfo.messaging.conversationsCount}</div>
            <div>Messages: {debugInfo.messaging.messagesCount}</div>
            <div>Loading: {debugInfo.messaging.loading ? '🔄 Yes' : '✅ No'}</div>
            <div>Polling: {debugInfo.messaging.isPolling ? '🔄 Active' : '⏹️ Stopped'}</div>
            <div>Last Refresh: {debugInfo.messaging.lastRefresh}</div>
            {debugInfo.messaging.hasError && (
              <div className="text-red-400">Error: {debugInfo.messaging.errorMessage}</div>
            )}
          </div>
        </div>

        {/* Recent Conversations */}
        {debugInfo.conversations.length > 0 && (
          <div>
            <h4 className="font-medium text-yellow-400 mb-1">📋 Conversations ({debugInfo.conversations.length})</h4>
            <div className="pl-2 space-y-1">
              {debugInfo.conversations.slice(0, 3).map((conv, idx) => (
                <div key={idx} className="text-xs">
                  <div>• {conv.username} {conv.hasProfilePic ? '🖼️' : '👤'}</div>
                  <div className="text-gray-400 ml-2">{conv.lastMessage}</div>
                </div>
              ))}
              {debugInfo.conversations.length > 3 && (
                <div className="text-gray-400">... and {debugInfo.conversations.length - 3} more</div>
              )}
            </div>
          </div>
        )}

        {/* Recent Messages */}
        {debugInfo.messages.length > 0 && (
          <div>
            <h4 className="font-medium text-cyan-400 mb-1">📨 Recent Messages ({debugInfo.messages.length})</h4>
            <div className="pl-2 space-y-1">
              {debugInfo.messages.map((msg, idx) => (
                <div key={idx} className="text-xs">
                  <div>
                    {msg.isFromSender ? '→' : '←'} {msg.isEncrypted ? '🔒' : '📝'} {msg.timestamp}
                  </div>
                  <div className="text-gray-400 ml-2">{msg.messagePreview}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h4 className="font-medium text-purple-400 mb-1">🛠️ Actions</h4>
          <div className="pl-2 space-y-1">
            <button
              onClick={() => {
                console.log('🔍 Debug: Full state dump', {
                  user: debugInfo.user,
                  messaging: debugInfo.messaging,
                  conversations: conversations,
                  messages: messages
                });
              }}
              className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs transition-colors"
            >
              📝 Log Full State
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs ml-2 transition-colors"
            >
              🔄 Reset App
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-600">
          💡 Check browser console for detailed logs with [SECTION] prefixes
        </div>
      </div>
    </div>
  );
} 