import React from 'react';
import { colors } from 'app/theme/colors';
import { Stack } from 'expo-router';
import { CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { Animated, Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const dramaticTransition = ({ current, next, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [screenWidth, 0],
          }),
        },
        {
          rotate: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['45deg', '0deg'],
          }),
        },
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          }),
        },
      ],
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
      }),
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    },
  };
};

const combinedTransition = ({ current, next, layouts }) => {
  if (Platform.OS === 'ios') {
    return {
      ...TransitionPresets.ModalPresentationIOS.cardStyleInterpolator({ current, next, layouts }),
      ...dramaticTransition({ current, next, layouts }),
    };
  } else {
    return {
      ...CardStyleInterpolators.forFadeFromBottomAndroid({ current, next, layouts }),
      ...dramaticTransition({ current, next, layouts }),
    };
  }
};

export default function SplashLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        gestureEnabled: false,
        gestureDirection: 'vertical',
        cardShadowEnabled: true,
        cardOverlayEnabled: true,
        ...Platform.select({
          ios: TransitionPresets.ModalPresentationIOS,
          android: TransitionPresets.FadeFromBottomAndroid,
        }),
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          cardStyleInterpolator: forFade,
        }}
      />
      <Stack.Screen 
        name="splash"
        options={{
          cardStyleInterpolator: combinedTransition,
        }}
      />
      <Stack.Screen 
        name="allow-notifications" 
        options={{
          cardStyleInterpolator: combinedTransition,
        }}
      />
      <Stack.Screen 
        name="walkthrough" 
        options={{
          cardStyleInterpolator: combinedTransition,
        }}
      />
    </Stack>
  );
}