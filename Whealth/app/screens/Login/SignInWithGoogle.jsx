import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useSequencer } from 'app/Context/Controller';

// this is how you handle deep linking in react native
export const GoogleSignIn = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setInitialToken, getToken } = useSequencer();

    const handleRedirect = async (url) => {
      const { hostname, path, queryParams } = Linking.parse(url);
      // console.log(`hostname: ${hostname}, path: ${path}, queryParams:`, queryParams);
      // Extract the token from queryParams
       // Validate token exists where expected
      const token = queryParams?.token;
      const fullPath = `${hostname}/${path}`;

       if (token) {
            try {
              // Check if there's an existing token
              const existingToken = await SecureStore.getItemAsync('auth_token');
              if (existingToken) {
                  // Remove the existing token
                  await SecureStore.deleteItemAsync('auth_token');
                  console.log('Existing token removed');
              }

              // Save the new token
              await setInitialToken(token);
              console.log('New token saved');

          } catch (error) {
              console.error('Error handling secure storage:', error);
              Alert.alert(
                  'Storage Error',
                  'Failed to securely store authentication data. Please try again.'
              );
          }
      }

      // Log both decoded and non-decoded tokens
      const rawToken = await getToken();
      const decodedToken = await getToken(true);

      console.log("Raw token:", rawToken);
      console.log("Decoded token:", decodedToken);

      switch (fullPath) {
        case 'auth/home':
          if (!token) {
            console.error('No token received for auth/home path');
            Alert.alert('Error', 'Authentication token missing');
            return;
        }
          // Navigate to the desired screen with the token
          router.replace({
            pathname: '/(auth)/home',
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
          console.log('Received deep link:', url);
          handleRedirect(url);
        };
    
        // Add event listener for incoming deep links (Android)
        const subscription = Linking.addEventListener('url', handleDeepLink);
    
        // Handle the case when the app is launched from a deep link (cold start)
        Linking.getInitialURL().then((url) => {
          if (url) {
            // console.log('App opened with URL:', url);
            handleRedirect(url);
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