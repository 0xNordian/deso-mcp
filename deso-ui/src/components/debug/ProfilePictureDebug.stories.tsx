import type { Meta, StoryObj } from '@storybook/react'
import { ProfilePictureDebug } from './ProfilePictureDebug'
import { defaultProfile } from '../../lib/mocks/deso-data'

const meta: Meta<typeof ProfilePictureDebug> = {
  title: 'Debug/ProfilePictureDebug',
  component: ProfilePictureDebug,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Debug component to visualize hex decoding process for DeSo profile pictures.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    profilePic: {
      control: 'text',
      description: 'Hex-encoded profile picture data',
    },
    nftUrl: {
      control: 'text',
      description: 'NFT profile picture URL',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const DefaultProfile: Story = {
  args: {
    profilePic: defaultProfile.accountByPublicKey.profilePic,
    nftUrl: defaultProfile.accountByPublicKey.extraData.NFTProfilePictureUrl,
  },
}

export const OnlyHexData: Story = {
  args: {
    profilePic: defaultProfile.accountByPublicKey.profilePic,
    nftUrl: undefined,
  },
}

export const OnlyNFTUrl: Story = {
  args: {
    profilePic: undefined,
    nftUrl: defaultProfile.accountByPublicKey.extraData.NFTProfilePictureUrl,
  },
}

export const NoProfileData: Story = {
  args: {
    profilePic: undefined,
    nftUrl: undefined,
  },
}

export const InvalidHexData: Story = {
  args: {
    profilePic: '\\x696e76616c6964',
    nftUrl: undefined,
  },
} 