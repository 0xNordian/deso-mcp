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
    className: {
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

const containerWidth = 'max-w-full w-[700px]';

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

const quotedPostSample = {
  publicKey: LIVE_PUBLIC_KEY,
  postContent:
    'This is the post that is being quoted. It can also have images and stuff.',
  timestamp: new Date('2023-05-20T10:00:00Z'),
  images: oneImage,
};

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

export const WithQuotePost: Story = {
  name: 'With Quote Post',
  args: {
    ...Default.args,
    postContent: "I'm quoting this post, what do you all think?",
    quotedPost: quotedPostSample,
    images: [],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithYouTubeEmbed: Story = {
  name: 'With YouTube Embed',
  args: {
    ...Default.args,
    postContent: 'Check out this cool video!',
    className: containerWidth,
    embedUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    images: [],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithSpotifyEmbed: Story = {
  name: 'With Spotify Embed',
  args: {
    ...Default.args,
    postContent: 'Listening to this banger!',
    className: containerWidth,
    embedUrl: 'https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp',
    images: [],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithSoundCloudEmbed: Story = {
  name: 'With SoundCloud Embed',
  args: {
    ...Default.args,
    postContent: 'New track on SoundCloud!',
    className: containerWidth,
    embedUrl:
      'https://soundcloud.com/yungkaai/blue?in=trending-music-us/sets/folk',
    images: [],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithTwitterEmbed: Story = {
  name: 'With Twitter Embed',
  args: {
    ...Default.args,
    postContent: 'Interesting tweet!',
    className: containerWidth,
    embedUrl: 'https://x.com/desoprotocol/status/1933587613434458243',
    images: [],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithWebsiteEmbed: Story = {
  name: 'With Website Embed',
  args: {
    ...Default.args,
    postContent: 'Check out the DeSo website.',
    className: containerWidth,
    embedUrl: 'https://www.deso.org/',
    images: [],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const Reposted: Story = {
  name: 'Reposted',
  args: {
    ...Default.args,
    status: {
      type: 'repost',
      reposterPublicKey: LIVE_PUBLIC_KEY,
    },
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const Pinned: Story = {
  name: 'Pinned Post',
  args: {
    ...Default.args,
    status: {
      type: 'pinned',
    },
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const SingleComment: Story = {
  name: 'With Single Comment',
  args: {
    ...Default.args,
    publicKey: DEFAULT_PUBLIC_KEY,
    postContent:
      'Fully censorship-resistant & decentralized social media platforms will become more important than ever.',
    comments: [
      {
        ...Default.args,
        publicKey: 'BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT',
        postContent: 'Keep up posting every day🔥🔥🔥',
        timestamp: new Date(),
      },
    ],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const MultipleComments: Story = {
  name: 'With Multiple Comments',
  args: {
    ...Default.args,
    publicKey: DEFAULT_PUBLIC_KEY,
    postContent:
      'Fully censorship-resistant & decentralized social media platforms will become more important than ever.',
    comments: [
      {
        ...Default.args,
        publicKey: 'BC1YLgi66tdjAaVfYpmM447cxsve3TpvfXD9h8X6JMak7gbKABoEVaT',
        postContent: 'Keep up posting every day🔥🔥🔥',
        timestamp: new Date(),
      },
      {
        ...Default.args,
        publicKey: DEFAULT_PUBLIC_KEY,
        postContent: 'This is another great point!',
        timestamp: new Date(),
      },
    ],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithReactions: Story = {
  name: 'With Reactions',
  args: {
    ...Default.args,
    reactions: [
      { emoji: '👍', count: 12, userHasReacted: true },
      { emoji: '🔥', count: 5, userHasReacted: false },
    ],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithAudio: Story = {
  name: 'With Audio',
  args: {
    ...Default.args,
    postContent: 'Check out this cool audio!',
    audioUrl: '/audio-sample.mp3',
    className: containerWidth,
    images: [],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

export const WithVideo: Story = {
  name: 'With Video',
  args: {
    ...Default.args,
    postContent: 'Check out this cool video!',
    videoUrl: '/public/video-sample.mp4',
    className: containerWidth,
    images: [],
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
}; 