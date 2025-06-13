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
import { ProfileCard } from './profile-card';

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

const meta: Meta<typeof ProfileCard> = {
  title: 'DeSo/ProfileCard',
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
};
