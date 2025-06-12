import type { Meta, StoryObj } from '@storybook/react'
import { http, HttpResponse } from 'msw'
import { ProfilePicture } from './profile-picture'
import { UsernameDisplay } from './username-display'
import { VerificationBadge } from './verification-badge'
import { ProfileCoverPhoto } from './profile-cover-photo'
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data'
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants'

/**
 * The ProfileCard is a composite component that combines multiple DeSo UI components
 * to create a complete user profile card.
 * 
 * ## GraphQL Queries
 * 
 * This component uses multiple GraphQL queries through its child components:
 * 
 * ```graphql
 * # For profile picture
 * query GetProfilePicture($publicKey: String!) {
 *   accountByPublicKey(publicKey: $publicKey) {
 *     profilePic
 *     extraData {
 *       NFTProfilePictureUrl
 *     }
 *   }
 * }
 * 
 * # For username
 * query GetUsernameInfo($publicKey: String!) {
 *   accountByPublicKey(publicKey: $publicKey) {
 *     username
 *     extraData {
 *       IsVerified
 *     }
 *   }
 * }
 * 
 * # For cover photo
 * query GetProfileData($publicKey: String!) {
 *   accountByPublicKey(publicKey: $publicKey) {
 *     extraData {
 *       CoverPhotoUrl
 *     }
 *   }
 * }
 * ```
 */

// Composite Profile Card Component for demonstration
function ProfileCard({ publicKey }: { publicKey: string }) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cover Photo */}
      <ProfileCoverPhoto 
        publicKey={publicKey} 
        aspectRatio="16:9"
        showOverlay
        overlayOpacity={0.3}
      >
        {/* Profile Picture overlayed on cover */}
        <div className="absolute bottom-4 left-4">
          <ProfilePicture 
            publicKey={publicKey} 
            size="lg"
            className="border-4 border-white shadow-lg"
          />
        </div>
      </ProfileCoverPhoto>
      
      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <UsernameDisplay 
            publicKey={publicKey}
            showVerification
            showCopyButton
          />
          <VerificationBadge isVerified />
        </div>
        
        <p className="text-gray-600 text-sm">
          This is a composite component showcasing all DeSo UI components working together with MSW mocked data.
        </p>
      </div>
    </div>
  )
}

const meta: Meta<typeof ProfileCard> = {
  title: 'DeSo/ProfileCard (Composite)',
  component: ProfileCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Profile Card Component

A composite component showcasing all DeSo UI components working together to create a complete user profile card.

## GraphQL Queries

This component uses multiple GraphQL queries through its child components:

\`\`\`graphql
# For profile picture
query GetProfilePicture($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    profilePic
    extraData {
      NFTProfilePictureUrl
    }
  }
}

# For username
query GetUsernameInfo($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    username
    extraData {
      IsVerified
    }
  }
}

# For cover photo
query GetProfileData($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    extraData {
      CoverPhotoUrl
    }
  }
}
\`\`\`

## Features

- Combines ProfilePicture, UsernameDisplay, VerificationBadge, and ProfileCoverPhoto components
- Creates a complete user profile card with a single public key
- Demonstrates how to compose DeSo UI components together
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    publicKey: {
      control: 'text',
      description: 'The public key of the DeSo user',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Create handlers for all queries used by the composite component
const createAllMockHandlers = (profileData: any) => [
  http.post('https://graphql-prod.deso.com/graphql', async ({ request }) => {
    const body = await request.json() as any;
    
    if (body.operationName === 'GetProfilePicture' || 
        body.operationName === 'GetUsernameInfo' || 
        body.operationName === 'GetProfileData') {
      return HttpResponse.json({ data: profileData });
    }
    
    return HttpResponse.json({ data: null });
  }),
];

const createAllErrorHandlers = () => [
  http.post('https://graphql-prod.deso.com/graphql', async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return HttpResponse.json({
      errors: [{ message: 'Failed to fetch profile data' }]
    });
  }),
];

const createAllLoadingHandlers = (profileData: any) => [
  http.post('https://graphql-prod.deso.com/graphql', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return HttpResponse.json({ data: profileData });
  }),
];

export const DefaultProfile: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: createAllMockHandlers(defaultProfile),
    },
  },
};

export const LoadingProfile: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: createAllLoadingHandlers(defaultProfile),
    },
  },
};

export const ErrorProfile: Story = {
  args: {
    publicKey: 'invalid-public-key',
  },
  parameters: {
    msw: {
      handlers: createAllErrorHandlers(),
    },
  },
};

export const ProfileWithoutCover: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: createAllMockHandlers({
        accountByPublicKey: {
          ...defaultProfile.accountByPublicKey,
          extraData: {
            ...defaultProfile.accountByPublicKey.extraData,
            CoverPhotoUrl: "" // Remove cover photo
          }
        }
      }),
    },
  },
}; 