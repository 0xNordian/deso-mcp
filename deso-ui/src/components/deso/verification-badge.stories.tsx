import type { Meta, StoryObj } from '@storybook/react-vite'
import { VerificationBadge } from './verification-badge'

const meta = {
  title: 'DeSo/VerificationBadge',
  component: VerificationBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Display a verification badge for verified DeSo users.',
      },
    },
  },
  argTypes: {
    isVerified: {
      control: 'boolean',
      description: 'Whether the user is verified',
    },
    style: {
      control: { type: 'select' },
      options: ['default', 'premium', 'creator', 'admin'],
      description: 'Visual style of the badge',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the verification badge',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Whether to show tooltip on hover',
    },
    tooltipText: {
      control: 'text',
      description: 'Custom tooltip text (overrides default)',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to show entrance animation',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof VerificationBadge>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultVerified: Story = {
  args: {
    isVerified: true,
    style: 'default',
    size: 'md',
    showTooltip: true,
    animated: true,
  },
}

export const PremiumVerified: Story = {
  args: {
    isVerified: true,
    style: 'premium',
    size: 'md',
    showTooltip: true,
    animated: true,
  },
}

export const CreatorVerified: Story = {
  args: {
    isVerified: true,
    style: 'creator',
    size: 'md',
    showTooltip: true,
    animated: true,
  },
}

export const AdminVerified: Story = {
  args: {
    isVerified: true,
    style: 'admin',
    size: 'md',
    showTooltip: true,
    animated: true,
  },
}

export const SmallSize: Story = {
  args: {
    isVerified: true,
    style: 'default',
    size: 'sm',
    showTooltip: true,
    animated: true,
  },
}

export const LargeSize: Story = {
  args: {
    isVerified: true,
    style: 'default',
    size: 'lg',
    showTooltip: true,
    animated: true,
  },
}

export const WithoutTooltip: Story = {
  args: {
    isVerified: true,
    style: 'default',
    size: 'md',
    showTooltip: false,
    animated: true,
  },
}

export const WithCustomTooltip: Story = {
  args: {
    isVerified: true,
    style: 'default',
    size: 'md',
    showTooltip: true,
    tooltipText: 'Custom verification message',
    animated: true,
  },
}

export const WithoutAnimation: Story = {
  args: {
    isVerified: true,
    style: 'default',
    size: 'md',
    showTooltip: true,
    animated: false,
  },
}

export const NotVerified: Story = {
  args: {
    isVerified: false,
    style: 'default',
    size: 'md',
    showTooltip: true,
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'When isVerified is false, the badge renders nothing (returns null).',
      },
    },
  },
} 