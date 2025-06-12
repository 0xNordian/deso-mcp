# 🚀 DeSo Messaging App

A decentralized messaging application built on the DeSo blockchain using Next.js, React, and TypeScript.

## ✨ Features

- **🔐 DeSo Identity Authentication**: Secure login with DeSo identity
- **👥 User Discovery**: Search for users by username
- **💬 Real-time Messaging**: Send messages directly on the DeSo blockchain
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🎨 Modern UI**: Clean, intuitive interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Blockchain**: DeSo Protocol
- **SDK**: deso-protocol npm package
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Context API

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd example-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 How to Use

### 1. **Login**
- Click "Login with DeSo" on the homepage
- Complete the DeSo identity authentication
- Grant necessary permissions for messaging

### 2. **Find Users**
- Click "Search Users" on the dashboard
- Enter a DeSo username (try "diamondhands" or "nader")
- Select a user from the search results

### 3. **Start Messaging**
- Click "Start Chat" or select from recent chats
- Type your message and press Enter or click Send
- Messages are sent directly to the DeSo blockchain!

## 🏗️ Architecture

### Components Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat interface components
│   └── user/           # User search and management
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
└── app/                # Next.js app directory
```

### Key Components

- **AuthProvider**: Manages DeSo identity state
- **MessageThread**: Complete chat interface
- **MessageBubble**: Individual message display
- **MessageInput**: Message composition
- **UserSearch**: User discovery functionality

## 🔧 Development Status

### ✅ Completed Features
- [x] DeSo Identity authentication
- [x] User search by username
- [x] Message sending to blockchain
- [x] Full chat UI with responsive design
- [x] Real-time message composition
- [x] Error handling and loading states

### 🚧 In Progress
- [ ] Message history retrieval (API research needed)
- [ ] Real-time message updates via polling
- [ ] Message encryption/decryption

### 🎯 Future Features
- [ ] Group messaging
- [ ] File sharing
- [ ] Message status indicators
- [ ] Dark/light mode
- [ ] Push notifications

## 🔑 DeSo Integration

### Authentication
The app uses DeSo Identity for secure authentication:
```typescript
// Login
await identity.login();

// Check permissions
const hasPermission = identity.hasPermissions({
  TransactionCountLimitMap: { BASIC_TRANSFER: 1 }
});
```

### Messaging
Messages are sent using the DeSo protocol:
```typescript
const result = await sendDMMessage({
  SenderPublicKeyBase58Check: currentUser.publicKey,
  RecipientPublicKeyBase58Check: recipient.publicKey,
  MessageText: message,
  MinFeeRateNanosPerKB: 1000
});
```

### User Discovery
Users are found using the DeSo API:
```typescript
const profile = await getSingleProfile({
  Username: searchTerm
});
```

## 🐛 Known Issues

1. **Message Retrieval**: Currently, the app can send messages but retrieving message history requires further API research
2. **Real-time Updates**: Messages don't update in real-time yet (polling implementation needed)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **DeSo Protocol**: For providing the decentralized social blockchain
- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

For questions or support, please open an issue in the repository.

## 🔍 Debugging & Troubleshooting

### Enhanced Logging System

The app includes a comprehensive logging system with color-coded console output to help debug messaging issues:

```typescript
// Log categories with emoji indicators:
🔵 [SECTION] Info messages
✅ [SECTION] Success messages  
❌ [SECTION] Error messages
⚠️ [SECTION] Warning messages
🔍 [SECTION] Debug messages
```

### Key Debugging Sections

#### 1. **INIT** - SDK Initialization
- Tracks DeSo protocol SDK loading
- Shows which functions are available
- Reports initialization failures

#### 2. **PROFILE** - User Profile Fetching
- Logs profile fetch attempts and results
- Shows profile picture availability
- Tracks username resolution issues

#### 3. **THREADS** - Conversation Retrieval
- Monitors DM thread fetching with profile enrichment
- Shows thread processing and profile loading
- Tracks conversation list updates

#### 4. **MESSAGES** - Message Operations
- Logs message fetching with decryption attempts
- Shows access group validation
- Tracks message processing pipeline

#### 5. **DECRYPT** - Message Decryption
- Attempts message decryption with fallbacks
- Shows encrypted vs plain text handling
- Reports decryption failures

#### 6. **SEND** - Message Sending
- Step-by-step message sending process
- Access group validation and encryption
- Blockchain transaction tracking

#### 7. **POLLING** - Real-time Updates
- Polling start/stop events
- Interval trigger logging
- Performance monitoring

### Common Issues & Solutions

#### 🔐 Message Decryption Issues
**Problem**: Messages show as `[Encrypted: ...]` or fail to decrypt

**Debug Steps**:
1. Check console for `[DECRYPT]` logs
2. Verify identity service is loaded: `[INIT]` section
3. Check access group availability: `[USER_ACCESS_GROUPS]`

**Potential Causes**:
- Identity service not properly initialized
- Missing access groups for user
- Encryption/decryption key mismatch

#### 👤 Profile Information Missing
**Problem**: Conversations show "Unknown User" or missing profile pictures

**Debug Steps**:
1. Monitor `[PROFILE]` logs for fetch attempts
2. Check `[THREADS]` for profile enrichment process
3. Verify API responses in `[CONVERSATIONS]`

**Potential Causes**:
- User profile doesn't exist or is private
- API rate limiting or connectivity issues
- Profile fetch API changes

#### 📋 Conversation List Issues  
**Problem**: No conversations appear or incomplete data

**Debug Steps**:
1. Check `[CONVERSATIONS]` logs for fetch process
2. Verify user authentication in `[HOOK]` logs
3. Monitor `[THREADS]` for API responses

**Potential Causes**:
- No existing conversations for the user
- API endpoint changes or access issues
- Access group configuration problems

#### 💬 Message Sending Failures
**Problem**: Messages fail to send with various errors

**Debug Steps**:
1. Follow `[SEND]` step-by-step process logs
2. Check access group validation: `[ACCESS_GROUPS]`
3. Verify encryption process in `[SEND] Step 2`

**Common Error Patterns**:
```
400 Error: Access group configuration issues
404 Error: API endpoint not found
403 Error: Permission denied
Encryption Error: Identity service issues
```

### Debugging Tips

1. **Open Browser Console**: All logs appear in the browser developer console
2. **Filter by Section**: Use browser console filtering with `[SECTION_NAME]`
3. **Monitor Network Tab**: Check API calls in browser dev tools
4. **Check Authentication**: Ensure DeSo Identity login is successful
5. **Verify Recipient**: Ensure target user exists and has proper access groups

### API Endpoints Used

The app uses these DeSo API endpoints:
- `POST /api/v0/get-user-dm-threads-ordered-by-timestamp`
- `POST /api/v0/get-paginated-messages-for-dm-thread`  
- `POST /api/v0/send-dm-message`
- `POST /api/v0/check-party-access-groups`
- `POST /api/v0/get-all-user-access-groups`
- `POST /api/v0/get-single-profile`

### Performance Monitoring

- **Polling Interval**: 10 seconds (configurable)
- **Message Batch Size**: 50 messages max per fetch
- **Concurrent Profile Fetches**: Handled via Promise.all()
- **Error Recovery**: Local state maintained on API failures

---

**Built with ❤️ for the decentralized web** 