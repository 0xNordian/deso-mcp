# DeSo MCP Server v3.0 (HTTP)

A comprehensive Model Context Protocol (MCP) server for DeSo blockchain development, now with HTTP transport support.

## Features

🛠️ **10 Comprehensive Tools:**
- `deso_api_explorer` - Complete DeSo API documentation and examples
- `deso_js_guide` - deso-js SDK setup and usage guides  
- `generate_deso_code` - Generate code examples for DeSo operations
- `explain_deso_architecture` - Architectural explanations and patterns
- `repository_search` - Search DeSo repository documentation
- `read_repository_document` - Read specific DeSo docs
- `deso_debugging_guide` - Real debugging fixes for common issues
- `deso_implementation_patterns` - Best practices from production apps
- `deso_ui_components` - Complete UI component library guide
- `deso_graphql_helper` - GraphQL query builder and examples

🚀 **HTTP Transport:**
- RESTful HTTP API instead of stdio
- CORS support for web integration
- Health check endpoint
- Easy deployment and scaling

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start

# Development with auto-reload
npm run dev
```

The server will run on `http://localhost:3000` by default.

### Environment Variables

```bash
PORT=3000          # Server port (default: 3000)
HOST=localhost     # Server host (default: localhost)
```

### Docker Deployment

```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run

# Or manually:
docker build -t deso-mcp-server .
docker run -p 3000:3000 -e HOST=0.0.0.0 deso-mcp-server
```

## HTTP Endpoints

### Health Check
```bash
curl http://localhost:3000/
```

### MCP Tool Requests

Send JSON-RPC requests to the root endpoint. 

**Important**: 
- MCP requires initialization first, then you can call tools
- Always include the `Accept: application/json, text/event-stream` header
- The server runs in stateless mode (no session management required)

```bash
# 1. Initialize the MCP session
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "capabilities": {},
      "protocolVersion": "2024-11-05",
      "clientInfo": {"name": "my-client", "version": "1.0.0"}
    }
  }'

# 2. List available tools
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list"
  }'

# 3. Call a specific tool
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0", 
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "deso_api_explorer",
      "arguments": {
        "category": "social",
        "includeCode": true
      }
    }
  }'
```

## Example Usage

### JavaScript Client Example

```javascript
class DesoMCPClient {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.initialized = false;
  }

  async request(method, params = {}) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.result;
  }

  async initialize() {
    await this.request('initialize', {
      capabilities: {},
      protocolVersion: '2024-11-05',
      clientInfo: { name: 'deso-client', version: '1.0.0' }
    });
    this.initialized = true;
  }

  async callTool(name, args) {
    if (!this.initialized) await this.initialize();
    return this.request('tools/call', { name, arguments: args });
  }
}

// Usage examples:
const client = new DesoMCPClient();

// Get DeSo API Information
const apiInfo = await client.callTool('deso_api_explorer', {
  category: 'social',
  endpoint: 'submit-post',
  includeCode: true
});
```

// Debug DeSo Integration Issues
const debugInfo = await client.callTool('deso_debugging_guide', {
  issue: 'message-decryption',
  includeCode: true
});

// Generate GraphQL Queries
const query = await client.callTool('deso_graphql_helper', {
  action: 'build',
  question: 'How many followers does nader have?',
  username: 'nader'
});
```

## Integration with MCP Clients

### Claude Desktop Configuration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "deso": {
      "command": "npx",
      "args": ["deso-mcp-server"],
      "transport": "http",
      "url": "http://localhost:3000"
    }
  }
}
```

### VS Code Integration

Use with MCP-compatible VS Code extensions by configuring the HTTP endpoint:

```json
{
  "mcp.servers": [
    {
      "name": "deso",
      "transport": "http",
      "url": "http://localhost:3000"
    }
  ]
}
```

## Architecture

The server uses:
- **HTTP Transport**: RESTful API with JSON-RPC over HTTP
- **CORS Support**: Cross-origin requests enabled
- **Graceful Shutdown**: Proper cleanup on SIGINT/SIGTERM
- **Error Handling**: Comprehensive error responses
- **Health Checks**: Built-in monitoring endpoint

## Development

### Project Structure
```
deso-mcp/
├── deso-mcp.js          # Main MCP server
├── package.json         # Dependencies and scripts  
├── Dockerfile          # Container configuration
└── README.md           # Documentation
```

### Debugging
- Enable debug logging with `DEBUG=mcp:*`
- Check server health at `http://localhost:3000/`
- Monitor logs for request/response details

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with HTTP requests
5. Submit a pull request

## Support

For issues and questions:
- GitHub Issues: [deso-protocol/mcp-server](https://github.com/deso-protocol/mcp-server)
- DeSo Documentation: [docs.deso.org](https://docs.deso.org)
- Developer Discord: [DeSo Developers](https://discord.gg/deso) 