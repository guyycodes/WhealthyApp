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
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="visuals" options={{ title: 'visuals' }} />
      <Tabs.Screen name="ai" options={{ title: 'Ai' }} />
      <Tabs.Screen name="featured_content" options={{ title: 'Featured_Content' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
