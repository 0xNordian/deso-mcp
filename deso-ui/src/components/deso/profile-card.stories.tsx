import type { Meta, StoryObj } from '@storybook/react-vite'
import { graphql, HttpResponse, delay } from 'msw'
import { ProfilePicture } from './profile-picture'
import { UsernameDisplay } from './username-display'
import { VerificationBadge } from './verification-badge'
import { ProfileCoverPhoto } from './profile-cover-photo'
import { mockProfiles, GRAPHQL_OPERATIONS } from '../../lib/mocks/deso-data'

// Composite Profile Card Component for demonstration
function ProfileCard({ publicKey }: { publicKey: string }) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cover Photo */}
      <ProfileCoverPhoto 
        publicKey={publicKey} 
        aspectRatio="16:9"
        showOverlay
        overlayOpacity={0.3}
      >
        {/* Profile Picture overlayed on cover */}
        <div className="absolute bottom-4 left-4">
          <ProfilePicture 
            publicKey={publicKey} 
            size="lg"
            className="border-4 border-white shadow-lg"
          />
        </div>
      </ProfileCoverPhoto>
      
      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <UsernameDisplay 
            publicKey={publicKey}
            showVerification
            showCopyButton
          />
          <VerificationBadge isVerified />
        </div>
        
        <p className="text-gray-600 text-sm">
          This is a composite component showcasing all DeSo UI components working together with MSW mocked data.
        </p>
      </div>
    </div>
  )
}

const meta = {
  title: 'DeSo/ProfileCard (Composite)',
  component: ProfileCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A composite component showcasing all DeSo UI components working together with MSW mocked data.',
      },
    },
  },
  argTypes: {
    publicKey: {
      control: 'text',
      description: 'The public key of the DeSo user',
    },
  },
} satisfies Meta<typeof ProfileCard>

export default meta
type Story = StoryObj<typeof meta>

// Create handlers for all queries used by the composite component
const createAllMockHandlers = (profileData: any) => [
  graphql.query(GRAPHQL_OPERATIONS.GetProfilePicture, () => {
    return HttpResponse.json({ data: profileData })
  }),
  graphql.query(GRAPHQL_OPERATIONS.GetUsernameInfo, () => {
    return HttpResponse.json({ data: profileData })
  }),
  graphql.query(GRAPHQL_OPERATIONS.GetProfileData, () => {
    return HttpResponse.json({ data: profileData })
  }),
]

const createAllErrorHandlers = () => [
  graphql.query(GRAPHQL_OPERATIONS.GetProfilePicture, async () => {
    await delay(800)
    return HttpResponse.json({
      errors: [{ message: 'Failed to fetch profile picture' }]
    })
  }),
  graphql.query(GRAPHQL_OPERATIONS.GetUsernameInfo, async () => {
    await delay(800)
    return HttpResponse.json({
      errors: [{ message: 'Failed to fetch username' }]
    })
  }),
  graphql.query(GRAPHQL_OPERATIONS.GetProfileData, async () => {
    await delay(800)
    return HttpResponse.json({
      errors: [{ message: 'Failed to fetch profile data' }]
    })
  }),
]

const createAllLoadingHandlers = (profileData: any) => [
  graphql.query(GRAPHQL_OPERATIONS.GetProfilePicture, async () => {
    await delay(3000)
    return HttpResponse.json({ data: profileData })
  }),
  graphql.query(GRAPHQL_OPERATIONS.GetUsernameInfo, async () => {
    await delay(3000)
    return HttpResponse.json({ data: profileData })
  }),
  graphql.query(GRAPHQL_OPERATIONS.GetProfileData, async () => {
    await delay(3000)
    return HttpResponse.json({ data: profileData })
  }),
]

export const MossifiedProfile: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
  },
  parameters: {
    msw: {
      handlers: createAllMockHandlers(mockProfiles.mossified),
    },
  },
}

export const DiamondHandsProfile: Story = {
  args: {
    publicKey: 'BC1YLhDuD4E9vHWbNLWLYfFytN4M8aX9WdPW8NrLYjH7J1b5JQRKvnN',
  },
  parameters: {
    msw: {
      handlers: createAllMockHandlers(mockProfiles.diamondhands),
    },
  },
}

export const LoadingProfile: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
  },
  parameters: {
    msw: {
      handlers: createAllLoadingHandlers(mockProfiles.mossified),
    },
  },
}

export const ErrorProfile: Story = {
  args: {
    publicKey: 'invalid-public-key',
  },
  parameters: {
    msw: {
      handlers: createAllErrorHandlers(),
    },
  },
}

export const ProfileWithoutCover: Story = {
  args: {
    publicKey: 'BC1YLgDnZU3JQ2dK6t2F9irkUr5gEg1sfb6BmsuF7ZDe6RRkAUn5iqy',
  },
  parameters: {
    msw: {
      handlers: createAllMockHandlers({
        accountByPublicKey: {
          ...mockProfiles.mossified.accountByPublicKey,
          extraData: {
            ...mockProfiles.mossified.accountByPublicKey.extraData,
            CoverPhotoUrl: "" // Remove cover photo
          }
        }
      }),
    },
  },
} 