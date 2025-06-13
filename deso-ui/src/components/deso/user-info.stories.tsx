import type { Meta, StoryObj } from '@storybook/react';
import { UserInfo } from './user-info';
import { http, HttpResponse } from 'msw';
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data';
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants';
import { successHandlers, errorHandlers, loadingHandlers } from '../../lib/mocks/msw-handlers';

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

const meta: Meta<typeof UserInfo> = {
  title: 'DeSo/UserInfo',
  component: UserInfo,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['row', 'column'],
    },
    pictureSize: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base story using mock data
export const Default: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    pictureSize: 'md',
    showVerification: true,
    showDisplayName: true,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const RowLayout: Story = {
  args: {
    ...Default.args,
    layout: 'row',
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const ColumnLayout: Story = {
  args: {
    ...Default.args,
    layout: 'column',
    pictureSize: 'lg',
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithCopyButton: Story = {
  args: {
    ...Default.args,
    showCopyButton: true,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const CustomStyling: Story = {
  args: {
    ...Default.args,
    className: 'bg-gray-100 p-3 rounded-lg',
    displayNameClassName: 'text-blue-600 font-bold',
    usernameClassName: 'text-gray-600',
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    msw: {
      handlers: loadingHandlers,
    },
  },
};

export const WithoutDisplayName: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    msw: {
      handlers: [
        http.post('https://graphql-prod.deso.com/graphql', () => {
          return HttpResponse.json({
            data: {
              accountByPublicKey: {
                ...defaultProfile.accountByPublicKey,
                extraData: {
                  ...defaultProfile.accountByPublicKey.extraData,
                  DisplayName: '', // No display name
                },
              },
            },
          });
        }),
      ],
    },
  },
};

export const WithoutProfilePicture: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    msw: {
      handlers: [
        http.post('https://graphql-prod.deso.com/graphql', () => {
          return HttpResponse.json({
            data: {
              accountByPublicKey: {
                ...defaultProfile.accountByPublicKey,
                profilePic: '', // No profile picture
              },
            },
          });
        }),
      ],
    },
  },
}; 