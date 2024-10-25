// (welcome)//_layout.jsx
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { BottomTabs } from 'app/components/Navigators/WithBottomTabs';
import { useSequencer } from 'app/Context/Controller';


export default function WelcomeLayout() {
  const { useTabNavigator, showTabNavigator } = useSequencer();

  useEffect(() => {
    useTabNavigator(true); // Show the tab navigator
    console.log("showTabNavigator ",showTabNavigator)
  }, []);
  
  return (
    <BottomTabs>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />

        <Stack.Screen name="ai" />
        <Stack.Screen name="browseCities" />
        <Stack.Screen name="giftCards" />
      </Stack>
    </BottomTabs>

  );
}