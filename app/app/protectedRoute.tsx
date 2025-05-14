import React, { useContext, useEffect } from 'react';
import { AuthContext } from './authContext';
import { useRouter } from 'expo-router';

export function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return (props: P) => {
    const { token } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!token) {
        router.replace('/Login');
      }
    }, [token]);

    return token ? <WrappedComponent {...props} /> : null;
  };
}

