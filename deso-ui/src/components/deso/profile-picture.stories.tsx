import type { Meta, StoryObj } from '@storybook/react'
import { ProfilePicture } from './profile-picture'
import { http, HttpResponse } from 'msw'
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data'
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants'
import { successHandlers, errorHandlers, loadingHandlers } from '../../lib/mocks/msw-handlers'

/**
 * The ProfilePicture component displays a user's profile picture from the DeSo blockchain,
 * with support for regular, NFT, and high-resolution profile pictures.
 * 
 * ## GraphQL Query
 * 
 * This component uses the following GraphQL query to fetch profile picture data:
 * 
 * ```graphql
 * query GetProfilePicture($publicKey: String!) {
 *   accountByPublicKey(publicKey: $publicKey) {
 *     profilePic
 *     extraData {
 *       NFTProfilePictureUrl
 *       LargeProfilePicURL
 *     }
 *   }
 * }
 * ```
 */

const meta: Meta<typeof ProfilePicture> = {
  title: 'DeSo/ProfilePicture',
  component: ProfilePicture,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'nft', 'highres'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'md',
    variant: 'default',
  },
};

export const Small: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'sm',
    variant: 'default',
  },
};

export const Large: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'lg',
    variant: 'default',
  },
};

export const NFTVariant: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'md',
    variant: 'nft',
  },
};

export const HighResVariant: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'md',
    variant: 'highres',
  },
};

export const Loading: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'md',
    variant: 'default',
  },
  parameters: {
    msw: {
      handlers: loadingHandlers,
    },
  },
}; 