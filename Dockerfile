# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install system dependencies and npm packages
RUN apk add --no-cache curl && \
    npm ci --only=production && \
    npm install -g pm2

# Copy the MCP server code
COPY deso-mcp.js ./

# Make the script executable
RUN chmod +x deso-mcp.js

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcp -u 1001

# Change ownership of the app directory
RUN chown -R mcp:nodejs /app
USER mcp

# Expose port for HTTP MCP server
EXPOSE 3000

# Health check via HTTP
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Use pm2 to keep process running
CMD ["pm2-runtime", "start", "deso-mcp.js", "--name", "mcp-server"]