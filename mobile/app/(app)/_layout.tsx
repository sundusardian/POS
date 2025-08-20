import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../../lib/auth/store';
import { View, Text } from 'react-native';

export default function AppLayout() {
  const { user } = useAuthStore();

  const { isLoading } = useAuthStore();
  
  // Initialize auth state on mount
  useEffect(() => {
  }, []);
  

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: `Welcome, ${user?.name || 'User'}`,
          headerBackVisible: false,
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          title: 'My Profile',
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
        }} 
      />
      <Stack.Screen 
        name="orders" 
        options={{ 
          title: 'Orders',
        }} 
      />
      <Stack.Screen 
        name="create-order" 
        options={{ 
          title: 'Create Order',
        }} 
      />
      <Stack.Screen 
        name="api-test" 
        options={{ 
          title: 'API Test',
        }} 
      />
    </Stack>
  );
}
