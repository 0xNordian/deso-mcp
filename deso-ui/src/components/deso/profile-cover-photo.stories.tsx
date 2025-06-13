import type { Meta, StoryObj } from '@storybook/react'
import { ProfileCoverPhoto } from './profile-cover-photo'
import { http, HttpResponse } from 'msw'
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data'
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants'
import { successHandlers, errorHandlers, loadingHandlers } from '../../lib/mocks/msw-handlers'

/**
 * The ProfileCoverPhoto component displays a user's cover photo from the DeSo blockchain,
 * with support for different aspect ratios and overlay options.
 * 
 * ## GraphQL Query
 * 
 * This component uses the following GraphQL query to fetch cover photo data:
 * 
 * ```graphql
 * query GetProfileData($publicKey: String!) {
 *   accountByPublicKey(publicKey: $publicKey) {
 *     extraData {
 *       FeaturedImageURL
 *     }
 *   }
 * }
 * ```
 */

const createMockHandler = (profile: any) => {
  return http.post('https://graphql-prod.deso.com/graphql', async ({ request }) => {
    const body = await request.json() as any;
    
    if (body.operationName === 'GetProfileData') {
      return HttpResponse.json({
        data: {
          accountByPublicKey: profile.accountByPublicKey
        }
      });
    }
    
    return HttpResponse.json({ data: null });
  });
};

const meta: Meta<typeof ProfileCoverPhoto> = {
  title: 'DeSo/ProfileCoverPhoto',
  component: ProfileCoverPhoto,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    aspectRatio: {
      control: 'select',
      options: ['16:9', '3:1', '2:1', '4:3'],
    },
    showOverlay: {
      control: 'boolean',
    },
    overlayOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    aspectRatio: '16:9',
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <h3 className="mb-2 text-lg font-semibold text-gray-700">Default (16:9)</h3>
      <ProfileCoverPhoto {...args} />
      <div className="mt-2 text-sm text-gray-500">
        <span>Image source: </span>
        <span className="break-all font-mono">{defaultProfile.accountByPublicKey.extraData.FeaturedImageURL}</span>
      </div>
    </div>
  ),
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithOverlay: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    aspectRatio: '16:9',
    showOverlay: true,
    overlayOpacity: 0.5,
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <h3 className="mb-2 text-lg font-semibold text-gray-700">With Overlay</h3>
      <ProfileCoverPhoto {...args} />
      <div className="mt-2 text-sm text-gray-500">
        <span>Image source: </span>
        <span className="break-all font-mono">{defaultProfile.accountByPublicKey.extraData.FeaturedImageURL}</span>
      </div>
    </div>
  ),
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const UltraWideAspect: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    aspectRatio: '3:1',
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <h3 className="mb-2 text-lg font-semibold text-gray-700">Ultra-Wide (3:1)</h3>
      <ProfileCoverPhoto {...args} />
      <div className="mt-2 text-sm text-gray-500">
        <span>Image source: </span>
        <span className="break-all font-mono">{defaultProfile.accountByPublicKey.extraData.FeaturedImageURL}</span>
      </div>
    </div>
  ),
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const StandardAspect: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    aspectRatio: '4:3',
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <h3 className="mb-2 text-lg font-semibold text-gray-700">Standard (4:3)</h3>
      <ProfileCoverPhoto {...args} />
      <div className="mt-2 text-sm text-gray-500">
        <span>Image source: </span>
        <span className="break-all font-mono">{defaultProfile.accountByPublicKey.extraData.FeaturedImageURL}</span>
      </div>
    </div>
  ),
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const Loading: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    aspectRatio: '16:9',
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <h3 className="mb-2 text-lg font-semibold text-gray-700">Loading State</h3>
      <ProfileCoverPhoto {...args} />
    </div>
  ),
  parameters: {
    msw: {
      handlers: loadingHandlers,
    },
  },
}; 