// screens/HomeScreen.js
import React, {useEffect} from 'react';
import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';

export const HomeScreen = () => {

  useEffect(() => {
    console.log("Redirects to Home Screen");
  }, []);

  return (
    <Redirect href="/(auth)/home" />
  );
};