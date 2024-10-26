import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useSequencer } from 'app/Context/Controller';

// this is how you handle deep linking in react native
export const GoogleSignIn = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setInitialToken, getToken, removeToken } = useSequencer();

    const handleRedirect = async (url) => {

      const { hostname, path, queryParams } = Linking.parse(url);
      // console.log(`hostname: ${hostname}, path: ${path}, queryParams:`, queryParams);
      // Extract the token from queryParams
       // Validate token exists where expected
      const token = queryParams?.token;
      const fullPath = `${hostname}/${path}`;

      if (token) {
        try {
          console.log('Attempting to set initial token');
          await removeToken();
          const claims = await setInitialToken(token);
          
          if (claims) {
            console.log('Token successfully stored with claims:', {
              email: claims.email,
              isReturningUser: claims.isReturningUser,
              userExists: claims.userExists
            });
            
            // Verify token was stored correctly
            const storedToken = await getToken();
            const decodedToken = await getToken(true);
            console.log('Token verification:', {
              hasStoredToken: !!storedToken,
              hasDecodedToken: !!decodedToken
            });
          } else {
            throw new Error('Failed to store token - no claims returned');
          }
        } catch (error) {
          console.error('Error during token storage:', error);
          Alert.alert(
            'Authentication Error',
            'Failed to complete sign in process. Please try again.'
          );
          isAuthenticating.current = false;
          return;
        }
      }
     
      switch (fullPath) {
        case 'auth/home':
          if (!token) {
            console.error('No token received for auth/home path');
            Alert.alert('Error', 'Authentication token missing');
            return;
        }
          // Navigate to the desired screen with the token
          router.replace({
            pathname: '/(auth)',
          });
          break;
        case 'auth/callback':
          if (!token) {
            console.error('No token received for auth/callback path');
            Alert.alert('Error', 'Authentication token missing');
            return;
        }
          router.replace({
            pathname: '/(auth)/callback',
          });
          break;
        case 'auth/error':
          console.log('Handling registration:', queryParams.registered_no_account);
          router.replace({
            pathname: '/(auth)/error',
          });
          break;
        default:
          console.log('Unhandled deep link path:', fullPath);
      }

    };

    useEffect(() => {
      const handleDeepLink = (event) => {
        const url = event.url;
        const parsedUrl = Linking.parse(url);
        console.log('Received deep link:', url);
        
        if (parsedUrl.scheme === 'whealthy') {
          handleRedirect(url);
        } else {
          console.log('Ignoring non-app deep link:', url);
        }
        // Remove this line as it's causing the unconditional redirect:
        // handleRedirect(url);  
      };
    
      // Add event listener for incoming deep links (Android)
      const subscription = Linking.addEventListener('url', handleDeepLink);
    
      // Handle the case when the app is launched from a deep link (cold start)
      Linking.getInitialURL().then((url) => {
        if (url) {
          const parsedUrl = Linking.parse(url);
          if (parsedUrl.scheme === 'whealthy') {
            handleRedirect(url);
          } else {
            console.log('Ignoring non-app deep link:', url);
          }
        }
      });
    
      // Clean up the event listener
      return () => {
        subscription.remove();
      };
    }, []);

    async function fetchGoogleAuth() {
        try {
          // Corrected fetch URL with 'https://'
          const response = await fetch('https://whealthy.ai/api/auth/mobile');
          // Check if the fetch was successful
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.text();
          return data;
        } catch (error) {
          console.error('Failed to fetch from Google Auth API:', error);
        }
      }
    
      const oAuthLogin = async () => {
        setLoading(true);

        try {
          const authUrl = await fetchGoogleAuth();
          console.log('authUrl:', authUrl);
    
          // Use Linking.createURL to generate the redirect URL
          const redirectUrl = Linking.createURL('auth/callback');
    
          const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
          console.log('AuthSession result:', result);
    
          if (result.type === 'success' && result.url) {
            if (Platform.OS === 'ios') {
              // On iOS, handle the redirect URL directly
              handleRedirect(result.url);
            } else {
              // On Android, the URL is handled by the deep link listener
              console.log('Android: Waiting for deep link...');
            }
          } else if (result.type === 'dismiss') {
            console.log('Authentication was dismissed');
          } else {
            console.log('Authentication failed or was cancelled');
            Alert.alert(
              'Authentication Failed',
              'The sign-in process was cancelled or failed. Please try again.'
            );
          }
        } catch (error) {
          console.error('Failed to initiate Google Sign In:', error);
          Alert.alert('Error', 'Failed to initiate Google Sign In. Please try again.');
        } finally {
          setLoading(false);
        }
      };

  return (
    <>
        <TouchableOpacity style={styles.socialButton} onPress={oAuthLogin}>
            <Image
            source={{ uri: "https://imgur.com/FOF6Hyq.png" }}
            style={styles.googleIcon}
            />
            <Text style={styles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
socialButtonText: {
    marginLeft: 10,
    color: '#000',
  },
googleIcon: {
    width: 20,
    height: 20,
  },
});