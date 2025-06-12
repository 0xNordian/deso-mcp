import React from 'react';
import { buildProfilePictureUrl } from '@/lib/utils/deso';

interface ProfilePictureDebugProps {
  profilePic: string;
  nftUrl?: string;
}

export function ProfilePictureDebug({ profilePic, nftUrl }: ProfilePictureDebugProps) {
  const decodedUrl = buildProfilePictureUrl(profilePic);
  
  return (
    <div className="p-4 border border-gray-300 rounded-lg space-y-4 max-w-2xl">
      <h3 className="text-lg font-semibold">Profile Picture Debug</h3>
      
      <div className="space-y-2">
        <h4 className="font-medium">Raw Hex Data:</h4>
        <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
          {profilePic.substring(0, 100)}...
        </div>
        <div className="text-sm text-gray-600">
          Length: {profilePic.length} characters
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Decoded URL:</h4>
        <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
          {decodedUrl?.substring(0, 100)}...
        </div>
        <div className="text-sm text-gray-600">
          Length: {decodedUrl?.length || 0} characters
        </div>
      </div>
      
      {nftUrl && (
        <div className="space-y-2">
          <h4 className="font-medium">NFT URL:</h4>
          <div className="bg-blue-100 p-2 rounded text-xs font-mono break-all">
            {nftUrl}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Decoded Image:</h4>
          {decodedUrl ? (
            <img 
              src={decodedUrl} 
              alt="Decoded profile" 
              className="w-20 h-20 rounded border"
              onError={(e) => {
                console.error('Failed to load decoded image:', decodedUrl);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={() => {
                console.log('✅ Successfully loaded decoded image:', decodedUrl?.substring(0, 50));
              }}
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded border flex items-center justify-center text-gray-500">
              No URL
            </div>
          )}
        </div>
        
        {nftUrl && (
          <div>
            <h4 className="font-medium mb-2">NFT Image:</h4>
            <img 
              src={nftUrl} 
              alt="NFT profile" 
              className="w-20 h-20 rounded border"
              onError={(e) => {
                console.error('Failed to load NFT image:', nftUrl);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={() => {
                console.log('✅ Successfully loaded NFT image:', nftUrl);
              }}
            />
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500">
        Check browser console for detailed decoding logs
      </div>
    </div>
  );
}

ProfilePictureDebug.displayName = 'ProfilePictureDebug'; 