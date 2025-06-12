#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  InitializeRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

class ComprehensiveDesoMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "deso-mcp-comprehensive",
        version: "2.3.0",
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
    // Handle initialization
    this.server.setRequestHandler(InitializeRequestSchema, async () => {
      return {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {},
          resources: {}
        },
        serverInfo: {
          name: "deso-mcp-comprehensive",
          version: "2.3.0"
        }
      };
    });

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
          },
          "update-profile": {
            method: "POST",
            url: "/api/v0/update-profile",
            handler: "UpdateProfile",
            description: "Update user profile information",
            desoJs: "updateProfile",
            params: {
              required: ["UpdaterPublicKeyBase58Check", "NewCreatorBasisPoints", "NewStakeMultipleBasisPoints", "MinFeeRateNanosPerKB"],
              optional: ["ProfilePublicKeyBase58Check", "NewUsername", "NewDescription", "NewProfilePic", "IsHidden", "ExtraData"]
            }
          },
          "send-message-stateless": {
            method: "POST",
            url: "/api/v0/send-message-stateless",
            handler: "SendMessageStateless",
            description: "Send private message between users",
            desoJs: "sendDMMessage",
            params: {
              required: ["SenderPublicKeyBase58Check", "RecipientPublicKeyBase58Check", "MessageText", "MinFeeRateNanosPerKB"],
              optional: ["EncryptedMessageText", "SenderMessagingPublicKey", "SenderMessagingKeyName", "RecipientMessagingPublicKey", "RecipientMessagingKeyName"]
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
          },
          "transfer-creator-coin": {
            method: "POST",
            url: "/api/v0/transfer-creator-coin",
            handler: "TransferCreatorCoin",
            description: "Transfer creator coins between users",
            desoJs: "transferCreatorCoin",
            params: {
              required: ["SenderPublicKeyBase58Check", "CreatorPublicKeyBase58Check", "ReceiverUsernameOrPublicKeyBase58Check", "CreatorCoinToTransferNanos", "MinFeeRateNanosPerKB"],
              optional: ["TransactionFees"]
            }
          },
          "exchange-bitcoin-stateless": {
            method: "POST",
            url: "/api/v0/exchange-bitcoin-stateless",
            handler: "ExchangeBitcoinStateless",
            description: "Exchange Bitcoin for DeSo",
            desoJs: "exchangeBitcoin",
            params: {
              required: ["PublicKeyBase58Check", "BurnAmountSatoshis", "FeeRateSatoshisPerKB", "LatestBitcionAPIResponse", "BTCDepositAddress"],
              optional: ["DerivedPublicKeyBase58Check", "Broadcast", "SignedHashes"]
            }
          }
        }
      },
      nft: {
        description: "NFT transaction endpoints for minting, bidding, transferring, and burning NFTs",
        backendFile: "routes/nft.go",
        endpoints: {
          "create-nft": {
            method: "POST",
            url: "/api/v0/create-nft",
            handler: "CreateNFT",
            description: "Create/mint a new NFT from a post",
            desoJs: "createNft",
            params: {
              required: ["UpdaterPublicKeyBase58Check", "NFTPostHashHex", "NumCopies", "MinFeeRateNanosPerKB"],
              optional: ["NFTRoyaltyToCreatorBasisPoints", "NFTRoyaltyToCoinBasisPoints", "HasUnlockable", "IsForSale"]
            }
          },
          "create-nft-bid": {
            method: "POST",
            url: "/api/v0/create-nft-bid",
            handler: "CreateNFTBid",
            description: "Place a bid on an NFT",
            desoJs: "createNftBid",
            params: {
              required: ["UpdaterPublicKeyBase58Check", "NFTPostHashHex", "SerialNumber", "BidAmountNanos", "MinFeeRateNanosPerKB"],
              optional: []
            }
          },
          "accept-nft-bid": {
            method: "POST",
            url: "/api/v0/accept-nft-bid",
            handler: "AcceptNFTBid",
            description: "Accept a bid on an NFT",
            desoJs: "acceptNftBid",
            params: {
              required: ["UpdaterPublicKeyBase58Check", "NFTPostHashHex", "SerialNumber", "BidderPublicKeyBase58Check", "BidAmountNanos", "MinFeeRateNanosPerKB"],
              optional: ["UnlockableText"]
            }
          },
          "transfer-nft": {
            method: "POST",
            url: "/api/v0/transfer-nft",
            handler: "TransferNFT",
            description: "Transfer NFT to another user",
            desoJs: "transferNft",
            params: {
              required: ["SenderPublicKeyBase58Check", "ReceiverPublicKeyBase58Check", "NFTPostHashHex", "SerialNumber", "MinFeeRateNanosPerKB"],
              optional: ["UnlockableText"]
            }
          },
          "burn-nft": {
            method: "POST",
            url: "/api/v0/burn-nft",
            handler: "BurnNFT",
            description: "Burn/destroy an NFT",
            desoJs: "burnNft",
            params: {
              required: ["UpdaterPublicKeyBase58Check", "NFTPostHashHex", "SerialNumber", "MinFeeRateNanosPerKB"],
              optional: []
            }
          }
        }
      },
      dao: {
        description: "DAO Coin operations including minting, burning, transfers, and limit orders",
        backendFile: "routes/transaction.go",
        endpoints: {
          "dao-coin": {
            method: "POST",
            url: "/api/v0/dao-coin",
            handler: "DAOCoin",
            description: "Mint, burn, or disable minting for DAO coins",
            desoJs: "daoCoin",
            params: {
              required: ["UpdaterPublicKeyBase58Check", "ProfilePublicKeyBase58CheckOrUsername", "OperationType", "MinFeeRateNanosPerKB"],
              optional: ["CoinsToMintNanos", "CoinsToBurnNanos", "TransferRestrictionStatus"]
            }
          },
          "transfer-dao-coin": {
            method: "POST",
            url: "/api/v0/transfer-dao-coin",
            handler: "TransferDAOCoin",
            description: "Transfer DAO coins between users",
            desoJs: "transferDAOCoin",
            params: {
              required: ["SenderPublicKeyBase58Check", "ProfilePublicKeyBase58CheckOrUsername", "ReceiverPublicKeyBase58CheckOrUsername", "DAOCoinToTransferNanos", "MinFeeRateNanosPerKB"],
              optional: []
            }
          },
          "create-dao-coin-limit-order": {
            method: "POST",
            url: "/api/v0/create-dao-coin-limit-order",
            handler: "CreateDAOCoinLimitOrder",
            description: "Create limit orders for DAO coin trading",
            desoJs: "createDAOCoinLimitOrder",
            params: {
              required: ["TransactorPublicKeyBase58Check", "BuyingDAOCoinCreatorPublicKeyBase58Check", "SellingDAOCoinCreatorPublicKeyBase58Check", "Price", "Quantity", "OperationType", "FillType", "MinFeeRateNanosPerKB"],
              optional: []
            }
          },
          "create-dao-coin-market-order": {
            method: "POST", 
            url: "/api/v0/create-dao-coin-market-order",
            handler: "CreateDAOCoinMarketOrder",
            description: "Create market orders for DAO coin trading",
            desoJs: "createDAOCoinMarketOrder",
            params: {
              required: ["TransactorPublicKeyBase58Check", "BuyingDAOCoinCreatorPublicKeyBase58Check", "SellingDAOCoinCreatorPublicKeyBase58Check", "Quantity", "OperationType", "FillType", "MinFeeRateNanosPerKB"],
              optional: []
            }
          },
          "cancel-dao-coin-limit-order": {
            method: "POST",
            url: "/api/v0/cancel-dao-coin-limit-order", 
            handler: "CancelDAOCoinLimitOrder",
            description: "Cancel existing DAO coin limit orders",
            desoJs: "cancelDAOCoinLimitOrder",
            params: {
              required: ["TransactorPublicKeyBase58Check", "CancelOrderID", "MinFeeRateNanosPerKB"],
              optional: []
            }
          }
        }
      },
      "derived-keys": {
        description: "Derived key management for app permissions and authorization",
        backendFile: "routes/transaction.go",
        endpoints: {
          "authorize-derived-key": {
            method: "POST",
            url: "/api/v0/authorize-derived-key",
            handler: "AuthorizeDerivedKey",
            description: "Authorize a derived key with spending limits",
            desoJs: "authorizeDerivedKey",
            params: {
              required: ["OwnerPublicKeyBase58Check", "DerivedPublicKeyBase58Check", "ExpirationBlock", "AccessSignature", "MinFeeRateNanosPerKB"],
              optional: ["DeleteKey", "DerivedKeySignature", "ExtraData", "TransactionSpendingLimitHex", "Memo", "AppName"]
            }
          },
          "de-authorize-derived-key": {
            method: "POST",
            url: "/api/v0/authorize-derived-key",
            handler: "AuthorizeDerivedKey", 
            description: "De-authorize/delete a derived key",
            desoJs: "deAuthorizeDerivedKey",
            params: {
              required: ["OwnerPublicKeyBase58Check", "DerivedPublicKeyBase58Check", "MinFeeRateNanosPerKB"],
              optional: ["ExtraData"]
            }
          }
        }
      },
      associations: {
        description: "Association transactions for linking users, posts, and custom associations",
        backendFile: "routes/associations.go",
        endpoints: {
          "create-user-association": {
            method: "POST",
            url: "/api/v0/create-user-association",
            handler: "CreateUserAssociation",
            description: "Create association between users",
            desoJs: "createUserAssociation",
            params: {
              required: ["TransactorPublicKeyBase58Check", "TargetUserPublicKeyBase58Check", "AssociationType", "AssociationValue", "MinFeeRateNanosPerKB"],
              optional: ["AppPublicKeyBase58Check", "ExtraData"]
            }
          },
          "delete-user-association": {
            method: "POST",
            url: "/api/v0/delete-user-association",
            handler: "DeleteUserAssociation",
            description: "Delete association between users",
            desoJs: "deleteUserAssociation",
            params: {
              required: ["TransactorPublicKeyBase58Check", "TargetUserPublicKeyBase58Check", "AssociationType", "AssociationValue", "MinFeeRateNanosPerKB"],
              optional: ["AppPublicKeyBase58Check", "ExtraData"]
            }
          },
          "create-post-association": {
            method: "POST",
            url: "/api/v0/create-post-association",
            handler: "CreatePostAssociation",
            description: "Create association with a post",
            desoJs: "createPostAssociation",
            params: {
              required: ["TransactorPublicKeyBase58Check", "PostHashHex", "AssociationType", "AssociationValue", "MinFeeRateNanosPerKB"],
              optional: ["AppPublicKeyBase58Check", "ExtraData"]
            }
          },
          "delete-post-association": {
            method: "POST",
            url: "/api/v0/delete-post-association",
            handler: "DeletePostAssociation",
            description: "Delete association with a post",
            desoJs: "deletePostAssociation",
            params: {
              required: ["TransactorPublicKeyBase58Check", "PostHashHex", "AssociationType", "AssociationValue", "MinFeeRateNanosPerKB"],
              optional: ["AppPublicKeyBase58Check", "ExtraData"]
            }
          }
        }
      },
      access: {
        description: "Access group management for private messaging and content access control",
        backendFile: "routes/access_group.go",
        endpoints: {
          "create-access-group": {
            method: "POST",
            url: "/api/v0/create-access-group",
            handler: "CreateAccessGroup",
            description: "Create a new access group",
            desoJs: "createAccessGroup",
            params: {
              required: ["AccessGroupOwnerPublicKeyBase58Check", "AccessGroupKeyName", "AccessGroupPublicKeyBase58Check", "MinFeeRateNanosPerKB"],
              optional: ["ExtraData"]
            }
          },
          "update-access-group": {
            method: "POST",
            url: "/api/v0/update-access-group",
            handler: "UpdateAccessGroup",
            description: "Update access group settings",
            desoJs: "updateAccessGroup", 
            params: {
              required: ["AccessGroupOwnerPublicKeyBase58Check", "AccessGroupKeyName", "MinFeeRateNanosPerKB"],
              optional: ["AccessGroupPublicKeyBase58Check", "ExtraData"]
            }
          },
          "access-group-members": {
            method: "POST",
            url: "/api/v0/access-group-members",
            handler: "AccessGroupMembers",
            description: "Add or remove members from access group",
            desoJs: "accessGroupMembers",
            params: {
              required: ["AccessGroupOwnerPublicKeyBase58Check", "AccessGroupKeyName", "AccessGroupMemberList", "OperationType", "MinFeeRateNanosPerKB"],
              optional: ["ExtraData"]
            }
          }
        }
      },
      data: {
        description: "Comprehensive data fetching endpoints for all DeSo content types",
        backendFile: "routes/user.go, routes/post.go, routes/nft.go, routes/messages.go, routes/associations.go",
        endpoints: {
          // USER ENDPOINTS
          "get-users-stateless": {
            method: "POST",
            url: "/api/v0/get-users-stateless",
            handler: "GetUsersStateless",
            description: "Get information about multiple users",
            desoJs: "getUsersStateless",
            params: {
              required: ["PublicKeysBase58Check"],
              optional: ["SkipForLeaderBoard", "GetUnminedBalance"]
            }
          },
          "get-profiles": {
            method: "POST",
            url: "/api/v0/get-profiles",
            handler: "GetProfiles",
            description: "Get user profiles for searching or leaderboard",
            desoJs: "getProfiles",
            params: {
              required: [],
              optional: ["PublicKeyBase58Check", "Username", "UsernamePrefix", "OrderBy", "NumToFetch", "ReaderPublicKeyBase58Check", "ModerationType", "FetchUsersThatHODL"]
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
              optional: ["PublicKeyBase58Check", "Username", "NoErrorOnMissing"]
            }
          },
          
          // POST ENDPOINTS
          "get-posts-stateless": {
            method: "POST",
            url: "/api/v0/get-posts-stateless",
            handler: "GetPostsStateless",
            description: "Fetch posts with filtering options for feeds",
            desoJs: "getPostsStateless",
            params: {
              required: ["NumToFetch"],
              optional: ["GetPostsForFollowFeed", "OrderBy", "ReaderPublicKeyBase58Check", "PostHashHex", "GetPostsForGlobalWhitelist", "PostContent", "FetchSubcomments", "GetPostsByDESO", "MediaRequired", "PostsByDESOMinutesLookback", "AddGlobalFeedBool"]
            }
          },
          "get-single-post": {
            method: "POST",
            url: "/api/v0/get-single-post",
            handler: "GetSinglePost",
            description: "Get single post with comments and thread view",
            desoJs: "getSinglePost",
            params: {
              required: ["PostHashHex", "CommentLimit"],
              optional: ["FetchParents", "CommentOffset", "ReaderPublicKeyBase58Check", "AddGlobalFeedBool"]
            }
          },
          "get-posts-for-public-key": {
            method: "POST",
            url: "/api/v0/get-posts-for-public-key",
            handler: "GetPostsForPublicKey",
            description: "Get posts created by a user",
            desoJs: "getPostsForUser",
            params: {
              required: ["NumToFetch"],
              optional: ["PublicKeyBase58Check", "Username", "ReaderPublicKeyBase58Check", "LastPostHashHex", "MediaRequired"]
            }
          },
          "get-hot-feed": {
            method: "POST",
            url: "/api/v0/get-hot-feed",
            handler: "GetHotFeed",
            description: "Get hot posts based on engagement metrics",
            desoJs: "getHotFeed",
            params: {
              required: [],
              optional: ["ReaderPublicKeyBase58Check", "ResponseLimit", "LastPostHashHex", "TagFilter", "HotFeedScoreThreshold", "MaxNanosToBurn"]
            }
          },
          
          // SOCIAL ENDPOINTS
          "get-hodlers-for-public-key": {
            method: "POST",
            url: "/api/v0/get-hodlers-for-public-key",
            handler: "GetHodlersForPublicKey",
            description: "Get creator coin or DAO coin holders",
            desoJs: "getHoldersForUser",
            params: {
              required: [],
              optional: ["PublicKeyBase58Check", "Username", "LastPublicKeyBase58Check", "NumToFetch", "FetchHodlings", "FetchAll", "IsDAOCoin"]
            }
          },
          "get-diamonds-for-public-key": {
            method: "POST",
            url: "/api/v0/get-diamonds-for-public-key",
            handler: "GetDiamondsForPublicKey",
            description: "Get diamonds given or received by user",
            desoJs: "getDiamondsForUser",
            params: {
              required: ["PublicKeyBase58Check"],
              optional: ["FetchYouDiamonded"]
            }
          },
          "get-follows-stateless": {
            method: "POST",
            url: "/api/v0/get-follows-stateless",
            handler: "GetFollowsStateless", 
            description: "Get followers/following for user",
            desoJs: "getFollowersForUser",
            params: {
              required: [],
              optional: ["PublicKeyBase58Check", "Username", "GetEntriesFollowingUsername", "LastPublicKeyBase58Check", "NumToFetch"]
            }
          },
          "is-following-public-key": {
            method: "POST",
            url: "/api/v0/is-following-public-key",
            handler: "IsFollowingPublicKey",
            description: "Check if user is following another user",
            desoJs: "isFollowing",
            params: {
              required: ["PublicKeyBase58Check", "IsFollowingPublicKeyBase58Check"],
              optional: []
            }
          },
          "is-hodling-public-key": {
            method: "POST",
            url: "/api/v0/is-hodling-public-key",
            handler: "IsHodlingPublicKey", 
            description: "Check if user holds creator coin or DAO coin",
            desoJs: "isHolding",
            params: {
              required: ["PublicKeyBase58Check", "IsHodlingPublicKeyBase58Check"],
              optional: ["IsDAOCoin"]
            }
          },
          
          // NFT ENDPOINTS
          "get-nfts-for-user": {
            method: "POST",
            url: "/api/v0/get-nfts-for-user",
            handler: "GetNFTsForUser",
            description: "Get NFTs owned by user",
            desoJs: "getNFTsForUser",
            params: {
              required: ["UserPublicKeyBase58Check"],
              optional: ["ReaderPublicKeyBase58Check", "IsForSale", "IsPending"]
            }
          },
          "get-nft-bids-for-user": {
            method: "POST",
            url: "/api/v0/get-nft-bids-for-user",
            handler: "GetNFTBidsForUser",
            description: "Get active NFT bids for a user",
            desoJs: "getNFTBidsForUser",
            params: {
              required: ["UserPublicKeyBase58Check"],
              optional: ["ReaderPublicKeyBase58Check"]
            }
          },
          "get-nft-bids-for-nft-post": {
            method: "POST",
            url: "/api/v0/get-nft-bids-for-nft-post",
            handler: "GetNFTBidsForNFTPost",
            description: "Get all bids for an NFT post",
            desoJs: "getNFTBidsForPost",
            params: {
              required: ["PostHashHex"],
              optional: ["ReaderPublicKeyBase58Check"]
            }
          },
          "get-nft-showcase": {
            method: "POST",
            url: "/api/v0/get-nft-showcase",
            handler: "GetNFTShowcase",
            description: "Get NFTs featured in showcase",
            desoJs: "getNFTShowcase",
            params: {
              required: [],
              optional: ["ReaderPublicKeyBase58Check"]
            }
          },
          "get-nft-collections-summary": {
            method: "POST", 
            url: "/api/v0/get-nft-collections-summary",
            handler: "GetNFTCollectionSummary",
            description: "Get summary of NFT collections",
            desoJs: "getNFTCollectionSummary", 
            params: {
              required: [],
              optional: ["ReaderPublicKeyBase58Check", "PostHashHex"]
            }
          },
          
          // MESSAGES ENDPOINTS
          "get-user-dm-threads-ordered-by-timestamp": {
            method: "POST",
            url: "/api/v0/get-user-dm-threads-ordered-by-timestamp",
            handler: "GetUserDMThreadsOrderedByTimestamp",
            description: "Get user's DM conversation threads",
            desoJs: "getDMThreads",
            params: {
              required: ["UserPublicKeyBase58Check"],
              optional: []
            }
          },
          "get-paginated-messages-for-dm-thread": {
            method: "POST",
            url: "/api/v0/get-paginated-messages-for-dm-thread",
            handler: "GetPaginatedMessagesForDMThread",
            description: "Get messages in a DM conversation",
            desoJs: "getDMMessages",
            params: {
              required: ["UserGroupOwnerPublicKeyBase58Check", "UserGroupKeyName", "PartyGroupOwnerPublicKeyBase58Check", "PartyGroupKeyName"],
              optional: ["StartTimestampString", "StartTimestamp", "MaxMessagesToFetch"]
            }
          },
          
          // DAO/TOKENS ENDPOINTS
          "get-dao-coin-limit-orders": {
            method: "POST",
            url: "/api/v0/get-dao-coin-limit-orders",
            handler: "GetDAOCoinLimitOrders",
            description: "Get open orders for DeSo Token trading",
            desoJs: "getDAOCoinLimitOrders",
            params: {
              required: ["DAOCoin1CreatorPublicKeyBase58CheckOrUsername", "DAOCoin2CreatorPublicKeyBase58CheckOrUsername2"],
              optional: []
            }
          },
          "get-transactor-dao-coin-limit-orders": {
            method: "POST",
            url: "/api/v0/get-transactor-dao-coin-limit-orders",
            handler: "GetTransactorDAOCoinLimitOrders",
            description: "Get open orders created by a transactor",
            desoJs: "getTransactorDAOCoinLimitOrders",
            params: {
              required: ["TransactorPublicKeyBase58CheckOrUsername"],
              optional: []
            }
          },
          
          // ASSOCIATIONS ENDPOINTS
          "get-user-associations": {
            method: "POST",
            url: "/api/v0/get-user-associations",
            handler: "GetUserAssociations",
            description: "Get associations for a user",
            desoJs: "getUserAssociations",
            params: {
              required: [],
              optional: ["TargetUserPublicKeyBase58Check", "TransactorPublicKeyBase58Check", "AssociationType", "AssociationValue", "Limit", "LastSeenAssociationID"]
            }
          },
          "get-post-associations": {
            method: "POST",
            url: "/api/v0/get-post-associations",
            handler: "GetPostAssociations",
            description: "Get associations for a post",
            desoJs: "getPostAssociations",
            params: {
              required: [],
              optional: ["PostHashHex", "AssociationType", "AssociationValue", "Limit", "LastSeenAssociationID"]
            }
          },
          
          // NOTIFICATION ENDPOINTS
          "get-notifications": {
            method: "POST",
            url: "/api/v0/get-notifications",
            handler: "GetNotifications",
            description: "Get notifications for a user",
            desoJs: "getNotifications",
            params: {
              required: ["PublicKeyBase58Check"],
              optional: ["FetchStartIndex", "NumToFetch", "FilteredOutNotificationCategories"]
            }
          },
          "get-unread-notifications-count": {
            method: "POST",
            url: "/api/v0/get-unread-notifications-count",
            handler: "GetUnreadNotificationsCount",
            description: "Get count of unread notifications",
            desoJs: "getUnreadNotificationsCount",
            params: {
              required: ["PublicKeyBase58Check"],
              optional: []
            }
          },
          
          // ACCESS GROUP ENDPOINTS
          "get-all-user-access-groups": {
            method: "POST",
            url: "/api/v0/get-all-user-access-groups",
            handler: "GetAllUserAccessGroups",
            description: "Get all access groups for a user",
            desoJs: "getAllUserAccessGroups",
            params: {
              required: ["OwnerPublicKeyBase58Check"],
              optional: []
            }
          },
          "get-access-group-info": {
            method: "POST",
            url: "/api/v0/get-access-group-info",
            handler: "GetAccessGroupInfo",
            description: "Get information about an access group",
            desoJs: "getAccessGroupInfo",
            params: {
              required: ["AccessGroupOwnerPublicKeyBase58Check", "AccessGroupKeyName"],
              optional: []
            }
          },
          "get-bulk-access-group-entries": {
            method: "POST",
            url: "/api/v0/get-bulk-access-group-entries",
            handler: "GetBulkAccessGroupEntries",
            description: "Get multiple access group entries",
            desoJs: "getBulkAccessGroupEntries",
            params: {
              required: ["AccessGroupPublicKeysToMemberPublicKeysMap"],
              optional: []
            }
          },
          
          // MEDIA ENDPOINTS
          "upload-image": {
            method: "POST",
            url: "/api/v0/upload-image",
            handler: "UploadImage",
            description: "Upload image to DeSo",
            desoJs: "uploadImage",
            params: {
              required: ["file", "UserPublicKeyBase58Check", "JWT"],
              optional: []
            }
          },
          "get-video-status": {
            method: "POST",
            url: "/api/v0/get-video-status",
            handler: "GetVideoStatus",
            description: "Get video processing status",
            desoJs: "getVideoStatus",
            params: {
              required: ["VideoId"],
              optional: []
            }
          }
        }
      },
      notifications: {
        description: "Notification endpoints for user notifications and counts",
        backendFile: "routes/notifications.go",
        endpoints: {
          "get-notifications": {
            method: "POST",
            url: "/api/v0/get-notifications",
            handler: "GetNotifications",
            description: "Get notifications for a user",
            desoJs: "getNotifications",
            params: {
              required: ["PublicKeyBase58Check"],
              optional: ["FetchStartIndex", "NumToFetch", "FilteredOutNotificationCategories"]
            }
          },
          "get-unread-notifications-count": {
            method: "POST",
            url: "/api/v0/get-unread-notifications-count",
            handler: "GetUnreadNotificationsCount",
            description: "Get count of unread notifications",
            desoJs: "getUnreadNotificationsCount",
            params: {
              required: ["PublicKeyBase58Check"],
              optional: []
            }
          },
          "set-notification-metadata": {
            method: "POST",
            url: "/api/v0/set-notification-metadata",
            handler: "SetNotificationMetadata",
            description: "Update notification metadata",
            desoJs: "setNotificationMetadata",
            params: {
              required: ["PublicKeyBase58Check", "LastSeenIndex", "LastUnreadNotificationIndex", "UnreadNotifications"],
              optional: []
            }
          }
        }
      },
      media: {
        description: "Media upload and processing endpoints",
        backendFile: "routes/media.go",
        endpoints: {
          "upload-image": {
            method: "POST",
            url: "/api/v0/upload-image",
            handler: "UploadImage",
            description: "Upload image to DeSo",
            desoJs: "uploadImage",
            params: {
              required: ["file", "UserPublicKeyBase58Check", "JWT"],
              optional: []
            }
          },
          "get-video-status": {
            method: "POST",
            url: "/api/v0/get-video-status",
            handler: "GetVideoStatus",
            description: "Get video processing status",
            desoJs: "getVideoStatus",
            params: {
              required: ["VideoId"],
              optional: []
            }
          },
          "upload-video": {
            method: "POST",
            url: "/api/v0/upload-video",
            handler: "UploadVideo",
            description: "Upload video to DeSo",
            desoJs: "uploadVideo",
            params: {
              required: ["file", "UserPublicKeyBase58Check", "JWT"],
              optional: []
            }
          }
        }
      },
      admin: {
        description: "Administrative endpoints for node management",
        backendFile: "routes/admin.go",
        endpoints: {
          "node-control": {
            method: "POST",
            url: "/api/v0/node-control",
            handler: "NodeControl",
            description: "Control node operations",
            desoJs: "nodeControl",
            params: {
              required: ["AdminPublicKey", "OperationType"],
              optional: ["Address", "MinerPublicKeys"]
            }
          },
          "reprocess-bitcoin-block": {
            method: "POST",
            url: "/api/v0/reprocess-bitcoin-block",
            handler: "ReprocessBitcoinBlock",
            description: "Reprocess a Bitcoin block",
            desoJs: "reprocessBitcoinBlock",
            params: {
              required: ["BlockHashOrBlockHeight", "AdminPublicKey"],
              optional: []
            }
          },
          "get-global-params": {
            method: "POST",
            url: "/api/v0/get-global-params",
            handler: "GetGlobalParams",
            description: "Get global blockchain parameters",
            desoJs: "getGlobalParams",
            params: {
              required: [],
              optional: []
            }
          },
          "update-global-params": {
            method: "POST",
            url: "/api/v0/update-global-params",
            handler: "UpdateGlobalParams",
            description: "Update global blockchain parameters",
            desoJs: "updateGlobalParams",
            params: {
              required: ["UpdaterPublicKeyBase58Check", "ModifiedGlobalParams", "MinFeeRateNanosPerKB"],
              optional: ["TransactionFees"]
            }
          }
        }
      },
      blockchain: {
        description: "Blockchain data and mining endpoints",
        backendFile: "routes/block.go, routes/transaction.go",
        endpoints: {
          "get-blocks": {
            method: "POST",
            url: "/api/v0/get-blocks",
            handler: "GetBlocks",
            description: "Get blockchain blocks",
            desoJs: "getBlocks",
            params: {
              required: [],
              optional: ["StartHeight", "EndHeight", "FullBlock"]
            }
          },
          "get-block": {
            method: "POST",
            url: "/api/v0/get-block",
            handler: "GetBlock",
            description: "Get single block",
            desoJs: "getBlock",
            params: {
              required: [],
              optional: ["Height", "HashHex", "FullBlock"]
            }
          },
          "get-transaction": {
            method: "POST",
            url: "/api/v0/get-transaction",
            handler: "GetTransaction",
            description: "Get transaction by ID",
            desoJs: "getTransaction",
            params: {
              required: ["TxnHashHex"],
              optional: []
            }
          },
          "get-mempool": {
            method: "POST",
            url: "/api/v0/get-mempool",
            handler: "GetMempool",
            description: "Get mempool transactions",
            desoJs: "getMempool",
            params: {
              required: [],
              optional: []
            }
          }
        }
      },
      tokens: {
        description: "DeSo Tokens (formerly DAO Coins) data and trading endpoints",
        backendFile: "routes/dao_coin_exchange.go",
        endpoints: {
          "get-dao-coin-limit-orders": {
            method: "POST",
            url: "/api/v0/get-dao-coin-limit-orders",
            handler: "GetDAOCoinLimitOrders",
            description: "Get open orders for DeSo Token trading",
            desoJs: "getDAOCoinLimitOrders",
            params: {
              required: ["DAOCoin1CreatorPublicKeyBase58CheckOrUsername", "DAOCoin2CreatorPublicKeyBase58CheckOrUsername2"],
              optional: []
            }
          },
          "get-transactor-dao-coin-limit-orders": {
            method: "POST",
            url: "/api/v0/get-transactor-dao-coin-limit-orders",
            handler: "GetTransactorDAOCoinLimitOrders",
            description: "Get open orders created by a transactor",
            desoJs: "getTransactorDAOCoinLimitOrders",
            params: {
              required: ["TransactorPublicKeyBase58CheckOrUsername"],
              optional: []
            }
          }
        }
      },
      identity: {
        description: "DeSo Identity Service for authentication, key management, and message encryption/decryption",
        backendFile: "identity.deso.org - Angular/TypeScript app",
        endpoints: {
          "iframe-sign": {
            method: "postMessage",
            url: "Identity iframe API",
            handler: "identity.service.ts - sign()",
            description: "Sign transactions through Identity iframe (AccessLevel 3-4 required)",
            desoJs: "identity.sign()",
            params: {
              required: ["transactionHex", "accessLevel", "accessLevelHmac", "encryptedSeedHex"],
              optional: ["derivedPublicKeyBase58Check"]
            }
          },
          "iframe-encrypt": {
            method: "postMessage",
            url: "Identity iframe API",
            handler: "identity.service.ts - encrypt()",
            description: "Encrypt messages for private messaging (AccessLevel 2+ required)",
            desoJs: "identity.encrypt()",
            params: {
              required: ["recipientPublicKey", "message", "accessLevel", "accessLevelHmac", "encryptedSeedHex"],
              optional: ["derivedPublicKeyBase58Check", "encryptedMessagingKeyRandomness", "ownerPublicKeyBase58Check"]
            }
          },
          "iframe-decrypt": {
            method: "postMessage",
            url: "Identity iframe API",
            handler: "identity.service.ts - decrypt()",
            description: "Decrypt messages and unlockable NFT content (AccessLevel 2+ required)",
            desoJs: "identity.decrypt()",
            params: {
              required: ["encryptedMessages", "accessLevel", "accessLevelHmac", "encryptedSeedHex"],
              optional: ["derivedPublicKeyBase58Check", "encryptedMessagingKeyRandomness", "ownerPublicKeyBase58Check"]
            }
          },
          "iframe-jwt": {
            method: "postMessage",
            url: "Identity iframe API",
            handler: "identity.service.ts - jwt()",
            description: "Generate JWT tokens for API authentication (AccessLevel 2+ required)",
            desoJs: "identity.jwt()",
            params: {
              required: ["accessLevel", "accessLevelHmac", "encryptedSeedHex"],
              optional: ["derivedPublicKeyBase58Check"]
            }
          },
          "window-login": {
            method: "window.open",
            url: "https://identity.deso.org/log-in",
            handler: "log-in component",
            description: "User login/signup with access level request",
            desoJs: "identity.login()",
            params: {
              required: [],
              optional: ["accessLevelRequest", "testnet", "webview", "jumio", "referralCode", "hideGoogle"]
            }
          },
          "window-logout": {
            method: "window.open",
            url: "https://identity.deso.org/logout",
            handler: "logout component",
            description: "User logout and permission revocation",
            desoJs: "identity.logout()",
            params: {
              required: ["publicKey"],
              optional: ["testnet", "webview"]
            }
          },
          "window-approve": {
            method: "window.open",
            url: "https://identity.deso.org/approve",
            handler: "approve component",
            description: "Manual transaction approval for restricted access levels",
            desoJs: "identity.approve()",
            params: {
              required: ["tx"],
              optional: ["testnet", "webview"]
            }
          },
          "window-derive": {
            method: "window.open",
            url: "https://identity.deso.org/derive",
            handler: "derive component",
            description: "Generate derived keys for mobile/server applications",
            desoJs: "identity.derive()",
            params: {
              required: ["publicKey"],
              optional: ["testnet", "webview", "callback", "deleteKey", "expirationDays", "transactionSpendingLimitResponse"]
            }
          },
          "window-messaging-group": {
            method: "window.open",
            url: "https://identity.deso.org/messaging-group",
            handler: "messaging-group component",
            description: "Get messaging group key randomness for derived key encryption",
            desoJs: "identity.getMessagingGroup()",
            params: {
              required: ["publicKey"],
              optional: ["testnet", "webview"]
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
      },
      authentication: {
        title: "DeSo Identity Authentication Deep Dive",
        content: `# DeSo Identity Authentication

## Architecture Overview

DeSo Identity operates on two communication channels:
- **iframe API**: Background operations (signing, encryption, decryption)
- **Window API**: User interactions (login, approval, key management)

## Access Levels

\`\`\`javascript
// Access Level 2 - Approval required for all transactions
// (Default - safest option)
const login = await identity.login({
  accessLevelRequest: 2
});

// Access Level 3 - Approval required for spending transactions  
// (Social actions authorized, buys/sells need approval)
const login = await identity.login({
  accessLevelRequest: 3
});

// Access Level 4 - Full permission 
// (All transactions authorized - use carefully)
const login = await identity.login({
  accessLevelRequest: 4
});
\`\`\`

## Complete Identity Setup

\`\`\`javascript
import { identity } from 'deso-protocol';

class DesoIdentityManager {
  constructor() {
    this.iframe = null;
    this.currentUser = null;
    this.setupIdentityIframe();
    this.setupEventListeners();
  }
  
  setupIdentityIframe() {
    // Create hidden iframe for background operations
    this.iframe = document.createElement('iframe');
    this.iframe.src = 'https://identity.deso.org/embed?v=2';
    this.iframe.style.display = 'none';
    document.body.appendChild(this.iframe);
  }
  
  setupEventListeners() {
    window.addEventListener('message', (event) => {
      if (event.origin !== 'https://identity.deso.org') return;
      
      const { data } = event;
      if (data.service !== 'identity') return;
      
      switch (data.method) {
        case 'initialize':
          this.handleInitialize(event);
          break;
        case 'login':
          this.handleLogin(data);
          break;
        case 'approve':
          this.handleApprove(data);
          break;
      }
    });
  }
  
  handleInitialize(event) {
    // Respond to identity initialization
    event.source.postMessage({
      id: event.data.id,
      service: 'identity',
      payload: {}
    }, 'https://identity.deso.org');
  }
  
  async login(accessLevel = 2) {
    return new Promise((resolve, reject) => {
      const loginWindow = window.open(
        \`https://identity.deso.org/log-in?accessLevelRequest=\${accessLevel}\`,
        'identity',
        'width=800,height=600'
      );
      
      const handleMessage = (event) => {
        if (event.data.method === 'login') {
          window.removeEventListener('message', handleMessage);
          loginWindow.close();
          
          this.currentUser = event.data.payload.publicKeyAdded;
          this.users = event.data.payload.users;
          resolve(event.data.payload);
        }
      };
      
      window.addEventListener('message', handleMessage);
    });
  }
  
  async signTransaction(transactionHex) {
    if (!this.currentUser) throw new Error('User not logged in');
    
    const userInfo = this.users[this.currentUser];
    
    return new Promise((resolve, reject) => {
      const messageId = this.generateUUID();
      
      const handleResponse = (event) => {
        if (event.data.id === messageId) {
          window.removeEventListener('message', handleResponse);
          
          if (event.data.payload.approvalRequired) {
            this.requestApproval(transactionHex).then(resolve).catch(reject);
          } else {
            resolve(event.data.payload.signedTransactionHex);
          }
        }
      };
      
      window.addEventListener('message', handleResponse);
      
      this.iframe.contentWindow.postMessage({
        id: messageId,
        service: 'identity',
        method: 'sign',
        payload: {
          transactionHex,
          accessLevel: userInfo.accessLevel,
          accessLevelHmac: userInfo.accessLevelHmac,
          encryptedSeedHex: userInfo.encryptedSeedHex
        }
      }, 'https://identity.deso.org');
    });
  }
  
  async requestApproval(transactionHex) {
    return new Promise((resolve, reject) => {
      const approvalWindow = window.open(
        \`https://identity.deso.org/approve?tx=\${transactionHex}\`,
        'approval',
        'width=800,height=600'
      );
      
      const handleMessage = (event) => {
        if (event.data.method === 'login' && event.data.payload.signedTransactionHex) {
          window.removeEventListener('message', handleMessage);
          approvalWindow.close();
          resolve(event.data.payload.signedTransactionHex);
        }
      };
      
      window.addEventListener('message', handleMessage);
    });
  }
  
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Usage
const identityManager = new DesoIdentityManager();
await identityManager.login(3); // Request access level 3
const signedTx = await identityManager.signTransaction(transactionHex);
\`\`\`

## Derived Keys for Mobile/Server

\`\`\`javascript
// Generate derived key for mobile/server use
const deriveResult = await identity.derive({
  expirationDays: 30,
  transactionSpendingLimitHex: getSpendingLimitHex({
    GlobalDESOLimit: 1 * 1e9, // 1 DeSo
    TransactionCountLimitMap: {
      SUBMIT_POST: 10,
      CREATE_FOLLOW_TXN_STATELESS: 20
    }
  })
});

// Use derived key for signing without user interaction
const derivedSignResult = await signTransactionWithDerivedKey({
  transactionHex,
  derivedPrivateKey: deriveResult.derivedPrivateKey
});
\`\`\`

## Message Encryption/Decryption

\`\`\`javascript
// Encrypt a message
const encryptResult = await identity.encrypt({
  recipientPublicKey: 'BC1YLi...',
  message: 'Secret message content'
});

// Decrypt multiple messages
const decryptResult = await identity.decrypt({
  encryptedMessages: [
    {
      EncryptedHex: '0x...',
      PublicKey: 'BC1YLi...',
      IsSender: false,
      Legacy: false
    }
  ]
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
      },
      "create-nft": {
        javascript: `// Create/mint an NFT from a post using deso-js
import { createNft, identity } from 'deso-protocol';

${includeAuth ? `// Login first
await identity.login();
const currentUser = identity.snapshot().currentUser;
` : ''}
const nftResult = await createNft({
  UpdaterPublicKeyBase58Check: ${includeAuth ? 'currentUser.publicKey' : "'YOUR_PUBLIC_KEY'"},
  NFTPostHashHex: 'POST_HASH_HEX_HERE',
  NumCopies: 1, // Number of NFT copies to mint
  NFTRoyaltyToCreatorBasisPoints: 1000, // 10% royalty
  NFTRoyaltyToCoinBasisPoints: 500, // 5% to coin holders
  HasUnlockable: false,
  IsForSale: true
});

console.log('NFT created:', nftResult);`,
        
        react: `// React component for creating NFTs
import React, { useState } from 'react';
import { createNft, identity } from 'deso-protocol';

function CreateNFTButton({ postHashHex }) {
  const [loading, setLoading] = useState(false);
  const [copies, setCopies] = useState(1);
  
  const handleCreateNFT = async () => {
    setLoading(true);
    try {
      const currentUser = identity.snapshot().currentUser;
      
      const result = await createNft({
        UpdaterPublicKeyBase58Check: currentUser.publicKey,
        NFTPostHashHex: postHashHex,
        NumCopies: copies,
        NFTRoyaltyToCreatorBasisPoints: 1000,
        NFTRoyaltyToCoinBasisPoints: 500,
        HasUnlockable: false,
        IsForSale: true
      });
      
      console.log('NFT created:', result);
    } catch (error) {
      console.error('NFT creation error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <input
        type="number"
        value={copies}
        onChange={(e) => setCopies(parseInt(e.target.value))}
        min="1"
        placeholder="Number of copies"
      />
      <button onClick={handleCreateNFT} disabled={loading}>
        {loading ? 'Creating NFT...' : 'Create NFT'}
      </button>
    </div>
  );
}`
      },
      "buy-creator-coin": {
        javascript: `// Buy creator coins using deso-js
import { buyCreatorCoin, identity } from 'deso-protocol';

${includeAuth ? `// Login first
await identity.login();
const currentUser = identity.snapshot().currentUser;
` : ''}
const buyResult = await buyCreatorCoin({
  UpdaterPublicKeyBase58Check: ${includeAuth ? 'currentUser.publicKey' : "'YOUR_PUBLIC_KEY'"},
  CreatorPublicKeyBase58Check: 'CREATOR_PUBLIC_KEY_HERE',
  OperationType: 'buy',
  DeSoToSellNanos: 1000000, // 0.001 DeSo in nanos
  MinCreatorCoinExpectedNanos: 100 // Minimum creator coin expected
});

console.log('Creator coin purchased:', buyResult);`,
        
        react: `// React component for buying creator coins
import React, { useState } from 'react';
import { buyCreatorCoin, identity } from 'deso-protocol';

function BuyCreatorCoinForm({ creatorPublicKey }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleBuy = async (e) => {
    e.preventDefault();
    if (!amount) return;
    
    setLoading(true);
    try {
      const currentUser = identity.snapshot().currentUser;
      const amountNanos = parseFloat(amount) * 1e9; // Convert DeSo to nanos
      
      const result = await buyCreatorCoin({
        UpdaterPublicKeyBase58Check: currentUser.publicKey,
        CreatorPublicKeyBase58Check: creatorPublicKey,
        OperationType: 'buy',
        DeSoToSellNanos: amountNanos,
        MinCreatorCoinExpectedNanos: 1
      });
      
      console.log('Purchase successful:', result);
      setAmount('');
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleBuy}>
      <input
        type="number"
        step="0.001"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="DeSo amount"
      />
      <button type="submit" disabled={loading || !amount}>
        {loading ? 'Buying...' : 'Buy Creator Coin'}
      </button>
    </form>
  );
}`
      },
      "dao-coin": {
        javascript: `// Mint DAO coins using deso-js
import { daoCoin, identity } from 'deso-protocol';

${includeAuth ? `// Login first
await identity.login();
const currentUser = identity.snapshot().currentUser;
` : ''}
const daoResult = await daoCoin({
  UpdaterPublicKeyBase58Check: ${includeAuth ? 'currentUser.publicKey' : "'YOUR_PUBLIC_KEY'"},
  ProfilePublicKeyBase58CheckOrUsername: 'username_or_public_key',
  OperationType: 'mint', // 'mint', 'burn', or 'disable_minting'
  CoinsToMintNanos: '1000000000000000000', // Amount to mint (uint256 as string)
  TransferRestrictionStatus: 'unrestricted'
});

console.log('DAO coin operation:', daoResult);`
      },
      login: {
        javascript: `// DeSo Identity login with access level
import { identity } from 'deso-protocol';

// Login with specific permission level
const loginResult = await identity.login({
  accessLevelRequest: 3 // Request access level 3 for social transactions
});

console.log('User logged in:', loginResult.publicKeyAdded);
console.log('Access level granted:', loginResult.users[loginResult.publicKeyAdded].accessLevel);

// Listen for identity changes
identity.subscribe((state) => {
  console.log('Identity event:', state.event);
  if (state.currentUser) {
    console.log('Current user:', state.currentUser.publicKey);
  }
});`,

        react: `// React hook for DeSo Identity authentication
import React, { useState, useEffect } from 'react';
import { identity } from 'deso-protocol';

function useDesoAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const unsubscribe = identity.subscribe((state) => {
      setUser(state.currentUser);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  const login = async (accessLevel = 3) => {
    setLoading(true);
    try {
      await identity.login({ accessLevelRequest: accessLevel });
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };
  
  const logout = async () => {
    await identity.logout();
  };
  
  return { user, loading, login, logout };
}

// Component usage
function AuthButton() {
  const { user, loading, login, logout } = useDesoAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <span>Welcome {user.username || user.publicKey.slice(0, 8)}...</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login(3)}>Login with DeSo</button>
      )}
    </div>
  );
}`
      },
      encrypt: {
        javascript: `// Encrypt messages for private messaging
import { identity } from 'deso-protocol';

${includeAuth ? `// Make sure user is logged in
const currentUser = identity.snapshot().currentUser;
if (!currentUser) {
  await identity.login({ accessLevelRequest: 2 });
}
` : ''}
const encryptResult = await identity.encrypt({
  recipientPublicKey: 'BC1YLiQ86kwXaVaUVwKyKF5uo2Kxt8SSeZ2CzGTAVp2TRb4VJeFHLqd',
  message: 'This is a secret message that only the recipient can read'
});

console.log('Encrypted message:', encryptResult.encryptedMessage);

// For derived keys, additional parameters needed:
const encryptWithDerived = await identity.encrypt({
  recipientPublicKey: 'BC1YLiQ86kwXaVaUVwKyKF5uo2Kxt8SSeZ2CzGTAVp2TRb4VJeFHLqd',
  message: 'Secret message with derived key',
  derivedPublicKeyBase58Check: 'DERIVED_KEY_HERE',
  ownerPublicKeyBase58Check: 'OWNER_KEY_HERE',
  encryptedMessagingKeyRandomness: 'RANDOMNESS_HEX'
});`,

        react: `// React component for message encryption
import React, { useState } from 'react';
import { identity } from 'deso-protocol';

function EncryptMessage({ recipientKey }) {
  const [message, setMessage] = useState('');
  const [encryptedResult, setEncryptedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleEncrypt = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const result = await identity.encrypt({
        recipientPublicKey: recipientKey,
        message: message
      });
      
      setEncryptedResult(result.encryptedMessage);
      console.log('Message encrypted successfully');
    } catch (error) {
      console.error('Encryption error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message to encrypt"
        rows={3}
      />
      <button onClick={handleEncrypt} disabled={loading || !message.trim()}>
        {loading ? 'Encrypting...' : 'Encrypt Message'}
      </button>
      {encryptedResult && (
        <div>
          <h4>Encrypted Result:</h4>
          <code>{encryptedResult}</code>
        </div>
      )}
    </div>
  );
}`
      },
      decrypt: {
        javascript: `// Decrypt messages and unlock NFT content
import { identity } from 'deso-protocol';

${includeAuth ? `// Make sure user is logged in
const currentUser = identity.snapshot().currentUser;
if (!currentUser) {
  await identity.login({ accessLevelRequest: 2 });
}
` : ''}
// Decrypt multiple messages at once
const decryptResult = await identity.decrypt({
  encryptedMessages: [
    {
      EncryptedHex: '0x1234567890abcdef...',
      PublicKey: 'BC1YLiQ86kwXaVaUVwKyKF5uo2Kxt8SSeZ2CzGTAVp2TRb4VJeFHLqd',
      IsSender: false,
      Legacy: false, // Set to true for V1 messages
      Version: 2
    }
  ]
});

console.log('Decrypted messages:', decryptResult.decryptedMessages);

// For NFT unlockable content
const nftDecryptResult = await identity.decrypt({
  encryptedMessages: [
    {
      EncryptedHex: nftEntry.EncryptedUnlockableText,
      PublicKey: nftEntry.OwnerPublicKeyBase58Check,
      IsSender: false,
      Legacy: false
    }
  ]
});`,

        react: `// React component for message decryption
import React, { useState } from 'react';
import { identity } from 'deso-protocol';

function DecryptMessages({ encryptedMessages }) {
  const [decryptedMessages, setDecryptedMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleDecrypt = async () => {
    setLoading(true);
    try {
      const result = await identity.decrypt({
        encryptedMessages: encryptedMessages
      });
      
      setDecryptedMessages(result.decryptedMessages);
    } catch (error) {
      console.error('Decryption error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button onClick={handleDecrypt} disabled={loading}>
        {loading ? 'Decrypting...' : 'Decrypt Messages'}
      </button>
      
      {decryptedMessages.length > 0 && (
        <div>
          <h4>Decrypted Messages:</h4>
          {decryptedMessages.map((msg, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
              <p><strong>From:</strong> {msg.senderPublicKey}</p>
              <p><strong>Message:</strong> {msg.decryptedMessage}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`
      },
      "derived-key": {
        javascript: `// Generate derived key for server/mobile apps
import { identity } from 'deso-protocol';

${includeAuth ? `// Login with master key first
await identity.login({ accessLevelRequest: 4 });
const currentUser = identity.snapshot().currentUser;
` : ''}
// Generate derived key with spending limits
const deriveResult = await identity.derive({
  publicKey: ${includeAuth ? 'currentUser.publicKey' : "'YOUR_PUBLIC_KEY'"},
  expirationDays: 30,
  transactionSpendingLimitHex: getTransactionSpendingLimitHex({
    GlobalDESOLimit: 1 * 1e9, // 1 DeSo limit
    TransactionCountLimitMap: {
      SUBMIT_POST: 10,
      CREATE_FOLLOW_TXN_STATELESS: 20,
      CREATE_LIKE_STATELESS: 50
    },
    CreatorCoinOperationLimitMap: {
      'CREATOR_PUBLIC_KEY': {
        buy: 5,
        sell: 5,
        transfer: 2
      }
    }
  })
});

console.log('Derived key generated:', deriveResult.derivedPublicKey);
console.log('JWT token:', deriveResult.jwt);
console.log('Derived JWT:', deriveResult.derivedJwt);

// Store these securely for your app to use
localStorage.setItem('derivedPrivateKey', deriveResult.derivedPrivateKey);
localStorage.setItem('derivedJWT', deriveResult.derivedJwt);`,

        react: `// React component for derived key management
import React, { useState, useEffect } from 'react';
import { identity } from 'deso-protocol';

function DerivedKeyManager() {
  const [derivedKeys, setDerivedKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const generateDerivedKey = async () => {
    setLoading(true);
    try {
      const currentUser = identity.snapshot().currentUser;
      
      const result = await identity.derive({
        publicKey: currentUser.publicKey,
        expirationDays: 30,
        transactionSpendingLimitHex: getTransactionSpendingLimitHex({
          GlobalDESOLimit: 0.1 * 1e9, // 0.1 DeSo limit
          TransactionCountLimitMap: {
            SUBMIT_POST: 5,
            CREATE_FOLLOW_TXN_STATELESS: 10
          }
        })
      });
      
      setDerivedKeys(prev => [...prev, {
        id: result.derivedPublicKey,
        publicKey: result.derivedPublicKey,
        jwt: result.derivedJwt,
        expirationBlock: result.expirationBlock,
        createdAt: new Date()
      }]);
      
    } catch (error) {
      console.error('Derived key generation error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteDerivedKey = async (publicKey) => {
    try {
      await identity.derive({
        publicKey: publicKey,
        deleteKey: true
      });
      
      setDerivedKeys(prev => prev.filter(key => key.publicKey !== publicKey));
    } catch (error) {
      console.error('Key deletion error:', error);
    }
  };
  
  return (
    <div>
      <h3>Derived Key Management</h3>
      
      <button onClick={generateDerivedKey} disabled={loading}>
        {loading ? 'Generating...' : 'Generate New Derived Key'}
      </button>
      
      <div>
        {derivedKeys.map(key => (
          <div key={key.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <p><strong>Public Key:</strong> {key.publicKey.slice(0, 20)}...</p>
            <p><strong>Created:</strong> {key.createdAt.toLocaleDateString()}</p>
            <p><strong>Expiration Block:</strong> {key.expirationBlock}</p>
            <button onClick={() => deleteDerivedKey(key.publicKey)}>
              Delete Key
            </button>
          </div>
        ))}
      </div>
    </div>
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