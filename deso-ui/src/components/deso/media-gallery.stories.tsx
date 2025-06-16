import type { Meta, StoryObj } from '@storybook/react';
import { MediaGallery } from './media-gallery';
import type { MediaType } from './media-card';

const meta: Meta<typeof MediaGallery> = {
  title: 'DeSo/MediaGallery',
  component: MediaGallery,
  argTypes: {
    onMediaClick: {
      action: 'mediaClicked',
      description: 'Callback for when a media card is clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof MediaGallery>;

const generateMediaItems = (count: number) => {
  const mediaTypes: MediaType[] = ['image', 'video', 'audio', 'carousel'];
  return Array.from({ length: count }, (_, i) => ({
    id: `media-${i + 1}`,
    imageUrl: `https://picsum.photos/seed/${i + 1}/600/600`,
    mediaType: mediaTypes[i % mediaTypes.length],
    viewCount: Math.floor(Math.random() * 100000),
  }));
};

export const Default: Story = {
  args: {
    mediaItems: generateMediaItems(16),
  },
};

export const FewerItems: Story = {
  args: {
    mediaItems: generateMediaItems(4),
  },
};

export const MoreItems: Story = {
  args: {
    mediaItems: generateMediaItems(28),
  },
}; 