'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoginButton } from '@/components/auth/LoginButton';
import { UserSearch } from '@/components/user/UserSearch';
import { MessageThread } from '@/components/chat/MessageThread';
import ConversationList from '@/components/chat/ConversationList';
import DebugPanel from '@/components/debug/DebugPanel';
import { useMessages } from '@/hooks/useMessages';
import { DesoUser, ConversationInfo } from '@/lib/types';

type ViewMode = 'conversations' | 'search' | 'chat';

export default function Home() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [selectedUser, setSelectedUser] = useState<{
    publicKey: string;
    username: string;
    profilePic?: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('conversations');
  
  const { 
    conversations, 
    messages,
    loading: messageLoading, 
    error: messageError,
    isPolling,
    lastRefresh,
    fetchConversations 
  } = useMessages(selectedUser?.publicKey);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to DeSo...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">DeSo Messaging</h1>
            <p className="text-gray-600 mb-8">
              Send blockchain messages on the DeSo network
            </p>
            <LoginButton />
            <p className="text-sm text-gray-500 mt-4">
              Login with your DeSo identity to start messaging
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleUserSelect = (user: DesoUser) => {
    console.log('🎯 User selected:', user.username);
    setSelectedUser({
      publicKey: user.publicKey,
      username: user.username || 'Unknown User',
      profilePic: user.profilePic
    });
    setViewMode('chat');
  };

  const handleConversationSelect = (conversation: ConversationInfo) => {
    console.log('🎯 Conversation selected:', {
      id: conversation.id,
      otherUser: conversation.otherUsername,
      publicKey: conversation.otherUserPublicKey ? 
        conversation.otherUserPublicKey.slice(0, 10) + '...' : 
        'No public key'
    });
    
    if (!conversation.otherUserPublicKey) {
      console.error('❌ Cannot select conversation: missing public key');
      return;
    }
    
    setSelectedUser({
      publicKey: conversation.otherUserPublicKey,
      username: conversation.otherUsername,
      profilePic: conversation.otherUserProfilePic
    });
    setViewMode('chat');
  };

  const handleBackToConversations = () => {
    setViewMode('conversations');
    setSelectedUser(null);
    fetchConversations(); // Refresh conversations
  };

  const handleNewChat = () => {
    setViewMode('search');
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {viewMode !== 'conversations' && (
                <button
                  onClick={handleBackToConversations}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {viewMode === 'conversations' && 'Conversations'}
                  {viewMode === 'search' && 'Find Users'}
                  {viewMode === 'chat' && selectedUser && `Chat with ${selectedUser.username}`}
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {currentUser.username || 'DeSo User'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {viewMode === 'conversations' && (
                <button
                  onClick={handleNewChat}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Chat</span>
                </button>
              )}
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Connected</span>
              </div>
              
              <LoginButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {viewMode === 'conversations' && (
            <ConversationList
              conversations={conversations}
              loading={messageLoading}
              onConversationSelect={handleConversationSelect}
              onNewChat={handleNewChat}
            />
          )}
          
          {viewMode === 'search' && (
            <div className="p-6">
              <UserSearch onUserSelect={handleUserSelect} />
            </div>
          )}
          
                     {viewMode === 'chat' && selectedUser && (
             <MessageThread
               recipient={{
                 publicKey: selectedUser.publicKey,
                 username: selectedUser.username,
                 profilePic: selectedUser.profilePic
               }}
               onBack={handleBackToConversations}
             />
           )}
        </div>
      </div>

      {/* Debug Information Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-900 rounded-lg border">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">🔧 Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-gray-400 mb-1">Authentication:</div>
              <div className="text-gray-200">
                User: {currentUser?.username || 'Not logged in'}<br/>
                Public Key: {currentUser?.publicKey ? 
                  `${currentUser.publicKey.slice(0, 15)}...${currentUser.publicKey.slice(-10)}` : 
                  'None'
                }
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Messaging Status:</div>
              <div className="text-gray-200">
                {messageLoading && <span className="text-yellow-400">⚡ Sending message...</span>}
                {messageError && <span className="text-red-400">❌ Error: {messageError}</span>}
                {!messageLoading && !messageError && <span className="text-green-400">✅ Ready</span>}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Conversations:</div>
              <div className="text-gray-200">
                Total: {conversations.length}<br/>
                Selected: {selectedUser ? selectedUser.username : 'None'}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Selected Chat:</div>
              <div className="text-gray-200">
                {selectedUser ? (
                  <>
                    User: {selectedUser.username}<br/>
                    Key: {selectedUser.publicKey.slice(0, 15)}...{selectedUser.publicKey.slice(-10)}<br/>
                    Messages: {messages.length}
                  </>
                ) : (
                  'No chat selected'
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-gray-400 mb-1">Last Refresh:</div>
            <div className="text-gray-200 text-xs">
              {lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : 'Never'}
              {isPolling && <span className="ml-2 text-green-400">🔄 Auto-refreshing</span>}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Debug Panel */}
      <DebugPanel
        conversations={conversations}
        messages={messages}
        loading={messageLoading}
        error={messageError}
        isPolling={isPolling}
        lastRefresh={lastRefresh}
      />
    </div>
  );
} 