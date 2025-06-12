import type { Meta, StoryObj } from '@storybook/react'
import { VerificationBadge } from './verification-badge'

/**
 * The VerificationBadge component displays a verification badge for DeSo users.
 * This is a presentational component that doesn't make GraphQL queries directly,
 * but is used by other components like UsernameDisplay.
 */

const meta: Meta<typeof VerificationBadge> = {
  title: 'DeSo/VerificationBadge',
  component: VerificationBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Verification Badge Component

A simple presentational component that displays a verification badge for DeSo users.

## Usage

This component doesn't make GraphQL queries directly but is used by other components like UsernameDisplay.
The verification status is typically determined by checking the \`IsVerified\` field in a user's profile data:

\`\`\`graphql
query GetUsernameInfo($publicKey: String!) {
  accountByPublicKey(publicKey: $publicKey) {
    extraData {
      IsVerified
    }
  }
}
\`\`\`

## Features

- Simple boolean prop to control verification state
- Multiple size options
- Multiple style variants
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isVerified: {
      control: 'boolean',
      description: 'Whether the user is verified',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the badge',
    },
    style: {
      control: 'select',
      options: ['default', 'premium', 'creator', 'admin'],
      description: 'Style variant of the badge',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Whether to show tooltip on hover',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Verified: Story = {
  args: {
    isVerified: true,
  },
}

export const Unverified: Story = {
  args: {
    isVerified: false,
  },
}

export const Small: Story = {
  args: {
    isVerified: true,
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    isVerified: true,
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    isVerified: true,
    size: 'lg',
  },
}

export const PremiumStyle: Story = {
  args: {
    isVerified: true,
    style: 'premium',
  },
}

export const CreatorStyle: Story = {
  args: {
    isVerified: true,
    style: 'creator',
  },
}

export const AdminStyle: Story = {
  args: {
    isVerified: true,
    style: 'admin',
  },
}

export const WithTooltip: Story = {
  args: {
    isVerified: true,
    showTooltip: true,
  },
}

export const WithCustomStyling: Story = {
  args: {
    isVerified: true,
    className: 'bg-blue-500 text-white p-1 rounded-md',
  },
} 