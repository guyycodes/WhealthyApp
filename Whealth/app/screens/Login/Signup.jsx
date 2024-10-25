import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsetsStyle } from 'app/util/useSafeAreaInsetsStyle';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BackArrow } from 'app/components/Handlers/BackArrow';
import { KeyboardHandler } from 'app/components/Handlers/KeyboardHandler';
import { AppleSignIn } from './SignInWithApple';

export const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const scrollViewRef = useRef(null);
  const safeAreaStyleTop = useSafeAreaInsetsStyle(['top'], 'padding', { top: { ios: -2} });
  
  const router = useRouter();

  const handleGoogleSignUp = () => {
    console.log('Sign up with Google clicked');
    // Add Google sign up logic here
  };

  const handleAppleSignUp = () => {
    console.log('Sign up with Apple clicked');
    // Add Apple sign up logic here
  };

  const handleTogglePasswordVisibility = () => {
    console.log('Toggle password visibility clicked');
    setShowPassword(!showPassword);
  };

  const handleSignUpWithEmail = () => {
    console.log('Sign up with email clicked');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Birthdate:', birthdate);
    // Add sign up logic here
  };

  return (
    <View style={[styles.container, safeAreaStyleTop]}>
      <BackArrow onPress={() => {
        console.log('Back arrow clicked');
        router.back();
      }} />
      <KeyboardHandler inputRef={scrollViewRef}>
        {({ dismissKeyboard, isKeyboardVisible, keyboardVerticalOffset }) => (
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: isKeyboardVisible ? keyboardVerticalOffset : 20 }
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerContainer}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.header}>Welcome</Text>
                <Text style={styles.subHeader}>Sign Up</Text>
              </View>
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignUp}>
                <Image
                  source={{ uri: "https://imgur.com/FOF6Hyq.png" }}
                  style={styles.googleIcon}
                />
                <Text style={styles.socialButtonText}>Sign up with Google</Text>
              </TouchableOpacity>
              
              {Platform.OS === 'ios' && <AppleSignIn />}
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.signUpLink}>Sign Up with email</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                console.log('Email input changed');
                setEmail(text);
              }}
              keyboardType="email-address"
              placeholderTextColor="#888"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  console.log('Password input changed');
                  setPassword(text);
                }}
                secureTextEntry={!showPassword}
                placeholderTextColor="#888"
              />
              <TouchableOpacity onPress={handleTogglePasswordVisibility} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="First name"
              value={firstName}
              onChangeText={(text) => {
                console.log('First name input changed');
                setFirstName(text);
              }}
              placeholderTextColor="#888"
            />

            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={lastName}
              onChangeText={(text) => {
                console.log('Last name input changed');
                setLastName(text);
              }}
              placeholderTextColor="#888"
            />

            <TextInput
              style={styles.input}
              placeholder="Birthdate (MM/DD/YYYY)"
              value={birthdate}
              onChangeText={(text) => {
                console.log('Birthdate input changed');
                setBirthdate(text);
              }}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />

            <TouchableOpacity 
              style={styles.signUpButton} 
              onPress={() => {
                handleSignUpWithEmail();
                dismissKeyboard();
              }}
            >
              <Text style={styles.signUpButtonText}>Sign up with email</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </KeyboardHandler>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  scrollContent: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 18,
    color: '#888',
  },
  socialButtonsContainer: {
    marginBottom: 20,
  },
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#888',
  },
  dividerText: {
    color: '#888',
    paddingHorizontal: 10,
  },
  signUpLink: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2c2c2e',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    color: '#fff',
  },
  eyeIcon: {
    padding: 10,
  },
  signUpButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
    
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});