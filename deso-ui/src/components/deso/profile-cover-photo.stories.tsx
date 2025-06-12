import type { Meta, StoryObj } from '@storybook/react-vite'
import { graphql, HttpResponse, delay } from 'msw'
import { ProfileCoverPhoto } from './profile-cover-photo'
import { mockProfiles, GRAPHQL_OPERATIONS } from '../../lib/mocks/deso-data'

const meta = {
  title: 'DeSo/ProfileCoverPhoto',
  component: ProfileCoverPhoto,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Display a user\'s cover photo from the DeSo blockchain, with fallback to a gradient.',
      },
    },
  },
  argTypes: {
    publicKey: {
      control: 'text',
      description: 'The public key of the DeSo user',
    },
    aspectRatio: {
      control: { type: 'select' },
      options: ['16:9', '3:1', '2:1', '4:3'],
      description: 'Aspect ratio of the cover photo',
    },
    fallbackGradient: {
      control: { type: 'select' },
      options: ['blue', 'purple', 'pink', 'green', 'orange', 'random'],
      description: 'Fallback gradient color when no cover photo',
    },
    showOverlay: {
      control: 'boolean',
      description: 'Whether to show overlay on the cover photo',
    },
    overlayOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Opacity of the overlay',
    },
    enableParallax: {
      control: 'boolean',
      description: 'Whether to enable parallax scrolling effect',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ProfileCoverPhoto>

export default meta
type Story = StoryObj<typeof meta>

// Mock GraphQL responses
const createMockHandler = (data: any) => 
  graphql.query(GRAPHQL_OPERATIONS.GetProfileData, () => {
    return HttpResponse.json({ data })
  })

const createErrorHandler = () =>
  graphql.query(GRAPHQL_OPERATIONS.GetProfileData, async () => {
    await delay(800)
    return HttpResponse.json({
      errors: [{ message: 'Failed to fetch profile data' }]
    })
  })

const createLoadingHandler = () =>
  graphql.query(GRAPHQL_OPERATIONS.GetProfileData, async () => {
    await delay(3000) // Long delay to show loading state
    return HttpResponse.json({ data: mockProfiles.mossified })
  })

export const WithCoverPhoto: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    aspectRatio: '16:9',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
}

export const WithDiamondHandsCover: Story = {
  args: {
    publicKey: 'BC1YLhDuD4E9vHWbNLWLYfFytN4M8aX9WdPW8NrLYjH7J1b5JQRKvnN',
    aspectRatio: '16:9',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.diamondhands)],
    },
  },
}

export const FallbackGradient: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    aspectRatio: '16:9',
    fallbackGradient: 'purple',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler({
        accountByPublicKey: {
          ...mockProfiles.mossified.accountByPublicKey,
          extraData: {
            ...mockProfiles.mossified.accountByPublicKey.extraData,
            CoverPhotoUrl: "" // Remove cover photo to show fallback
          }
        }
      })],
    },
  },
}

export const AspectRatio3to1: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    aspectRatio: '3:1',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
}

export const AspectRatio2to1: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    aspectRatio: '2:1',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
}

export const WithOverlay: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
    aspectRatio: '16:9',
    showOverlay: true,
    overlayOpacity: 0.5,
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
    aspectRatio: '16:9',
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
    aspectRatio: '16:9',
    fallbackGradient: 'orange',
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
    aspectRatio: '16:9',
    className: 'border-4 border-blue-500 shadow-xl rounded-lg',
  },
  parameters: {
    msw: {
      handlers: [createMockHandler(mockProfiles.mossified)],
    },
  },
} 