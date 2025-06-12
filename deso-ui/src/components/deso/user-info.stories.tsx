import type { Meta, StoryObj } from '@storybook/react';
import { UserInfo } from './user-info';
import { http, HttpResponse } from 'msw';
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data';
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants';

/**
 * The UserInfo component combines ProfilePicture and UsernameDisplay with the DisplayName
 * from a user's profile, providing a complete user information display.
 * 
 * ## GraphQL Query
 * 
 * This component uses the following GraphQL query to fetch user data:
 * 
 * ```graphql
 * query GetProfileData($publicKey: String!) {
 *   accountByPublicKey(publicKey: $publicKey) {
 *     username
 *     profilePic
 *     extraData {
 *       DisplayName
 *       IsVerified
 *       NFTProfilePictureUrl
 *     }
 *   }
 * }
 * ```
 */

// Helper to create MSW handlers for mocking GraphQL responses
const createMockHandler = (profile: any) => {
  return http.post('https://graphql-prod.deso.com/graphql', async ({ request }) => {
    const body = await request.json() as any;
    
    if (body.operationName === 'GetProfileData' || 
        body.operationName === 'GetProfilePicture' || 
        body.operationName === 'GetUsernameInfo') {
      return HttpResponse.json({
        data: {
          accountByPublicKey: profile.accountByPublicKey
        }
      });
    }
    
    return HttpResponse.json({ data: null });
  });
};

// Create a profile without DisplayName to demonstrate fallback
const profileWithoutDisplayName = {
  accountByPublicKey: {
    ...defaultProfile.accountByPublicKey,
    extraData: {
      ...defaultProfile.accountByPublicKey.extraData,
      DisplayName: undefined
    }
  }
};

const meta: Meta<typeof UserInfo> = {
  title: 'DeSo/UserInfo',
  component: UserInfo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# UserInfo Component

A composite component that displays a user's profile picture, display name, and username.

## GraphQL Query

This component combines multiple GraphQL queries to fetch all necessary user data:

\`\`\`graphql
query GetProfileData($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    username
    profilePic
    extraData {
      DisplayName
      IsVerified
      NFTProfilePictureUrl
    }
  }
}
\`\`\`

## Features

- Displays profile picture, display name, and username in a single component
- Uses username as fallback when display name is not available
- Supports both row and column layouts
- Customizable spacing and styling
- Handles loading and error states gracefully
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    pictureSize: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    layout: {
      control: 'radio',
      options: ['row', 'column'],
    },
    gap: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    showVerification: {
      control: 'boolean',
    },
    showDisplayName: {
      control: 'boolean',
    },
    showCopyButton: {
      control: 'boolean',
    },
    truncate: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    pictureSize: 'md',
    showVerification: true,
    showDisplayName: true,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const WithDisplayName: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    pictureSize: 'md',
    showVerification: true,
    showDisplayName: true,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const WithUsernameAsFallback: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    pictureSize: 'md',
    showVerification: true,
    showDisplayName: true,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(profileWithoutDisplayName)],
    },
  },
};

export const ColumnLayout: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    pictureSize: 'lg',
    showVerification: true,
    showDisplayName: true,
    layout: 'column',
    gap: 'sm',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const WithoutDisplayName: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    pictureSize: 'md',
    showVerification: true,
    showDisplayName: false,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const WithCopyButton: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    pictureSize: 'md',
    showVerification: true,
    showDisplayName: true,
    showCopyButton: true,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const SmallSize: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    pictureSize: 'sm',
    showVerification: true,
    showDisplayName: true,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const LargeSize: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    pictureSize: 'lg',
    showVerification: true,
    showDisplayName: true,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const CustomStyling: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    pictureSize: 'md',
    showVerification: true,
    showDisplayName: true,
    className: 'bg-gray-100 p-3 rounded-lg',
    displayNameClassName: 'text-blue-600 font-bold',
    usernameClassName: 'text-gray-600',
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
    pictureSize: 'md',
    showVerification: true,
    showDisplayName: true,
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
    pictureSize: 'md',
    showVerification: true,
    showDisplayName: true,
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