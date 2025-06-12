#!/usr/bin/env node

/**
 * DeSo MCP Server v3.0 - Comprehensive DeSo Development Assistant
 * 
 * Enhanced with real debugging experience and implementation patterns from building
 * a complete DeSo messaging application. Includes solutions to all major pitfalls
 * and best practices learned through extensive debugging sessions.
 * 
 * NEW IN v3.0:
 * 🛠️ deso_debugging_guide - Comprehensive debugging for common DeSo issues
 * 🏗️ deso_implementation_patterns - Best practices from deso-chat analysis
 * 
 * CORE DEBUGGING FIXES INCLUDED:
 * ✅ Message Decryption: DecryptedMessage vs MessageText property fix
 * ✅ Access Groups: Empty string handling vs undefined checks  
 * ✅ Infinite Loops: useCallback dependency management
 * ✅ API Responses: Proper response structure handling per endpoint
 * ✅ Authentication: Complete identity event handling and user switching
 * ✅ React Integration: Key warnings, state management, error boundaries
 * 
 * IMPLEMENTATION PATTERNS:
 * 📱 Complete messaging flow with encryption and access groups
 * 🛡️ Comprehensive error handling with retry logic
 * 🔄 Professional state management patterns
 * 🎯 Real-time polling and optimistic updates
 * 
 * Based on real debugging experience building a production DeSo messaging app
 * with reference to deso-chat implementation patterns.
 */

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
    version: "3.0.0", // Updated with comprehensive debugging tools
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
      },
      {
        name: "deso_debugging_guide",
        description: "Comprehensive debugging guide for common DeSo integration issues with solutions",
        inputSchema: {
          type: "object",
          properties: {
            issue: {
              type: "string",
              enum: ["message-decryption", "access-groups", "infinite-loops", "api-responses", "authentication", "react-errors", "all"],
              description: "Specific issue to debug or 'all' for complete guide"
            },
            includeCode: {
              type: "boolean",
              description: "Include code examples and fixes"
            }
          },
          required: ["issue"]
        }
      },
      {
        name: "deso_implementation_patterns",
        description: "Best practices and implementation patterns learned from deso-chat and real debugging",
        inputSchema: {
          type: "object",
          properties: {
            pattern: {
              type: "string",
              enum: ["messaging-flow", "error-handling", "state-management", "api-integration", "user-switching", "real-time-updates", "all"],
              description: "Implementation pattern to explore"
            },
            framework: {
              type: "string",
              enum: ["react", "vanilla", "nextjs"],
              description: "Framework context"
            }
          },
          required: ["pattern"]
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
      case "deso_debugging_guide":
        return await desoDebuggingGuide(args);
      case "deso_implementation_patterns":
        return await desoImplementationPatterns(args);
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
        description: "Social interaction endpoints for posts, follows, likes, diamonds, and messaging",
        backendFile: "routes/transaction.go, routes/post.go, routes/new_message.go",
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
        }
      }
    },
    messages: {
      description: "Modern DeSo messaging system with DM and group chat support",
      backendFile: "routes/new_message.go",
      documentation: {
        endpoints: ["docs/deso-backend/api/messages-endpoints.md"],
        transactions: ["docs/deso-backend/construct-transactions/social-transactions-api.md"]
      },
      endpoints: {
        "send-dm-message": {
          method: "POST",
          url: "/api/v0/send-dm-message",
          handler: "SendDmMessage",
          description: "Send private message between users (replaces deprecated send-message-stateless)",
          desoJs: "sendDMMessage",
          params: {
            required: [
              "SenderAccessGroupOwnerPublicKeyBase58Check",
              "SenderAccessGroupPublicKeyBase58Check", 
              "SenderAccessGroupKeyName",
              "RecipientAccessGroupOwnerPublicKeyBase58Check",
              "RecipientAccessGroupPublicKeyBase58Check",
              "RecipientAccessGroupKeyName",
              "EncryptedMessageText",
              "MinFeeRateNanosPerKB"
            ],
            optional: ["TransactionFees", "ExtraData"]
          }
        },
        "update-dm-message": {
          method: "POST",
          url: "/api/v0/update-dm-message",
          handler: "UpdateDmMessage", 
          description: "Update existing direct message",
          desoJs: "updateDMMessage",
          params: {
            required: [
              "SenderAccessGroupOwnerPublicKey",
              "SenderAccessGroupPublicKey",
              "SenderAccessGroupKeyName",
              "RecipientAccessGroupOwnerPublicKey", 
              "RecipientAccessGroupPublicKey",
              "RecipientAccessGroupKeyName",
              "EncryptedMessageText",
              "TimestampNanosString"
            ],
            optional: ["MinFeeRateNanosPerKB", "TransactionFees", "ExtraData"]
          }
        },
        "get-user-dm-threads-ordered-by-timestamp": {
          method: "POST",
          url: "/api/v0/get-user-dm-threads-ordered-by-timestamp",
          handler: "GetUserDmThreadsOrderedByTimestamp",
          description: "Get user's DM conversation list ordered by most recent message",
          desoJs: "getAllMessageThreads",
          params: {
            required: ["UserPublicKeyBase58Check"],
            optional: []
          }
        },
        "get-paginated-messages-for-dm-thread": {
          method: "POST", 
          url: "/api/v0/get-paginated-messages-for-dm-thread",
          handler: "GetPaginatedMessagesForDmThread",
          description: "Get messages for specific DM conversation with pagination",
          desoJs: "getPaginatedDMThread",
          params: {
            required: [
              "UserGroupOwnerPublicKeyBase58Check",
              "UserGroupKeyName", 
              "PartyGroupOwnerPublicKeyBase58Check",
              "PartyGroupKeyName",
              "MaxMessagesToFetch"
            ],
            optional: ["StartTimestampString", "StartTimestamp"]
          }
        },
        "send-group-chat-message": {
          method: "POST",
          url: "/api/v0/send-group-chat-message", 
          handler: "SendGroupChatMessage",
          description: "Send message to group chat",
          desoJs: "sendGroupChatMessage",
          params: {
            required: [
              "SenderAccessGroupOwnerPublicKey",
              "SenderAccessGroupPublicKeyBase58Check",
              "SenderAccessGroupKeyName", 
              "RecipientAccessGroupOwnerPublicKeyBase58Check",
              "RecipientAccessGroupPublicKeyBase58Check",
              "RecipientAccessGroupKeyName",
              "EncryptedMessageText"
            ],
            optional: ["MinFeeRateNanosPerKB", "TransactionFees", "ExtraData"]
          }
        },
        "update-group-chat-message": {
          method: "POST",
          url: "/api/v0/update-group-chat-message",
          handler: "UpdateGroupChatMessage", 
          description: "Update existing group chat message",
          desoJs: "updateGroupChatMessage",
          params: {
            required: [
              "SenderAccessGroupOwnerPublicKey",
              "SenderAccessGroupPublicKey",
              "SenderAccessGroupKeyName",
              "RecipientAccessGroupOwnerPublicKey",
              "RecipientAccessGroupPublicKey", 
              "RecipientAccessGroupKeyName",
              "EncryptedMessageText",
              "TimestampNanosString"
            ],
            optional: ["MinFeeRateNanosPerKB", "TransactionFees", "ExtraData"]
          }
        },
        "get-user-group-chat-threads-ordered-by-timestamp": {
          method: "POST",
          url: "/api/v0/get-user-group-chat-threads-ordered-by-timestamp", 
          handler: "GetUserGroupChatThreadsOrderedByTimestamp",
          description: "Get user's group chat list ordered by most recent message",
          desoJs: "getAllMessageThreads", 
          params: {
            required: ["UserPublicKeyBase58Check"],
            optional: []
          }
        },
        "get-paginated-messages-for-group-chat-thread": {
          method: "POST",
          url: "/api/v0/get-paginated-messages-for-group-chat-thread",
          handler: "GetPaginatedMessagesForGroupChatThread",
          description: "Get messages for specific group chat with pagination", 
          desoJs: "getPaginatedGroupChatThread",
          params: {
            required: [
              "UserPublicKeyBase58Check",
              "AccessGroupKeyName", 
              "MaxMessagesToFetch"
            ],
            optional: ["StartTimestampString", "StartTimestamp"]
          }
        },
        "get-all-user-message-threads": {
          method: "POST",
          url: "/api/v0/get-all-user-message-threads",
          handler: "GetAllUserMessageThreads", 
          description: "Get all user conversations (DMs + group chats) ordered by timestamp",
          desoJs: "getAllMessageThreads",
          params: {
            required: ["UserPublicKeyBase58Check"],
            optional: []
          }
        },
        "send-message-stateless": {
          method: "POST",
          url: "/api/v0/send-message-stateless",
          handler: "SendMessageStateless",
          description: "⚠️ DEPRECATED - Use send-dm-message instead. Legacy message sending endpoint",
          desoJs: "sendDMMessage (maps to new endpoint)",
          params: {
            required: ["SenderPublicKeyBase58Check", "RecipientPublicKeyBase58Check", "MessageText", "MinFeeRateNanosPerKB"],
            optional: ["EncryptedMessageText", "SenderMessagingPublicKey", "SenderMessagingKeyName", "RecipientMessagingPublicKey", "RecipientMessagingKeyName", "ExtraData"],
            deprecated: true
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
    },
    access: {
      description: "Access group management for DeSo messaging and permissions",
      backendFile: "routes/access_group.go",
      documentation: {
        endpoints: ["docs/deso-backend/api/access-group-endpoints.md"],
        transactions: ["docs/deso-backend/construct-transactions/access-groups-api.md"]
      },
      endpoints: {
        "get-all-user-access-groups": {
          method: "POST",
          url: "/api/v0/get-all-user-access-groups",
          handler: "GetAllUserAccessGroups",
          description: "Get all access groups owned by and member of for a user",
          desoJs: "getAllUserAccessGroups",
          params: {
            required: ["PublicKeyBase58Check"],
            optional: []
          }
        },
        "check-party-access-groups": {
          method: "POST",
          url: "/api/v0/check-party-access-groups",
          handler: "CheckPartyAccessGroups",
          description: "Check if both sender and receiver have requested access groups",
          desoJs: "checkPartyAccessGroups",
          params: {
            required: [
              "SenderPublicKeyBase58Check",
              "SenderAccessGroupKeyName", 
              "RecipientPublicKeyBase58Check",
              "RecipientAccessGroupKeyName"
            ],
            optional: []
          }
        },
        "create-access-group": {
          method: "POST",
          url: "/api/v0/create-access-group",
          handler: "CreateAccessGroup",
          description: "Create a new access group for messaging",
          desoJs: "createAccessGroup",
          params: {
            required: [
              "AccessGroupOwnerPublicKeyBase58Check",
              "AccessGroupPublicKeyBase58Check",
              "AccessGroupKeyName",
              "MinFeeRateNanosPerKB"
            ],
            optional: ["TransactionFees", "ExtraData"]
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
- Applications guide: \`repos/docs/deso-applications.md\``,

    "messaging-architecture": `# DeSo Messaging Architecture (Access Groups)

## Modern Messaging System (from deso-chat analysis)

DeSo implements end-to-end encrypted messaging using Access Groups:

### Core Components:
1. **Access Groups**: Encryption containers for messages
2. **Derived Keys**: Handle encryption without identity popups  
3. **Message APIs**: Modern endpoints for DM and group chat
4. **Real-time Polling**: Live message updates

### Access Group Pattern:
\`\`\`typescript
// Auto-setup default messaging access group
const { AccessGroupsOwned } = await getAllAccessGroups({
  PublicKeyBase58Check: userPublicKey
});

if (!AccessGroupsOwned?.find(g => g.AccessGroupKeyName === "default-key")) {
  await createAccessGroup({
    AccessGroupOwnerPublicKeyBase58Check: userPublicKey,
    AccessGroupPublicKeyBase58Check: messagingPublicKey,
    AccessGroupKeyName: "default-key",
    MinFeeRateNanosPerKB: 1000
  });
}
\`\`\`

### Message Flow:
1. **Check Access Groups**: Verify sender/receiver have required groups
2. **Encrypt Message**: Use recipient's access group public key
3. **Send Message**: Via sendDMMessage or sendGroupChatMessage
4. **Retrieve Messages**: Use getAllMessageThreads + pagination
5. **Decrypt Messages**: Use identity.decryptMessage with access groups

### Key APIs:
- \`getAllMessageThreads\` - Get conversation list
- \`getPaginatedDMThread\` - Get DM messages with pagination
- \`getPaginatedGroupChatThread\` - Get group messages with pagination
- \`sendDMMessage\` - Send encrypted direct message
- \`sendGroupChatMessage\` - Send encrypted group message

### Implementation Patterns:
- **Spending Limits**: Set unlimited NEW_MESSAGE transactions
- **Error Handling**: Retry access group fetching if decryption fails
- **Mobile Optimization**: Longer polling intervals (20s vs 5s)
- **State Management**: Conversation maps with message arrays
- **Real-time Updates**: Polling with conversation-specific updates`
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
    if (topic === "messaging-architecture") {
      response += `\n\n## Complete Messaging Implementation Example
\`\`\`typescript
// DeSo Messaging Setup (from deso-chat analysis)
import { 
  configure, identity, getAllAccessGroups, createAccessGroup,
  checkPartyAccessGroups, sendDMMessage, getAllMessageThreads,
  getPaginatedDMThread, DeSoNetwork, NOTIFICATION_EVENTS
} from 'deso-protocol';

// 1. Configure SDK with messaging permissions
configure({
  identityURI: process.env.REACT_APP_IDENTITY_URL,
  nodeURI: process.env.REACT_APP_NODE_URL,
  network: DeSoNetwork.mainnet,
  spendingLimitOptions: {
    GlobalDESOLimit: 5 * 1e9,
    TransactionCountLimitMap: {
      AUTHORIZE_DERIVED_KEY: 1,
      NEW_MESSAGE: "UNLIMITED"
    },
    AccessGroupLimitMap: [{
      AccessGroupOwnerPublicKeyBase58Check: "",
      ScopeType: "Any",
      AccessGroupKeyName: "",
      OperationType: "Any",
      OpCount: "UNLIMITED"
    }]
  }
});

// 2. Setup user with auto-created access groups
identity.subscribe(async ({ event, currentUser }) => {
  if (event === NOTIFICATION_EVENTS.LOGIN_END && currentUser) {
    const { messagingPublicKeyBase58Check } = currentUser.primaryDerivedKey;
    
    // Get existing access groups
    const { AccessGroupsOwned } = await getAllAccessGroups({
      PublicKeyBase58Check: currentUser.publicKey
    });
    
    // Auto-create default messaging group if needed
    if (!AccessGroupsOwned?.find(g => g.AccessGroupKeyName === "default-key")) {
      await createAccessGroup({
        AccessGroupOwnerPublicKeyBase58Check: currentUser.publicKey,
        AccessGroupPublicKeyBase58Check: messagingPublicKeyBase58Check,
        AccessGroupKeyName: "default-key",
        MinFeeRateNanosPerKB: 1000
      });
    }
  }
});

// 3. Send encrypted message
async function sendMessage(recipientPublicKey: string, messageText: string) {
  const currentUser = identity.snapshot().currentUser;
  
  // Check both parties have required access groups
  const response = await checkPartyAccessGroups({
    SenderPublicKeyBase58Check: currentUser.publicKey,
    SenderAccessGroupKeyName: "default-key",
    RecipientPublicKeyBase58Check: recipientPublicKey,
    RecipientAccessGroupKeyName: "default-key"
  });
  
  // Encrypt message
  const encryptedMessage = await identity.encryptMessage(
    response.RecipientAccessGroupPublicKeyBase58Check,
    messageText
  );
  
  // Send message
  const result = await sendDMMessage({
    SenderAccessGroupOwnerPublicKeyBase58Check: currentUser.publicKey,
    SenderAccessGroupPublicKeyBase58Check: response.SenderAccessGroupPublicKeyBase58Check,
    SenderAccessGroupKeyName: "default-key",
    RecipientAccessGroupOwnerPublicKeyBase58Check: recipientPublicKey,
    RecipientAccessGroupPublicKeyBase58Check: response.RecipientAccessGroupPublicKeyBase58Check,
    RecipientAccessGroupKeyName: "default-key",
    EncryptedMessageText: encryptedMessage,
    MinFeeRateNanosPerKB: 1000
  });
  
  return result.submittedTransactionResponse.TxnHashHex;
}

// 4. Get conversations and messages
async function getConversations(userPublicKey: string) {
  // Get all conversation threads
  const threads = await getAllMessageThreads({
    UserPublicKeyBase58Check: userPublicKey
  });
  
  // Get access groups for decryption
  const { AccessGroupsOwned, AccessGroupsMember } = await getAllAccessGroups({
    PublicKeyBase58Check: userPublicKey
  });
  const allAccessGroups = (AccessGroupsOwned || []).concat(AccessGroupsMember || []);
  
  // Decrypt messages
  const decryptedMessages = await Promise.all(
    threads.MessageThreads.map(m => identity.decryptMessage(m, allAccessGroups))
  );
  
  return {
    conversations: organizeIntoConversations(decryptedMessages),
    profiles: threads.PublicKeyToProfileEntryResponse
  };
}

// 5. Real-time polling pattern
function startMessagePolling(userPublicKey: string, callback: Function) {
  const pollInterval = setInterval(async () => {
    try {
      const { conversations } = await getConversations(userPublicKey);
      callback(conversations);
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 5000); // 5 second intervals
  
  return () => clearInterval(pollInterval);
}
\`\`\``;
    } else {
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

// Comprehensive DeSo debugging guide based on real debugging experience
async function desoDebuggingGuide(args) {
  const { issue, includeCode = false } = args;
  
  const debuggingGuides = {
    "message-decryption": {
      title: "🔐 Message Decryption Issues",
      content: `# Message Decryption Debugging

## 🚨 CRITICAL: DecryptedMessage vs MessageText

**The #1 Issue:** Using wrong property name for decrypted messages

### ❌ WRONG (Common Mistake)
\`\`\`javascript
if (decryptedMessage.MessageText) {
  messageText = decryptedMessage.MessageText; // This is WRONG!
}
\`\`\`

### ✅ CORRECT (Actual Fix)
\`\`\`javascript
if (decryptedMessage.DecryptedMessage) {
  messageText = decryptedMessage.DecryptedMessage; // This is RIGHT!
}
\`\`\`

## 🔍 Debugging Steps

1. **Check Console Logs**: Look for \`hasMessageText: false\` vs \`hasDecryptedMessage: true\`
2. **Inspect Response Structure**: Use \`Object.keys(decryptedMessage)\` to see available properties
3. **Reference Implementation**: Always check deso-chat for correct patterns

## 🛠️ Complete Decryption Pattern
\`\`\`javascript
// Proper message decryption handling
for (const decryptedMessage of decrypted) {
  let messageText = '[Encrypted Message]';
  
  if (decryptedMessage.error) {
    messageText = '[Decryption Failed]';
  } else if (decryptedMessage.DecryptedMessage) {
    // ✅ CORRECT: Use DecryptedMessage property
    messageText = decryptedMessage.DecryptedMessage;
  } else if (decryptedMessage.MessageInfo?.ExtraData?.unencrypted === "true") {
    // Handle unencrypted messages (hex-encoded)
    try {
      const hexString = decryptedMessage.MessageInfo.EncryptedText;
      const bytes = new Uint8Array(Buffer.from(hexString, 'hex'));
      messageText = new TextDecoder().decode(bytes);
    } catch (error) {
      messageText = '[Decoding Failed]';
    }
  }
}
\`\`\`

## 🔧 Common Error Messages
- **"incorrect MAC"**: Normal for old/incompatible messages - handle gracefully
- **"access group key not found"**: Need to fetch updated access groups
- **Empty DecryptedMessage**: Check if message is unencrypted (ExtraData.unencrypted)`
    },
    
    "access-groups": {
      title: "🔑 Access Group Issues",
      content: `# Access Group Debugging

## 🚨 CRITICAL: Empty String vs Undefined

**The Issue:** \`checkPartyAccessGroups\` returns empty strings, not undefined!

### ❌ WRONG (Common Mistake)
\`\`\`javascript
if (response.SenderAccessGroupKeyName) {
  // This fails when API returns empty string!
}
\`\`\`

### ✅ CORRECT (Actual Fix)
\`\`\`javascript
const senderKeyName = response.SenderAccessGroupKeyName || DEFAULT_KEY_MESSAGING_GROUP_NAME;
const recipientKeyName = response.RecipientAccessGroupKeyName || DEFAULT_KEY_MESSAGING_GROUP_NAME;
\`\`\`

## 🔍 Access Group Flow

1. **Check Party Access Groups**: Always check both sender and recipient
2. **Handle Empty Responses**: API returns empty strings when groups don't exist
3. **Fallback to Default**: Use "default-key" as fallback
4. **Auto-Create Groups**: Create default messaging groups if needed

## 🛠️ Complete Access Group Pattern
\`\`\`javascript
// Proper access group handling
const response = await checkPartyAccessGroups({
  SenderPublicKeyBase58Check: senderPublicKey,
  SenderAccessGroupKeyName: DEFAULT_KEY_MESSAGING_GROUP_NAME,
  RecipientPublicKeyBase58Check: recipientPublicKey,
  RecipientAccessGroupKeyName: DEFAULT_KEY_MESSAGING_GROUP_NAME
});

// ✅ CORRECT: Handle empty strings properly
const senderKeyName = response.SenderAccessGroupKeyName || DEFAULT_KEY_MESSAGING_GROUP_NAME;
const recipientKeyName = response.RecipientAccessGroupKeyName || DEFAULT_KEY_MESSAGING_GROUP_NAME;

if (!senderKeyName || !recipientKeyName) {
  throw new Error('Access groups not available for messaging');
}
\`\`\`

## 🔧 Error Messages to Watch For
- **"SenderAccessGroupKeyName is undefined"**: Check for empty string handling
- **"access group key not found"**: Need to create or fetch access groups
- **"insufficient permissions"**: Check derived key permissions for access groups`
    },
    
    "infinite-loops": {
      title: "🔄 Infinite Loop Issues",
      content: `# Infinite Loop Debugging

## 🚨 CRITICAL: useCallback Dependencies

**The Issue:** Missing or incorrect dependencies in useCallback hooks

### ❌ WRONG (Causes Infinite Loops)
\`\`\`javascript
const searchUsers = useCallback(async (query) => {
  // Missing dependencies!
}, []); // Empty dependency array is often wrong
\`\`\`

### ✅ CORRECT (Prevents Infinite Loops)
\`\`\`javascript
const searchUsers = useCallback(async (query) => {
  if (!query.trim()) return;
  // Implementation...
}, [getSingleProfile, setUsers, setLoading]); // Include ALL dependencies
\`\`\`

## 🔍 Debugging Steps

1. **Check React DevTools**: Look for "Maximum update depth exceeded"
2. **Add Dependency Warnings**: Use ESLint react-hooks/exhaustive-deps
3. **Add Debouncing**: Prevent rapid API calls
4. **Isolate State Updates**: Separate loading states from data states

## 🛠️ Complete Debounced Search Pattern
\`\`\`javascript
// Proper debounced search with correct dependencies
const [searchQuery, setSearchQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

// Debounce the search query
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 500); // 500ms debounce

  return () => clearTimeout(timer);
}, [searchQuery]);

// Search function with proper dependencies
const searchUsers = useCallback(async (query) => {
  if (!query.trim()) {
    setUsers([]);
    return;
  }
  
  setLoading(true);
  try {
    const profile = await getSingleProfile({ Username: query });
    setUsers(profile ? [profile] : []);
  } catch (error) {
    setError(error.message);
    setUsers([]);
  } finally {
    setLoading(false);
  }
}, [getSingleProfile]); // Only include stable dependencies

// Trigger search when debounced query changes
useEffect(() => {
  if (debouncedQuery) {
    searchUsers(debouncedQuery);
  }
}, [debouncedQuery, searchUsers]);
\`\`\`

## 🔧 Common Patterns That Cause Loops
- **Missing useCallback**: Functions recreated on every render
- **Incorrect dependencies**: Including unstable objects/functions
- **State updates in render**: Causing immediate re-renders
- **Effect cleanup issues**: Not properly cleaning up timers/subscriptions`
    },
    
    "api-responses": {
      title: "📡 API Response Structure Issues",
      content: `# API Response Structure Debugging

## 🚨 CRITICAL: Different Endpoints, Different Structures

**The Issue:** Each DeSo endpoint has different response structures!

### Key Response Differences:
- \`getAllMessageThreads\` → \`MessageThreads\` array
- \`getPaginatedDMThread\` → \`ThreadMessages\` array  
- \`getAllAccessGroups\` → \`AccessGroupsOwned\` + \`AccessGroupsMember\`

## 🔍 Debugging API Responses

### 1. Always Log Response Structure
\`\`\`javascript
const response = await getPaginatedDMThread(params);
console.log('API Response keys:', Object.keys(response));
console.log('Messages array:', response.ThreadMessages?.length);
\`\`\`

### 2. Handle Empty/Null Responses
\`\`\`javascript
// ✅ CORRECT: Always validate response structure
const messages = response?.ThreadMessages || [];
const profiles = response?.PublicKeyToProfileEntryResponse || {};
\`\`\`

### 3. Check for JSON Parsing Errors
\`\`\`javascript
// ✅ CORRECT: Validate before parsing
if (!response || response.trim() === '') {
  throw new Error('Empty response from API');
}

try {
  const data = JSON.parse(response);
  return data;
} catch (error) {
  throw new Error(\`Invalid JSON response: \${error.message}\`);
}
\`\`\`

## 🛠️ Complete API Error Handling Pattern
\`\`\`javascript
async function safeApiCall(apiFunction, params, fallback = null) {
  try {
    const response = await apiFunction(params);
    
    // Validate response structure
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid API response structure');
    }
    
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    
    // Categorize errors for user-friendly messages
    if (error.message.includes('404')) {
      throw new Error('User not found');
    } else if (error.message.includes('network')) {
      throw new Error('Network connection issue');
    } else {
      throw new Error(\`API error: \${error.message}\`);
    }
  }
}
\`\`\`

## 🔧 Common API Issues
- **"Cannot read property of undefined"**: Missing null checks
- **"Unexpected end of JSON input"**: Empty response handling
- **"404 errors"**: User/resource not found - handle gracefully
- **Rate limiting**: Implement proper retry logic with exponential backoff`
    },
    
    "authentication": {
      title: "🔐 Authentication & User Switching Issues",
      content: `# Authentication Debugging

## 🚨 CRITICAL: Identity Event Handling

**The Issue:** Not properly handling identity state changes and user switching

### ✅ CORRECT: Complete Identity Setup
\`\`\`javascript
// Proper identity subscription with user switching
identity.subscribe(({ currentUser, alternateUsers, event }) => {
  console.log('Identity event:', event);
  
  if (event === 'LOGIN_END' && currentUser) {
    setUser({
      isAuthenticated: true,
      username: currentUser.username || currentUser.publicKey?.slice(0, 10) + '...',
      publicKey: currentUser.publicKey,
      alternateUsers: alternateUsers || []
    });
  } else if (event === 'LOGOUT') {
    setUser({
      isAuthenticated: false,
      username: null,
      publicKey: null,
      alternateUsers: []
    });
  }
});
\`\`\`

## 🔍 User Switching Implementation

### Account Switcher Component
\`\`\`javascript
function AccountSwitcher({ currentUser, alternateUsers }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSwitchUser = async (publicKey) => {
    try {
      await identity.setActiveUser(publicKey);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch user:', error);
    }
  };
  
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        {currentUser.username}
        <ChevronDownIcon />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg">
          {alternateUsers.map(user => (
            <button
              key={user.publicKey}
              onClick={() => handleSwitchUser(user.publicKey)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {user.username || user.publicKey.slice(0, 10) + '...'}
            </button>
          ))}
          <hr />
          <button
            onClick={() => identity.login()}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Add Another Account
          </button>
          <button
            onClick={() => identity.logout()}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
\`\`\`

## 🔧 Common Authentication Issues
- **Identity not showing**: Check if LoginButton is in the header when authenticated
- **User switching not working**: Ensure proper identity.setActiveUser() usage
- **Permissions issues**: Check derived key permissions for messaging/transactions
- **State not updating**: Verify identity.subscribe() is properly set up`
    },
    
    "react-errors": {
      title: "⚛️ React-Specific Issues",
      content: `# React Integration Debugging

## 🚨 CRITICAL: Key Warnings & State Management

### 1. Unique Key Generation
\`\`\`javascript
// ❌ WRONG: Non-unique keys
{messages.map((msg, index) => (
  <div key={index}> // Don't use array index!
))}

// ✅ CORRECT: Unique, stable keys
{messages.map((msg) => (
  <div key={\`\${msg.timestampNanos}-\${msg.senderPublicKey}\`}>
))}
\`\`\`

### 2. Proper Loading State Management
\`\`\`javascript
// ✅ CORRECT: Separate loading states
const [isLoading, setIsLoading] = useState(false);
const [isLoadingMessages, setIsLoadingMessages] = useState(false);
const [isLoadingConversations, setIsLoadingConversations] = useState(false);
\`\`\`

### 3. Error Boundary Implementation
\`\`\`javascript
class DeSoErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('DeSo Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong with DeSo integration</h2>
          <details>
            {this.state.error?.message}
          </details>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
\`\`\`

## 🔧 Common React Issues
- **"Maximum update depth exceeded"**: Check useCallback dependencies
- **"Cannot read property of undefined"**: Add proper null checks
- **"Each child should have unique key"**: Use stable, unique identifiers
- **State not updating**: Verify proper state setter usage and dependencies`
    }
  };

  if (issue === 'all') {
    let response = `# 🛠️ Complete DeSo Debugging Guide

Based on real debugging experience and fixes applied during development.

## 🎯 Quick Reference

| Issue | Key Fix | Common Error |
|-------|---------|--------------|
| Message Decryption | Use \`DecryptedMessage\` not \`MessageText\` | "[Encrypted Message]" showing |
| Access Groups | Handle empty strings, not undefined | "SenderAccessGroupKeyName is undefined" |
| Infinite Loops | Fix useCallback dependencies | "Maximum update depth exceeded" |
| API Responses | Check response structure per endpoint | "Cannot read property of undefined" |
| Authentication | Proper identity.subscribe() setup | User switching not working |
| React Errors | Unique keys, proper state management | Key warnings, state issues |

## 🔍 Debugging Methodology

1. **Check Console Logs**: Look for specific error patterns
2. **Inspect Response Structure**: Use \`Object.keys()\` to see available properties  
3. **Reference deso-chat**: Always check reference implementation
4. **Add Comprehensive Logging**: Use emoji-coded logging for easy identification
5. **Test Edge Cases**: Empty responses, failed API calls, network issues

`;

    for (const [key, guide] of Object.entries(debuggingGuides)) {
      response += `\n## ${guide.title}\n\n`;
      response += guide.content.split('\n').slice(2, 8).join('\n'); // Summary
      response += `\n\n*Use \`deso_debugging_guide\` with issue="${key}" for complete details*\n\n`;
    }

    return { content: [{ type: "text", text: response }] };
  }

  if (debuggingGuides[issue]) {
    const guide = debuggingGuides[issue];
    let response = guide.content;
    
    if (includeCode) {
      response += `\n\n## 🧪 Testing & Validation

### Debug Logging Pattern
\`\`\`javascript
// Emoji-coded logging for easy debugging
const log = {
  info: (category, message, data) => console.log(\`🔵 [\${category}] \${message}\`, data),
  warn: (category, message, data) => console.warn(\`⚠️ [\${category}] \${message}\`, data),
  error: (category, message, data) => console.error(\`❌ [\${category}] \${message}\`, data),
  debug: (category, message, data) => console.debug(\`🔍 [\${category}] \${message}\`, data),
  success: (category, message, data) => console.log(\`✅ [\${category}] \${message}\`, data)
};
\`\`\`

### Validation Helpers
\`\`\`javascript
// Helper functions for common validations
const validateApiResponse = (response, expectedKeys) => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid API response');
  }
  
  for (const key of expectedKeys) {
    if (!(key in response)) {
      console.warn(\`Missing expected key: \${key}\`);
    }
  }
  
  return response;
};

const validatePublicKey = (publicKey) => {
  if (!publicKey || typeof publicKey !== 'string' || publicKey.length < 50) {
    throw new Error('Invalid public key format');
  }
  return publicKey;
};
\`\`\``;
    }
    
    return { content: [{ type: "text", text: response }] };
  }

  return { content: [{ type: "text", text: `Unknown issue: ${issue}. Available: ${Object.keys(debuggingGuides).join(', ')}` }] };
}

// Implementation patterns based on deso-chat analysis and debugging experience
async function desoImplementationPatterns(args) {
  const { pattern, framework = 'react' } = args;
  
  const patterns = {
    "messaging-flow": {
      title: "📱 Complete Messaging Flow Pattern",
      content: `# DeSo Messaging Implementation Pattern

## 🎯 Complete Flow (from deso-chat analysis)

### 1. SDK Configuration with Messaging Permissions
\`\`\`javascript
import { configure, DeSoNetwork } from 'deso-protocol';

configure({
  identityURI: process.env.REACT_APP_IDENTITY_URL,
  nodeURI: process.env.REACT_APP_NODE_URL,
  network: DeSoNetwork.mainnet,
  spendingLimitOptions: {
    GlobalDESOLimit: 5 * 1e9, // 5 DeSo
    TransactionCountLimitMap: {
      AUTHORIZE_DERIVED_KEY: 1,
      NEW_MESSAGE: "UNLIMITED" // ✅ CRITICAL: Unlimited messaging
    },
    AccessGroupLimitMap: [{
      AccessGroupOwnerPublicKeyBase58Check: "",
      ScopeType: "Any",
      AccessGroupKeyName: "",
      OperationType: "Any", 
      OpCount: "UNLIMITED"
    }]
  }
});
\`\`\`

### 2. Access Group Auto-Setup Pattern
\`\`\`javascript
// Auto-create default messaging access group
const setupMessagingForUser = async (userPublicKey, messagingPublicKey) => {
  const { AccessGroupsOwned } = await getAllAccessGroups({
    PublicKeyBase58Check: userPublicKey
  });
  
  // Check if default messaging group exists
  const hasDefaultGroup = AccessGroupsOwned?.find(
    group => group.AccessGroupKeyName === "default-key"
  );
  
  if (!hasDefaultGroup) {
    await createAccessGroup({
      AccessGroupOwnerPublicKeyBase58Check: userPublicKey,
      AccessGroupPublicKeyBase58Check: messagingPublicKey,
      AccessGroupKeyName: "default-key",
      MinFeeRateNanosPerKB: 1000
    });
  }
};
\`\`\`

### 3. Message Sending with Access Group Validation
\`\`\`javascript
const sendMessage = async (senderPublicKey, recipientPublicKey, messageText) => {
  // 1. Check party access groups
  const response = await checkPartyAccessGroups({
    SenderPublicKeyBase58Check: senderPublicKey,
    SenderAccessGroupKeyName: "default-key",
    RecipientPublicKeyBase58Check: recipientPublicKey,
    RecipientAccessGroupKeyName: "default-key"
  });
  
  // 2. Handle empty string responses (not undefined!)
  const senderKeyName = response.SenderAccessGroupKeyName || "default-key";
  const recipientKeyName = response.RecipientAccessGroupKeyName || "default-key";
  
  // 3. Encrypt message
  let encryptedMessage;
  let isUnencrypted = false;
  const ExtraData = {};
  
  if (response.RecipientAccessGroupPublicKeyBase58Check) {
    encryptedMessage = await identity.encryptMessage(
      response.RecipientAccessGroupPublicKeyBase58Check,
      messageText
    );
  } else {
    // Fallback to unencrypted (hex-encoded)
    encryptedMessage = bytesToHex(new TextEncoder().encode(messageText));
    isUnencrypted = true;
    ExtraData["unencrypted"] = "true";
  }
  
  // 4. Send message
  const result = await sendDMMessage({
    SenderAccessGroupOwnerPublicKeyBase58Check: senderPublicKey,
    SenderAccessGroupPublicKeyBase58Check: response.SenderAccessGroupPublicKeyBase58Check,
    SenderAccessGroupKeyName: senderKeyName,
    RecipientAccessGroupOwnerPublicKeyBase58Check: recipientPublicKey,
    RecipientAccessGroupPublicKeyBase58Check: isUnencrypted 
      ? response.RecipientPublicKeyBase58Check 
      : response.RecipientAccessGroupPublicKeyBase58Check,
    RecipientAccessGroupKeyName: recipientKeyName,
    EncryptedMessageText: encryptedMessage,
    ExtraData,
    MinFeeRateNanosPerKB: 1000
  });
  
  return result.submittedTransactionResponse.TxnHashHex;
};
\`\`\`

### 4. Message Retrieval and Decryption Pattern
\`\`\`javascript
const getConversationsWithDecryption = async (userPublicKey) => {
  // 1. Get all message threads
  const threads = await getAllMessageThreads({
    UserPublicKeyBase58Check: userPublicKey
  });
  
  // 2. Get access groups for decryption
  const { AccessGroupsOwned, AccessGroupsMember } = await getAllAccessGroups({
    PublicKeyBase58Check: userPublicKey
  });
  const allAccessGroups = (AccessGroupsOwned || []).concat(AccessGroupsMember || []);
  
  // 3. Decrypt messages with retry logic
  const { decrypted } = await decryptAccessGroupMessagesWithRetry(
    userPublicKey,
    threads.MessageThreads,
    allAccessGroups
  );
  
  // 4. Process decrypted messages
  const conversations = {};
  for (const decryptedMessage of decrypted) {
    if (!decryptedMessage.MessageInfo) continue;
    
    const otherUserKey = decryptedMessage.IsSender 
      ? decryptedMessage.RecipientInfo.OwnerPublicKeyBase58Check
      : decryptedMessage.SenderInfo.OwnerPublicKeyBase58Check;
    
    // ✅ CRITICAL: Use DecryptedMessage property, not MessageText!
    let messageText = '[Encrypted Message]';
    if (decryptedMessage.error) {
      messageText = '[Decryption Failed]';
    } else if (decryptedMessage.DecryptedMessage) {
      messageText = decryptedMessage.DecryptedMessage;
    } else if (decryptedMessage.MessageInfo.ExtraData?.unencrypted === "true") {
      // Handle unencrypted messages
      try {
        const hexString = decryptedMessage.MessageInfo.EncryptedText;
        const bytes = new Uint8Array(Buffer.from(hexString, 'hex'));
        messageText = new TextDecoder().decode(bytes);
      } catch (error) {
        messageText = '[Decoding Failed]';
      }
    }
    
    if (!conversations[otherUserKey]) {
      conversations[otherUserKey] = {
        messages: [],
        ChatType: decryptedMessage.ChatType,
        lastMessage: messageText,
        lastTimestamp: decryptedMessage.MessageInfo.TimestampNanos
      };
    }
    
    conversations[otherUserKey].messages.push({
      id: \`\${decryptedMessage.MessageInfo.TimestampNanos}-\${decryptedMessage.SenderInfo.OwnerPublicKeyBase58Check}\`,
      messageText,
      timestampNanos: decryptedMessage.MessageInfo.TimestampNanos,
      isFromSender: decryptedMessage.IsSender,
      isEncrypted: !decryptedMessage.MessageInfo.ExtraData?.unencrypted
    });
  }
  
  return {
    conversations,
    profiles: threads.PublicKeyToProfileEntryResponse
  };
};
\`\`\`

### 5. Real-time Polling Pattern
\`\`\`javascript
const useMessagePolling = (userPublicKey, interval = 5000) => {
  const [conversations, setConversations] = useState({});
  const [isPolling, setIsPolling] = useState(false);
  
  useEffect(() => {
    if (!userPublicKey) return;
    
    const pollMessages = async () => {
      try {
        setIsPolling(true);
        const { conversations: newConversations } = await getConversationsWithDecryption(userPublicKey);
        setConversations(newConversations);
      } catch (error) {
        console.error('Polling error:', error);
      } finally {
        setIsPolling(false);
      }
    };
    
    // Initial load
    pollMessages();
    
    // Set up polling
    const pollInterval = setInterval(pollMessages, interval);
    
    return () => clearInterval(pollInterval);
  }, [userPublicKey, interval]);
  
  return { conversations, isPolling };
};
\`\`\``
    },
    
    "error-handling": {
      title: "🛡️ Comprehensive Error Handling Pattern",
      content: `# DeSo Error Handling Best Practices

## 🎯 Categorized Error Handling

### 1. API Error Classification
\`\`\`javascript
const classifyError = (error) => {
  const message = error.message.toLowerCase();
  
  if (message.includes('404') || message.includes('not found')) {
    return {
      type: 'NOT_FOUND',
      userMessage: 'User or resource not found',
      technical: error.message,
      recoverable: false
    };
  }
  
  if (message.includes('network') || message.includes('fetch')) {
    return {
      type: 'NETWORK',
      userMessage: 'Network connection issue. Please try again.',
      technical: error.message,
      recoverable: true
    };
  }
  
  if (message.includes('incorrect mac')) {
    return {
      type: 'DECRYPTION',
      userMessage: 'Message could not be decrypted',
      technical: error.message,
      recoverable: false
    };
  }
  
  if (message.includes('access group')) {
    return {
      type: 'ACCESS_GROUP',
      userMessage: 'Messaging permissions issue',
      technical: error.message,
      recoverable: true
    };
  }
  
  return {
    type: 'UNKNOWN',
    userMessage: 'An unexpected error occurred',
    technical: error.message,
    recoverable: false
  };
};
\`\`\`

### 2. Retry Logic with Exponential Backoff
\`\`\`javascript
const withRetry = async (apiCall, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      const errorInfo = classifyError(error);
      
      if (!errorInfo.recoverable || attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(\`Attempt \${attempt} failed, retrying in \${delay}ms...\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
\`\`\`

### 3. React Error Boundary for DeSo Operations
\`\`\`javascript
class DeSoErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    const classified = classifyError(error);
    console.error('DeSo Error Boundary:', {
      error,
      errorInfo,
      classified
    });
    
    this.setState({ errorInfo: classified });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>DeSo Integration Error</h2>
          <p>{this.state.errorInfo?.userMessage}</p>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Technical Details</summary>
              <pre>{this.state.errorInfo?.technical}</pre>
            </details>
          )}
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
\`\`\`

### 4. Graceful Degradation Pattern
\`\`\`javascript
const useDesoWithFallback = (apiCall, fallbackValue = null) => {
  const [data, setData] = useState(fallbackValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await withRetry(() => apiCall(...args));
      setData(result);
      return result;
    } catch (err) {
      const errorInfo = classifyError(err);
      setError(errorInfo);
      
      // Return fallback for non-critical errors
      if (errorInfo.type === 'NOT_FOUND') {
        setData(fallbackValue);
        return fallbackValue;
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, fallbackValue]);
  
  return { data, error, loading, execute };
};
\`\`\``
    },
    
    "state-management": {
      title: "🔄 DeSo State Management Pattern",
      content: `# DeSo State Management Best Practices

## 🎯 Centralized DeSo State with Context

### 1. DeSo Context Provider
\`\`\`javascript
const DeSoContext = createContext();

export const DeSoProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    publicKey: null,
    username: null,
    alternateUsers: []
  });
  
  const [messaging, setMessaging] = useState({
    conversations: {},
    messages: {},
    loading: false,
    error: null
  });
  
  const [sdk, setSdk] = useState({
    isInitialized: false,
    functions: {}
  });
  
  // Initialize SDK
  useEffect(() => {
    const initializeSdk = async () => {
      try {
        const desoFunctions = await import('deso-protocol');
        setSdk({
          isInitialized: true,
          functions: desoFunctions
        });
      } catch (error) {
        console.error('Failed to initialize DeSo SDK:', error);
      }
    };
    
    initializeSdk();
  }, []);
  
  // Identity subscription
  useEffect(() => {
    if (!sdk.isInitialized) return;
    
    const { identity } = sdk.functions;
    
    const unsubscribe = identity.subscribe(({ currentUser, alternateUsers, event }) => {
      if (event === 'LOGIN_END' && currentUser) {
        setUser({
          isAuthenticated: true,
          publicKey: currentUser.publicKey,
          username: currentUser.username || currentUser.publicKey?.slice(0, 10) + '...',
          alternateUsers: alternateUsers || []
        });
      } else if (event === 'LOGOUT') {
        setUser({
          isAuthenticated: false,
          publicKey: null,
          username: null,
          alternateUsers: []
        });
        setMessaging({
          conversations: {},
          messages: {},
          loading: false,
          error: null
        });
      }
    });
    
    return unsubscribe;
  }, [sdk.isInitialized]);
  
  const value = {
    user,
    messaging,
    sdk,
    setUser,
    setMessaging
  };
  
  return (
    <DeSoContext.Provider value={value}>
      {children}
    </DeSoContext.Provider>
  );
};

export const useDeSo = () => {
  const context = useContext(DeSoContext);
  if (!context) {
    throw new Error('useDeSo must be used within DeSoProvider');
  }
  return context;
};
\`\`\`

### 2. Custom Hooks for DeSo Operations
\`\`\`javascript
// Custom hook for messaging operations
export const useDesoMessaging = () => {
  const { user, messaging, setMessaging, sdk } = useDeSo();
  
  const sendMessage = useCallback(async (recipientPublicKey, messageText) => {
    if (!user.isAuthenticated || !sdk.isInitialized) {
      throw new Error('User not authenticated or SDK not initialized');
    }
    
    setMessaging(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { sendDMMessage, checkPartyAccessGroups, identity } = sdk.functions;
      
      // Implementation from messaging-flow pattern...
      const txnHash = await sendMessage(user.publicKey, recipientPublicKey, messageText);
      
      // Update local state optimistically
      setMessaging(prev => ({
        ...prev,
        loading: false,
        // Add optimistic message to state
      }));
      
      return txnHash;
    } catch (error) {
      setMessaging(prev => ({ 
        ...prev, 
        loading: false, 
        error: classifyError(error) 
      }));
      throw error;
    }
  }, [user, sdk, setMessaging]);
  
  const refreshConversations = useCallback(async () => {
    if (!user.isAuthenticated) return;
    
    setMessaging(prev => ({ ...prev, loading: true }));
    
    try {
      const { conversations } = await getConversationsWithDecryption(user.publicKey);
      setMessaging(prev => ({
        ...prev,
        conversations,
        loading: false,
        error: null
      }));
    } catch (error) {
      setMessaging(prev => ({
        ...prev,
        loading: false,
        error: classifyError(error)
      }));
    }
  }, [user.publicKey, setMessaging]);
  
  return {
    conversations: messaging.conversations,
    loading: messaging.loading,
    error: messaging.error,
    sendMessage,
    refreshConversations
  };
};
\`\`\`

### 3. Optimistic Updates Pattern
\`\`\`javascript
const useOptimisticMessages = () => {
  const { messaging, setMessaging } = useDeSo();
  
  const addOptimisticMessage = useCallback((conversationId, message) => {
    const optimisticMessage = {
      ...message,
      id: \`optimistic-\${Date.now()}\`,
      isOptimistic: true,
      timestamp: Date.now()
    };
    
    setMessaging(prev => ({
      ...prev,
      conversations: {
        ...prev.conversations,
        [conversationId]: {
          ...prev.conversations[conversationId],
          messages: [
            optimisticMessage,
            ...(prev.conversations[conversationId]?.messages || [])
          ]
        }
      }
    }));
    
    return optimisticMessage.id;
  }, [setMessaging]);
  
  const confirmOptimisticMessage = useCallback((conversationId, optimisticId, confirmedMessage) => {
    setMessaging(prev => ({
      ...prev,
      conversations: {
        ...prev.conversations,
        [conversationId]: {
          ...prev.conversations[conversationId],
          messages: prev.conversations[conversationId]?.messages.map(msg =>
            msg.id === optimisticId ? { ...confirmedMessage, isOptimistic: false } : msg
          ) || []
        }
      }
    }));
  }, [setMessaging]);
  
  return { addOptimisticMessage, confirmOptimisticMessage };
};
\`\`\``
    }
  };

  if (pattern === 'all') {
    let response = `# 🏗️ Complete DeSo Implementation Patterns

Based on deso-chat analysis and real debugging experience.

## 🎯 Pattern Overview

| Pattern | Purpose | Key Benefits |
|---------|---------|--------------|
| Messaging Flow | Complete message send/receive | Proper encryption, access groups |
| Error Handling | Robust error management | User-friendly errors, retry logic |
| State Management | Centralized DeSo state | Clean architecture, reusability |
| API Integration | Consistent API usage | Proper response handling |
| User Switching | Multi-account support | Professional UX |
| Real-time Updates | Live message polling | Current conversation state |

`;

    for (const [key, patternInfo] of Object.entries(patterns)) {
      response += `\n## ${patternInfo.title}\n\n`;
      response += patternInfo.content.split('\n').slice(2, 8).join('\n'); // Summary
      response += `\n\n*Use \`deso_implementation_patterns\` with pattern="${key}" for complete implementation*\n\n`;
    }

    return { content: [{ type: "text", text: response }] };
  }

  if (patterns[pattern]) {
    return { content: [{ type: "text", text: patterns[pattern].content }] };
  }

  return { content: [{ type: "text", text: `Unknown pattern: ${pattern}. Available: ${Object.keys(patterns).join(', ')}` }] };
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
          console.error("🚀 DeSo MCP Server v3.0 connected successfully with 8 comprehensive tools!");
    console.error("🛠️ NEW: Advanced debugging guide and implementation patterns included!");
    
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