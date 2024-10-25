import React from 'react';
import BottomTabNavigator from 'app/components/Navigators/CustomTabNavbar';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <BottomTabNavigator {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="favorites" options={{ title: 'visuals' }} />
      <Tabs.Screen name="ai" options={{ title: 'ai' }} />
      <Tabs.Screen name="articles" options={{ title: 'articles' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}