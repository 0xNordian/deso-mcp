import type { Meta, StoryObj } from '@storybook/react'
import { ProfilePicture } from '../components/deso/profile-picture'
import { UsernameDisplay } from '../components/deso/username-display'
import { ProfileCoverPhoto } from '../components/deso/profile-cover-photo'
import { VerificationBadge } from '../components/deso/verification-badge'

const meta: Meta = {
  title: 'DeSo/Overview',
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
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Profile card example
export const ProfileCard: Story = {
  render: () => (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <ProfileCoverPhoto 
        publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT" 
        className="h-32"
      />
      <div className="relative px-6 pb-6">
        <div className="absolute -top-8 left-6">
          <ProfilePicture 
            publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
            size="lg"
            className="border-4 border-white shadow-lg"
          />
        </div>
        <div className="pt-12">
          <div className="flex items-center gap-2 mb-2">
            <UsernameDisplay 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              className="text-xl font-bold"
            />
          </div>
          <p className="text-gray-600 text-sm">
            Building the future of decentralized social media on DeSo
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A complete profile card using all components together',
      },
    },
  },
}

// NFT Profile card
export const NFTProfileCard: Story = {
  render: () => (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <ProfileCoverPhoto 
        publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT" 
        className="h-32"
      />
      <div className="relative px-6 pb-6">
        <div className="absolute -top-8 left-6">
          <ProfilePicture 
            publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
            variant="nft"
            size="lg"
            className="shadow-lg"
          />
        </div>
        <div className="pt-12">
          <div className="flex items-center gap-2 mb-2">
            <UsernameDisplay 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              className="text-xl font-bold"
            />
          </div>
          <p className="text-gray-600 text-sm">
            NFT collector and creator on DeSo
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Profile card featuring NFT hexagon profile picture',
      },
    },
  },
}

// User list example
export const UserList: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Active Users</h3>
      </div>
      <div className="divide-y">
        <div className="p-4 flex items-center gap-3 hover:bg-gray-50">
          <ProfilePicture 
            publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
            size="md"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <UsernameDisplay 
                publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
                className="font-medium"
              />
            </div>
            <p className="text-sm text-gray-500">Active 2 minutes ago</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3 hover:bg-gray-50">
          <ProfilePicture 
            publicKey="BC1YLhBLE1834FBJbQ9JU23JbPanNYMkUsdpJZrFVqNGsCe7YadYiUg"
            size="md"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <UsernameDisplay 
                publicKey="BC1YLhBLE1834FBJbQ9JU23JbPanNYMkUsdpJZrFVqNGsCe7YadYiUg"
                className="font-medium"
              />
            </div>
            <p className="text-sm text-gray-500">Active 5 minutes ago</p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User list showing profile pictures and usernames',
      },
    },
  },
}

// Verification badge showcase
export const VerificationShowcase: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold mb-4">Verification Badge Styles</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Default User</span>
                <VerificationBadge isVerified={true} style="default" size="sm" />
              </div>
              <p className="text-sm text-gray-500">Verified account</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Premium User</span>
                <VerificationBadge isVerified={true} style="premium" size="sm" />
              </div>
              <p className="text-sm text-gray-500">Premium verified</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Creator</span>
                <VerificationBadge isVerified={true} style="creator" size="sm" />
              </div>
              <p className="text-sm text-gray-500">Verified creator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Admin</span>
                <VerificationBadge isVerified={true} style="admin" size="sm" />
              </div>
              <p className="text-sm text-gray-500">Platform admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all verification badge styles',
      },
    },
  },
}

// Size comparison
export const SizeComparison: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold mb-4">Profile Picture Sizes</h3>
        <div className="flex items-end gap-6">
          <div className="text-center">
            <ProfilePicture 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              size="xs"
            />
            <p className="text-xs mt-2">xs</p>
          </div>
          <div className="text-center">
            <ProfilePicture 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              size="sm"
            />
            <p className="text-xs mt-2">sm</p>
          </div>
          <div className="text-center">
            <ProfilePicture 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              size="md"
            />
            <p className="text-xs mt-2">md</p>
          </div>
          <div className="text-center">
            <ProfilePicture 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              size="lg"
            />
            <p className="text-xs mt-2">lg</p>
          </div>
          <div className="text-center">
            <ProfilePicture 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              size="xl"
            />
            <p className="text-xs mt-2">xl</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold mb-4">NFT Profile Picture Sizes</h3>
        <div className="flex items-end gap-6">
          <div className="text-center">
            <ProfilePicture 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              variant="nft"
              size="xs"
            />
            <p className="text-xs mt-2">xs</p>
          </div>
          <div className="text-center">
            <ProfilePicture 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              variant="nft"
              size="sm"
            />
            <p className="text-xs mt-2">sm</p>
          </div>
          <div className="text-center">
            <ProfilePicture 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              variant="nft"
              size="md"
            />
            <p className="text-xs mt-2">md</p>
          </div>
          <div className="text-center">
            <ProfilePicture 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              variant="nft"
              size="lg"
            />
            <p className="text-xs mt-2">lg</p>
          </div>
          <div className="text-center">
            <ProfilePicture 
              publicKey="BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT"
              variant="nft"
              size="xl"
            />
            <p className="text-xs mt-2">xl</p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Size comparison for both regular and NFT profile pictures',
      },
    },
  },
} 