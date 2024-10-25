import * as AppleAuthentication from 'expo-apple-authentication';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export const AppleSignIn = () => {
  const router = useRouter();

  const handleAppleSignIn = async () => {
    try {
      // Get Apple credentials
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Send to your backend
      const response = await fetch('https://whealthy.ai/api/auth/apple/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identityToken: credential.identityToken,
          authorizationCode: credential.authorizationCode
        })
      });

      // Parse the response
      const data = await response.json();

      if (!response.ok) {
        switch (data.message) {
          case 'User not registered':
            Alert.alert(
              'Account Not Found',
              'No account associated with this Apple ID. Would you like to create one?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: async () => {
                    try {
                      await SecureStore.setItemAsync('temp_auth_token', data.token);
                      await router.replace('/(welcome)/welcome');
                    } catch (error) {
                      console.error('Navigation error:', error);
                      Alert.alert('Error', 'Failed to navigate. Please try again.');
                    }
                  }
                },
                {
                  text: 'Sign Up',
                  style: 'default',
                  onPress: async () => {
                    try {
                      const registrationData = {
                        email: credential.email,
                        fullName: credential.fullName,
                        identityToken: credential.identityToken,
                        token: data.token
                      };

                      await SecureStore.setItemAsync('pendingRegistration', 
                        JSON.stringify(registrationData));
                      
                      await router.replace({
                        pathname: '/(auth)/callback',
                        params: { mode: 'registration' }
                      });
                    } catch (error) {
                      console.error('Registration error:', error);
                      Alert.alert('Error', 'Failed to proceed with registration. Please try again.');
                    }
                  }
                }
              ]
            );
            break;

          case 'Apple account not verified':
            Alert.alert('Authentication Error', 'Your Apple account is not verified.');
            break;

          case 'User not validated':
            Alert.alert('Authentication Error', 'Your account is not validated. Please contact support.');
            break;

          default:
            Alert.alert('Authentication Error', data.message || 'An unexpected error occurred');
        }
      } else {
        // Successful login
        try {
          await SecureStore.setItemAsync('auth_token', data.token);
          await router.replace('/(tabs)');
        } catch (error) {
          console.error('Post-login error:', error);
          Alert.alert('Error', 'Failed to complete login. Please try again.');
        }
      }

    } catch (e) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // User canceled the sign-in flow
        console.log('Sign in canceled by user');
      } else {
        console.error('Apple Sign In Error:', e);
        Alert.alert('Error', 'Failed to sign in with Apple. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={handleAppleSignIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  button: {
    width: 210,
    height: 44,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});