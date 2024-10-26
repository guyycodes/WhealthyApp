import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="callback"
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="error"
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="home"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}