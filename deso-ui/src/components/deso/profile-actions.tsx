'use client';

import React from 'react';
import {
  ActionMenu,
  ActionMenuItem,
} from './action-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, Share2, Flag, Ban } from 'lucide-react';

const confirmationText = [
  {
    title: 'Report User?',
    description:
      'This will report the user for review. Please confirm.',
    confirmText: 'Report',
    onConfirm: () => console.log('User reported'),
  }, 
  {
    title: 'Block User?',
    description:
      "This will block the user. You won't see their posts or notifications. They won't be able to follow you or message you.",
    variant: 'destructive',
    confirmText: 'Block',
    onConfirm: () => console.log('User blocked'),
  },
];

export const ProfileActions = () => {
  return (
    <ActionMenu
      trigger={
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      }
    >
      <ActionMenuItem icon={Share2}>Share profile</ActionMenuItem>
      <ActionMenuItem
        icon={Flag}
        confirmation={{
          title: confirmationText[0].title,
          description: confirmationText[0].description,
          confirmText: confirmationText[0].confirmText,
          onConfirm: confirmationText[0].onConfirm,
        }}
      >
        Report user
      </ActionMenuItem>
      <ActionMenuItem
        icon={Ban}
        variant="destructive"
        confirmation={{
          title: confirmationText[1].title,
          description: confirmationText[1].description,
          variant: confirmationText[1].variant as 'destructive' | 'default' | 'success',
          confirmText: confirmationText[1].confirmText,
          onConfirm: confirmationText[1].onConfirm,
        }}
      >
        Block user
      </ActionMenuItem>
    </ActionMenu>
  );
}; 