import type { Meta, StoryObj } from '@storybook/react'
import { ProfilePicture } from './profile-picture'
import { http, HttpResponse } from 'msw'
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data'
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants'

/**
 * The ProfilePicture component displays a user's profile picture from the DeSo blockchain,
 * with support for both regular and NFT profile pictures.
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
 *     }
 *   }
 * }
 * ```
 */

const createMockHandler = (profile: any) => {
  return http.post('https://graphql-prod.deso.com/graphql', async ({ request }) => {
    const body = await request.json() as any;
    
    if (body.operationName === 'GetProfilePicture') {
      return HttpResponse.json({
        data: {
          accountByPublicKey: profile.accountByPublicKey
        }
      });
    }
    
    return HttpResponse.json({ data: null });
  });
};

const meta: Meta<typeof ProfilePicture> = {
  title: 'DeSo/ProfilePicture',
  component: ProfilePicture,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Profile Picture Component

Displays a user's profile picture from the DeSo blockchain, with support for both regular and NFT profile pictures.

## GraphQL Query

This component fetches profile picture data using the following GraphQL query:

\`\`\`graphql
query GetProfilePicture($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    profilePic
    extraData {
      NFTProfilePictureUrl
    }
  }
}
\`\`\`

## Features

- Supports multiple sizes (xs, sm, md, lg, xl)
- Automatically detects and displays NFT profile pictures when available
- Can be forced to display either regular or NFT variant
- Handles loading and error states gracefully
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'nft'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'md',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const Small: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'sm',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const Large: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'lg',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const NFTVariant: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'md',
    variant: 'nft',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const Loading: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    size: 'md',
  },
  parameters: {
    msw: {
      handlers: [
        http.post('https://graphql-prod.deso.com/graphql', async () => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return HttpResponse.json({ data: null });
        }),
      ],
    },
  },
};

export const Error: Story = {
  args: {
    publicKey: 'invalid-key',
    size: 'md',
  },
  parameters: {
    msw: {
      handlers: [
        http.post('https://graphql-prod.deso.com/graphql', () => {
          return HttpResponse.json({ errors: [{ message: 'Profile not found' }] });
        }),
      ],
    },
  },
}; 