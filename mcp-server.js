#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

class ComprehensiveDesoMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "deso-mcp-comprehensive",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupTools();
  }

  setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "deso_api_explorer",
            description: "Comprehensive DeSo API explorer with backend implementation details and deso-js SDK integration",
            inputSchema: {
              type: "object",
              properties: {
                category: {
                  type: "string",
                  enum: ["social", "financial", "nft", "dao", "access", "messages", "data", "blockchain", "all"],
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
                  enum: ["setup", "identity", "transactions", "data", "permissions", "examples", "troubleshooting"],
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
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "deso_api_explorer":
          return this.exploreDesoApi(request.params.arguments);
        case "deso_js_guide":
          return this.getDesoJsGuide(request.params.arguments);
        case "generate_deso_code":
          return this.generateDesoCode(request.params.arguments);
        case "explain_deso_architecture":
          return this.explainDesoArchitecture(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  async exploreDesoApi(args) {
    const { category = 'all', endpoint, includeCode = false } = args;
    
    const apiDetails = {
      social: {
        description: "Social interaction endpoints for posts, follows, likes, and diamonds",
        backendFile: "routes/transaction.go, routes/post.go",
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
          }
        }
      },
      data: {
        description: "Data fetching endpoints for posts, users, follows, and more",
        backendFile: "routes/user.go, routes/post.go",
        endpoints: {
          "get-posts-stateless": {
            method: "POST",
            url: "/api/v0/get-posts-stateless",
            handler: "GetPostsStateless",
            description: "Fetch posts with filtering options",
            desoJs: "getPostsStateless",
            params: {
              required: [],
              optional: ["PostHashHex", "ReaderPublicKeyBase58Check", "OrderBy", "StartTstampSecs", "NumToFetch"]
            }
          },
          "get-single-profile": {
            method: "POST",
            url: "/api/v0/get-single-profile", 
            handler: "GetSingleProfile",
            description: "Get single user profile",
            desoJs: "getSingleProfile",
            params: {
              required: [],
              optional: ["PublicKeyBase58Check", "Username"]
            }
          },
          "get-follows-stateless": {
            method: "POST",
            url: "/api/v0/get-follows-stateless",
            handler: "GetFollowsStateless", 
            description: "Get followers/following for user",
            desoJs: "getFollowersForUser",
            params: {
              required: ["PublicKeyBase58Check"],
              optional: ["GetEntriesFollowingUsername", "LastPublicKeyBase58Check", "NumToFetch"]
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
            result += this.generateEndpointExample(endpoint, ep);
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

  async getDesoJsGuide(args) {
    const { topic, framework = 'vanilla' } = args;
    
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

  async generateDesoCode(args) {
    const { operation, language, includeAuth = false, fullExample = false } = args;
    
    const examples = {
      follow: {
        javascript: `// Follow a user using deso-js
import { updateFollowingStatus, identity } from 'deso-protocol';

${includeAuth ? `// Login first
await identity.login();
const currentUser = identity.snapshot().currentUser;
` : ''}
const followResult = await updateFollowingStatus({
  FollowerPublicKeyBase58Check: ${includeAuth ? 'currentUser.publicKey' : "'YOUR_PUBLIC_KEY'"},
  FollowedPublicKeyBase58Check: 'BC1YLiQ86kwXaVaUVwKyKF5uo2Kxt8SSeZ2CzGTAVp2TRb4VJeFHLqd',
  IsUnfollow: false // true to unfollow
});

console.log('Follow transaction:', followResult);`,
        
        react: `// React component for following users
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
}`,

        curl: `# Follow a user via direct API call
curl -X POST https://node.deso.org/api/v0/create-follow-txn-stateless \\
  -H "Content-Type: application/json" \\
  -d '{
    "FollowerPublicKeyBase58Check": "YOUR_PUBLIC_KEY",
    "FollowedPublicKeyBase58Check": "BC1YLiQ86kwXaVaUVwKyKF5uo2Kxt8SSeZ2CzGTAVp2TRb4VJeFHLqd",
    "IsUnfollow": false,
    "MinFeeRateNanosPerKB": 1000
  }'`
      },
      post: {
        javascript: `// Create a post using deso-js
import { submitPost, identity } from 'deso-protocol';

${includeAuth ? `// Login first
await identity.login();
const currentUser = identity.snapshot().currentUser;
` : ''}
const postResult = await submitPost({
  UpdaterPublicKeyBase58Check: ${includeAuth ? 'currentUser.publicKey' : "'YOUR_PUBLIC_KEY'"},
  BodyObj: {
    Body: 'Hello DeSo! This is my first post using the SDK.',
    ImageURLs: [],
    VideoURLs: []
  }
});

console.log('Post created:', postResult);`,

        react: `// React component for creating posts
import React, { useState } from 'react';
import { submitPost, identity } from 'deso-protocol';

function CreatePost() {
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText.trim()) return;
    
    setLoading(true);
    try {
      const currentUser = identity.snapshot().currentUser;
      
      const result = await submitPost({
        UpdaterPublicKeyBase58Check: currentUser.publicKey,
        BodyObj: {
          Body: postText,
          ImageURLs: [],
          VideoURLs: []
        }
      });
      
      console.log('Post created:', result);
      setPostText('');
    } catch (error) {
      console.error('Post error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="What's happening?"
        rows={3}
      />
      <button type="submit" disabled={loading || !postText.trim()}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}`
      }
    };

    if (examples[operation] && examples[operation][language]) {
      return { content: [{ type: "text", text: examples[operation][language] }] };
    }

    return { content: [{ type: "text", text: `Example for "${operation}" in "${language}" not available` }] };
  }

  async explainDesoArchitecture(args) {
    const { topic, includeCode = false } = args;
    
    const explanations = {
      "transaction-flow": `# DeSo Transaction Flow

DeSo uses a two-step transaction process:

## 1. Construction Phase
- Create unsigned transaction with required parameters
- Calculate fees and validate inputs
- Returns transaction hex and metadata

## 2. Signing & Submission Phase  
- Sign transaction with private key (via identity service)
- Submit signed transaction to network
- Transaction gets mined into a block

## Backend Implementation
The backend (routes/transaction.go) handles:
- Parameter validation
- UTXO selection and fee calculation
- Transaction construction
- Mempool submission

## deso-js SDK Integration
The SDK abstracts this complexity:
- Handles both phases automatically
- Manages identity and permissions
- Provides simple function calls

${includeCode ? `
## Example Flow
\`\`\`javascript
// This single call handles both phases
const result = await submitPost({
  UpdaterPublicKeyBase58Check: currentUser.publicKey,
  BodyObj: { Body: 'Hello!' }
});
// SDK internally:
// 1. Calls /api/v0/submit-post (construct)
// 2. Signs with identity service  
// 3. Submits signed transaction
\`\`\`
` : ''}`,

      "identity-system": `# DeSo Identity System

## Core Concepts
- **Master Keys**: Main account keys (never shared)
- **Derived Keys**: Limited permission keys for apps
- **Access Signatures**: Authorize derived key usage

## Permission System
Derived keys have spending limits:
- Global DeSo spending limit
- Transaction count limits by type
- Creator coin operation limits
- NFT operation limits

## deso-js Integration
The SDK manages identity automatically:
- Handles login/logout flows
- Manages derived key permissions
- Provides permission checking utilities

${includeCode ? `
## Example Usage
\`\`\`javascript
import { identity } from 'deso-protocol';

// Check if we can post
const canPost = identity.hasPermissions({
  TransactionCountLimitMap: {
    SUBMIT_POST: 1
  }
});

if (!canPost) {
  // Request permission from user
  await identity.requestPermissions({
    TransactionCountLimitMap: {
      SUBMIT_POST: 10
    }
  });
}
\`\`\`
` : ''}`
    };

    if (explanations[topic]) {
      return { content: [{ type: "text", text: explanations[topic] }] };
    }

    return { content: [{ type: "text", text: `Architecture topic "${topic}" not found` }] };
  }

  generateEndpointExample(endpoint, details) {
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

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("DeSo MCP Comprehensive Server running on stdio");
  }
}

const server = new ComprehensiveDesoMCPServer();
server.run().catch(console.error); 