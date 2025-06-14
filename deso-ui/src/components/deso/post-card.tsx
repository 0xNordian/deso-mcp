import { ProfilePicture } from './profile-picture';
import { UsernameDisplay } from './username-display';
import { UserPublicKey } from './user-public-key';
import {
  ActionMenu,
  ActionMenuItem,
  ActionMenuSeparator,
} from './action-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, UserPlus, Ban, Flag, Repeat, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUsername } from '@/hooks/useProfile';
import { PostAction } from './post-action';
import { useState, useLayoutEffect, useRef } from 'react';
import { Timestamp } from './timestamp';
import { PostImage, PostImageActions } from './post-image';
import { PostEmbed } from './post-embed';
import { PostVideo } from './post-video';
import { PostAudio } from './post-audio';
import { PostReactions, Reaction } from './post-reactions';
import { PostShare } from './post-share';
import { PostPoll, PollOption } from './post-poll';

export interface PostActionProps {
  comments: number;
  likes: number;
  reposts: number;
  diamonds: number;
  diamondValue: string;
  quotes: number;
  views: number;
  audioUrl?: string;
  status?: PostStatusProps;
  videoUrl?: string;
  reactions?: Reaction[];
}

export interface PostStatusProps {
  type: 'repost' | 'pinned';
  reposterPublicKey?: string;
}

export interface PostQuoteProps {
  publicKey: string;
  postContent: string;
  timestamp: string | Date;
  images?: string[];
  embedUrl?: string;
  quotedPost?: PostQuoteProps;
  status?: PostStatusProps;
  videoUrl?: string;
  audioUrl?: string;
  reactions?: Reaction[];
}

export interface PostPollInfo {
  options: PollOption[];
  votes: number[];
  totalVotes: number;
  userVotedIndex: number | null;
}

export interface PostCardProps {
  publicKey: string;
  postContent: string;
  className?: string;
  actions?: PostActionProps;
  timestamp: string | Date;
  images?: string[];
  embedUrl?: string;
  quotedPost?: PostQuoteProps;
  status?: PostStatusProps;
  videoUrl?: string;
  audioUrl?: string;
  reactions?: Reaction[];
  comments?: PostCardProps[];
  postUrl?: string;
  poll?: PostPollInfo;
}

const RepostedBy = ({ publicKey }: { publicKey: string }) => {
  return (
    <div className="flex items-center gap-1">
      <span>Reposted by</span>
      <UsernameDisplay publicKey={publicKey} linkToProfile />
    </div>
  );
};

const PostStatus = ({ type, reposterPublicKey }: PostStatusProps) => {
  if (type === 'pinned') {
    return (
      <div className="ml-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Pin className="h-4 w-4" />
        <span>Pinned Post</span>
      </div>
    );
  }

  if (type === 'repost' && reposterPublicKey) {
    return (
      <div className="ml-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Repeat className="h-4 w-4" />
        <RepostedBy publicKey={reposterPublicKey} />
      </div>
    );
  }

  return null;
};

const PostCardHeader = ({
  publicKey,
  username,
  timestamp,
  quotedPost,
  videoUrl,
  audioUrl,
}: {
  publicKey: string;
  username?: string;
  timestamp: string | Date;
  quotedPost?: PostQuoteProps;
  videoUrl?: string;
  audioUrl?: string;
}) => (
  <div className="flex justify-between items-start">
    <div className="flex flex-col">
      <UsernameDisplay publicKey={publicKey} showVerification linkToProfile />
      <div className="flex items-center gap-2 text-muted-foreground">
        <UserPublicKey publicKey={publicKey} truncate />
        <span className="text-xs">·</span>
        <Timestamp timestamp={timestamp} />
      </div>
    </div>
    <ActionMenu
      trigger={
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </Button>
      }
    >
      <ActionMenuItem icon={UserPlus}>
        Follow {username ? `@${username}` : 'user'}
      </ActionMenuItem>
      <ActionMenuSeparator />
      <ActionMenuItem icon={Flag}>Report post</ActionMenuItem>
      <ActionMenuItem
        icon={Ban}
        variant="destructive"
        confirmation={{
          title: 'Block User?',
          description:
            "This will block the user. You won't see their posts or notifications. They won't be able to follow you or message you.",
          variant: 'destructive',
          confirmText: 'Block',
          onConfirm: () => console.log('User blocked'),
        }}
      >
        Block {username ? `@${username}` : 'user'}
      </ActionMenuItem>
    </ActionMenu>
  </div>
);

const PostCardBody = ({
  postContent,
  embedUrl,
  images,
  modalActions,
  quotedPost,
  videoUrl,
  audioUrl,
  reactions,
  poll,
  onPollVote,
}: {
  postContent: string;
  embedUrl?: string;
  images?: string[];
  modalActions: PostImageActions;
  quotedPost?: PostQuoteProps;
  videoUrl?: string;
  audioUrl?: string;
  reactions?: Reaction[];
  poll?: PostPollInfo;
  onPollVote: (index: number) => void;
}) => (
  <>
    <div className="mt-2 text-foreground">
      <p className="whitespace-pre-wrap">{postContent}</p>
    </div>
    {audioUrl && <PostAudio url={audioUrl} />}
    {videoUrl && <PostVideo url={videoUrl} />}
    {embedUrl && <PostEmbed url={embedUrl} />}
    {images && images.length > 0 && (
      <PostImage images={images} withModal withModalActions={modalActions} />
    )}
    {poll && (
      <PostPoll
        options={poll.options}
        votes={poll.votes}
        totalVotes={poll.totalVotes}
        userVotedIndex={poll.userVotedIndex}
        onVote={onPollVote}
      />
    )}
    {quotedPost && <PostQuote {...quotedPost} />}
    {reactions && reactions.length > 0 && (
      <PostReactions
        reactions={reactions}
        onReactionClick={(emoji) => {
          // Handle reaction click
        }}
      />
    )}
  </>
);

const PostCardFooter = ({
  actions,
  like,
  repost,
  diamond,
  toggleLike,
  toggleRepost,
  giveDiamond,
  postUrl,
  postContent,
}: {
  actions: PostActionProps;
  like: { active: boolean; count: number };
  repost: { active: boolean; count: number };
  diamond: { active: boolean; count: number; value: string };
  toggleLike: () => void;
  toggleRepost: () => void;
  giveDiamond: () => void;
  postUrl?: string;
  postContent: string;
}) => (
  <div className="mt-4 flex w-full items-center gap-x-4 text-muted-foreground">
    <PostAction
      variant="comment"
      count={actions.comments}
      onClick={() => alert('Comment!')}
    />
    <PostAction
      variant="repost"
      count={repost.count}
      active={repost.active}
      onClick={toggleRepost}
    />
    <PostAction
      variant="like"
      count={like.count}
      active={like.active}
      onClick={toggleLike}
    />
    <PostAction
      variant="diamond"
      count={diamond.count}
      value={diamond.value}
      active={diamond.active}
      onClick={giveDiamond}
    />
    <div className="flex-grow" />
    <PostAction variant="view" count={actions.views} />
    {postUrl && <PostShare url={postUrl} text={postContent} />}
  </div>
);

const PostQuote = (props: PostQuoteProps) => {
  const { publicKey, postContent, timestamp, images, embedUrl, reactions } = props;
  const { data: userData } = useUsername(publicKey);
  const username = userData?.accountByPublicKey?.username;

  // Quoted posts don't have actions on their face, but the image modal might.
  // We provide dummy actions here to prevent crashes, as the UI for these
  // actions on a quoted post's image modal is not defined.
  const dummyModalActions: PostImageActions = {
    likes: { count: 0, active: false },
    reposts: { count: 0, active: false },
    diamonds: { count: 0, value: '', active: false },
    comments: { count: 0 },
    onLike: () => {},
    onRepost: () => {},
    onDiamond: () => {},
    onComment: () => {},
  };

  return (
    <div className="border rounded-lg mt-2 p-3">
      <div className="flex gap-3">
        <div>
          <ProfilePicture publicKey={publicKey} size="sm" />
        </div>
        <div className="flex-grow flex flex-col">
          <PostCardHeader
            publicKey={publicKey}
            username={username}
            timestamp={timestamp}
          />
          <div className="mt-2 text-foreground">
            <p className="whitespace-pre-wrap">{postContent}</p>
          </div>
          {embedUrl && <PostEmbed url={embedUrl} />}
          {images && images.length > 0 && (
            <PostImage
              images={images}
              withModal
              withModalActions={dummyModalActions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const PostCardCore = (props: PostCardProps) => {
  const {
    publicKey,
    postContent,
    actions = {
      comments: 0,
      likes: 0,
      reposts: 0,
      diamonds: 0,
      diamondValue: '($0.00)',
      quotes: 0,
      views: 0,
    },
    timestamp,
    images,
    embedUrl,
    quotedPost,
    videoUrl,
    audioUrl,
    reactions: initialReactions,
    postUrl,
    poll: initialPoll,
  } = props;
  const { data: userData } = useUsername(publicKey);
  const username = userData?.accountByPublicKey?.username;

  const [like, setLike] = useState({ active: false, count: actions.likes });
  const [repost, setRepost] = useState({
    active: false,
    count: actions.reposts,
  });
  const [diamond, setDiamond] = useState({
    active: false,
    count: actions.diamonds,
    value: actions.diamondValue,
  });
  const [reactions, setReactions] = useState(initialReactions || []);
  const [poll, setPoll] = useState(initialPoll);

  const handlePollVote = (index: number) => {
    if (poll) {
      const newVotes = [...poll.votes];
      newVotes[index]++;
      setPoll({
        ...poll,
        votes: newVotes,
        totalVotes: poll.totalVotes + 1,
        userVotedIndex: index,
      });
    }
  };

  const toggleLike = () => {
    setLike((prev) => ({
      active: !prev.active,
      count: !prev.active ? prev.count + 1 : prev.count - 1,
    }));
  };

  const toggleRepost = () => {
    setRepost((prev) => ({
      active: !prev.active,
      count: !prev.active ? prev.count + 1 : prev.count - 1,
    }));
  };

  const giveDiamond = () => {
    setDiamond((prev) => {
      const newActive = !prev.active;
      const numericValue = parseFloat(prev.value.replace(/[($)]/g, ''));
      const newValue = newActive ? numericValue + 0.01 : numericValue - 0.01;
      return {
        active: newActive,
        count: newActive ? prev.count + 1 : prev.count - 1,
        value: `($${newValue.toFixed(2)})`,
      };
    });
  };

  const handleReactionClick = (emoji: string) => {
    setReactions((prevReactions) => {
      const reactionIndex = prevReactions.findIndex((r) => r.emoji === emoji);

      if (reactionIndex > -1) {
        const newReactions = [...prevReactions];
        const reaction = newReactions[reactionIndex];
        const userHasReacted = !reaction.userHasReacted;
        const count = userHasReacted ? reaction.count + 1 : reaction.count - 1;

        if (count > 0) {
          newReactions[reactionIndex] = { ...reaction, count, userHasReacted };
        } else {
          newReactions.splice(reactionIndex, 1);
        }
        return newReactions;
      } else {
        return [...prevReactions, { emoji, count: 1, userHasReacted: true }];
      }
    });
  };

  const modalActions: PostImageActions = {
    likes: like,
    reposts: repost,
    diamonds: diamond,
    comments: { count: actions.comments },
    onLike: toggleLike,
    onRepost: toggleRepost,
    onDiamond: giveDiamond,
    onComment: () => alert('Comment!'),
  };

  return (
    <div className="flex-grow flex flex-col">
      <PostCardHeader
        publicKey={publicKey}
        username={username}
        timestamp={timestamp}
      />
      <PostCardBody
        postContent={postContent}
        embedUrl={embedUrl}
        images={images}
        modalActions={modalActions}
        quotedPost={quotedPost}
        videoUrl={videoUrl}
        audioUrl={audioUrl}
        poll={poll}
        onPollVote={handlePollVote}
      />
      <PostReactions
        reactions={reactions}
        onReactionClick={handleReactionClick}
      />
      <PostCardFooter
        actions={actions}
        like={like}
        repost={repost}
        diamond={diamond}
        toggleLike={toggleLike}
        toggleRepost={toggleRepost}
        giveDiamond={giveDiamond}
        postUrl={postUrl}
        postContent={postContent}
      />
    </div>
  );
};

export function PostCard(props: PostCardProps) {
  const { className, status, comments } = props;

  // Threaded View
  if (comments && comments.length > 0) {
    const allPosts = [props, ...comments];
    return (
      <div className="w-full max-w-2xl mx-auto">
        {status && <PostStatus {...status} />}
        <div
          className={cn(
            'w-full bg-white rounded-xl shadow-sm p-4 border',
            className
          )}
        >
          {allPosts.map((post, index) => {
            const isLast = index === allPosts.length - 1;
            return (
              <div
                key={`${post.publicKey}-${index}`}
                className={cn('flex gap-4', index > 0 && 'pt-4')}
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <ProfilePicture publicKey={post.publicKey} size="md" />
                  {!isLast && <div className="w-0.5 grow relative bg-gray-200 mt-2 before:content-[''] before:w-0.5 before:h-5 before:bg-gray-200 before:absolute before:-bottom-[10px]" />}
                </div>
                <div className="flex-1">
                  <PostCardCore {...post} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  

  // Single Post View
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={cn(
          'w-full bg-white rounded-xl shadow-sm p-4 border',
          className,
          status && 'flex-col'
        )}
      >
        {status && <div className="flex-1 mb-4"><PostStatus {...status} /></div>}
        <div className="flex-grow flex gap-4">
          <div className="flex-shrink-0">
            <ProfilePicture publicKey={props.publicKey} size="md" />
          </div>
          <PostCardCore {...props} />
        </div>
      </div>
    </div>
  );
} 