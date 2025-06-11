# DeSo MCP Server for Cursor IDE v2.2

A comprehensive Model Context Protocol (MCP) server that provides **complete DeSo blockchain API coverage** for Cursor IDE. This server transforms Cursor's AI assistant into a DeSo development expert with extensive knowledge about all DeSo APIs, the deso-js SDK, backend implementation details, and production-ready code generation.

## 🔥 **What's New in v2.2**
- **Complete Data API Coverage**: All endpoint categories from DeSo backend documentation
- **40+ Data Endpoints**: Users, Posts, NFTs, Messages, Notifications, Access Groups, and more
- **Enhanced API Explorer**: Comprehensive backend handler mapping and parameter documentation

## 🚀 What This Does

This MCP server transforms Cursor's AI assistant into a **DeSo development expert** by providing:

- **Complete DeSo API Knowledge**: All endpoints from the backend with handler details
- **deso-js SDK Expertise**: Full SDK documentation and usage patterns  
- **Code Generation**: Production-ready examples in JavaScript, TypeScript, React, and cURL
- **Architecture Guidance**: Deep understanding of DeSo's transaction flows and systems
- **Backend Integration**: Direct mapping to `routes/transaction.go` and other backend files

## 📋 Features Checklist

### ✅ **API Explorer (`deso_api_explorer`)**
- [x] **Social APIs** (follow, post, like, diamonds, profile updates, messaging)
- [x] **Financial APIs** (creator coins, DeSo transfers, diamonds, Bitcoin exchange)
- [x] **NFT APIs** (create, bid, accept, transfer, burn NFTs)
- [x] **DAO APIs** (mint, burn, transfer, limit/market orders)
- [x] **Derived Keys APIs** (authorize, de-authorize derived keys)
- [x] **Associations APIs** (create/delete user/post associations)
- [x] **Access Groups APIs** (create, update, manage members)
- [x] **Data APIs** (40+ endpoints across all categories):
  - **User Endpoints** (profiles, multiple users, leaderboards)
  - **Post Endpoints** (feeds, single posts, hot feed, user posts)  
  - **Social Endpoints** (follows, holders, diamonds, hodlings)
  - **NFT Endpoints** (user NFTs, bids, showcase, collections)
  - **Messages Endpoints** (DM threads, paginated messages)
  - **Notifications Endpoints** (get notifications, unread counts)
  - **Access Groups Endpoints** (user groups, group info, bulk entries)
  - **Tokens Endpoints** (DeSo Token trading, limit orders)
  - **Media Endpoints** (image/video upload, processing status)
  - **Admin Endpoints** (node control, global params)
  - **Blockchain Endpoints** (blocks, transactions, mempool)
- [x] Backend handler mapping from `routes/*.go` files
- [x] deso-js SDK function mapping
- [x] Parameter documentation (required/optional)
- [x] Code examples for each endpoint

### ✅ **deso-js SDK Guide (`deso_js_guide`)**
- [x] Installation and setup instructions
- [x] Configuration for web and React Native
- [x] Identity and authentication management
- [x] Transaction creation patterns
- [x] Data fetching examples
- [x] Permission management
- [x] JWT handling for API calls

### ✅ **Code Generator (`generate_deso_code`)**
- [x] JavaScript examples
- [x] TypeScript examples  
- [x] React component examples
- [x] cURL command examples
- [x] Authentication integration
- [x] Full working examples
- [x] Follow operations
- [x] Post creation
- [x] Creator coin operations
- [x] Diamond sending

### ✅ **Architecture Explainer (`explain_deso_architecture`)**
- [x] Transaction flow explanation
- [x] Identity system breakdown
- [x] Derived key permissions
- [x] Integration patterns
- [x] Code examples for complex flows

### ✅ **Knowledge Base Integration**
- [x] Backend routes mapping (`/routes/*.go`)
- [x] deso-js SDK functions (`/repos/deso-js/src/`)
- [x] API documentation (`/repos/docs/`)
- [x] React examples integration
- [x] GraphQL schema understanding

## 🛠 Installation & Setup

### Prerequisites

- Node.js (v18+ recommended)
- Cursor IDE
- Git (for cloning repositories)

### 1. Clone and Setup

```bash
# Clone your repository
git clone <your-repo-url>
cd deso-mcp

# Install dependencies
npm install

# Verify the MCP server works
npm run test
# OR manually:
# echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node mcp-server.js
```

### 2. Configure Cursor IDE

Create or update your Cursor MCP configuration file:

**File:** `.cursor/mcp.json`

```json
{
  "deso-mcp": {
    "command": "node",
    "args": ["mcp-server.js"],
    "cwd": "/absolute/path/to/your/deso-mcp",
    "type": "stdio"
  }
}
```

**Important:** Replace `/absolute/path/to/your/deso-mcp` with your actual project path.

**💡 Quick tip:** Run `pwd` in your project directory to get the absolute path:
```bash
cd deso-mcp
pwd
# Copy this path to use in .cursor/mcp.json
```

### 3. Enable in Cursor Settings

1. Open Cursor Settings (`⌘ + ,` on Mac, `Ctrl + ,` on Windows/Linux)
2. Navigate to **Features** → **MCP**
3. You should see "deso-mcp" listed
4. Ensure it shows as "Connected" ✅

### 4. Test the Integration

1. **Start a new chat** in Cursor (`⌘ + L` or `Ctrl + L`)
2. **Test with this prompt:**
   ```
   Use the DeSo MCP tools to show me how to follow a user with the deso-js SDK
   ```
3. **You should see** the AI use your MCP tools and provide comprehensive DeSo-specific guidance!

## 🎯 Usage Examples

Once configured, you can ask Cursor's AI assistant questions like:

### API Exploration
- *"Show me all the data endpoints available in DeSo"*
- *"What notification APIs can I use to get user notifications?"*
- *"How do I fetch DM messages using the messages API?"*
- *"Show me the DeSo Token trading endpoints"*
- *"What endpoints are available for uploading media?"*
- *"How do I get NFT bids and collections data?"*

### Code Generation  
- *"Generate a React component for creating and minting NFTs"*
- *"Show me how to set up DAO coin limit orders using deso-js"*
- *"Create a JavaScript function for managing derived key permissions"*
- *"Generate a React form for transferring creator coins"*

### Setup & Configuration
- *"How do I set up the deso-js SDK in a React app?"*
- *"What permissions do I need for posting transactions?"*
- *"Show me how to configure identity management"*

### Architecture Understanding
- *"Explain how DeSo transactions work"*
- *"What's the difference between master keys and derived keys?"*
- *"How does the two-phase transaction system work?"*

## 🔧 Running the Server Manually

For development or debugging:

```bash
# Quick tests using npm scripts
npm run test              # Test tools list
npm run test-follow       # Test follow endpoint with code

# Run the server manually
node mcp-server.js

# Test specific tools manually
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "deso_api_explorer", "arguments": {"category": "social"}}}' | node mcp-server.js

# Test code generation
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "generate_deso_code", "arguments": {"operation": "follow", "language": "react", "includeAuth": true}}}' | node mcp-server.js
```

## 📁 Project Structure

```
deso-mcp/
├── mcp-server.js          # Main MCP server implementation
├── package.json           # Dependencies and scripts
├── .cursor/
│   └── mcp.json          # Cursor MCP configuration
├── repos/
│   ├── docs/             # DeSo documentation
│   ├── backend/          # DeSo backend code
│   └── deso-js/          # DeSo JavaScript SDK
└── schema.graphql        # DeSo GraphQL schema
```

## 🐛 Troubleshooting

### MCP Server Not Connecting

1. **Check the path** in `.cursor/mcp.json` is absolute and correct
2. **Restart Cursor** completely
3. **Check server runs manually:**
   ```bash
   node mcp-server.js
   # Should output: "DeSo MCP Comprehensive Server running on stdio"
   ```

### Tools Not Available in Chat

1. **Start a new chat session** in Cursor (`⌘ + L`)
2. **Explicitly mention MCP tools** in your first message
3. **Check MCP status** in Cursor Settings → Features → MCP

### Dependencies Issues

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be v18+
```

## 🚀 Advanced Usage

### Adding Custom Endpoints

To add new DeSo endpoints to the MCP server:

1. **Edit `mcp-server.js`**
2. **Add to the `apiDetails` object** in `exploreDesoApi()` method
3. **Include backend handler and deso-js function mapping**
4. **Restart the MCP server**

### Framework-Specific Examples

The server can generate examples for different frameworks:
- **Vanilla JavaScript**: Basic SDK usage
- **React**: Component patterns with hooks
- **Next.js**: Server-side integration
- **React Native**: Mobile-specific configuration

## 📚 Related Resources

- **[DeSo Documentation](https://docs.deso.org/)**
- **[deso-js SDK](https://www.npmjs.com/package/deso-protocol)**
- **[DeSo Backend Repository](https://github.com/deso-protocol/backend)**
- **[React Examples](https://github.com/deso-protocol/deso-examples-react)**
- **[Model Context Protocol](https://modelcontextprotocol.io/)**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add new MCP tools or enhance existing ones
4. Update this README with new features
5. Submit a pull request

## 📝 License

[Add your license here]

## ✅ Quick Verification

After setup, verify everything is working:

```bash
# 1. Test MCP server is functional
npm run test

# 2. Test specific tool with code examples  
npm run test-follow

# 3. Check Cursor MCP connection
# Open Cursor → Settings → Features → MCP → Should show "deso-mcp" as Connected ✅

# 4. Test in Cursor AI
# Start new chat (⌘ + L) and ask:
# "Use the DeSo MCP tools to show me how to create a post"
```

---

**🎉 Congratulations! Your Cursor AI assistant is now a DeSo development expert!**

**What you can do now:**
- Ask about any DeSo API endpoint
- Generate production-ready React components
- Get comprehensive deso-js SDK guidance
- Understand DeSo architecture and flows
- Create complete authentication flows

**Start a new chat in Cursor and experience the power of AI-assisted DeSo development!** ⚡ 