import { configure } from 'deso-protocol';

// Define UNLIMITED constant to match DeSo types
const UNLIMITED = 'UNLIMITED' as const;

// Get transaction spending limits with proper access group configuration (based on deso-chat)
const getTransactionSpendingLimits = (publicKey: string = '') => {
  return {
    GlobalDESOLimit: 5 * 1e9, // 5 DeSo in nanos (same as deso-chat)
    TransactionCountLimitMap: {
      // Core messaging permissions (using UNLIMITED constant)
      NEW_MESSAGE: UNLIMITED,
      
      // Access group management for messaging
      ACCESS_GROUP: UNLIMITED,
      ACCESS_GROUP_MEMBERS: UNLIMITED,
      
      // Derived key authorization
      AUTHORIZE_DERIVED_KEY: 1,
      
      // Basic social interactions
      BASIC_TRANSFER: UNLIMITED,
      SUBMIT_POST: UNLIMITED,
      FOLLOW: UNLIMITED,
      LIKE: UNLIMITED,
      
      // Creator coin interactions
      CREATOR_COIN: UNLIMITED,
      CREATOR_COIN_TRANSFER: UNLIMITED,
      
      // NFT interactions
      CREATE_NFT: UNLIMITED,
      UPDATE_NFT: UNLIMITED,
      NFT_BID: UNLIMITED,
      ACCEPT_NFT_BID: UNLIMITED,
    },
    // Access group limits for messaging (critical for DeSo messaging)
    AccessGroupLimitMap: [
      {
        AccessGroupOwnerPublicKeyBase58Check: publicKey,
        ScopeType: 'Any' as const,
        AccessGroupKeyName: '',
        OperationType: 'Any' as const,
        OpCount: UNLIMITED,
      },
    ],
    AccessGroupMemberLimitMap: [
      {
        AccessGroupOwnerPublicKeyBase58Check: publicKey,
        ScopeType: 'Any' as const,
        AccessGroupKeyName: '',
        OperationType: 'Any' as const,
        OpCount: UNLIMITED,
      },
    ],
  };
};

// Configure DeSo SDK with comprehensive messaging permissions
export const initializeDeSoConfig = () => {
  configure({
    // Use the same spending limit function as deso-chat
    spendingLimitOptions: getTransactionSpendingLimits(''),
    
    // Node URI (defaults to https://node.deso.org)
    nodeURI: process.env.NEXT_PUBLIC_DESO_NODE_URL || 'https://node.deso.org',
    
    // App configuration for proper derived key identification
    appName: 'DeSo Messaging App',
    
    // Network configuration
    network: 'mainnet',
    
    // Identity configuration
    identityURI: process.env.NEXT_PUBLIC_IDENTITY_URL || 'https://identity.deso.org',
    
    // JWT algorithm for authentication
    jwtAlgorithm: 'ES256',
    
    // Show skip option for users without funds (like deso-chat)
    showSkip: true,
  });
};

// Export the spending limits function for use in AuthProvider
export { getTransactionSpendingLimits };

// Initialize config on module load
initializeDeSoConfig(); 