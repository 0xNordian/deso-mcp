import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_PROFILE_DATA, GET_PROFILE_PICTURE, GET_USERNAME_INFO } from '@/lib/graphql/queries';

// Hook to detect if we're on the client side
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

// Hook for fetching complete profile data
export function useProfile(publicKey: string) {
  const isClient = useIsClient();
  
  return useQuery(GET_PROFILE_DATA, {
    variables: { publicKey },
    skip: !publicKey || !isClient,
    errorPolicy: 'all',
  });
}

// Hook for fetching just profile picture data
export function useProfilePicture(publicKey: string) {
  const isClient = useIsClient();
  
  return useQuery(GET_PROFILE_PICTURE, {
    variables: { publicKey },
    skip: !publicKey || !isClient,
    errorPolicy: 'all',
  });
}

// Hook for fetching username information
export function useUsername(publicKey: string) {
  const isClient = useIsClient();
  
  return useQuery(GET_USERNAME_INFO, {
    variables: { publicKey },
    skip: !publicKey || !isClient,
    errorPolicy: 'all',
  });
} 