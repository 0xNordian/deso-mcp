import type { Meta, StoryObj } from '@storybook/react-vite'
import { graphql, HttpResponse, delay } from 'msw'
import { UsernameDisplay } from './username-display'
import { mockProfiles, GRAPHQL_OPERATIONS } from '../../lib/mocks/deso-data'

const meta = {
  title: 'DeSo/Username',
  component: UsernameDisplay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Display a user\'s username and display name from the DeSo blockchain.',
      },
    },
  },
  argTypes: {
    publicKey: {
      control: 'text',
      description: 'The public key of the DeSo user',
    },
    showVerification: {
      control: 'boolean',
      description: 'Whether to show verification badge',
    },
    truncate: {
      control: 'boolean',
      description: 'Whether to truncate long usernames',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum length for truncated text',
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
} satisfies Meta<typeof UsernameDisplay>

export default meta
type Story = StoryObj<typeof meta>

// Mock GraphQL responses
const createMockHandler = (data: any) => 
  graphql.query(GRAPHQL_OPERATIONS.GetUsernameInfo, () => {
    return HttpResponse.json({ data })
  })

const createErrorHandler = () =>
  graphql.query(GRAPHQL_OPERATIONS.GetUsernameInfo, async () => {
    await delay(800)
    return HttpResponse.json({
      errors: [{ message: 'Failed to fetch username data' }]
    })
  })

const createLoadingHandler = () =>
  graphql.query(GRAPHQL_OPERATIONS.GetUsernameInfo, async () => {
    await delay(3000) // Long delay to show loading state
    return HttpResponse.json({ data: mockProfiles.mossified })
  })

export const WithMossified: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    showVerification: true,
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
    showVerification: true,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.diamondhands)],
    },
  },
}

export const WithCopyButton: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    showVerification: true,
    showCopyButton: true,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
}

export const WithTruncation: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    showVerification: true,
    truncate: true,
    maxLength: 10,
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
}

export const WithProfileLink: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    showVerification: true,
    linkToProfile: true,
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
    showVerification: true,
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
    showVerification: true,
  },
  parameters: {
    msw: {
      handlers: [createErrorHandler()],
    },
  },
}

export const WithCustomStyling: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    showVerification: true,
    className: 'text-blue-600 font-bold text-lg',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
} 