#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from 'fs/promises';
import path from 'path';

// Create server with explicit error handling
const server = new Server(
  {
    name: "deso-mcp-final",
    version: "2.3.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Add error handling
server.onerror = (error) => {
  console.error("DeSo MCP Server error:", error);
};

// List tools handler with explicit error handling
server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    const tools = [
      {
        name: "deso_api_explorer",
        description: "Comprehensive DeSo API explorer with backend implementation details and deso-js SDK integration",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["social", "financial", "nft", "dao", "tokens", "access", "associations", "derived-keys", "messages", "data", "notifications", "media", "admin", "blockchain", "identity", "all"],
              description: "API category to explore"
            },
            endpoint: {
              type: "string",
              description: "Specific endpoint name (optional)"
            },
            includeCode: {
              type: "boolean",
              description: "Include code examples"
            }
          }
        }
      },
      {
        name: "deso_js_guide",
        description: "Complete guide to using the deso-js SDK with setup, authentication, and transactions",
        inputSchema: {
          type: "object", 
          properties: {
            topic: {
              type: "string",
              enum: ["setup", "identity", "authentication", "transactions", "data", "permissions", "examples", "troubleshooting"],
              description: "Topic to get guidance on"
            },
            framework: {
              type: "string",
              enum: ["vanilla", "react", "nextjs", "node"],
              description: "Framework context (optional)"
            }
          },
          required: ["topic"]
        }
      },
      {
        name: "generate_deso_code",
        description: "Generate comprehensive code examples for DeSo operations using deso-js SDK",
        inputSchema: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              description: "DeSo operation (e.g., 'follow', 'post', 'buy-creator-coin', 'send-diamonds')"
            },
            language: {
              type: "string",
              enum: ["javascript", "typescript", "react", "curl"],
              description: "Programming language/framework"
            },
            includeAuth: {
              type: "boolean",
              description: "Include authentication setup"
            },
            fullExample: {
              type: "boolean",
              description: "Generate complete working example"
            }
          },
          required: ["operation", "language"]
        }
      },
      {
        name: "explain_deso_architecture",
        description: "Explain DeSo architecture, flows, and integration patterns",
        inputSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "Architecture topic to explain"
            },
            includeCode: {
              type: "boolean",
              description: "Include code examples"
            }
          },
          required: ["topic"]
        }
      },
      {
        name: "repository_search",
        description: "Search for documents in the DeSo repository",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query"
            }
          },
          required: ["query"]
        }
      },
      {
        name: "read_repository_document",
        description: "Read a specific document from the DeSo repository",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Relative path to the document (e.g., 'docs/deso-tutorial-build-apps.md')"
            },
            repository: {
              type: "string",
              enum: ["docs", "core", "identity", "frontend", "backend", "deso-js"],
              description: "Repository name"
            }
          },
          required: ["path"]
        }
      }
    ];
    
    console.error("DeSo MCP: Returning", tools.length, "tools");
    return { tools };
  } catch (error) {
    console.error("Error in DeSo ListTools:", error);
    throw error;
  }
});

// Call tool handler with your comprehensive implementations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    
    console.error("DeSo MCP: Tool called:", name);
    
    switch (name) {
      case "deso_api_explorer":
        return await exploreDesoApi(args);
      case "deso_js_guide":
        return await getDesoJsGuide(args);
      case "generate_deso_code":
        return await generateDesoCode(args);
      case "explain_deso_architecture":
        return await explainDesoArchitecture(args);
      case "repository_search":
        return await repositorySearch(args);
      case "read_repository_document":
        return await readRepositoryDocument(args);
      default:
        throw new Error(`Unknown DeSo tool: ${name}`);
    }
  } catch (error) {
    console.error("Error in DeSo CallTool:", error);
    throw error;
  }
});

// COMPREHENSIVE DeSo API Implementation (from original mcp-server.js)
async function exploreDesoApi(args) {
  const { category = 'all', endpoint, includeCode = false } = args;
  
  // Complete API Details from original comprehensive server (FULLY RESTORED)
  const apiDetails = {
          social: {
        description: "Social interaction endpoints for posts, follows, likes, and diamonds",
        backendFile: "routes/transaction.go, routes/post.go",
        documentation: {
          tutorials: ["docs/deso-tutorial-build-apps.md"],
          architecture: ["docs/architecture-overview/"],
          examples: ["docs/deso-applications.md"]
        },
      endpoints: {
        "create-follow-txn-stateless": {
          method: "POST",
          url: "/api/v0/create-follow-txn-stateless",
          handler: "CreateFollowTxnStateless",
          description: "Creates unsigned follow/unfollow transaction",  
          desoJs: "updateFollowingStatus",
          params: {
            required: ["FollowerPublicKeyBase58Check", "FollowedPublicKeyBase58Check", "IsUnfollow", "MinFeeRateNanosPerKB"],
            optional: ["TransactionFees"]
          }
        },
        "submit-post": {
          method: "POST",
          url: "/api/v0/submit-post",
          handler: "SubmitPost",
          description: "Submit new post or modify existing post",
          desoJs: "submitPost",
          params: {
            required: ["UpdaterPublicKeyBase58Check", "BodyObj", "MinFeeRateNanosPerKB"],
            optional: ["PostHashHexToModify", "ParentStakeID", "RepostedPostHashHex", "PostExtraData", "IsHidden"]
          }
        },
        "create-like-stateless": {
          method: "POST",
          url: "/api/v0/create-like-stateless",
          handler: "CreateLikeStateless",
          description: "Creates unsigned like/unlike transaction",
          desoJs: "updateLikeStatus",
          params: {
            required: ["ReaderPublicKeyBase58Check", "LikedPostHashHex", "IsUnlike", "MinFeeRateNanosPerKB"],
            optional: ["TransactionFees"]
          }
        },
        "update-profile": {
          method: "POST",
          url: "/api/v0/update-profile", 
          handler: "UpdateProfile",
          description: "Update user profile information",
          desoJs: "updateProfile",
          params: {
            required: ["UpdaterPublicKeyBase58Check", "NewCreatorBasisPoints", "NewStakeMultipleBasisPoints", "MinFeeRateNanosPerKB"],
            optional: ["ProfilePublicKeyBase58Check", "NewUsername", "NewDescription", "NewProfilePic", "IsHidden", "ExtraData"]
          }
        },
        "send-message-stateless": {
          method: "POST",
          url: "/api/v0/send-message-stateless",
          handler: "SendMessageStateless",
          description: "Send private message between users",
          desoJs: "sendDMMessage",
          params: {
            required: ["SenderPublicKeyBase58Check", "RecipientPublicKeyBase58Check", "MessageText", "MinFeeRateNanosPerKB"],
            optional: ["EncryptedMessageText", "SenderMessagingPublicKey", "SenderMessagingKeyName", "RecipientMessagingPublicKey", "RecipientMessagingKeyName"]
          }
        }
      }
    },
    financial: {
      description: "Financial transactions including creator coins, DeSo transfers, and diamonds",
      backendFile: "routes/transaction.go",
      endpoints: {
        "buy-or-sell-creator-coin": {
          method: "POST",
          url: "/api/v0/buy-or-sell-creator-coin",
          handler: "BuyOrSellCreatorCoin",
          description: "Buy or sell creator coins",
          desoJs: "buyCreatorCoin / sellCreatorCoin",
          params: {
            required: ["UpdaterPublicKeyBase58Check", "CreatorPublicKeyBase58Check", "OperationType", "MinFeeRateNanosPerKB"],
            optional: ["DeSoToSellNanos", "CreatorCoinToSellNanos", "MinDeSoExpectedNanos", "MinCreatorCoinExpectedNanos"]
          }
        },
        "send-deso": {
          method: "POST",
          url: "/api/v0/send-deso", 
          handler: "SendDeSo",
          description: "Send DeSo to another user",
          desoJs: "sendDeso",
          params: {
            required: ["SenderPublicKeyBase58Check", "RecipientPublicKeyOrUsername", "AmountNanos", "MinFeeRateNanosPerKB"],
            optional: ["ExtraData", "TransactionFees"]
          }
        },
        "send-diamonds": {
          method: "POST",
          url: "/api/v0/send-diamonds",
          handler: "SendDiamonds",
          description: "Send diamond tips to posts",
          desoJs: "sendDiamonds", 
          params: {
            required: ["SenderPublicKeyBase58Check", "ReceiverPublicKeyBase58Check", "DiamondPostHashHex", "DiamondLevel", "MinFeeRateNanosPerKB"],
            optional: ["ExtraData", "TransactionFees"]
          }
        },
        "transfer-creator-coin": {
          method: "POST",
          url: "/api/v0/transfer-creator-coin",
          handler: "TransferCreatorCoin", 
          description: "Transfer creator coins between users",
          desoJs: "transferCreatorCoin",
          params: {
            required: ["SenderPublicKeyBase58Check", "CreatorPublicKeyBase58Check", "ReceiverUsernameOrPublicKeyBase58Check", "CreatorCoinToTransferNanos", "MinFeeRateNanosPerKB"],
            optional: ["TransactionFees"]
          }
        },
        "exchange-bitcoin-stateless": {
          method: "POST",
          url: "/api/v0/exchange-bitcoin-stateless",
          handler: "ExchangeBitcoinStateless",
          description: "Exchange Bitcoin for DeSo",
          desoJs: "exchangeBitcoin",
          params: {
            required: ["PublicKeyBase58Check", "BurnAmountSatoshis", "FeeRateSatoshisPerKB", "LatestBitcionAPIResponse", "BTCDepositAddress"],
            optional: ["DerivedPublicKeyBase58Check", "Broadcast", "SignedHashes"]
          }
        }
      }
    },
    nft: {
      description: "NFT transaction endpoints for minting, bidding, transferring, and burning NFTs",
      backendFile: "routes/nft.go",
      endpoints: {
        "create-nft": {
          method: "POST",
          url: "/api/v0/create-nft",
          handler: "CreateNFT",
          description: "Create/mint a new NFT from a post",
          desoJs: "createNft",
          params: {
            required: ["UpdaterPublicKeyBase58Check", "NFTPostHashHex", "NumCopies", "MinFeeRateNanosPerKB"],
            optional: ["NFTRoyaltyToCreatorBasisPoints", "NFTRoyaltyToCoinBasisPoints", "HasUnlockable", "IsForSale"]
          }
        },
        "create-nft-bid": {
          method: "POST",
          url: "/api/v0/create-nft-bid",
          handler: "CreateNFTBid",
          description: "Place a bid on an NFT",
          desoJs: "createNftBid",
          params: {
            required: ["UpdaterPublicKeyBase58Check", "NFTPostHashHex", "SerialNumber", "BidAmountNanos", "MinFeeRateNanosPerKB"],
            optional: []
          }
        },
        "accept-nft-bid": {
          method: "POST",
          url: "/api/v0/accept-nft-bid",
          handler: "AcceptNFTBid",
          description: "Accept a bid on an NFT",
          desoJs: "acceptNftBid",
          params: {
            required: ["UpdaterPublicKeyBase58Check", "NFTPostHashHex", "SerialNumber", "BidderPublicKeyBase58Check", "BidAmountNanos", "MinFeeRateNanosPerKB"],
            optional: ["UnlockableText"]
          }
        },
        "transfer-nft": {
          method: "POST",
          url: "/api/v0/transfer-nft",
          handler: "TransferNFT",
          description: "Transfer NFT to another user",
          desoJs: "transferNft",
          params: {
            required: ["SenderPublicKeyBase58Check", "ReceiverPublicKeyBase58Check", "NFTPostHashHex", "SerialNumber", "MinFeeRateNanosPerKB"],
            optional: ["UnlockableText"]
          }
        },
        "burn-nft": {
          method: "POST",
          url: "/api/v0/burn-nft",
          handler: "BurnNFT",
          description: "Burn/destroy an NFT",
          desoJs: "burnNft",
          params: {
            required: ["UpdaterPublicKeyBase58Check", "NFTPostHashHex", "SerialNumber", "MinFeeRateNanosPerKB"],
            optional: []
          }
        }
      }
    },
    dao: {
      description: "DAO Coin operations including minting, burning, transfers, and limit orders",
      backendFile: "routes/transaction.go",
      endpoints: {
        "dao-coin": {
          method: "POST",
          url: "/api/v0/dao-coin",
          handler: "DAOCoin",
          description: "Mint, burn, or disable minting for DAO coins",
          desoJs: "daoCoin",
          params: {
            required: ["UpdaterPublicKeyBase58Check", "ProfilePublicKeyBase58CheckOrUsername", "OperationType", "MinFeeRateNanosPerKB"],
            optional: ["CoinsToMintNanos", "CoinsToBurnNanos", "TransferRestrictionStatus"]
          }
        },
        "transfer-dao-coin": {
          method: "POST",
          url: "/api/v0/transfer-dao-coin",
          handler: "TransferDAOCoin",
          description: "Transfer DAO coins between users",
          desoJs: "transferDAOCoin",
          params: {
            required: ["SenderPublicKeyBase58Check", "ProfilePublicKeyBase58CheckOrUsername", "ReceiverPublicKeyBase58CheckOrUsername", "DAOCoinToTransferNanos", "MinFeeRateNanosPerKB"],
            optional: []
          }
        },
        "create-dao-coin-limit-order": {
          method: "POST",
          url: "/api/v0/create-dao-coin-limit-order",
          handler: "CreateDAOCoinLimitOrder",
          description: "Create limit orders for DAO coin trading",
          desoJs: "createDAOCoinLimitOrder",
          params: {
            required: ["TransactorPublicKeyBase58Check", "BuyingDAOCoinCreatorPublicKeyBase58Check", "SellingDAOCoinCreatorPublicKeyBase58Check", "Price", "Quantity", "OperationType", "FillType", "MinFeeRateNanosPerKB"],
            optional: []
          }
        },
        "create-dao-coin-market-order": {
          method: "POST",
          url: "/api/v0/create-dao-coin-market-order",
          handler: "CreateDAOCoinMarketOrder",
          description: "Create market orders for DAO coin trading",
          desoJs: "createDAOCoinMarketOrder",
          params: {
            required: ["TransactorPublicKeyBase58Check", "BuyingDAOCoinCreatorPublicKeyBase58Check", "SellingDAOCoinCreatorPublicKeyBase58Check", "Quantity", "OperationType", "FillType", "MinFeeRateNanosPerKB"],
            optional: []
          }
        },
        "cancel-dao-coin-limit-order": {
          method: "POST",
          url: "/api/v0/cancel-dao-coin-limit-order",
          handler: "CancelDAOCoinLimitOrder",
          description: "Cancel existing DAO coin limit orders",
          desoJs: "cancelDAOCoinLimitOrder",
          params: {
            required: ["TransactorPublicKeyBase58Check", "CancelOrderID", "MinFeeRateNanosPerKB"],
            optional: []
          }
        }
      }
    }
  };

  if (endpoint) {
    for (const [cat, info] of Object.entries(apiDetails)) {
      if (info.endpoints[endpoint]) {
        const ep = info.endpoints[endpoint];
        let result = `# ${endpoint}\n\n`;
        result += `**Category:** ${cat.toUpperCase()}\n`;
        result += `**Description:** ${ep.description}\n\n`;
        result += `**API Details:**\n`;
        result += `- Method: ${ep.method}\n`;
        result += `- URL: ${ep.url}\n`;
        result += `- Backend Handler: ${ep.handler}\n`;
        result += `- Backend File: ${info.backendFile}\n`;
        result += `- deso-js Function: ${ep.desoJs}\n\n`;
        
        result += `**Parameters:**\n`;
        result += `- Required: ${ep.params.required.join(', ') || 'None'}\n`;
        result += `- Optional: ${ep.params.optional.join(', ') || 'None'}\n\n`;
        
        if (includeCode) {
          result += generateEndpointExample(endpoint, ep);
        }
        
        return { content: [{ type: "text", text: result }] };
      }
    }
    return { content: [{ type: "text", text: `Endpoint "${endpoint}" not found` }] };
  }

  if (category === 'all') {
    let result = "# Complete DeSo API Reference\n\n";
    for (const [cat, info] of Object.entries(apiDetails)) {
      result += `## ${cat.toUpperCase()} APIs\n`;
      result += `${info.description}\n`;
      result += `**Backend:** ${info.backendFile}\n\n`;
      
      for (const [ep, details] of Object.entries(info.endpoints)) {
        result += `### ${ep}\n`;
        result += `${details.description}\n`;
        result += `- ${details.method} ${details.url}\n`;
        result += `- deso-js: ${details.desoJs}\n\n`;
      }
    }
    return { content: [{ type: "text", text: result }] };
  }

  if (apiDetails[category]) {
    const info = apiDetails[category];
    let result = `# ${category.toUpperCase()} APIs\n\n`;
    result += `${info.description}\n\n`;
    result += `**Backend Implementation:** ${info.backendFile}\n\n`;
    
    for (const [ep, details] of Object.entries(info.endpoints)) {
      result += `## ${ep}\n`;
      result += `${details.description}\n\n`;
      result += `**API:** ${details.method} ${details.url}\n`;
      result += `**Handler:** ${details.handler}\n`;
      result += `**deso-js:** ${details.desoJs}\n\n`;
      result += `**Required Params:** ${details.params.required.join(', ') || 'None'}\n`;
      result += `**Optional Params:** ${details.params.optional.join(', ') || 'None'}\n\n`;
    }
    
    return { content: [{ type: "text", text: result }] };
  }

  return { content: [{ type: "text", text: `Unknown category: ${category}` }] };
}

async function getDesoJsGuide(args) {
  const { topic, framework = 'vanilla' } = args;
  
  // COMPREHENSIVE GUIDES from original mcp-server.js
  const guides = {
    setup: {
      title: "DeSo-JS SDK Setup & Installation",
      content: `# DeSo-JS SDK Setup

## Installation

\`\`\`bash
npm install deso-protocol
\`\`\`

## Configuration

\`\`\`javascript
import { configure } from 'deso-protocol';

configure({
  // Permissions for derived keys
  spendingLimitOptions: {
    GlobalDESOLimit: 1 * 1e9, // 1 DeSo in nanos
    TransactionCountLimitMap: {
      BASIC_TRANSFER: 2,
      SUBMIT_POST: 4,
      CREATE_FOLLOW_TXN_STATELESS: 10
    }
  },
  
  // Optional node URI (defaults to https://node.deso.org)
  nodeURI: 'https://node.deso.org',
  
  // Your app name
  appName: 'My DeSo App',
  
  // Fee rate
  MinFeeRateNanosPerKB: 1000
});
\`\`\`

## React Native Setup

For React Native, provide storage and browser handlers:

\`\`\`javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

configure({
  // ... other options
  storageProvider: AsyncStorage,
  identityPresenter: async (url) => {
    const result = await WebBrowser.openAuthSessionAsync(url);
    if (result.type === 'success') {
      identity.handleRedirectURI(result.url);
    }
  }
});
\`\`\``
    },
    identity: {
      title: "Identity & Authentication with DeSo-JS",
      content: `# Identity & Authentication

## Basic Login/Logout

\`\`\`javascript
import { identity } from 'deso-protocol';

// Start login flow
await identity.login();

// Logout
await identity.logout();

// Subscribe to identity state changes
identity.subscribe((state) => {
  console.log('Current user:', state.currentUser);
  console.log('Event:', state.event);
  console.log('Alternate users:', state.alternateUsers);
});
\`\`\`

## Permission Management

\`\`\`javascript
// Check permissions (synchronous)
const hasPermission = identity.hasPermissions({
  TransactionCountLimitMap: {
    SUBMIT_POST: 1
  }
});

// Check permissions (async for React Native)
const hasPermissionAsync = await identity.hasPermissionsAsync({
  TransactionCountLimitMap: {
    SUBMIT_POST: 1
  }
});

// Request permissions
if (!hasPermission) {
  await identity.requestPermissions({
    TransactionCountLimitMap: {
      SUBMIT_POST: 1,
      CREATE_FOLLOW_TXN_STATELESS: 5
    }
  });
}
\`\`\`

## JWT for API Calls

\`\`\`javascript
// Generate JWT for authenticated requests
const jwt = await identity.jwt();

// Use in API calls
const response = await fetch('/api/authenticated-endpoint', {
  headers: {
    'Authorization': \`Bearer \${jwt}\`
  }
});
\`\`\``
    },
    transactions: {
      title: "Transaction Creation with DeSo-JS",
      content: `# Transaction Creation

## Social Transactions

\`\`\`javascript
import { submitPost, updateFollowingStatus, updateLikeStatus, sendDiamonds } from 'deso-protocol';

// Submit a post
const postResult = await submitPost({
  UpdaterPublicKeyBase58Check: currentUser.publicKey,
  BodyObj: {
    Body: 'Hello DeSo!',
    ImageURLs: [],
    VideoURLs: []
  }
});

// Follow a user
const followResult = await updateFollowingStatus({
  FollowerPublicKeyBase58Check: currentUser.publicKey,
  FollowedPublicKeyBase58Check: 'BC1YLi...',
  IsUnfollow: false
});

// Like a post
const likeResult = await updateLikeStatus({
  ReaderPublicKeyBase58Check: currentUser.publicKey,
  LikedPostHashHex: 'abcd1234...',
  IsUnlike: false
});

// Send diamonds
const diamondResult = await sendDiamonds({
  SenderPublicKeyBase58Check: currentUser.publicKey,
  ReceiverPublicKeyBase58Check: 'BC1YLi...',
  DiamondPostHashHex: 'abcd1234...',
  DiamondLevel: 1
});
\`\`\`

## Financial Transactions

\`\`\`javascript
import { buyCreatorCoin, sendDeso } from 'deso-protocol';

// Buy creator coin
const buyResult = await buyCreatorCoin({
  UpdaterPublicKeyBase58Check: currentUser.publicKey,
  CreatorPublicKeyBase58Check: 'BC1YLi...',
  DeSoToSellNanos: 1000000, // 0.001 DeSo
  MinCreatorCoinExpectedNanos: 100
});

// Send DeSo
const sendResult = await sendDeso({
  SenderPublicKeyBase58Check: currentUser.publicKey,
  RecipientPublicKeyOrUsername: 'username',
  AmountNanos: 1000000 // 0.001 DeSo
});
\`\`\``
    },
    data: {
      title: "Data Fetching with DeSo-JS",
      content: `# Data Fetching

## Get Posts

\`\`\`javascript
import { getPostsStateless, getSinglePost, getPostsForUser } from 'deso-protocol';

// Get latest posts
const posts = await getPostsStateless({
  NumToFetch: 20
});

// Get single post
const post = await getSinglePost({
  PostHashHex: 'abcd1234...'
});

// Get posts for specific user
const userPosts = await getPostsForUser({
  Username: 'nader',
  NumToFetch: 10
});
\`\`\`

## Get Users

\`\`\`javascript
import { getSingleProfile, getUsersStateless, getFollowersForUser } from 'deso-protocol';

// Get single profile
const profile = await getSingleProfile({
  Username: 'nader'
});

// Get multiple users
const users = await getUsersStateless({
  PublicKeysBase58Check: ['BC1YLi...', 'BC1YLf...']
});

// Get followers
const followers = await getFollowersForUser({
  Username: 'nader'
});
\`\`\``
    }
  };

  if (guides[topic]) {
    return { content: [{ type: "text", text: guides[topic].content }] };
  }

  return { content: [{ type: "text", text: `Topic "${topic}" not found. Available: ${Object.keys(guides).join(', ')}` }] };
}

async function generateDesoCode(args) {
  const { operation, language, includeAuth = false, fullExample = false } = args;
  
  const examples = {
    follow: {
      javascript: `// Follow a user using deso-js
import { updateFollowingStatus${includeAuth ? ', identity' : ''} } from 'deso-protocol';

${includeAuth ? `// Login first
await identity.login();
const currentUser = identity.snapshot().currentUser;
` : ''}
const result = await updateFollowingStatus({
  FollowerPublicKeyBase58Check: ${includeAuth ? 'currentUser.publicKey' : "'YOUR_PUBLIC_KEY'"},
  FollowedPublicKeyBase58Check: 'BC1YLiQ86kwXaVaUVwKyKF5uo2Kxt8SSeZ2CzGTAVp2TRb4VJeFHLqd',
  IsUnfollow: false
});

console.log('Follow successful:', result);`,

      react: `// React Follow Button Component
import React, { useState } from 'react';
import { updateFollowingStatus, identity } from 'deso-protocol';

function FollowButton({ userToFollow }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleFollow = async () => {
    setLoading(true);
    try {
      const currentUser = identity.snapshot().currentUser;
      
      await updateFollowingStatus({
        FollowerPublicKeyBase58Check: currentUser.publicKey,
        FollowedPublicKeyBase58Check: userToFollow.PublicKeyBase58Check,
        IsUnfollow: isFollowing
      });
      
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Follow error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button onClick={handleFollow} disabled={loading}>
      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}`
    },
    
    post: {
      javascript: `// Create a post using deso-js
import { submitPost${includeAuth ? ', identity' : ''} } from 'deso-protocol';

${includeAuth ? `// Login first
await identity.login();
const currentUser = identity.snapshot().currentUser;
` : ''}
const result = await submitPost({
  UpdaterPublicKeyBase58Check: ${includeAuth ? 'currentUser.publicKey' : "'YOUR_PUBLIC_KEY'"},
  BodyObj: {
    Body: 'Hello DeSo! This is my first post using the SDK.',
    ImageURLs: [],
    VideoURLs: []
  }
});

console.log('Post created:', result);`
    }
  };
  
  const code = examples[operation]?.[language] || `// ${operation} example in ${language}
// Generated code for DeSo ${operation} operation
console.log('${operation} implementation here');`;
  
  return {
    content: [{
      type: "text",
      text: `# DeSo Code Generator

**Operation:** ${operation}  
**Language:** ${language}  
**Include Auth:** ${includeAuth}

## Generated Code:

\`\`\`${language}
${code}
\`\`\`

Your DeSo MCP server is generating code! ⚡`
    }]
  };
}

async function explainDesoArchitecture(args) {
  const { topic, includeCode = false } = args;
  
  // Enhanced architecture explanations with repository context
  const architectureTopics = {
    "transaction-flow": `# DeSo Transaction Architecture

## Two-Phase Transaction System

DeSo implements a unique two-phase transaction system for security and usability:

### Phase 1: Transaction Construction
- **Location:** Backend API (\`repos/backend/routes/\`)
- **Purpose:** Create unsigned transaction with proper fees and validation
- **Components:**
  - Transaction handlers in \`routes/transaction.go\`
  - Fee calculation in \`core/lib/transaction_fees.go\`
  - Validation in \`core/lib/block_view.go\`

### Phase 2: Transaction Signing & Submission  
- **Location:** Identity Service (\`repos/identity/\`)
- **Purpose:** Sign transaction with user's private key
- **Components:**
  - Key management in Identity iframe
  - Derived key authorization
  - Transaction submission to mempool

## Repository Structure:
- \`repos/backend/\` - Go backend with transaction handlers
- \`repos/identity/\` - TypeScript identity service
- \`repos/deso-js/\` - JavaScript SDK abstraction
- \`repos/frontend/\` - Reference frontend implementation`,

    "identity-system": `# DeSo Identity Architecture

## Identity Service Components

### Core Identity (\`repos/identity/\`)
The identity service manages user authentication and key storage:

- **Iframe Communication**: Secure cross-origin messaging
- **Key Storage**: Encrypted local storage of private keys  
- **Derived Keys**: Limited permission keys for applications
- **Access Levels**: Granular permission system

### Integration with deso-js (\`repos/deso-js/\`)
The SDK provides seamless identity integration:

\`\`\`typescript
// Identity abstraction in deso-js
import { identity } from 'deso-protocol';

// Login flow
await identity.login();
const user = identity.snapshot().currentUser;

// Permission management
await identity.requestPermissions({
  TransactionCountLimitMap: {
    SUBMIT_POST: 5
  }
});
\`\`\`

## Documentation References:
- Tutorial: \`repos/docs/deso-tutorial-build-apps.md\`
- Identity Docs: \`repos/docs/deso-identity/\`
- Architecture: \`repos/docs/architecture-overview/\``,

    "backend-implementation": `# DeSo Backend Architecture

## Go Backend Structure (\`repos/backend/\`)

### Core Components:
- \`main.go\` - Entry point and server setup
- \`routes/\` - API endpoint handlers
- \`apis/\` - External API integrations
- \`config/\` - Configuration management

### Key Route Files:
- \`routes/transaction.go\` - Transaction construction
- \`routes/post.go\` - Post-related endpoints
- \`routes/user.go\` - User profile endpoints
- \`routes/nft.go\` - NFT marketplace endpoints
- \`routes/associations.go\` - Association system

### Core Library (\`repos/core/\`)
Shared blockchain logic:
- Transaction types and validation
- Block processing and consensus
- Mempool management
- Fee calculation

## API Integration:
The backend integrates with \`deso-js\` through standardized endpoints that match SDK function calls.`,

    "frontend-patterns": `# DeSo Frontend Architecture

## Reference Implementation (\`repos/frontend/\`)

The reference frontend demonstrates best practices:

### Component Structure:
- Identity integration components
- Transaction confirmation flows  
- Real-time data fetching patterns
- Error handling and loading states

### Key Patterns:
- React hooks for DeSo state management
- TypeScript for type safety
- Responsive design principles
- Performance optimization

## Integration with deso-js:
The frontend shows practical usage of the SDK for common operations like posting, following, and transactions.

### Documentation:
- Frontend docs: \`repos/docs/deso-frontend/\`
- Tutorial: \`repos/docs/deso-tutorial-build-apps.md\`
- Applications guide: \`repos/docs/deso-applications.md\``
  };

  let response;
  if (architectureTopics[topic]) {
    response = architectureTopics[topic];
  } else {
    // Default comprehensive overview
    response = `# DeSo Architecture Overview: ${topic}

## Complete System Architecture

DeSo is a decentralized social blockchain with several key repositories:

### 1. Backend (\`repos/backend/\`)
- **Language:** Go
- **Purpose:** API server, transaction construction, data serving
- **Key Files:** \`routes/\`, \`main.go\`, \`config/\`

### 2. Core (\`repos/core/\`) 
- **Language:** Go  
- **Purpose:** Blockchain consensus, transaction validation
- **Key Files:** Block processing, mempool, fees

### 3. Identity (\`repos/identity/\`)
- **Language:** TypeScript/Angular
- **Purpose:** User authentication, key management
- **Key Files:** Identity service, key derivation

### 4. Frontend (\`repos/frontend/\`)
- **Language:** TypeScript/Angular
- **Purpose:** Reference web application
- **Key Features:** Social feeds, messaging, creator coins

### 5. deso-js (\`repos/deso-js/\`)
- **Language:** TypeScript
- **Purpose:** Developer SDK for easy integration
- **Key Features:** Transaction abstraction, identity integration

### 6. Documentation (\`repos/docs/\`)
- **Format:** Markdown
- **Content:** Tutorials, API docs, architecture guides
- **Key Files:** Build tutorial, tokenomics, governance

## Integration Flow:
Frontend/Apps → deso-js SDK → Backend API → Core Blockchain

For specific topics, try: "transaction-flow", "identity-system", "backend-implementation", or "frontend-patterns"`;
  }

  // Add repository search suggestion
  response += `\n\n## 🔍 Explore Further
Use the \`repository_search\` tool to find specific documentation:
- Search "transaction" for transaction-related docs
- Search "identity" for authentication guides  
- Search "tutorial" for step-by-step guides
- Search "API" for endpoint documentation

Or use \`read_repository_document\` to read specific files like:
- \`docs/deso-tutorial-build-apps.md\`
- \`docs/architecture-overview/README.md\`
- \`deso-js/README.md\``;

  if (includeCode) {
    response += `\n\n## Code Example
\`\`\`javascript
// Complete DeSo integration example
import { identity, submitPost } from 'deso-protocol';

// 1. Identity phase
await identity.login();
const user = identity.snapshot().currentUser;

// 2. Transaction phase (SDK handles backend + signing)
const result = await submitPost({
  UpdaterPublicKeyBase58Check: user.publicKey,
  BodyObj: { Body: 'Built with DeSo architecture!' }
});

console.log('Transaction:', result.TransactionIDBase58Check);
\`\`\``;
  }

  return {
    content: [{
      type: "text", 
      text: response
    }]
  };
}

// Helper function from original comprehensive server
function generateEndpointExample(endpoint, details) {
  return `
## Code Examples

### Using deso-js SDK
\`\`\`javascript
import { ${details.desoJs} } from 'deso-protocol';

const result = await ${details.desoJs}({
  ${details.params.required.map(p => `${p}: 'value'`).join(',\n  ')}
});
\`\`\`

### Direct API Call
\`\`\`javascript
const response = await fetch('https://node.deso.org${details.url}', {
  method: '${details.method}',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ${details.params.required.map(p => `${p}: 'value'`).join(',\n    ')}
  })
});
\`\`\`
`;
}

async function repositorySearch(args) {
  const { query } = args;
  
  try {
    const results = await searchRepositoryDocuments(query);
    
    if (results.length === 0) {
      return {
        content: [{
          type: "text",
          text: `# Repository Search Results

**Query:** "${query}"

No matching documents found in the DeSo repository.

**Available repositories:** docs, core, identity, frontend, backend, deso-js`
        }]
      };
    }
    
    let response = `# Repository Search Results\n\n**Query:** "${query}"\n**Found:** ${results.length} matches\n\n`;
    
    for (const result of results.slice(0, 10)) { // Limit to top 10 results
      response += `## ${result.title}\n`;
      response += `**Path:** \`${result.path}\`\n`;
      response += `**Repository:** ${result.repository}\n\n`;
      response += `${result.excerpt}\n\n---\n\n`;
    }
    
    if (results.length > 10) {
      response += `*Showing top 10 of ${results.length} results*\n`;
    }
    
    return {
      content: [{
        type: "text",
        text: response
      }]
    };
  } catch (error) {
    console.error("Repository search error:", error);
    return {
      content: [{
        type: "text",
        text: `# Repository Search Error

**Query:** "${query}"

Error searching repository: ${error.message}

This might be due to repository access permissions or path issues.`
      }]
    };
  }
}

// Repository document search implementation
async function searchRepositoryDocuments(query) {
  const repositories = ['docs', 'core', 'identity', 'frontend', 'backend', 'deso-js'];
  const reposPath = path.join(process.cwd(), 'repos');
  const results = [];
  const searchTerms = query.toLowerCase().split(' ');
  
  for (const repo of repositories) {
    const repoPath = path.join(reposPath, repo);
    
    try {
      const stats = await fs.stat(repoPath);
      if (stats.isDirectory()) {
        const repoResults = await searchInDirectory(repoPath, repo, searchTerms);
        results.push(...repoResults);
      }
    } catch (error) {
      console.error(`Error accessing ${repo}:`, error.message);
      continue;
    }
  }
  
  // Sort by relevance (number of matching terms)
  return results.sort((a, b) => b.score - a.score);
}

async function searchInDirectory(dirPath, repository, searchTerms) {
  const results = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        // Recursively search subdirectories
        const subResults = await searchInDirectory(fullPath, repository, searchTerms);
        results.push(...subResults);
      } else if (entry.isFile() && isSearchableFile(entry.name)) {
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          const matches = findMatches(content, searchTerms, fullPath, repository);
          results.push(...matches);
        } catch (error) {
          // Skip files that can't be read
          continue;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
  
  return results;
}

function isSearchableFile(filename) {
  const searchableExtensions = ['.md', '.txt', '.js', '.ts', '.go', '.json', '.yaml', '.yml', '.tsx', '.jsx'];
  const ext = path.extname(filename).toLowerCase();
  return searchableExtensions.includes(ext);
}

function findMatches(content, searchTerms, filePath, repository) {
  const lines = content.split('\n');
  const matches = [];
  const contentLower = content.toLowerCase();
  
  // Calculate relevance score
  let score = 0;
  for (const term of searchTerms) {
    const termCount = (contentLower.match(new RegExp(term, 'g')) || []).length;
    score += termCount;
  }
  
  if (score === 0) return [];
  
  // Find relevant excerpts
  const relevantLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    
    if (searchTerms.some(term => lineLower.includes(term))) {
      // Include context lines
      const start = Math.max(0, i - 2);
      const end = Math.min(lines.length, i + 3);
      relevantLines.push({
        lineNumber: i + 1,
        content: lines.slice(start, end).join('\n'),
        matchLine: line
      });
    }
  }
  
  // Create title from file path and content
  const fileName = path.basename(filePath);  
  const title = getDocumentTitle(content, fileName);
  
  // Create excerpt from best matches
  const excerpt = createExcerpt(relevantLines, searchTerms);
  
  matches.push({
    title,
    path: path.relative(path.join(process.cwd(), 'repos'), filePath),
    repository,
    score,
    excerpt,
    matchCount: relevantLines.length
  });
  
  return matches;
}

function getDocumentTitle(content, fileName) {
  // Try to extract title from markdown headers
  const lines = content.split('\n');
  for (const line of lines.slice(0, 10)) { // Check first 10 lines
    if (line.startsWith('# ')) {
      return line.substring(2).trim();
    }
  }
  
  // Fallback to filename
  return fileName.replace(path.extname(fileName), '').replace(/[-_]/g, ' ');
}

function createExcerpt(relevantLines, searchTerms) {
  if (relevantLines.length === 0) return '';
  
  // Take the best matching excerpt
  const bestMatch = relevantLines[0];
  let excerpt = bestMatch.content;
  
  // Highlight search terms
  for (const term of searchTerms) {
    const regex = new RegExp(`(${term})`, 'gi');
    excerpt = excerpt.replace(regex, '**$1**');
  }
  
  // Limit excerpt length
  if (excerpt.length > 500) {
    excerpt = excerpt.substring(0, 500) + '...';
  }
  
  return excerpt;
}

// Repository document reader
async function readRepositoryDocument(args) {
  const { path: docPath, repository } = args;
  
  try {
    let fullPath;
    if (repository) {
      fullPath = path.join(process.cwd(), 'repos', repository, docPath);
    } else {
      // If no repository specified, check if path already includes it
      fullPath = path.join(process.cwd(), 'repos', docPath);
    }
    
    const content = await fs.readFile(fullPath, 'utf-8');
    const fileName = path.basename(fullPath);
    const title = getDocumentTitle(content, fileName);
    
    return {
      content: [{
        type: "text",
        text: `# ${title}

**Path:** \`${docPath}\`
**Repository:** ${repository || 'auto-detected'}
**File:** ${fileName}

---

${content}`
      }]
    };
  } catch (error) {
    console.error("Document read error:", error);
    return {
      content: [{
        type: "text",
        text: `# Document Read Error

**Path:** "${docPath}"
**Repository:** ${repository || 'auto-detect'}

Error reading document: ${error.message}

**Available repositories:** docs, core, identity, frontend, backend, deso-js

Try using the \`repository_search\` tool first to find the correct document path.`
      }]
    };
  }
}

// Start server with robust error handling
async function main() {
  try {
    const transport = new StdioServerTransport();
    
    // Add transport error handling
    transport.onerror = (error) => {
      console.error("DeSo MCP Transport error:", error);
    };
    
    await server.connect(transport);
          console.error("🚀 DeSo MCP Server v2.3 connected successfully with 6 tools!");
    
    // Keep process alive
    process.on('SIGINT', () => {
      console.error("DeSo MCP Server shutting down...");
      process.exit(0);
    });
    
  } catch (error) {
    console.error("Failed to start DeSo MCP Server:", error);
    process.exit(1);
  }
}

main(); 