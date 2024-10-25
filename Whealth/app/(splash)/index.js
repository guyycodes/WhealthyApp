// app/(splash)/index.jsx
import { useFonts } from 'expo-font';
import { Redirect } from 'expo-router';
import React from 'react';
import { Text } from 'app/components/Text';
import { customFontsToLoad } from 'app/theme/typography';

export default function SplashIndex() {
  
  const [fontsLoaded] = useFonts(customFontsToLoad);

  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }
  return (
    <Redirect href="/(splash)/splash" />
)
}
