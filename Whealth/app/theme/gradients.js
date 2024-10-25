import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { spacing } from 'app/theme';
import { colors } from 'app/theme/colors';

const screenHeight = Dimensions.get('window').height;

export const GradientTypes = {
  ORANGE_RED: 'ORANGE_RED',
  BLUE_DARK_BLUE: 'BLUE_DARK_BLUE',
  TRANSPARENT_TO_BLACK: 'TRANSPARENT_TO_BLACK',
  TRANSPARENT_GRAY_TO_BLACK: 'TRANSPARENT_GRAY_TO_BLACK',
  SOLID_LIGHT_BLUE_TO_DARK_BLUE:'SOLID_LIGHT_BLUE_TO_DARK_BLUE',
  SOLID_GREEN_TO_DARK_GREEN: 'SOLID_GREEN_TO_DARK_GREEN',
  TRANSPARENT_GREEN_TO_LIGHT_GREEN: 'TRANSPARENT_GREEN_TO_LIGHT_GREEN',
  YELLOW_TO_PINK: 'YELLOW_TO_PINK',
  PINK_TO_YELLOW: 'PINK_TO_YELLOW',
  BLACK_TO_ORANGE_RED: 'BLACK_TO_ORANGE_RED',
};

const gradientConfigs = {
  [GradientTypes.ORANGE_RED]: {
    colors: ['#F6511E', '#902F12'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  [GradientTypes.BLACK_TO_ORANGE_RED]: {
    colors: ['#1E1E22', '#902F12'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  [GradientTypes.ORANGE_RED_TO_BLACK]: {
    colors: ['#902F12', '#1E1E22'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  [GradientTypes.SOLID_LIGHT_BLUE_TO_DARK_BLUE]: {
    colors: ['#3C5D6F', 'rgba(79, 190, 248, 0.5)'],
    start: { x: 1, y: 0 },
    end: { x: 0, y: 1 },
  },
  [GradientTypes.SOLID_GREEN_TO_DARK_GREEN]: {
    colors: ['#00D1CF', 'rgba(0, 209, 207, 0.5)'],
    start: { x: 1, y: 0 },
    end: { x: 0, y: 1 },
  },
  [GradientTypes.TRANSPARENT_GREEN_TO_LIGHT_GREEN]: {
    colors: ['#00D1CF', '#00D1CF'],
    start: { x: 1, y: 0 },
    end: { x: 0, y: 1 },
  },
  [GradientTypes.YELLOW_TO_PINK]: {
    colors: ['#F7F282', '#FBCEFF'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  [GradientTypes.PINK_TO_YELLOW]: {
    colors: ['#FBCEFF', '#F7F282'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  [GradientTypes.BLUE_DARK_BLUE]: {
    colors: ['#4FBEF8', '#3C5D6F'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  [GradientTypes.TRANSPARENT_TO_BLACK]: {
    colors: ['transparent', 'transparent', 'transparent' , 'rgba(0,0,0,0.9)', 'black'],
    locations: [0.1, 0.3, 0.5,.75, 1],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  [GradientTypes.TRANSPARENT_GRAY_TO_BLACK]: {
    colors: ['rgba(99, 110, 114,0.4)','transparent', 'rgba(45, 52, 54, 1)', 'rgba(99, 110, 114,0.3)'],
    locations: [.10, 0.20, 0.5, 1],
    // blur: [10],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

export const Gradient = ({ type, style, children, pointerEvents}) => {
  const config = gradientConfigs[type];

  return (
    <LinearGradient
      pointerEvents={pointerEvents}
      colors={config.colors}
      start={config.start}
      end={config.end}
      locations={config.locations}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
};

export const DottedLineSeparator = () => (
  <View style={$dottedLineSeparator}>
{[...Array(20)].map((_, index) => (
  <View key={index} style={$dot} />
))}
</View>
);

export const FrostedGlassContainer = ({ children, style, pointerEvents, gradientType = 'TRANSPARENT_GRAY_TO_BLACK' }) => {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={50} tint="light" style={[styles.container, style]} pointerEvents={pointerEvents}>
        {children}
      </BlurView>
    );
  } else {
    // Fallback for Android
    return (
      <Gradient 
        type={GradientTypes[gradientType]} 
        pointerEvents={pointerEvents}
        style={[
          styles.container, 
          styles.androidContainer, 
          { alignSelf: 'center', justifyContent: 'center' },
          style
        ]}
      >
        <View style={styles.content}>{children}</View>
      </Gradient>
    );
  }
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    
    borderRadius: 8,
    overflow: 'hidden',
  },
  androidContainer: {
    marginTop: screenHeight * 0.11,
    position: 'absolute',
    borderRadius: 8,
  },
  content: {
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
});

export const gradientBackground = {
  width: '100%',
  paddingTop: 100,
  paddingBottom: 20,
  borderRadius: 10,
};

export const allowButtonGradient = {
  paddingVertical: 15,
  alignItems: 'center',
};


export const languageButtonGradient = {
  flexDirection: 'row',
  alignItems: 'center',
  padding: spacing.sm,
  borderRadius: 8,
}

export const overlayGradient = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export const overlayGradient2 = {
  padding:10,
  height:25,
  paddingVertical: 15,
  alignItems: 'center',
  borderRadius: 15,
};

export const overlaySearchBar = {
  height: '100%',
  paddingVertical: 25, // this has to line up with the search icon and search input in the searchbar component
  alignItems: 'center',
  borderRadius: 15,
};

export const overlayGoalsBar = {
  height: '100%',
  paddingVertical: 31, // this has to line up with the search icon and search input in the searchbar component
  alignItems: 'center',
  borderRadius: 15,
};

export const $dottedLineSeparator = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 5,
  paddingHorizontal: 20,
  width: '100%',
}

export const $dot = {
  width: 14,
  height: 1,
  backgroundColor: colors.palette.neutral600,
}