import { ProfilePicture } from './profile-picture';
import { UsernameDisplay } from './username-display';
import { UserPublicKey } from './user-public-key';
import {
  ActionMenu,
  ActionMenuItem,
  ActionMenuSeparator,
} from './action-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, UserPlus, Ban, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUsername } from '@/hooks/useProfile';
import { PostAction } from './post-action';
import { useState } from 'react';
import { Timestamp } from './timestamp';
import { PostImage } from './post-image';

export interface PostActionProps {
  comments: number;
  likes: number;
  reposts: number;
  diamonds: number;
  diamondValue: string;
  quotes: number;
  views: number;
}

export interface PostCardProps {
  publicKey: string;
  postContent: string;
  className?: string;
  actions?: PostActionProps;
  timestamp: string | Date;
  images?: string[];
}

export function PostCard({
  publicKey,
  postContent,
  className,
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
}: PostCardProps) {
  const { data: userData } = useUsername(publicKey);
  const username = userData?.accountByPublicKey?.username;

  // States to manage active status for demo purposes
  const [like, setLike] = useState({ active: false, count: actions.likes });
  const [repost, setRepost] = useState({ active: false, count: actions.reposts });
  const [diamond, setDiamond] = useState({
    active: false,
    count: actions.diamonds,
    value: actions.diamondValue,
  });

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

  const modalActions = {
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
    <div
      className={cn(
        'w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-4 flex gap-4 border',
        className
      )}
    >
      <div>
        <ProfilePicture publicKey={publicKey} size="md" />
      </div>
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <UsernameDisplay
              publicKey={publicKey}
              showVerification
              linkToProfile
            />
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
        <div className="mt-2 text-foreground">
          <p className="whitespace-pre-wrap">{postContent}</p>
        </div>
        {images && images.length > 0 && (
          <PostImage images={images} withModal withModalActions={modalActions} />
        )}
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
        </div>
      </div>
    </div>
  );
} 