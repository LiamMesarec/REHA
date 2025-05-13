import React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from './authContext';
import { Navbar } from './navbar';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <AuthProvider>
      <Navbar />
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
      </Stack>
    </AuthProvider>
  );
}
