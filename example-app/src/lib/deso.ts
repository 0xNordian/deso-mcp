import { configure } from 'deso-protocol';

// Configure DeSo SDK with messaging permissions
export const initializeDeSoConfig = () => {
  configure({
    // Permissions for derived keys
    spendingLimitOptions: {
      GlobalDESOLimit: 1 * 1e9, // 1 DeSo in nanos
      TransactionCountLimitMap: {
        BASIC_TRANSFER: 2,
        SUBMIT_POST: 4,
        FOLLOW: 10,
      }
    },
    
    // Node URI (defaults to https://node.deso.org)
    nodeURI: process.env.NEXT_PUBLIC_DESO_NODE_URL || 'https://node.deso.org',
    
    // App configuration
    appName: 'DeSo Messaging App',
    
    // Fee rate
    MinFeeRateNanosPerKB: 1000
  });
};

// Initialize config on module load
initializeDeSoConfig(); 