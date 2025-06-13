import type { Meta, StoryObj } from '@storybook/react';
import { PostCard } from './post-card';
import { DEFAULT_PUBLIC_KEY, LIVE_PUBLIC_KEY } from '@/lib/constants';
import {
  successHandlers,
  errorHandlers,
  loadingHandlers,
} from '@/lib/mocks/msw-handlers';

const meta: Meta<typeof PostCard> = {
  title: 'DeSo/PostCard',
  component: PostCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    postContent: {
      control: 'text',
    },
    publicKey: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof PostCard>;

const samplePost =
  'This is a sample post content. It can be a short message or a longer paragraph.\\nThe purpose of this text is to demonstrate how the post content is displayed within the PostCard component. DeSo is a decentralized social network.';

const sampleActions = {
  comments: 1,
  likes: 11,
  reposts: 2,
  diamonds: 2,
  diamondValue: '($0.02)',
  quotes: 1,
  views: 135000,
};

const oneImage = ['https://placehold.co/1200x800/dbd8e3/352f44'];
const twoImages = [
  ...oneImage,
  'https://placehold.co/1200x800/a39ba8/352f44',
];
const threeImages = [
  ...twoImages,
  'https://placehold.co/1200x800/625772/352f44',
];
const fourImages = [
  ...threeImages,
  'https://placehold.co/1200x800/352f44/dbd8e3',
];
const fiveImages = [
  ...fourImages,
  'https://placehold.co/1200x800/b9b7bd/352f44',
];

export const Default: Story = {
  name: 'Default (No Image)',
  args: {
    publicKey: DEFAULT_PUBLIC_KEY,
    postContent: samplePost,
    actions: sampleActions,
    timestamp: new Date(),
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithImage: Story = {
  name: 'With Image (default)',
  args: {
    ...Default.args,
    images: oneImage,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    ...Default.args,
    images: oneImage,
  },
  parameters: {
    msw: {
      handlers: loadingHandlers,
    },
  },
};

export const Error: Story = {
  name: 'Error State',
  args: {
    publicKey: 'invalid-key',
    postContent: samplePost,
    actions: sampleActions,
    timestamp: new Date(),
  },
  parameters: {
    msw: {
      handlers: errorHandlers,
    },
  },
};

export const Live: Story = {
  name: 'Live Data',
  args: {
    publicKey: LIVE_PUBLIC_KEY,
    postContent:
      'This is a post from a live user on the DeSo blockchain. The profile picture and username are fetched in real-time.',
    actions: sampleActions,
    timestamp: new Date(),
  },
  parameters: {
    msw: {
      handlers: [], // Bypass MSW
    },
  },
};

export const WithFullDate: Story = {
  name: 'With Full Date',
  args: {
    ...Default.args,
    timestamp: new Date('2023-01-01T12:00:00Z'),
    images: twoImages,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithBento3: Story = {
  name: 'With Bento (3 images)',
  args: {
    ...Default.args,
    images: threeImages,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithBento4: Story = {
  name: 'With Bento (4 images)',
  args: {
    ...Default.args,
    images: fourImages,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithCarousel: Story = {
  name: 'With Carousel',
  args: {
    ...Default.args,
    images: fiveImages,
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
}; 