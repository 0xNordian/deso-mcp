#!/usr/bin/env node

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");

class DesoMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "deso-mcp-cjs",
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
            name: "test_tool",
            description: "A simple test tool to verify MCP connection",
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
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      if (name === "test_tool") {
        return { 
          content: [{ 
            type: "text", 
            text: `Test tool called with message: ${args.message}` 
          }] 
        };
      }
      
      throw new Error(`Unknown tool: ${name}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("DeSo MCP CJS Server running on stdio");
  }
}

const server = new DesoMCPServer();
server.run().catch(console.error); 