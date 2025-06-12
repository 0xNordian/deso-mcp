import { useState, useEffect, useCallback, useRef } from 'react';
import { DesoMessage, SendMessagePayload, ConversationInfo } from '@/lib/types';
import { useAuth } from '@/components/auth/AuthProvider';

// Enhanced logging helper
const log = {
  info: (section: string, message: string, data?: any) => {
    console.log(`🔵 [${section}] ${message}`, data ? data : '');
  },
  success: (section: string, message: string, data?: any) => {
    console.log(`✅ [${section}] ${message}`, data ? data : '');
  },
  error: (section: string, message: string, error?: any) => {
    console.error(`❌ [${section}] ${message}`, error ? error : '');
  },
  warn: (section: string, message: string, data?: any) => {
    console.warn(`⚠️ [${section}] ${message}`, data ? data : '');
  },
  debug: (section: string, message: string, data?: any) => {
    console.log(`🔍 [${section}] ${message}`, data ? data : '');
  }
};

// DeSo SDK functions - imported dynamically to avoid SSR issues
let sendDMMessage: any = null;
let sendGroupChatMessage: any = null;
let identity: any = null;
let getAllMessageThreads: any = null;
let getPaginatedDMThread: any = null;
let checkPartyAccessGroups: any = null;
let getAllAccessGroups: any = null;
let createAccessGroup: any = null;
let waitForTransactionFound: any = null;

const DEFAULT_KEY_MESSAGING_GROUP_NAME = 'default-key';

// Initialize DeSo SDK
const initializeDesoSDK = async () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const desoProtocol = await import('deso-protocol');
    sendDMMessage = desoProtocol.sendDMMessage;
    sendGroupChatMessage = desoProtocol.sendGroupChatMessage;
    identity = desoProtocol.identity;
    getAllMessageThreads = desoProtocol.getAllMessageThreads;
    getPaginatedDMThread = desoProtocol.getPaginatedDMThread;
    checkPartyAccessGroups = desoProtocol.checkPartyAccessGroups;
    getAllAccessGroups = desoProtocol.getAllAccessGroups;
    createAccessGroup = desoProtocol.createAccessGroup;
    waitForTransactionFound = desoProtocol.waitForTransactionFound;
    
    log.success('SDK', 'DeSo SDK initialized successfully');
    return true;
  } catch (error) {
    log.error('SDK', 'Failed to initialize DeSo SDK', error);
    return false;
  }
};

// Decrypt access group messages with retry logic (from deso-chat)
const decryptAccessGroupMessagesWithRetry = async (
  publicKeyBase58Check: string,
  messages: any[],
  accessGroups: any[]
): Promise<{
  decrypted: any[];
  updatedAllAccessGroups: any[];
}> => {
  let decryptedMessageEntries = await decryptAccessGroupMessages(messages, accessGroups);

  // Check for missing access groups and refetch if needed
  const accessGroupsToFetch = decryptedMessageEntries.filter(
    (dmr) => dmr.error === "Error: access group key not found for group message"
  );
  
  if (accessGroupsToFetch.length > 0) {
    log.info('DECRYPT', 'Refetching access groups for missing keys');
    const newAllAccessGroups = await getAllAccessGroups({
      PublicKeyBase58Check: publicKeyBase58Check,
    });
    accessGroups = (newAllAccessGroups.AccessGroupsOwned || []).concat(
      newAllAccessGroups.AccessGroupsMember || []
    );
    decryptedMessageEntries = await decryptAccessGroupMessages(messages, accessGroups);
  }

  return {
    decrypted: decryptedMessageEntries,
    updatedAllAccessGroups: accessGroups,
  };
};

// Decrypt access group messages
const decryptAccessGroupMessages = (
  messages: any[],
  accessGroups: any[]
): Promise<any[]> => {
  return Promise.all(
    (messages || []).map((m) => identity.decryptMessage(m, accessGroups))
  );
};

// Get conversations using the deso-chat pattern
const getConversationsWithProfiles = async (userPublicKey: string) => {
  log.info('CONVERSATIONS', 'Fetching conversations using deso-chat pattern');
  
  try {
    if (!getAllMessageThreads || !getAllAccessGroups) {
      throw new Error('DeSo SDK not initialized');
    }

    // Get all access groups first
    const allAccessGroupsResponse = await getAllAccessGroups({
      PublicKeyBase58Check: userPublicKey
    });
    
    const allAccessGroups = (allAccessGroupsResponse.AccessGroupsOwned || []).concat(
      allAccessGroupsResponse.AccessGroupsMember || []
    );

    log.debug('CONVERSATIONS', 'Access groups retrieved', {
      owned: allAccessGroupsResponse.AccessGroupsOwned?.length || 0,
      member: allAccessGroupsResponse.AccessGroupsMember?.length || 0,
      total: allAccessGroups.length
    });

    // Get all message threads
    const messages = await getAllMessageThreads({
      UserPublicKeyBase58Check: userPublicKey,
    });

    log.debug('CONVERSATIONS', 'Message threads retrieved', {
      threadsCount: messages.MessageThreads?.length || 0,
      hasProfiles: !!messages.PublicKeyToProfileEntryResponse
    });

    if (!messages.MessageThreads || messages.MessageThreads.length === 0) {
      log.warn('CONVERSATIONS', 'No message threads found');
      return [];
    }

    // Decrypt messages with retry logic
    const { decrypted } = await decryptAccessGroupMessagesWithRetry(
      userPublicKey,
      messages.MessageThreads,
      allAccessGroups
    );

    log.debug('CONVERSATIONS', 'Messages decrypted', {
      decryptedCount: decrypted.length,
      successfulDecryptions: decrypted.filter(d => !d.error).length,
      errors: decrypted.filter(d => d.error).length
    });

    // Log a sample decrypted message for debugging
    if (decrypted.length > 0) {
      log.debug('CONVERSATIONS', 'Sample decrypted message structure', {
        hasMessageText: !!decrypted[0].MessageText,
        hasError: !!decrypted[0].error,
        hasMessageInfo: !!decrypted[0].MessageInfo,
        messageKeys: Object.keys(decrypted[0]),
        error: decrypted[0].error
      });
    }

    // Organize messages into conversations (deso-chat pattern)
    const conversationMap: { [key: string]: any } = {};
    
    decrypted.forEach((dmr: any) => {
      if (!dmr.MessageInfo) {
        log.warn('CONVERSATIONS', 'Message missing MessageInfo', dmr);
        return;
      }
      
      const otherInfo = dmr.ChatType === 0 // DM
        ? dmr.IsSender ? dmr.RecipientInfo : dmr.SenderInfo
        : dmr.RecipientInfo;
        
      if (!otherInfo) {
        log.warn('CONVERSATIONS', 'Message missing other user info', dmr);
        return;
      }
      
      const key = otherInfo.OwnerPublicKeyBase58Check + 
        (otherInfo.AccessGroupKeyName || DEFAULT_KEY_MESSAGING_GROUP_NAME);
      
      if (conversationMap[key]) {
        conversationMap[key].messages.push(dmr);
        conversationMap[key].messages.sort(
          (a: any, b: any) => b.MessageInfo.TimestampNanos - a.MessageInfo.TimestampNanos
        );
      } else {
        conversationMap[key] = {
          firstMessagePublicKey: otherInfo.OwnerPublicKeyBase58Check,
          messages: [dmr],
          ChatType: dmr.ChatType
        };
      }
    });

    // Convert to ConversationInfo array
    const conversations: ConversationInfo[] = [];
    
    for (const [key, conversation] of Object.entries(conversationMap)) {
      const latestMessage = conversation.messages[0];
      if (!latestMessage?.MessageInfo) continue;
      
      const otherUserPublicKey = conversation.firstMessagePublicKey;
      if (!otherUserPublicKey) continue;
      
      // Get profile from response
      const profile = messages.PublicKeyToProfileEntryResponse?.[otherUserPublicKey];
      
      // Extract the last message text from the decrypted message
      let lastMessageText = '[Encrypted Message]';
      if (latestMessage.error) {
        lastMessageText = '[Decryption Failed]';
      } else if (latestMessage.DecryptedMessage) {
        lastMessageText = latestMessage.DecryptedMessage;
      } else if (latestMessage.MessageInfo?.ExtraData?.unencrypted === "true") {
        // Handle unencrypted messages
        try {
          const hexString = latestMessage.MessageInfo.EncryptedText;
          const bytes = new Uint8Array(Buffer.from(hexString, 'hex'));
          lastMessageText = new TextDecoder().decode(bytes);
        } catch (error) {
          lastMessageText = '[Decoding Failed]';
        }
      }
      
      conversations.push({
        id: key,
        otherUserPublicKey,
        otherUsername: profile?.Username || 'Unknown User',
        otherUserProfilePic: profile?.ProfilePic,
        lastMessage: lastMessageText,
        lastMessageTimestamp: latestMessage.MessageInfo.TimestampNanos,
        unreadCount: 0 // TODO: Implement unread count logic
      });
    }

    log.success('CONVERSATIONS', `Processed ${conversations.length} conversations`);
    return conversations;
    
  } catch (error) {
    log.error('CONVERSATIONS', 'Failed to fetch conversations', error);
    throw error;
  }
};

// Get messages for a specific conversation using deso-chat pattern
const getMessagesForConversation = async (
  userPublicKey: string,
  otherUserPublicKey: string,
  maxMessages: number = 50
): Promise<DesoMessage[]> => {
  log.info('MESSAGES', 'Fetching messages for conversation', {
    user: userPublicKey?.slice(0, 10) + '...',
    other: otherUserPublicKey?.slice(0, 10) + '...',
    maxMessages
  });
  
  try {
    if (!getPaginatedDMThread || !getAllAccessGroups) {
      throw new Error('DeSo SDK not initialized');
    }

    // Get access groups
    const allAccessGroupsResponse = await getAllAccessGroups({
      PublicKeyBase58Check: userPublicKey
    });
    
    const allAccessGroups = (allAccessGroupsResponse.AccessGroupsOwned || []).concat(
      allAccessGroupsResponse.AccessGroupsMember || []
    );

    log.debug('MESSAGES', 'Access groups retrieved', {
      owned: allAccessGroupsResponse.AccessGroupsOwned?.length || 0,
      member: allAccessGroupsResponse.AccessGroupsMember?.length || 0,
      total: allAccessGroups.length
    });

    // Use default-key for DM conversations
    const messagesResponse = await getPaginatedDMThread({
      UserGroupOwnerPublicKeyBase58Check: userPublicKey,
      UserGroupKeyName: DEFAULT_KEY_MESSAGING_GROUP_NAME,
      PartyGroupOwnerPublicKeyBase58Check: otherUserPublicKey,
      PartyGroupKeyName: DEFAULT_KEY_MESSAGING_GROUP_NAME,
      MaxMessagesToFetch: maxMessages,
      StartTimestampString: (Date.now() * 1e6).toString() // Current time in nanos
    });
    
    log.debug('MESSAGES', 'Raw messages response', {
      messagesCount: messagesResponse?.ThreadMessages?.length || 0,
      hasProfiles: !!messagesResponse?.PublicKeyToProfileEntryResponse
    });
    
    if (!messagesResponse?.ThreadMessages || messagesResponse.ThreadMessages.length === 0) {
      log.warn('MESSAGES', 'No messages found in response');
      return [];
    }

    // Decrypt messages with retry logic
    const { decrypted } = await decryptAccessGroupMessagesWithRetry(
      userPublicKey,
      messagesResponse.ThreadMessages,
      allAccessGroups
    );

    log.debug('MESSAGES', 'Messages decrypted', {
      decryptedCount: decrypted.length,
      successfulDecryptions: decrypted.filter(d => !d.error).length,
      errors: decrypted.filter(d => d.error).length
    });

    // Log a sample decrypted message for debugging
    if (decrypted.length > 0) {
      log.debug('MESSAGES', 'Sample decrypted message structure', {
        hasDecryptedMessage: !!decrypted[0].DecryptedMessage,
        hasError: !!decrypted[0].error,
        hasMessageInfo: !!decrypted[0].MessageInfo,
        messageKeys: Object.keys(decrypted[0]),
        error: decrypted[0].error
      });
    }

    // Convert to DesoMessage format
    const messages: DesoMessage[] = [];
    
    for (const decryptedMessage of decrypted) {
      if (decryptedMessage?.MessageInfo) {
        const messageInfo = decryptedMessage.MessageInfo;
        const senderInfo = decryptedMessage.SenderInfo;
        const recipientInfo = decryptedMessage.RecipientInfo;
        
        // Extract decrypted text from the DecryptedMessageEntryResponse
        let messageText = '[Encrypted Message]';
        
        if (decryptedMessage.error) {
          // If there was an error decrypting, show the error or fallback
          log.warn('MESSAGES', 'Decryption error', decryptedMessage.error);
          messageText = '[Decryption Failed]';
        } else if (decryptedMessage.DecryptedMessage) {
          // Successfully decrypted message
          messageText = decryptedMessage.DecryptedMessage;
        } else if (messageInfo.ExtraData?.unencrypted === "true") {
          // Handle unencrypted messages
          try {
            const hexString = messageInfo.EncryptedText;
            const bytes = new Uint8Array(Buffer.from(hexString, 'hex'));
            messageText = new TextDecoder().decode(bytes);
          } catch (error) {
            log.warn('MESSAGES', 'Failed to decode unencrypted message', error);
            messageText = '[Decoding Failed]';
          }
        }
        
        const message: DesoMessage = {
          id: `${messageInfo.TimestampNanos}-${senderInfo.OwnerPublicKeyBase58Check}`,
          senderPublicKey: senderInfo.OwnerPublicKeyBase58Check,
          recipientPublicKey: recipientInfo.OwnerPublicKeyBase58Check,
          messageText,
          timestampNanos: messageInfo.TimestampNanos,
          isFromSender: senderInfo.OwnerPublicKeyBase58Check === userPublicKey,
          isEncrypted: !messageInfo.ExtraData?.unencrypted
        };
        
        messages.push(message);
      }
    }

    // Sort messages by timestamp (oldest first for chat display)
    messages.sort((a, b) => a.timestampNanos - b.timestampNanos);
    
    log.success('MESSAGES', `Retrieved ${messages.length} messages`);
    return messages;
    
  } catch (error) {
    log.error('MESSAGES', 'Failed to fetch messages', error);
    throw error;
  }
};

// Send message using deso-chat pattern
const sendMessageToUser = async (
  senderPublicKey: string,
  recipientPublicKey: string,
  messageText: string
): Promise<string> => {
  log.info('SEND_MESSAGE', 'Attempting to send message', {
    sender: senderPublicKey.slice(0, 8) + '...',
    recipient: recipientPublicKey.slice(0, 8) + '...',
    messageLength: messageText.length
  });

  try {
    if (!sendDMMessage || !checkPartyAccessGroups || !identity) {
      throw new Error('DeSo SDK not initialized');
    }

    // Check party access groups
    const response = await checkPartyAccessGroups({
      SenderPublicKeyBase58Check: senderPublicKey,
      SenderAccessGroupKeyName: DEFAULT_KEY_MESSAGING_GROUP_NAME,
      RecipientPublicKeyBase58Check: recipientPublicKey,
      RecipientAccessGroupKeyName: DEFAULT_KEY_MESSAGING_GROUP_NAME,
    });

    log.debug('SEND_MESSAGE', 'Party access groups response', response);

    // Handle the case where access groups don't exist (empty strings returned)
    const senderKeyName = response.SenderAccessGroupKeyName || DEFAULT_KEY_MESSAGING_GROUP_NAME;
    const recipientKeyName = response.RecipientAccessGroupKeyName || DEFAULT_KEY_MESSAGING_GROUP_NAME;
    const senderAccessGroupPublicKey = response.SenderAccessGroupPublicKeyBase58Check || senderPublicKey;
    const recipientAccessGroupPublicKey = response.RecipientAccessGroupPublicKeyBase58Check || recipientPublicKey;

    // Encrypt or encode message
    let message: string;
    let isUnencrypted = false;
    const ExtraData: { [k: string]: string } = {};
    
    if (response.IsRecipientAccessGroupKey && response.RecipientAccessGroupPublicKeyBase58Check) {
      // Encrypt the message using the recipient's access group public key
      log.debug('SEND_MESSAGE', 'Encrypting message for access group');
      message = await identity.encryptMessage(
        response.RecipientAccessGroupPublicKeyBase58Check,
        messageText
      );
    } else {
      // Send unencrypted (hex encoded) - fallback for users without access groups
      log.debug('SEND_MESSAGE', 'Sending unencrypted message');
      const { bytesToHex } = await import('@noble/hashes/utils');
      message = bytesToHex(new TextEncoder().encode(messageText));
      isUnencrypted = true;
      ExtraData["unencrypted"] = "true";
    }

    if (!message) {
      throw new Error('Error encrypting/encoding message');
    }

    // Prepare request body
    const requestBody = {
      SenderAccessGroupOwnerPublicKeyBase58Check: senderPublicKey,
      SenderAccessGroupPublicKeyBase58Check: senderAccessGroupPublicKey,
      SenderAccessGroupKeyName: senderKeyName,
      RecipientAccessGroupOwnerPublicKeyBase58Check: recipientPublicKey,
      RecipientAccessGroupPublicKeyBase58Check: recipientAccessGroupPublicKey,
      RecipientAccessGroupKeyName: recipientKeyName,
      ExtraData,
      EncryptedMessageText: message,
      MinFeeRateNanosPerKB: 1000,
    };

    log.debug('SEND_MESSAGE', 'Sending DM with request body', {
      ...requestBody,
      EncryptedMessageText: requestBody.EncryptedMessageText.slice(0, 20) + '...'
    });

    // Send the message
    const { submittedTransactionResponse } = await sendDMMessage(requestBody);

    if (!submittedTransactionResponse) {
      throw new Error('Failed to submit transaction for sending message.');
    }

    log.success('SEND_MESSAGE', 'Message sent successfully', {
      txnHash: submittedTransactionResponse.TxnHashHex
    });

    return submittedTransactionResponse.TxnHashHex;
    
  } catch (error) {
    log.error('SEND_MESSAGE', 'Failed to send message', error);
    throw error;
  }
};

export function useMessages(recipientPublicKey?: string) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<DesoMessage[]>([]);
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number | null>(null);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sdkInitialized = useRef(false);

  // Initialize SDK
  useEffect(() => {
    const initSDK = async () => {
      if (!sdkInitialized.current) {
        const initialized = await initializeDesoSDK();
        sdkInitialized.current = initialized;
      }
    };
    
    initSDK();
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!currentUser?.publicKey || !sdkInitialized.current) {
      log.warn('FETCH_CONVERSATIONS', 'User not authenticated or SDK not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const conversationList = await getConversationsWithProfiles(currentUser.publicKey);
      setConversations(conversationList);
      setLastRefresh(Date.now());
      log.success('FETCH_CONVERSATIONS', `Fetched ${conversationList.length} conversations`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversations';
      setError(errorMessage);
      log.error('FETCH_CONVERSATIONS', errorMessage, err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.publicKey]);

  // Fetch messages for specific conversation
  const fetchMessages = useCallback(async (otherUserPublicKey: string) => {
    if (!currentUser?.publicKey || !sdkInitialized.current) {
      log.warn('FETCH_MESSAGES', 'User not authenticated or SDK not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const messageList = await getMessagesForConversation(
        currentUser.publicKey,
        otherUserPublicKey
      );
      setMessages(messageList);
      setLastRefresh(Date.now());
      log.success('FETCH_MESSAGES', `Fetched ${messageList.length} messages`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      log.error('FETCH_MESSAGES', errorMessage, err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.publicKey]);

  // Send message
  const sendMessage = useCallback(async (payload: SendMessagePayload): Promise<boolean> => {
    if (!currentUser?.publicKey || !sdkInitialized.current) {
      log.warn('SEND_MESSAGE', 'User not authenticated or SDK not initialized');
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      const txnHash = await sendMessageToUser(
        currentUser.publicKey,
        payload.recipientPublicKey,
        payload.messageText
      );
      
      if (txnHash) {
        // Wait a moment for the transaction to propagate
        setTimeout(async () => {
          // Refresh messages after sending
          await fetchMessages(payload.recipientPublicKey);
          // Refresh conversations to update last message
          await fetchConversations();
        }, 2000);
      }
      
      return !!txnHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      log.error('SEND_MESSAGE', errorMessage, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.publicKey, fetchMessages, fetchConversations]);

  // Start polling for new messages
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;
    
    setIsPolling(true);
    pollingIntervalRef.current = setInterval(() => {
      if (recipientPublicKey) {
        fetchMessages(recipientPublicKey);
      } else {
        fetchConversations();
      }
    }, 10000); // Poll every 10 seconds
    
    log.info('POLLING', 'Started message polling');
  }, [recipientPublicKey, fetchMessages, fetchConversations]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsPolling(false);
      log.info('POLLING', 'Stopped message polling');
    }
  }, []);

  // Auto-fetch on mount and when recipient changes
  useEffect(() => {
    if (currentUser?.publicKey && sdkInitialized.current) {
      if (recipientPublicKey) {
        fetchMessages(recipientPublicKey);
      } else {
        fetchConversations();
      }
    }
  }, [currentUser?.publicKey, recipientPublicKey, fetchMessages, fetchConversations]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    messages,
    conversations,
    loading,
    error,
    isPolling,
    lastRefresh,
    sendMessage,
    fetchMessages,
    fetchConversations,
    startPolling,
    stopPolling,
    refreshMessages: () => {
      if (recipientPublicKey) {
        fetchMessages(recipientPublicKey);
      } else {
        fetchConversations();
      }
    }
  };
} 