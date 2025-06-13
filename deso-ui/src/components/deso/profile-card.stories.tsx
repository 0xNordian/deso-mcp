import type { Meta, StoryObj } from '@storybook/react'
import { http, HttpResponse } from 'msw'
import { ProfilePicture } from './profile-picture'
import { UsernameDisplay } from './username-display'
import { VerificationBadge } from './verification-badge'
import { ProfileCoverPhoto } from './profile-cover-photo'
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data'
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants'
import { getSingleProfilePictureUrl } from '@/lib/utils/deso'
import { successHandlers, errorHandlers, loadingHandlers, noCoverHandlers } from '../../lib/mocks/msw-handlers';

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
 *       FeaturedImageURL
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
          <img
            src={getSingleProfilePictureUrl(publicKey, 'https://node.deso.org/assets/img/default_profile_pic.png')}
            alt="Profile"
            className="h-16 w-16 rounded-full border-4 border-white shadow-lg object-cover"
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
  },
  argTypes: {
    publicKey: {
      control: 'text',
      description: 'The public key of the DeSo user',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const DefaultProfile: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const LoadingProfile: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: loadingHandlers,
    },
  },
};

export const ProfileWithoutCover: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: noCoverHandlers,
    },
  },
}; 