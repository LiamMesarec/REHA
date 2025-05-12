import React, { useContext, useEffect } from 'react';
import { AuthContext } from './authContext';
import { useRouter } from 'expo-router';

export function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return (props: P) => {
    const { token } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!token) {
        // Kick straight to login if no token
        router.replace('/Login');
      }
    }, [token]);

    // Only render the real component if we have a token
    return token ? <WrappedComponent {...props} /> : null;
  };
}

