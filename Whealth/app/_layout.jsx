import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useSequencer } from 'app/Context/Controller'
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { App } from './App';

function Navigation() {
  const colorScheme = useColorScheme();
  const { showTabNavigator, useTabNavigator } = useSequencer();

  React.useEffect(() => {
    useTabNavigator(false);
  }, [useTabNavigator]);

  return (
  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
     
    <Stack>
        <Stack.Screen name="(splash)" options={{ headerShown: false }} />
        <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
        <Stack.Screen name="(login)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
     
  </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <App>
      <Navigation />
    </App>
  );
}
