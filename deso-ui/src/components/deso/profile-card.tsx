import { ProfileCoverPhoto } from './profile-cover-photo';
import { ProfileDescription } from './profile-description';
import { UserInfo } from './user-info';
import { FollowButton } from './follow-button';
import { MessageButton } from './message-button';

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
          </div>
        </div>
        <ProfileDescription publicKey={publicKey} formatted lineClamp={4} />
      </div>
    </div>
  );
} 