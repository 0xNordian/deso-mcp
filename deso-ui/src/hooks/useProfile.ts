import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_PROFILE_DATA, GET_PROFILE_PICTURE, GET_USERNAME_INFO } from '@/lib/graphql/queries';
import { gql } from '@apollo/client';

// Hook to detect if we're on the client side
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    console.log('🌐 useIsClient: Setting isClient to true');
    setIsClient(true);
  }, []);
  
  console.log('🌐 useIsClient current state:', isClient);
  
  return isClient;
}

// Updated query that matches the actual DeSo GraphQL schema
const GET_PROFILE = gql`
  query GetProfile($publicKey: String!) {
    accountByPublicKey(publicKey: $publicKey) {
      username
      profilePic
      extraData
    }
  }
`;

// Hook for fetching complete profile data
export function useProfile(publicKey: string) {
  const isClient = useIsClient();
  
  console.log('🔍 useProfile called:', { publicKey, isClient });
  
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { publicKey },
    skip: !publicKey || !isClient,
    errorPolicy: 'all',
  });

  console.log('🔍 useProfile query result:', {
    loading,
    error: error?.message,
    hasData: !!data,
    data: data,
    accountExists: !!data?.accountByPublicKey
  });

  // Parse extraData to get additional fields
  const extraData = data?.accountByPublicKey?.extraData || {};

  const result = {
    profile: data?.accountByPublicKey,
    loading,
    error,
    username: data?.accountByPublicKey?.username,
    profilePic: data?.accountByPublicKey?.profilePic,
    isVerified: extraData?.IsVerified === 'true', // Parse from extraData
    coverPhoto: extraData?.FeaturedImageURL,
    nftProfilePic: extraData?.NFTProfilePictureUrl,
    extraData,
  };

  console.log('🔍 useProfile returning:', result);
  
  return result;
}

// Hook for fetching just profile picture data
export function useProfilePicture(publicKey: string) {
  const isClient = useIsClient();
  
  console.log('🔍 useProfilePicture called:', { publicKey, isClient });
  
  const result = useQuery(GET_PROFILE_PICTURE, {
    variables: { publicKey },
    skip: !publicKey || !isClient,
    errorPolicy: 'all',
  });

  console.log('🔍 useProfilePicture query result:', {
    loading: result.loading,
    error: result.error?.message,
    fullError: result.error,
    hasData: !!result.data,
    data: result.data,
    accountExists: !!result.data?.accountByPublicKey
  });
  
  return result;
}

// Hook for fetching just username data
export function useUsername(publicKey: string) {
  const isClient = useIsClient();
  
  console.log('🔍 useUsername called:', { publicKey, isClient });
  
  const result = useQuery(GET_USERNAME_INFO, {
    variables: { publicKey },
    skip: !publicKey || !isClient,
    errorPolicy: 'all',
  });

  console.log('🔍 useUsername query result:', {
    loading: result.loading,
    error: result.error?.message,
    fullError: result.error,
    hasData: !!result.data,
    data: result.data,
    accountExists: !!result.data?.accountByPublicKey
  });
  
  return result;
} 