import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { useRouter, Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return (props: P) => {
    const { token, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      if (!authLoading) {
        setIsReady(true);
      }
    }, [authLoading]);

    useEffect(() => {
      if (!isReady) return;

      if (!token) {
        router.replace('/calendar');
      }
    }, [isReady, token]);

    if (!isReady) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        </View>
      );
    }

    if (!token) {
      return <Redirect href="/login" />;
    }

    return <WrappedComponent {...props} />;
  };
}
