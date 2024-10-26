import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsetsStyle } from 'app/util/useSafeAreaInsetsStyle';
import { 
  Gradient, 
  GradientTypes, 
  overlayGradient,
} from 'app/theme/gradients';
import { AlertCircle } from 'lucide-react-native';
import { colors } from 'app/theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export function ErrorScreen({ 
  errorMessage = "Something went wrong", 
  errorDetails = "We encountered an unexpected error while processing your request.",
  errorCode = "500"
}) {
  const safeAreaStyleTop = useSafeAreaInsetsStyle(['top'], 'padding', { top: { ios: -1} });
  const safeAreaStyleBottom = useSafeAreaInsetsStyle(['bottom'], 'padding', { bottom: { ios: 3, android: 7 } });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRetry = () => {
    router.replace('/(auth)/callback');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/backgrounds/ErrorScreen.png')}
        style={styles.backgroundImage}
      />
      <Gradient type={GradientTypes.TRANSPARENT_TO_BLACK} style={overlayGradient} />
      
      <View style={[styles.mainViewStyle, safeAreaStyleTop, safeAreaStyleBottom]}>
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.errorIconContainer}>
            <AlertCircle size={64} color={colors.error} style={styles.icon} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.errorCode}>Error {errorCode}</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <Text style={styles.errorDetails}>{errorDetails}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
    opacity: 0.5, // Dimmed background for error state
  },
  mainViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: screenWidth * 0.85,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  errorIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  errorCode: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorDetails: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});