import type { Meta, StoryObj } from '@storybook/react'
import { ProfilePicture } from '../components/deso/profile-picture'
import { UsernameDisplay } from '../components/deso/username-display'
import { ProfileCoverPhoto } from '../components/deso/profile-cover-photo'
import { VerificationBadge } from '../components/deso/verification-badge'
import { UserInfo } from '../components/deso/user-info'
import { http, HttpResponse } from 'msw'
import { defaultProfile } from '../lib/mocks/deso-data'
import { DEFAULT_PUBLIC_KEY } from '../lib/constants'

// Helper to create MSW handlers
const createHandler = () => {
  return http.post('https://graphql-prod.deso.com/graphql', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({ data: defaultProfile });
  });
};

function Overview() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">DeSo UI Library</h1>
        <p className="text-lg text-gray-600">
          A collection of React components for building DeSo-powered applications with Storybook documentation.
        </p>
      </div>

      {/* Profile Pictures Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Pictures</h2>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Different Sizes</h3>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <ProfilePicture
                publicKey={DEFAULT_PUBLIC_KEY}
                size="xs"
              />
              <p className="text-sm text-gray-500 mt-2">XS</p>
            </div>
            <div className="text-center">
              <ProfilePicture
                publicKey={DEFAULT_PUBLIC_KEY}
                size="sm"
              />
              <p className="text-sm text-gray-500 mt-2">SM</p>
            </div>
            <div className="text-center">
              <ProfilePicture
                publicKey={DEFAULT_PUBLIC_KEY}
                size="md"
              />
              <p className="text-sm text-gray-500 mt-2">MD</p>
            </div>
            <div className="text-center">
              <ProfilePicture
                publicKey={DEFAULT_PUBLIC_KEY}
                size="lg"
              />
              <p className="text-sm text-gray-500 mt-2">LG</p>
            </div>
            <div className="text-center">
              <ProfilePicture
                publicKey={DEFAULT_PUBLIC_KEY}
                size="xl"
              />
              <p className="text-sm text-gray-500 mt-2">XL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Username Display Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Username Display</h2>
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">With Verification</h3>
            <UsernameDisplay
              publicKey={DEFAULT_PUBLIC_KEY}
              showVerification={true}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">With Copy Button</h3>
            <UsernameDisplay
              publicKey={DEFAULT_PUBLIC_KEY}
              showCopyButton={true}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Truncated</h3>
            <UsernameDisplay
              publicKey={DEFAULT_PUBLIC_KEY}
              truncate={true}
              maxLength={8}
            />
          </div>
        </div>
      </section>

      {/* UserInfo Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Info</h2>
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Row Layout</h3>
            <UserInfo
              publicKey={DEFAULT_PUBLIC_KEY}
              pictureSize="md"
              showVerification={true}
              showDisplayName={true}
              layout="row"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Column Layout</h3>
            <UserInfo
              publicKey={DEFAULT_PUBLIC_KEY}
              pictureSize="lg"
              showVerification={true}
              showDisplayName={true}
              layout="column"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">With Copy Button</h3>
            <UserInfo
              publicKey={DEFAULT_PUBLIC_KEY}
              pictureSize="md"
              showVerification={true}
              showDisplayName={true}
              showCopyButton={true}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Custom Styling</h3>
            <UserInfo
              publicKey={DEFAULT_PUBLIC_KEY}
              pictureSize="md"
              showVerification={true}
              showDisplayName={true}
              className="bg-gray-100 p-3 rounded-lg"
              displayNameClassName="text-blue-600 font-bold"
              usernameClassName="text-gray-600"
            />
          </div>
        </div>
      </section>

      {/* Verification Badge Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Verification Badge</h2>
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <VerificationBadge isVerified={true} />
            <span className="text-gray-700">Verified Account</span>
          </div>
          <div className="flex items-center space-x-4">
            <VerificationBadge isVerified={false} />
            <span className="text-gray-700">Unverified Account</span>
          </div>
        </div>
      </section>

      {/* Cover Photo Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Cover Photos</h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">16:9 Aspect Ratio</h3>
            <div className="max-w-md">
              <ProfileCoverPhoto
                publicKey={DEFAULT_PUBLIC_KEY}
                aspectRatio="16:9"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">3:1 Ultra-wide</h3>
            <div className="max-w-md">
              <ProfileCoverPhoto
                publicKey={DEFAULT_PUBLIC_KEY}
                aspectRatio="3:1"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">With Overlay</h3>
            <div className="max-w-md">
              <ProfileCoverPhoto
                publicKey={DEFAULT_PUBLIC_KEY}
                aspectRatio="16:9"
                showOverlay={true}
                overlayOpacity={0.4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Composite Example */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Composite Example</h2>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden max-w-md mx-auto">
          <ProfileCoverPhoto
            publicKey={DEFAULT_PUBLIC_KEY}
            aspectRatio="16:9"
            showOverlay={true}
            overlayOpacity={0.3}
          >
            <div className="absolute bottom-4 left-4">
              <ProfilePicture
                publicKey={DEFAULT_PUBLIC_KEY}
                size="lg"
                className="border-4 border-white shadow-lg"
              />
            </div>
          </ProfileCoverPhoto>
          
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <UsernameDisplay
                publicKey={DEFAULT_PUBLIC_KEY}
                showVerification={true}
                showCopyButton={true}
              />
            </div>
            <p className="text-gray-600 text-sm">
              A beautiful composite layout combining all DeSo UI components with real blockchain data.
            </p>
          </div>
        </div>
      </section>

      {/* GraphQL Queries Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">GraphQL Queries</h2>
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">ProfilePicture Query</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {`query GetProfilePicture($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    profilePic
    extraData {
      NFTProfilePictureUrl
    }
  }
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">UsernameDisplay Query</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {`query GetUsernameInfo($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    username
    extraData {
      IsVerified
    }
  }
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">ProfileCoverPhoto Query</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {`query GetProfileData($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    extraData {
      CoverPhotoUrl
    }
  }
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">UserInfo Query</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {`query GetProfileData($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    username
    profilePic
    extraData {
      DisplayName
      IsVerified
      NFTProfilePictureUrl
    }
  }
}`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

const meta: Meta<typeof Overview> = {
  title: 'Overview',
  component: Overview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# DeSo UI Library Overview

This page showcases all DeSo components working together in realistic scenarios.

## Components Included

- **ProfilePicture**: Displays user profile pictures with support for regular circular and NFT hexagon variants
- **UsernameDisplay**: Shows usernames with optional verification badges
- **ProfileCoverPhoto**: Displays user cover photos with responsive design
- **VerificationBadge**: Shows verification status with multiple styles

## Live Data Integration

All components fetch real data from the DeSo blockchain using GraphQL queries to:
- \`https://graphql-prod.deso.com/graphql\`

## Features

- ✅ **Live Blockchain Data**: Real profile pictures, usernames, and verification status
- ✅ **NFT Support**: Hexagon-shaped NFT profile pictures
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Accessibility**: ARIA labels and semantic markup
- ✅ **Error Handling**: Graceful fallbacks for missing data
- ✅ **TypeScript**: Full type safety with Zod validation
        `,
      },
    },
    msw: {
      handlers: [createHandler()],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllComponents: Story = {}; 