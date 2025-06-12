'use client';

import React from 'react';
import { DesoMessage } from '@/lib/types';

interface MessageBubbleProps {
  message: DesoMessage;
  currentUserPublicKey: string;
}

export function MessageBubble({ message, currentUserPublicKey }: MessageBubbleProps) {
  const isFromCurrentUser = message.senderPublicKey === currentUserPublicKey;
  const timestamp = new Date(message.timestampNanos / 1000000);

  return (
    <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} mb-4 message-bubble`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isFromCurrentUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-200 text-gray-800'
      }`}>
        <div className="text-sm break-words">
          {message.messageText}
        </div>
        <div className={`text-xs mt-1 ${
          isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
} 