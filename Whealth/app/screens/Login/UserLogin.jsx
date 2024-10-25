import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsetsStyle } from 'app/util/useSafeAreaInsetsStyle';
import { validate } from 'app/util/validate/validateLogin';
import { Ionicons } from '@expo/vector-icons';
import { BackArrow } from 'app/components/Handlers/BackArrow';
import Logo from '../../../assets/images/icon.png';
import { KeyboardHandler } from 'app/components/Handlers/KeyboardHandler';
import { AppleSignIn } from './SignInWithApple';
import { GoogleSignIn } from './SignInWithGoogle';
import { UseCustomGet } from 'app/util/Hooks/GetHook';
import { USE_CUSTOM_POST } from 'app/util/Hooks/PostHook'
import {NewAccountModal} from './Modals/NewAccount'

const { width, height } = Dimensions.get('window');

export const SignInForm = ({ NeedsNewAccount = false }) => {
  const loginFormRef = useRef(null);

  const [rememberMe, setRememberMe] = useState(false);
  const [showNewAccountModal, setShowNewAccountModal] = useState(NeedsNewAccount);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const safeAreaStyleTop = useSafeAreaInsetsStyle(['top'], 'padding', { top: { ios: -1} });
  const safeAreaStyleBottom = useSafeAreaInsetsStyle(['bottom'], 'padding', { bottom: { ios: 4, android: 9 } });

  const { sendRequest, loading, error, response, LoadingComponent } = USE_CUSTOM_POST('https://api.example.com/data')

  useEffect(() => {
    setShowNewAccountModal(NeedsNewAccount);
  }, [NeedsNewAccount]);

  const handleSubmit = async () => {
    console.log('Sign In button clicked');
    const result = await validate(email, password, loginFormRef.current);
    if (result === 0) {
      const data = { email, password };
      try {
        setSpinner(true);
        const path = await sendRequest(data);
        setTimeout(() => {
          setSpinner(false);
          // Navigation logic
        }, 2250);
      } catch (error) {
        console.error('Failed to fetch credentials:', error);
        setSpinner(false);
      }
    } else {
      console.error("Error redirecting");
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password clicked');
    // Add forgot password logic here
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In clicked');
    // Add Google sign in logic here
    
  };

  const handleTogglePasswordVisibility = () => {
    console.log('Toggle password visibility clicked');
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, safeAreaStyleBottom, safeAreaStyleTop]}>
      <ImageBackground
        source={require('../../../assets/images/backgrounds/loginScreen.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      <View style={styles.overlay}>
        <BackArrow 
          style={[styles.backArrow, safeAreaStyleTop]} 
          onPress={() => console.log('Back arrow clicked')}
        />

        <View style={styles.logoContainer}>
          <Image
            source={Logo}
            style={styles.logo}
          />
        </View>

        <KeyboardHandler inputRef={loginFormRef}>
          {({ dismissKeyboard, isKeyboardVisible, keyboardVerticalOffset }) => (
            <ScrollView 
              contentContainerStyle={[
                styles.scrollView,
                { marginBottom: isKeyboardVisible ? keyboardVerticalOffset : 0 }
              ]}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome!</Text>
                <TextInput
                  ref={loginFormRef}
                  style={[styles.input, emailError && styles.inputError]}
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => {
                    console.log('Email input changed');
                    setEmail(text);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, passwordError && styles.inputError]}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                      console.log('Password input changed');
                      setPassword(text);
                    }}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={handleTogglePasswordVisibility} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#888" />
                  </TouchableOpacity>
                </View>
                <View style={styles.rememberForgotContainer}>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.signInButton} onPress={handleSubmit}>
                  <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <View style={styles.socialButtonsContainer}>
    
                <GoogleSignIn/>
                {Platform.OS === 'ios' && <AppleSignIn />}

              </View>
              </View>
            </ScrollView>
          )}
        </KeyboardHandler>
      </View>
      <NewAccountModal 
        isVisible={showNewAccountModal}
        onClose={() => {
          setShowNewAccountModal(false);
          // Add any additional cleanup logic here
          console.log('Modal closed');
        }}
      />
      {spinner && <View style={styles.spinner} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: width,
    height: height * .25, // Adjust this value to change the visible portion of the image
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 28, 30, 0.7)',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.1,
    top: Platform.OS === 'ios' ? height * -0.01 : height * -0.05,
    marginBottom: Platform.OS === 'ios' ? height * -0.24 : height * -0.23
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    margin: 20,
    marginTop: 0,
    bottom: Platform.OS === 'ios' ? 'auto' : height * 0.03,
    height: Platform.OS === 'ios' ? 'auto' : height * 0.52,
    maxHeight: height * 0.7,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: 'red',
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 5,
  },
  checked: {
    backgroundColor: 'black',
  },
  rememberMeText: {
    fontSize: 14,
  },
  forgotPassword: {
    fontSize: 14,
    color: 'blue',
  },
  signInButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 10,
  },
  orText: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 10,
  },
  socialButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 15 : 0,
    marginTop: Platform.OS === 'ios' ? 0 : 10,
  },
  googleButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: 'black',
    fontSize: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  socialButtonText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
  spinner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});