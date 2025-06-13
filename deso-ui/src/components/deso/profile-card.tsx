import { ProfileCoverPhoto } from './profile-cover-photo';
import { ProfileDescription } from './profile-description';
import { UserInfo } from './user-info';
import { FollowButton } from './follow-button';
import { MessageButton } from './message-button';
import { ProfileStat } from './profile-stat';
import {
  ActionMenu,
  ActionMenuItem,
  ActionMenuSeparator,
} from './action-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, Share2, Flag, Ban } from 'lucide-react';

export interface ProfileCardProps {
  publicKey: string;
}

export function ProfileCard({ publicKey }: ProfileCardProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cover Photo */}
      <ProfileCoverPhoto
        publicKey={publicKey}
        aspectRatio="16:9"
        showOverlay
        overlayOpacity={0.3}
        className="rounded-b-none"
      />
      {/* Profile Info */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <UserInfo
            publicKey={publicKey}
            pictureSize="md"
            showVerification
            showPublicKey
            className="z-10"
          />
          <div className="flex items-center gap-2">
            <MessageButton variant="icon-only" showTooltip />
            <FollowButton />
            <ActionMenu
              trigger={
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            >
              <ActionMenuItem icon={Share2}>Share profile</ActionMenuItem>
              <ActionMenuSeparator />
              <ActionMenuItem icon={Flag}>Report user</ActionMenuItem>
              <ActionMenuItem icon={Ban} variant="destructive">
                Block user
              </ActionMenuItem>
            </ActionMenu>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ProfileStat variant="followers" count={32430} />
          <ProfileStat variant="following" count={2540} />
        </div>
        <ProfileDescription publicKey={publicKey} formatted lineClamp={4} />
      </div>
    </div>
  );
} 