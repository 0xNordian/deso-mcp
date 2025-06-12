'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Search } from 'lucide-react';
import { useResolveUsername, isPublicKey } from '@/hooks/useResolveUser';
import {
  ProfilePicture,
  UsernameDisplay,
  VerificationBadge,
  ProfileCoverPhoto,
} from '@/components/deso';

// GraphQL queries for display
const GRAPHQL_QUERIES = {
  profilePicture: `query GetProfilePicture($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    profilePic
    username
    extraData
  }
}`,
  usernameDisplay: `query GetUsernameInfo($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    username
    extraData
  }
}`,
  profileData: `query GetProfileData($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    id
    publicKey
    username
    description
    profilePic
    extraData
    coinPriceDesoNanos
  }
}`,
  usernameResolution: `query GetAccountByUsername($username: String!) {
  accountByUsername(username: $username) {
    id
    publicKey
    username
    description
    profilePic
    extraData
  }
}`,
  userPosts: `query GetUserPosts($publicKey: String!, $first: Int!, $after: String) {
  accountByPublicKey(publicKey: $publicKey) {
    posts(first: $first, after: $after, orderBy: [TIMESTAMP_DESC]) {
      edges {
        node {
          id
          postHash
          body
          timestamp
          extraData
          likes(first: 1) {
            totalCount
          }
          diamonds(first: 1) {
            totalCount
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`,
};

// GraphQL queries for display

export default function DemoPage() {
  const [userInput, setUserInput] = useState('mossified');
  const [currentPublicKey, setCurrentPublicKey] = useState('BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT');
  const [isSearching, setIsSearching] = useState(false);

  // Use GraphQL to resolve username if it's not a public key
  const shouldResolve = !isPublicKey(userInput) && userInput.trim();
  const { data: resolvedUser, loading: resolving } = useResolveUsername(
    shouldResolve ? userInput.trim() : ''
  );

  const handleSearch = () => {
    if (!userInput.trim()) {
      alert('Please enter a username or public key');
      return;
    }

    setIsSearching(true);

    if (isPublicKey(userInput)) {
      setCurrentPublicKey(userInput);
      alert('Updated to public key: ' + userInput.slice(0, 20) + '...');
      setIsSearching(false);
    } else if (resolvedUser?.accountByUsername?.publicKey) {
      // Use GraphQL resolved public key
      setCurrentPublicKey(resolvedUser.accountByUsername.publicKey);
      alert(`Updated to user: @${userInput}`);
      setIsSearching(false);
    } else {
      // Fallback to demo users for offline testing
      const knownUsers: Record<string, string> = {
        'mossified': 'BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT',
        'diamondhands': 'BC1YLhBLE1834FBJbQ9JU23JbPanNYMkUsdpJZrFVqNGsCe7YadYiUg',
        'nader': 'BC1YLhtBTFXAsKZgoaoYNW8mWAJWdfQjycheAeYjaX46azVrnZfJ94s',
      };

      const publicKey = knownUsers[userInput.toLowerCase()];
      if (publicKey) {
        setCurrentPublicKey(publicKey);
        alert(`Updated to user: @${userInput} (demo fallback)`);
      } else {
        alert(`Username @${userInput} not found. Try: mossified, diamondhands, or nader`);
      }
      setIsSearching(false);
    }
  };

  const copyQuery = (query: string) => {
    navigator.clipboard.writeText(query);
    alert('GraphQL query copied to clipboard!');
  };

  const QueryDisplay = ({ title, query }: { title: string; query: string }) => (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">GraphQL Query - {title}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyQuery(query)}
            className="h-8 px-2"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
          <code>{query}</code>
        </pre>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            DeSo UI Components Demo
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Phase 2: Atomic Components Showcase
          </p>
          
          {/* Interactive User Input */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">Test with Any DeSo User</CardTitle>
              <CardDescription>
                Enter a DeSo username (e.g., mossified) or public key to see live data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter username or public key..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                                 <Button onClick={handleSearch} disabled={isSearching || resolving}>
                   <Search className="h-4 w-4 mr-2" />
                   {isSearching || resolving ? 'Loading...' : 'Load User'}
                 </Button>
              </div>
                             <div className="mt-3 text-sm text-muted-foreground">
                 <p><strong>Current:</strong> {currentPublicKey.slice(0, 20)}...</p>
                 <p><strong>Demo users:</strong> mossified, diamondhands, nader</p>
                 {resolving && <p className="text-blue-600">🔍 Resolving username via GraphQL...</p>}
               </div>
            </CardContent>
          </Card>
          
          {/* Username Resolution Query */}
          <QueryDisplay title="Username Resolution" query={GRAPHQL_QUERIES.usernameResolution} />
        </div>

        <div className="space-y-12">
          {/* Profile Picture Component */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">ProfilePicture Component</CardTitle>
                <CardDescription>
                  Avatar component with multiple sizes, fallbacks, and verification badges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Size Variants */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Size Variants</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <ProfilePicture publicKey={currentPublicKey} size="xs" />
                      <p className="text-sm text-muted-foreground mt-2">xs</p>
                    </div>
                    <div className="text-center">
                      <ProfilePicture publicKey={currentPublicKey} size="sm" />
                      <p className="text-sm text-muted-foreground mt-2">sm</p>
                    </div>
                    <div className="text-center">
                      <ProfilePicture publicKey={currentPublicKey} size="md" />
                      <p className="text-sm text-muted-foreground mt-2">md</p>
                    </div>
                    <div className="text-center">
                      <ProfilePicture publicKey={currentPublicKey} size="lg" />
                      <p className="text-sm text-muted-foreground mt-2">lg</p>
                    </div>
                    <div className="text-center">
                      <ProfilePicture publicKey={currentPublicKey} size="xl" />
                      <p className="text-sm text-muted-foreground mt-2">xl</p>
                    </div>
                  </div>
                </div>

                {/* With Verification Badge */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">With Verification Badge</h3>
                  <div className="flex items-center gap-4">
                    <ProfilePicture publicKey={currentPublicKey} size="sm" showVerification={true} />
                    <ProfilePicture publicKey={currentPublicKey} size="md" showVerification={true} />
                    <ProfilePicture publicKey={currentPublicKey} size="lg" showVerification={true} />
                  </div>
                </div>

                {/* NFT Profile Pictures */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">NFT Profile Pictures (Hexagon Shape)</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-md font-medium mb-2">NFT Size Variants</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <ProfilePicture publicKey={currentPublicKey} size="xs" variant="nft" />
                          <p className="text-sm text-muted-foreground mt-2">xs</p>
                        </div>
                        <div className="text-center">
                          <ProfilePicture publicKey={currentPublicKey} size="sm" variant="nft" />
                          <p className="text-sm text-muted-foreground mt-2">sm</p>
                        </div>
                        <div className="text-center">
                          <ProfilePicture publicKey={currentPublicKey} size="md" variant="nft" />
                          <p className="text-sm text-muted-foreground mt-2">md</p>
                        </div>
                        <div className="text-center">
                          <ProfilePicture publicKey={currentPublicKey} size="lg" variant="nft" />
                          <p className="text-sm text-muted-foreground mt-2">lg</p>
                        </div>
                        <div className="text-center">
                          <ProfilePicture publicKey={currentPublicKey} size="xl" variant="nft" />
                          <p className="text-sm text-muted-foreground mt-2">xl</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium mb-2">NFT with Verification Badge</h4>
                      <div className="flex items-center gap-4">
                        <ProfilePicture publicKey={currentPublicKey} size="sm" variant="nft" showVerification={true} />
                        <ProfilePicture publicKey={currentPublicKey} size="md" variant="nft" showVerification={true} />
                        <ProfilePicture publicKey={currentPublicKey} size="lg" variant="nft" showVerification={true} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <QueryDisplay title="Profile Picture" query={GRAPHQL_QUERIES.profilePicture} />
          </section>

          {/* Username Display Component */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">UsernameDisplay Component</CardTitle>
                <CardDescription>
                  Username component with display names, verification, and copy functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Display */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Display</h3>
                  <UsernameDisplay publicKey={currentPublicKey} />
                </div>

                {/* With Copy Button */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">With Copy Button</h3>
                  <UsernameDisplay publicKey={currentPublicKey} showCopyButton />
                </div>

                {/* With Profile Link */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">With Profile Link</h3>
                                     <UsernameDisplay publicKey={currentPublicKey} linkToProfile />
                </div>

                {/* Truncated */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Truncated (max 10 chars)</h3>
                  <UsernameDisplay publicKey={currentPublicKey} maxLength={10} />
                </div>
              </CardContent>
            </Card>
            <QueryDisplay title="Username Display" query={GRAPHQL_QUERIES.usernameDisplay} />
          </section>

          {/* Verification Badge Component */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">VerificationBadge Component</CardTitle>
                <CardDescription>
                  Verification badges with different styles and sizes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Badge Styles */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Badge Styles</h3>
                  <div className="flex items-center gap-4">
                                         <div className="flex items-center gap-2">
                       <VerificationBadge isVerified={true} style="default" />
                       <span className="text-sm">Default</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <VerificationBadge isVerified={true} style="premium" />
                       <span className="text-sm">Premium</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <VerificationBadge isVerified={true} style="creator" />
                       <span className="text-sm">Creator</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <VerificationBadge isVerified={true} style="admin" />
                       <span className="text-sm">Admin</span>
                     </div>
                  </div>
                </div>

                {/* Badge Sizes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Badge Sizes</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <VerificationBadge isVerified={true} size="sm" />
                      <span className="text-sm">Small</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <VerificationBadge isVerified={true} size="md" />
                      <span className="text-sm">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <VerificationBadge isVerified={true} size="lg" />
                      <span className="text-sm">Large</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Profile Cover Photo Component */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">ProfileCoverPhoto Component</CardTitle>
                <CardDescription>
                  Cover photo component with responsive aspect ratios and gradient fallbacks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Aspect Ratios */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Aspect Ratios</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">16:9 (Default)</p>
                      <ProfileCoverPhoto publicKey={currentPublicKey} aspectRatio="16:9" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">3:1 (Wide)</p>
                      <ProfileCoverPhoto publicKey={currentPublicKey} aspectRatio="3:1" />
                    </div>
                  </div>
                </div>

                {/* With Overlay Content */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">With Overlay Content</h3>
                  <ProfileCoverPhoto publicKey={currentPublicKey} aspectRatio="16:9">
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <ProfilePicture publicKey={currentPublicKey} size="lg" className="mx-auto mb-4" />
                        <UsernameDisplay publicKey={currentPublicKey} className="text-white text-xl font-bold" />
                        <p className="text-white/80 mt-2">Profile Header Example</p>
                      </div>
                    </div>
                  </ProfileCoverPhoto>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Component Combination Example */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Component Combinations</CardTitle>
                <CardDescription>
                  Examples of components working together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Profile Card</h3>
                    <Card className="max-w-md">
                      <ProfileCoverPhoto publicKey={currentPublicKey} aspectRatio="3:1" />
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <ProfilePicture publicKey={currentPublicKey} size="lg" showVerification={true} />
                          <div>
                            <UsernameDisplay publicKey={currentPublicKey} linkToProfile={true} />
                            <p className="text-sm text-muted-foreground">DeSo Creator</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">Creator</Badge>
                          <Badge variant="outline">Verified</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* NFT Profile Card */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">NFT Profile Card</h3>
                    <Card className="max-w-md">
                      <ProfileCoverPhoto publicKey={currentPublicKey} aspectRatio="3:1" />
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <ProfilePicture publicKey={currentPublicKey} size="lg" variant="nft" showVerification={true} />
                          <div>
                            <UsernameDisplay publicKey={currentPublicKey} linkToProfile={true} />
                            <p className="text-sm text-muted-foreground">NFT Creator</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">NFT</Badge>
                          <Badge variant="outline">Verified</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* GraphQL Queries */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">GraphQL Queries</CardTitle>
                <CardDescription>
                  Copy these queries to use in your own applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Username Resolution Query */}
                <QueryDisplay
                  title="Username Resolution"
                  query={`query GetAccountByUsername($username: String!) {
  accountByUsername(username: $username) {
    publicKey
    username
    description
    profilePic
    extraData
  }
}`}
                />

                {/* Profile Picture Query */}
                <QueryDisplay
                  title="Profile Picture"
                  query={`query GetProfilePicture($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    profilePic
    username
    extraData
  }
}`}
                />

                {/* NFT Profile Picture Query */}
                <QueryDisplay
                  title="NFT Profile Picture"
                  query={`query GetNFTProfilePicture($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    username
    extraData {
      NFTProfilePictureUrl
      isVerified
    }
  }
}`}
                />

                {/* Username Display Query */}
                <QueryDisplay
                  title="Username Display"
                  query={`query GetUsernameInfo($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    username
    extraData {
      DisplayName
      isVerified
    }
  }
}`}
                />

                {/* Profile Data Query */}
                <QueryDisplay
                  title="Complete Profile Data"
                  query={`query GetProfileData($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    id
    publicKey
    username
    description
    profilePic
    extraData {
      DisplayName
      CoverPhotoUrl
      NFTProfilePictureUrl
      isVerified
    }
    coinPriceDesoNanos
  }
}`}
                />
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-muted-foreground">
          <p>DeSo UI Components Library - Phase 2 Complete</p>
          <p className="text-sm mt-2">
            Built with Next.js 15, React 19, TypeScript, and DeSo GraphQL API
          </p>
        </div>
      </div>
    </div>
  );
} 