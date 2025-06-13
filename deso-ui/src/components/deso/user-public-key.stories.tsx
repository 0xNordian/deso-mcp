import type { Meta, StoryObj } from '@storybook/react';
import { UserPublicKey } from './user-public-key';
import { http, HttpResponse } from 'msw';
import { mockProfiles, defaultProfile } from '../../lib/mocks/deso-data';
import { DEFAULT_PUBLIC_KEY } from '../../lib/constants';
import { successHandlers, errorHandlers, loadingHandlers } from '../../lib/mocks/msw-handlers';

const meta: Meta<typeof UserPublicKey> = {
  title: 'DeSo/UserPublicKey',
  component: UserPublicKey,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    showPicture: {
      control: 'boolean',
    },
    showUsername: {
      control: 'boolean',
    },
    showDisplayName: {
      control: 'boolean',
    },
    showCopyButton: {
      control: 'boolean',
    },
    pictureSize: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    layout: {
      control: 'radio',
      options: ['row', 'column'],
    },
    startChars: {
      control: 'number',
    },
    endChars: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base story using mock data
export const Default: Story = {
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithPicture: Story = {
  args: {
    ...Default.args,
    showPicture: true,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithUsername: Story = {
  args: {
    ...Default.args,
    showUsername: true,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithDisplayName: Story = {
  args: {
    ...Default.args,
    showDisplayName: true,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const FullInfo: Story = {
  args: {
    ...Default.args,
    showPicture: true,
    showUsername: true,
    showDisplayName: true,
    showCopyButton: true,
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