import type { Meta, StoryObj } from '@storybook/react'
import { UsernameDisplay } from './username-display'
import { http, HttpResponse } from 'msw'
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data'
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants'
import { successHandlers, errorHandlers, loadingHandlers } from '../../lib/mocks/msw-handlers'

const meta: Meta<typeof UsernameDisplay> = {
  title: 'DeSo/Username',
  component: UsernameDisplay,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    showVerification: {
      control: 'boolean',
    },
    showCopyButton: {
      control: 'boolean',
    },
    truncate: {
      control: 'boolean',
    },
    maxLength: {
      control: 'number',
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
      handlers: successHandlers,
    },
  },
}

export const WithVerification: Story = {
  args: {
    ...Default.args,
    showVerification: true,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
}

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
}

export const Truncated: Story = {
  args: {
    ...Default.args,
    truncate: true,
    maxLength: 8,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
}

export const Loading: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    msw: {
      handlers: loadingHandlers,
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
      handlers: successHandlers,
    },
  },
} 