import { ProfileCoverPhoto } from './profile-cover-photo';
import { ProfileDescription } from './profile-description';
import { UserInfo } from './user-info';
import { FollowButton } from './follow-button';
import { MessageButton } from './message-button';
import { ProfileStat } from './profile-stat';
import { ProfileActions } from './profile-actions';
import { cn } from '@/lib/utils';

export interface ProfileCardProps {
  publicKey: string;
  variant?: 'default' | 'compact';
  showFollowButton?: boolean;
  showMessageButton?: boolean;
  showActionMenu?: boolean;
  followButtonVariant?: 'default' | 'icon-only';
  messageButtonVariant?: 'default' | 'icon-only';
  className?: string;
}

export function ProfileCard({
  publicKey,
  variant = 'default',
  showFollowButton = true,
  showMessageButton = true,
  showActionMenu = true,
  followButtonVariant = 'default',
  messageButtonVariant = 'default',
  className,
}: ProfileCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden',
        className
      )}
    >
      {!isCompact && (
        <ProfileCoverPhoto
          publicKey={publicKey}
          aspectRatio="16:9"
          showOverlay
          overlayOpacity={0.3}
          className="rounded-b-none"
        />
      )}
      <div className={cn('p-6 flex flex-col gap-4', isCompact && 'p-4')}>
        <div className="flex items-center justify-between gap-2">
          <UserInfo
            publicKey={publicKey}
            pictureSize={isCompact ? 'sm' : 'md'}
            showVerification
            showPublicKey
            className="z-10"
          />
          <div className="flex items-center gap-2">
            {showActionMenu && <ProfileActions />}
            {showMessageButton && <MessageButton variant="icon-only" showTooltip />}
            {showFollowButton && <FollowButton />}
          </div>
        </div>
        {!isCompact && (
          <>
            <div className="flex items-center gap-4">
              <ProfileStat variant="followers" count={32430} />
              <ProfileStat variant="following" count={2540} />
            </div>
            <ProfileDescription
              publicKey={publicKey}
              lineClamp={4}
              showMoreText="Show more"
              showLessText="Show less"
            />
          </>
        )}
      </div>
    </div>
  );
} 