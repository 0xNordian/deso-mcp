import type { Meta, StoryObj } from '@storybook/react';
import { UserPublicKey } from './user-public-key';
import { http, HttpResponse } from 'msw';
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data';
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants';

/**
 * The UserPublicKey component displays a user's username and truncated public key,
 * with optional display name and copy button.
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

const meta: Meta<typeof UserPublicKey> = {
  title: 'DeSo/UserPublicKey',
  component: UserPublicKey,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# UserPublicKey Component

A component that displays a user's username and truncated public key, with optional display name and copy button.

## GraphQL Query

This component uses the following GraphQL query to fetch user data:

\`\`\`graphql
query GetProfileData($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    username
    profilePic
    extraData {
      DisplayName
      IsVerified
    }
  }
}
\`\`\`

## Features

- Displays username and truncated public key
- Optional profile picture
- Optional display name
- Configurable truncation of public key
- Copy button for public key
- Handles loading and error states gracefully
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showPicture: {
      control: 'boolean',
    },
    showUsername: {
      control: 'boolean',
    },
    showDisplayName: {
      control: 'boolean',
    },
    showVerification: {
      control: 'boolean',
    },
    showCopyButton: {
      control: 'boolean',
    },
    startChars: {
      control: 'number',
    },
    endChars: {
      control: 'number',
    },
    pictureSize: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    layout: {
      control: 'radio',
      options: ['row', 'column'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    showPicture: false,
    showUsername: true,
    showDisplayName: false,
    showCopyButton: true,
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
    showPicture: false,
    showUsername: false,
    showDisplayName: true,
    showCopyButton: true,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const WithProfilePicture: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    showPicture: true,
    showUsername: true,
    showDisplayName: false,
    showCopyButton: true,
    pictureSize: 'md',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const Complete: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    showPicture: true,
    showUsername: true,
    showDisplayName: true,
    showVerification: true,
    showCopyButton: true,
    pictureSize: 'md',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const ColumnLayout: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    showPicture: true,
    showUsername: true,
    showDisplayName: true,
    showCopyButton: true,
    layout: 'column',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
};

export const CustomTruncation: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    showUsername: true,
    startChars: 8,
    endChars: 4,
    showCopyButton: true,
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
    showPicture: true,
    showUsername: true,
    showDisplayName: true,
    showCopyButton: true,
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
    showPicture: true,
    showUsername: true,
    showDisplayName: true,
    showCopyButton: true,
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