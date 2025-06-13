import { ProfilePicture } from './profile-picture';
import { ProfileCoverPhoto } from './profile-cover-photo';
import { ProfileDescription } from './profile-description';
import { UsernameDisplay } from './username-display';
import { VerificationBadge } from './verification-badge';

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
      >
        {/* Profile Picture overlayed on cover */}
        <div className="absolute bottom-4 left-4">
          <ProfilePicture
            publicKey={publicKey}
            size="xl"
            className="h-16 w-16 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </ProfileCoverPhoto>
      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <UsernameDisplay 
            publicKey={publicKey}
            showVerification
            showCopyButton
          />
        </div>
        <ProfileDescription publicKey={publicKey} formatted lineClamp={4} />
      </div>
    </div>
  );
} 