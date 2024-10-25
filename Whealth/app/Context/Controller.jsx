import { useNavigation, useRouter, useSegments } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { AsyncStorageUtil } from 'app/util/DeviceStore';
import * as SecureStore from 'expo-secure-store';

const SequenceContext = createContext();
const TOKEN_KEY = 'auth_token';
const CLAIMS_KEY = 'token_claims';
const ONE_HOUR = 60 * 60; // in seconds

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
const getToken = async (decode=false) => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
      return null;
    }

    if (decode) {
      return decodeToken(token);
    }

    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const serializeClaims = (claims) => { // Helper function to serialize dates in claims
  if (!claims) return null;
  return {
    ...claims,
    issuedAt: claims.issuedAt.toISOString(),
    expirationTime: claims.expirationTime.toISOString(),
  };
};

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
  const deserializeClaims = (claims) => { // Helper function to deserialize dates in claims
    if (!claims) return null;
    return {
      ...claims,
      issuedAt: new Date(claims.issuedAt),
      expirationTime: new Date(claims.expirationTime),
      isExpired: () => new Date().getTime() >= new Date(claims.expirationTime).getTime(),
      getRemainingTime: () => Math.max(0, new Date(claims.expirationTime).getTime() - new Date().getTime()),
    };
  };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const decodeToken = (token) => {
    try {
      const [, payloadBase64] = token.split('.');
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
const setInitialToken = async (token) => {  // Set initial token from login
  try {
    if (!token) {
      throw new Error('Token is required');
    }

    // Parse and validate the token
    const claims = parseTokenClaims(token);
    
    if (!claims) {
      throw new Error('Invalid token format');
    }

    if (!claims.valid) {
      throw new Error('Token is marked as invalid');
    }

    if (claims.isExpired()) {
      throw new Error('Token is expired');
    }

    // Since we know the Java side sets a 2-hour expiration
    // we can verify the timeUntilExpiration claim matches what we expect
    if (claims.timeUntilExpiration !== 7200) {
      throw new Error('Token expiration time mismatch');
    }


    // Store token and claims
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(CLAIMS_KEY, JSON.stringify(serializeClaims(claims)));
    
    // Update state
    setTokenClaims(claims);
    setIsAuthenticated(true);

    return claims;
  } catch (error) {
    console.error('Error setting initial token:', error);
    await cleanupTokenData();
    return null;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
const cleanupTokenData = async () => {  // Clean up token and claims
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(CLAIMS_KEY);
    setTokenClaims(null);
    setIsAuthenticated(false);
  } catch (error) {
    console.error('Error cleaning up token data:', error);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
const parseTokenClaims = (token) => {    // Parse and validate token claims
  try {
    const claims = decodeToken(token);
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
const getTokenClaims = async () => {   // Get token claims from secure storage
try {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!token) {
    await cleanupTokenData();
    return null;
  }

  const claims = parseTokenClaims(token);
  if (!claims || claims.isExpired()) {
    await cleanupTokenData();
    return null;
  }

  await SecureStore.setItemAsync(CLAIMS_KEY, JSON.stringify(serializeClaims(claims)));
  setTokenClaims(claims);
  setIsAuthenticated(true);
  return claims;
} catch (error) {
  console.error('Error getting token claims:', error);
  await cleanupTokenData();
  return null;
}
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const refreshToken = async () => {    // Refresh the token
  try {
    const currentToken = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!currentToken) {
      await cleanupTokenData();
      return null;
    }

    const response = await fetch('your/jwt/refresh/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: currentToken })
    });

    if (!response.ok) {
      await cleanupTokenData();
      return null;
    }

    const { token } = await response.json();
    const claims = parseTokenClaims(token);
    
    if (!claims || claims.isExpired()) {
      await cleanupTokenData();
      return null;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(CLAIMS_KEY, JSON.stringify(serializeClaims(claims)));
    setTokenClaims(claims);
    setIsAuthenticated(true);
    return claims;
  } catch (error) {
    console.error('Error refreshing token:', error);
    await cleanupTokenData();
    return null;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const checkAndRefreshToken = async () => {  // Check and refresh token if needed
try {
  const claims = await getTokenClaims();
  
  if (!claims) {
    return false;
  }

  // If less than 1 hour remaining, try to refresh
  if (claims.getRemainingTime() < ONE_HOUR * 1000) {
    console.log('Refreshing token, less than 1 hour remaining...');
    const refreshedClaims = await refreshToken();
    if (!refreshedClaims) {
      console.log('token refresh failed');
      return false;
    }
  }

  return true; // if there are claim from the token, and time until expiry is more than 1 hour, return true
} catch (error) {
  console.error('Error checking token:', error);
  await cleanupTokenData();
  router.replace('/(login)', { reset: true });
  return false;
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
        isAuthenticated,
        setSelectedLanguage,
        clearNavigationStack,
        setWalkthroughCompleted,
        useTabNavigator,
        updateAllowsNotifications,
        checkAndRefreshToken,
        getTokenClaims,
        setInitialToken,
        getToken
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
