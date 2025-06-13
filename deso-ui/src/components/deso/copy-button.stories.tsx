import type { Meta, StoryObj } from '@storybook/react';
import { CopyButton } from './copy-button';

const meta: Meta<typeof CopyButton> = {
  title: 'DeSo/CopyButton',
  component: CopyButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    textToCopy: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
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