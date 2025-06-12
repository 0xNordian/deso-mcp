import type { Meta, StoryObj } from '@storybook/react'
import { UsernameDisplay } from './username-display'
import { http, HttpResponse } from 'msw'
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data'
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants'

/**
 * The UsernameDisplay component shows a user's username from the DeSo blockchain,
 * with optional verification badge and copy button.
 * 
 * ## GraphQL Query
 * 
 * This component uses the following GraphQL query to fetch username data:
 * 
 * ```graphql
 * query GetUsernameInfo($publicKey: String!) {
 *   accountByPublicKey(publicKey: $publicKey) {
 *     username
 *     extraData {
 *       IsVerified
 *     }
 *   }
 * }
 * ```
 */

const createMockHandler = (profile: any) => {
  return http.post('https://graphql-prod.deso.com/graphql', async ({ request }) => {
    const body = await request.json() as any
    
    if (body.operationName === 'GetUsernameInfo') {
      return HttpResponse.json({
        data: {
          accountByPublicKey: profile.accountByPublicKey
        }
      })
    }
    
    return HttpResponse.json({ data: null })
  })
}

const meta: Meta<typeof UsernameDisplay> = {
  title: 'DeSo/Username',
  component: UsernameDisplay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Username Display Component

Display a user's username from the DeSo blockchain with optional verification badge and copy button.

## GraphQL Query

This component fetches username data using the following GraphQL query:

\`\`\`graphql
query GetUsernameInfo($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    username
    extraData {
      IsVerified
    }
  }
}
\`\`\`

## Features

- Shows username with @ prefix
- Optional verification badge
- Optional copy button
- Truncation for long usernames
- Customizable styling
- Handles loading and error states gracefully
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showVerification: {
      control: 'boolean',
    },
    truncate: {
      control: 'boolean',
    },
    maxLength: {
      control: 'number',
    },
    showCopyButton: {
      control: 'boolean',
      description: 'Whether to show copy username button',
    },
    linkToProfile: {
      control: 'boolean',
      description: 'Whether username should link to profile',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
}

export const WithVerification: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    showVerification: true,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
}

export const Truncated: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    truncate: true,
    maxLength: 8,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
}

export const Loading: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: [
        http.post('https://graphql-prod.deso.com/graphql', async () => {
          await new Promise(resolve => setTimeout(resolve, 2000))
          return HttpResponse.json({ data: null })
        }),
      ],
    },
  },
}

export const Error: Story = {
  args: {
    publicKey: 'invalid-key',
  },
  parameters: {
    msw: {
      handlers: [
        http.post('https://graphql-prod.deso.com/graphql', () => {
          return HttpResponse.json({ errors: [{ message: 'Profile not found' }] })
        }),
      ],
    },
  },
}

export const WithCustomStyling: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    showVerification: true,
    className: 'text-blue-600 font-bold text-lg',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(defaultProfile)],
    },
  },
} 