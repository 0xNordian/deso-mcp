#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

class SimpleDesoMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "deso-mcp-simple",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
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

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        case "deso_api_explorer":
          return { content: [{ type: "text", text: "DeSo API Explorer: " + JSON.stringify(args) }] };
        case "deso_js_guide":
          return { content: [{ type: "text", text: "DeSo JS Guide: " + JSON.stringify(args) }] };
        case "generate_deso_code":
          return { content: [{ type: "text", text: "DeSo Code Generator: " + JSON.stringify(args) }] };
        case "explain_deso_architecture":
          return { content: [{ type: "text", text: "DeSo Architecture: " + JSON.stringify(args) }] };
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Simple DeSo MCP Server running on stdio");
  }
}

const server = new SimpleDesoMCPServer();
server.run().catch(console.error); 