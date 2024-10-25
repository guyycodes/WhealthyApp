import React from 'react';
import { View } from 'react-native';
import { useSequencer } from 'app/Context/Controller';
import { BottomTabNavigator } from './CustomTabNavbar';

export const BottomTabs = ({ children }) => {
  const { showTabNavigator } = useSequencer();

  return (
    <View style={{ flex: 1 }}>
      {children}
      {showTabNavigator && <BottomTabNavigator />}
    </View>
  );
};