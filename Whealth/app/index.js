import { useFonts } from 'expo-font';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler'; // allows UI kit and ios gesture manipulation
import { useSequencer } from 'app/Context/Controller'
import { customFontsToLoad } from 'app/theme/typography';

export default function Index() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts(customFontsToLoad);
  const { showTabNavigator, useTabNavigator, screenStack, navigate, animatedStyle  } = useSequencer();
  useEffect(() => {
    async function prepare() {
      try {
        const timer = setTimeout(async() => {
          // splashSequence();
          await SplashScreen.preventAutoHideAsync();
        }, 5000);
    
        return () => clearTimeout(timer);
        // Load any resources or data here
      } catch (e) {
        console.warn(e);
      } finally {
        if (fontsLoaded) {
          setAppIsReady(true);
        }
      }
    }

    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const onLayoutRootView = async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Redirect href="/(splash)" />
    </View>
  );
}

// app/
// ├── _layout.js (main app layout)
// ├── index.js (entry point, redirects to splash)
// ├── App.jsx 
// ├── config 
// ├── jsconfig.json 
// ├── components/
// │   ├── Text.jsx
// │   ├── Button.jsx
// │   ├── Icon.jsx
// │   ├── Screen.jsx
// │   └── Navigators
// │      └── TabAppNavigator.jsx
// ├── context/
// │   └── SequenceContext.js
// ├── (welcome)/
// │   ├── welcome.jsx
// │   ├── about.jsx
// │   ├── _layout.jsx
// │   ├── index.js
// │   └── promo.jsx
// ├── (splash)/
// │   ├── _layout.jsx
// │   ├── splash.jsx
// │   ├── allow-notifications.jsx
// │   ├── index.js
// │   └── walkthrough.jsx
// └── (tabs)/
//     ├── _layout.js 
//     ├── home.js 
//     ├── settings.js 
//     ├── profile.js 
//     ├── index.js 
//     └── favorites.js