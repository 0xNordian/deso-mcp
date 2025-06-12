import type { Meta, StoryObj } from '@storybook/react';
import { CopyButton } from './copy-button';

/**
 * The CopyButton component provides a reusable way to copy text to clipboard with visual feedback.
 */

const meta: Meta<typeof CopyButton> = {
  title: 'DeSo/CopyButton',
  component: CopyButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# CopyButton Component

A reusable button component that copies text to clipboard with visual feedback.

## Features

- Copy any text to clipboard
- Visual feedback when text is copied
- Tooltip with copy status
- Configurable size
- Customizable styling
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    textToCopy: 'This text will be copied to clipboard',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    textToCopy: 'This text will be copied to clipboard',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    textToCopy: 'This text will be copied to clipboard',
    size: 'lg',
  },
};

export const CustomStyling: Story = {
  args: {
    textToCopy: 'This text will be copied to clipboard',
    size: 'md',
    className: 'bg-blue-100 rounded-md p-2',
  },
}; 