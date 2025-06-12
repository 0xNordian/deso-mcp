import type { Meta, StoryObj } from '@storybook/react-vite'
import { graphql, HttpResponse, delay } from 'msw'
import { ProfilePicture } from './profile-picture'
import { mockProfiles, GRAPHQL_OPERATIONS } from '../../lib/mocks/deso-data'

const meta = {
  title: 'DeSo/ProfilePicture',
  component: ProfilePicture,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Display a user\'s profile picture from the DeSo blockchain, with fallback to a default avatar.',
      },
    },
  },
  argTypes: {
    publicKey: {
      control: 'text',
      description: 'The public key of the DeSo user',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the profile picture',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ProfilePicture>

export default meta
type Story = StoryObj<typeof meta>

// Mock GraphQL responses
const createMockHandler = (data: any) => 
  graphql.query(GRAPHQL_OPERATIONS.GetProfilePicture, () => {
    return HttpResponse.json({ data })
  })

const createErrorHandler = () =>
  graphql.query(GRAPHQL_OPERATIONS.GetProfilePicture, async () => {
    await delay(800)
    return HttpResponse.json({
      errors: [{ message: 'Failed to fetch profile data' }]
    })
  })

const createLoadingHandler = () =>
  graphql.query(GRAPHQL_OPERATIONS.GetProfilePicture, async () => {
    await delay(3000) // Long delay to show loading state
    return HttpResponse.json({ data: mockProfiles.mossified })
  })

export const WithMossified: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    size: 'md',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
}

export const WithDiamondHands: Story = {
  args: {
    publicKey: 'BC1YLhDuD4E9vHWbNLWLYfFytN4M8aX9WdPW8NrLYjH7J1b5JQRKvnN',
    size: 'md',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.diamondhands)],
    },
  },
}

export const SmallSize: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    size: 'sm',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
}

export const LargeSize: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    size: 'lg',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
}

export const LoadingState: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    size: 'md',
  },
  parameters: {
    msw: {
      handlers: [createLoadingHandler()],
    },
  },
}

export const ErrorState: Story = {
  args: {
    publicKey: 'invalid-public-key',
    size: 'md',
  },
  parameters: {
    msw: {
      handlers: [createErrorHandler()],
    },
  },
}

export const WithCustomClassName: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    size: 'md',
    className: 'border-4 border-blue-500 shadow-lg',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
}

export const NFTProfilePicture: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a profile with an NFT profile picture instead of the default profile picture.',
      },
    },
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
} 