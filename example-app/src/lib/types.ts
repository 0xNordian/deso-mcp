// User types
export interface DesoUser {
  publicKey: string;
  username: string;
  profilePic?: string;
  description?: string;
  isVerified?: boolean;
}

// Message types
export interface DesoMessage {
  id: string;
  senderPublicKey: string;
  recipientPublicKey: string;
  messageText: string;
  timestampNanos: number;
  isFromSender: boolean;
  isEncrypted: boolean;
}

// Message sending payload
export interface SendMessagePayload {
  recipientPublicKey: string;
  messageText: string;
  extraData?: Record<string, string>;
}

// Conversation and thread types
export interface MessageThread {
  ThreadId: string;
  PartyAccessGroupOwnerPublicKeyBase58Check: string;
  PartyUsername: string;
  PartyProfilePic?: string;
  LastMessage?: {
    MessageText: string;
    TimestampNanos: number;
  };
}

export interface ConversationInfo {
  id: string;
  otherUserPublicKey: string;
  otherUsername: string;
  lastMessage: string;
  lastMessageTimestamp: number;
  unreadCount: number;
  otherUserProfilePic?: string;
}

// Profile types for API responses
export interface ProfileEntryResponse {
  PublicKeyBase58Check: string;
  Username: string;
  Description: string;
  ProfilePic?: string;
  IsVerified: boolean;
  CoinEntry?: {
    CreatorBasisPoints: number;
    DeSoLockedNanos: number;
    NumberOfHolders: number;
  };
  DESOBalanceNanos: number;
}

// Search types
export interface UserSearchResult {
  publicKey: string;
  username: string;
  description?: string;
  profilePic?: string;
  isVerified?: boolean;
}

// Chat types
export interface ChatThread {
  otherUser: DesoUser;
  lastMessage?: DesoMessage;
  unreadCount: number;
  lastActivity: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth context types (moved to AuthProvider.tsx)

// Access Group Types
export interface AccessGroupInfo {
  AccessGroupOwnerPublicKeyBase58Check: string;
  AccessGroupKeyName: string;
  AccessGroupPublicKeyBase58Check: string;
  ExtraData?: Record<string, string>;
}

export interface AccessGroupCheckResponse {
  SenderPublicKeyBase58Check: string;
  SenderAccessGroupPublicKeyBase58Check: string;
  SenderAccessGroupKeyName: string;
  IsSenderAccessGroupKey: boolean;
  RecipientPublicKeyBase58Check: string;
  RecipientAccessGroupPublicKeyBase58Check: string;
  RecipientAccessGroupKeyName: string;
  IsRecipientAccessGroupKey: boolean;
}

// Message Info from DeSo API
export interface MessageInfo {
  MessageId?: string;
  SenderAccessGroupOwnerPublicKeyBase58Check: string;
  RecipientAccessGroupOwnerPublicKeyBase58Check: string;
  EncryptedText?: string;
  MessageText?: string;
  TimestampNanos: number;
}

// DeSo API Response Types
export interface DMThreadsResponse {
  MessageThreads: MessageThread[];
  PublicKeyToProfileEntryResponse?: Record<string, ProfileEntryResponse>;
}

export interface DMMessagesResponse {
  Messages: Array<{
    MessageInfo: MessageInfo;
  }>;
  PublicKeyToProfileEntryResponse?: Record<string, ProfileEntryResponse>;
} 