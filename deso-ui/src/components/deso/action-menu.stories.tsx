import type { Meta, StoryObj } from '@storybook/react';
import {
  ActionMenu,
  ActionMenuItem,
  ActionMenuSeparator,
} from './action-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Ban, Flag, Share2, Trash2 } from 'lucide-react';

const meta: Meta<typeof ActionMenu> = {
  title: 'DeSo/ActionMenu',
  component: ActionMenu,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof ActionMenu>;

const menuItems = (
  <>
    <ActionMenuItem icon={Share2}>Share</ActionMenuItem>
    <ActionMenuItem icon={Flag}>Report</ActionMenuItem>
    <ActionMenuItem icon={Ban}>Block</ActionMenuItem>
    <ActionMenuSeparator />
    <ActionMenuItem icon={Trash2} variant="destructive">
      Delete
    </ActionMenuItem>
  </>
);

export const IconOnly: Story = {
  name: 'Icon Only Trigger',
  args: {
    trigger: (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
    children: menuItems,
  },
};

export const WithText: Story = {
  name: 'With Text Trigger',
  args: {
    trigger: <Button variant="outline">Actions</Button>,
    children: menuItems,
  },
};

const menuItemsWithoutIcons = (
  <>
    <ActionMenuItem>Share</ActionMenuItem>
    <ActionMenuItem>Report</ActionMenuItem>
    <ActionMenuItem>Block</ActionMenuItem>
    <ActionMenuSeparator />
    <ActionMenuItem variant="destructive">Delete</ActionMenuItem>
  </>
);

export const NoIcons: Story = {
  name: 'No Icons',
  args: {
    trigger: <Button variant="outline">Actions</Button>,
    children: menuItemsWithoutIcons,
  },
}; 