// app/(splash)/splash.jsx
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSequencer } from 'app/Context/Controller';

// this screen will render the tiny coin icon after the splash screen ends
export default function SplashScreen() {
  const router = useRouter()
  const { allowsNotifications } = useSequencer();

  useEffect(() => {
    /// manage the allow notification screen shown here
    if (allowsNotifications !== true) {
      router.replace('/(splash)/allow-notifications');
    } else {
      router.replace('/(splash)/walkthrough');
    }

  }, []);
 
  return (
    <View style={styles.container}>
      <Image
        source={require('../../splash-screen/logo.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d3436',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});