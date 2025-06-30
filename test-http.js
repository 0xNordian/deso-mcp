#!/usr/bin/env node

/**
 * Test script for HTTP MCP server
 * Run this to verify the server is working correctly
 */

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const BASE_URL = `http://${HOST}:${PORT}`;

async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  
  try {
    const response = await fetch(`${BASE_URL}/`, {
      headers: {
        'Accept': 'application/json, text/event-stream'
      }
    });
    
    if (response.status === 400) {
      // Expected behavior for MCP server without initialization
      console.log('✅ Health check passed (MCP server responding)');
      return true;
    } else if (response.ok) {
      console.log('✅ Health check passed');
      return true;
    } else {
      console.log('❌ Health check failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

async function testToolsList() {
  console.log('🔍 Testing tools list...');
  
  try {
    // First initialize the server
    const initResponse = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          capabilities: {},
          protocolVersion: '2024-11-05',
          clientInfo: { name: 'test-client', version: '1.0.0' }
        }
      })
    });

    if (!initResponse.ok) {
      console.log('❌ Tools list failed: Initialization failed');
      return false;
    }

    // Now list tools
    const response = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list'
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result && data.result.tools) {
        console.log(`✅ Tools list successful: ${data.result.tools.length} tools available`);
        console.log('   Tools:', data.result.tools.map(t => t.name).join(', '));
        return true;
      } else {
        console.log('❌ Tools list failed: Invalid response structure');
        return false;
      }
    } else {
      console.log('❌ Tools list failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Tools list error:', error.message);
    return false;
  }
}

async function testToolCall() {
  console.log('🔍 Testing tool call...');
  
  try {
    // First initialize the server
    const initResponse = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          capabilities: {},
          protocolVersion: '2024-11-05',
          clientInfo: { name: 'test-client', version: '1.0.0' }
        }
      })
    });

    if (!initResponse.ok) {
      console.log('❌ Tool call failed: Initialization failed');
      return false;
    }

    // Now call the tool
    const response = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'deso_api_explorer',
          arguments: {
            category: 'social',
            endpoint: 'submit-post'
          }
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result && data.result.content) {
        console.log('✅ Tool call successful');
        console.log('   Response preview:', data.result.content[0].text.substring(0, 100) + '...');
        return true;
      } else {
        console.log('❌ Tool call failed: Invalid response structure');
        return false;
      }
    } else {
      console.log('❌ Tool call failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Tool call error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log(`🚀 Testing DeSo MCP HTTP Server at ${BASE_URL}\n`);
  
  const results = [];
  
  results.push(await testHealthCheck());
  console.log('');
  
  results.push(await testToolsList());
  console.log('');
  
  results.push(await testToolCall());
  console.log('');
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! HTTP MCP server is working correctly.');
    process.exit(0);
  } else {
    console.log('💥 Some tests failed. Check the server configuration.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test runner error:', error.message);
  process.exit(1);
}); 