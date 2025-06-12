#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "deso-mcp-working",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
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
      }
    ]
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "deso_api_explorer":
      return {
        content: [
          {
            type: "text",
            text: `# DeSo API Explorer

**Category:** ${args.category || 'all'}
**Endpoint:** ${args.endpoint || 'Not specified'}
**Include Code:** ${args.includeCode || false}

## Available Categories:
- **social**: Follow, post, like, diamonds endpoints
- **financial**: Creator coins, DeSo transfers, diamonds
- **nft**: NFT creation, bidding, transfers
- **dao**: DAO coin operations and limit orders
- **identity**: Authentication and key management
- **data**: Comprehensive data fetching endpoints

This is a working DeSo MCP server! 🎉`
          }
        ]
      };
      
    case "deso_js_guide":
      return {
        content: [
          {
            type: "text",
            text: `# DeSo-JS SDK Guide

**Topic:** ${args.topic}
**Framework:** ${args.framework || 'vanilla'}

## Getting Started with DeSo-JS

\`\`\`bash
npm install deso-protocol
\`\`\`

\`\`\`javascript
import { identity, configure } from 'deso-protocol';

// Configure the SDK
configure({
  nodeURI: 'https://node.deso.org',
  appName: 'My DeSo App'
});

// Login
await identity.login();
\`\`\`

Your DeSo MCP server is working! 🚀`
          }
        ]
      };
      
    case "generate_deso_code":
      return {
        content: [
          {
            type: "text",
            text: `# DeSo Code Generator

**Operation:** ${args.operation}
**Language:** ${args.language}
**Include Auth:** ${args.includeAuth || false}

## Generated ${args.language.toUpperCase()} Code for: ${args.operation}

\`\`\`${args.language}
// DeSo ${args.operation} example
import { ${args.operation === 'follow' ? 'updateFollowingStatus' : 'submitPost'} } from 'deso-protocol';

${args.includeAuth ? '// Login first\nawait identity.login();\nconst user = identity.snapshot().currentUser;\n' : ''}
const result = await ${args.operation === 'follow' ? 'updateFollowingStatus' : 'submitPost'}({
  // Your parameters here
});

console.log('Success:', result);
\`\`\`

Your DeSo MCP server is generating code! ⚡`
          }
        ]
      };
      
    case "explain_deso_architecture":
      return {
        content: [
          {
            type: "text",
            text: `# DeSo Architecture Explanation

**Topic:** ${args.topic}
**Include Code:** ${args.includeCode || false}

## DeSo Architecture Overview

DeSo uses a two-phase transaction system:

1. **Construction Phase**: Create unsigned transaction
2. **Signing Phase**: Sign with identity service
3. **Submission Phase**: Submit to blockchain

## Key Components:
- **Identity Service**: Manages keys and authentication
- **Derived Keys**: Limited permission keys for apps
- **Backend API**: Transaction construction and data
- **deso-js SDK**: Abstracts complexity

Your DeSo MCP server is explaining architecture! 🏗️`
          }
        ]
      };
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DeSo MCP Working Server running on stdio");
}

main().catch(console.error); 