import { useNavigation, useRouter, useSegments } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { AsyncStorageUtil } from 'app/util/DeviceStore';
import * as SecureStore from 'expo-secure-store';
import { decodeToken } from 'expo-jwt';



const SequenceContext = createContext();


export function SequenceProvider({ children }) {
  const [isWalkthroughCompleted, setIsWalkthroughCompleted] = useState(false);
  const [allowsNotifications, setAllowsNotifications] = useState(null);
  const [showTabNavigator, setShowTabNavigator] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const showTabNavigatorRef = useRef(showTabNavigator);
  const [tokenClaims, setTokenClaims] = useState(null);
  const [screenStack, setScreenStack] = useState([]);
  const [sequence, setSequence] = useState('splash');
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(null);
  const translateX = useSharedValue(0);
  const navigation = useNavigation();
  const segments = useSegments();
  const router = useRouter();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    async function loadNotificationPreference() {
      try { // settin it to false automatically
        const value = await AsyncStorageUtil.getAllowsNotifications();
        console.log('Notification preference loaded:', value);
        setAllowsNotifications(value);
        await AsyncStorageUtil.reset(); //resets notifications to false
      } catch (error) {
        console.error('Error loading notification preference', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotificationPreference();
  }, []);

  useEffect(() => {
    showTabNavigatorRef.current = showTabNavigator;
  }, [showTabNavigator]);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const setSelectedLanguage = useCallback(async(lang) => {
  setLanguage(lang);
  try {
    await AsyncStorageUtil.setUserLanguage(lang);
  } catch (error) {
    console.error('Error saving notification preference', error);
  }
}, []);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const useTabNavigator = useCallback((state) => {
  setShowTabNavigator(state);
}, []);
/////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateAllowsNotifications = useCallback(async (value) => {
    setAllowsNotifications(value);
    try {
      await AsyncStorageUtil.setAllowsNotifications(value);
    } catch (error) {
      console.error('Error saving notification preference', error);
    }
  }, []);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const setWalkthroughCompleted = useCallback((value) => {
  setIsWalkthroughCompleted(value);
}, []);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const clearNavigationStack = () => {
  const unsubscribe = navigation.addListener('focus', () => {
    setTimeout(() => {
      if (router.canDismiss()) {
        console.log('Clearing navigation stack...');
        router.dismiss();
      }
    }, 0);
  });

  return unsubscribe;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        return null;
      }
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getTokenClaims = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      setTokenClaims(null);
      return null;
    }
    const claims = decodeToken(token);
    
    const tokenData = {
      email: claims.sub,
      issuedAt: new Date(claims.iat * 1000),
      expirationTime: new Date(claims.exp * 1000),

      // custom claims
      valid: claims.valid,
      userExists: claims.userExists,
      isReturningUser: claims.isReturningUser,
      timeUntilExpiration: claims.timeUntilExpiration,

      // Helper methods
      isExpired: () => {
        const now = new Date().getTime();
        return now >= claims.exp * 1000;
      },
      getRemainingTime: () => {
        const now = new Date().getTime();
        const expTime = claims.exp * 1000;
        return Math.max(0, expTime - now);
      }
    }
    
    setTokenClaims(tokenData);
    return tokenData;
  }catch(error) {
    console.error('Error decoding token:', error);
    setTokenClaims(null);
    return null;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const refreshToken = async () => {
  try {
    // Call your refresh token endpoint
    const response = await fetch('your/jwt/refresh/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: await SecureStore.getItemAsync('token')
      })
    });
    
    if (response.ok) {
      const { token } = await response.json();
      await SecureStore.setItemAsync('token', token);
      return await getTokenClaims(); // update tokenClaims state
    }
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const checkAndRefreshToken = async () => {
  const ONE_HOUR = 60 * 60; // in seconds
  
  await getTokenClaims();
  
  if (!tokenClaims) {
    router.replace('/(login)', {
      reset: true // Also clear the stack when navigating to login
    });
    return false;
  }

  if (!tokenClaims.valid) {
    router.replace('/(login)', {
      reset: true // Also clear the stack when navigating to login
    });
    return false;
  }

  // If less than 1 hour remaining, try to refresh
  if (tokenClaims.timeUntilExpiration < ONE_HOUR) {
    const refreshedClaims = await refreshToken();
    if (!refreshedClaims) {
      router.replace('/(login)', {
        reset: true // Also clear the stack when navigating to login
      });
      return false;
    }
    setTokenClaims(refreshedClaims); // Changed from setClaims to setTokenClaims
    return true;
  }

  setTokenClaims(tokenClaims); // Changed from setClaims to setTokenClaims
  return true;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const parseTokenClaims = (token) => {
  try {
    const claims = token; // In real code this would be decoded JWT
    const tokenData = {
      email: claims.sub,
      issuedAt: new Date(claims.iat * 1000),
      expirationTime: new Date(claims.exp * 1000),
      valid: claims.valid,
      userExists: claims.userExists,
      isReturningUser: claims.isReturningUser,
      timeUntilExpiration: claims.timeUntilExpiration,
      isExpired: () => new Date().getTime() >= claims.exp * 1000,
      getRemainingTime: () => Math.max(0, claims.exp * 1000 - new Date().getTime()),
    };
    return tokenData;
  } catch (error) {
    console.error('Error parsing token claims:', error);
    return null;
  }
};
  return (
    <SequenceContext.Provider 
      value={{
        sequence,
        isAuthenticated,
        allowsNotifications,
        showTabNavigator,
        animatedStyle,
        screenStack,
        isWalkthroughCompleted,
        language,
        setSelectedLanguage,
        clearNavigationStack,
        setWalkthroughCompleted,
        useTabNavigator,
        updateAllowsNotifications,
        // Include login, logout, and finishWelcomeSequence here
      }}
    >
      {children}
    </SequenceContext.Provider>
  );
}

export function useSequencer() {
  const context = useContext(SequenceContext);
  if (context === undefined) {
    throw new Error('useSequence must be used within a SequenceProvider');
  }
  return context;
}
