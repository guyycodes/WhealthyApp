// /app/(login)/index
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import {
  Text,
  ImageBackground,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../assets/images/icon.png';
import { customFontsToLoad } from 'app/theme/typography';
import { useSequencer } from 'app/Context/Controller';
import {
  Gradient,
  GradientTypes,
  overlayGradient,
} from 'app/theme/gradients';
import { useRouter } from 'expo-router';
import { colors } from 'app/theme';
import { BackArrow } from 'app/components/Handlers/BackArrow';

// get the height and width
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function LoginIndex() {
  const [fontsLoaded] = useFonts(customFontsToLoad);
  const { useTabNavigator } = useSequencer();
  const router = useRouter();
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    setToggle(!toggle)
    useTabNavigator(toggle);
  }, []);

  const handleLogin = () => {
    router.push('/(login)/login');
  };

  const handleSignup = () => {
    router.push('/(login)/signup');
  };

  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://imgur.com/k9a68j3.png' }}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(4, 2, 3, 0)', 'rgba(4, 2, 3, 1)']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
          style={styles.gradient}
        >
          <View style={styles.contentContainer}>
            <BackArrow />
            <Image
              source={Logo}
              style={styles.logo}
            />

            <View style={styles.overlay}>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Gradient type={GradientTypes.SOLID_LIGHT_BLUE_TO_DARK_BLUE} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Login</Text>
                  </Gradient>
                </TouchableOpacity>
                <Text style={styles.subText}>Have an Account</Text>
              </View>

              <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                  <Gradient type={GradientTypes.SOLID_GREEN_TO_DARK_GREEN} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Sign up</Text>
                  </Gradient>
                </TouchableOpacity>
                <Text style={styles.subText}>Get the app</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 50,
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    height: screenHeight * 0.6,
    resizeMode: 'contain',
    width: screenWidth * 0.8,
    marginBottom: screenHeight * 0.05,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: screenWidth * 0.8,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.palette.neutral100,
  },
  buttonGradient: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.palette.neutral100,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    marginTop: 8,
    color: colors.palette.neutral100,
    fontSize: 14,
  },
});