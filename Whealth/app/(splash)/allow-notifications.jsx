// app/(splash)/allow-notifications.jsx
import React, {useCallback} from 'react';
import AllowNotifications from 'app/screens/SplashScreenElements/AllowNotifications';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router'
import { BackHandler } from 'react-native';
import 'react-native-gesture-handler';

export default function AllowNotificationsScreen() {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Handle Android back button
      const onBackPress = () => {
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [router])
  );
  return (
    <AllowNotifications />
  );
}