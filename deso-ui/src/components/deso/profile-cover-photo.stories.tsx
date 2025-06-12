import type { Meta, StoryObj } from '@storybook/react'
import { ProfileCoverPhoto } from './profile-cover-photo'
import { http, HttpResponse } from 'msw'
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data'
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants'

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
 *       CoverPhotoUrl
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
    docs: {
      description: {
        component: `
# Profile Cover Photo Component

Displays a user's cover photo from the DeSo blockchain with support for different aspect ratios and overlay options.

## GraphQL Query

This component fetches cover photo data using the following GraphQL query:

\`\`\`graphql
query GetProfileData($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    extraData {
      CoverPhotoUrl
    }
  }
}
\`\`\`

## Features

- Supports multiple aspect ratios (16:9, 3:1, 2:1, 4:3)
- Optional overlay with adjustable opacity
- Gradient fallback when cover photo is not available
- Optional parallax scrolling effect
- Handles loading and error states gracefully
`,
      },
    },
  },
  tags: ['autodocs'],
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
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
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
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const UltraWideAspect: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    aspectRatio: '3:1',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const StandardAspect: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    aspectRatio: '4:3',
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
    aspectRatio: '16:9',
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
    aspectRatio: '16:9',
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