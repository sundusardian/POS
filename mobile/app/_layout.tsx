import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useAuthStore } from '../lib/auth/store';
import { View, Text } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// We don't need a separate hook for route protection
// We'll handle it directly in the layout component

export default function RootLayout() {
  const { isLoading, token, initialize } = useAuthStore();
  
  // Initialize auth state on mount
  useEffect(() => {
    async function prepare() {
      try {
        // Initialize auth state
        await initialize();
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide splash screen
        SplashScreen.hideAsync();
      }
    }
    
    prepare();
  }, [initialize]);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Instead of redirecting in a hook, we conditionally render different stacks
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!token ? (
        // Auth stack for unauthenticated users
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        // App stack for authenticated users
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
