#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Create server with explicit error handling
const server = new Server(
  {
    name: "deso-robust",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Add error handling
server.onerror = (error) => {
  console.error("Server error:", error);
};

// List tools handler with explicit error handling
server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    const tools = [
      {
        name: "test_tool",
        description: "A test tool",
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Test message"
            }
          },
          required: ["message"]
        }
      }
    ];
    
    console.error("Returning tools:", tools.length);
    return { tools };
  } catch (error) {
    console.error("Error in ListTools:", error);
    throw error;
  }
});

// Call tool handler with explicit error handling
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    
    console.error("Tool called:", name, "with args:", args);
    
    if (name === "test_tool") {
      return {
        content: [
          {
            type: "text",
            text: `Test: ${args.message || 'no message'}`
          }
        ]
      };
    }
    
    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    console.error("Error in CallTool:", error);
    throw error;
  }
});

// Start server with better error handling
async function main() {
  try {
    const transport = new StdioServerTransport();
    
    // Add transport error handling
    transport.onerror = (error) => {
      console.error("Transport error:", error);
    };
    
    await server.connect(transport);
    console.error("DeSo Robust MCP Server connected successfully");
    
    // Keep process alive
    process.on('SIGINT', () => {
      console.error("Server shutting down...");
      process.exit(0);
    });
    
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main(); 