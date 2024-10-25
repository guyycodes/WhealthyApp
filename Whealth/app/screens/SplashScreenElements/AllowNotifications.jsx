import { Icon } from 'app/components/Icon';
import { Text } from 'app/components/Text';
import { colors } from 'app/theme';
import { DottedLineSeparator } from 'app/theme/gradients';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ImageBackground,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';
import { useSequencer } from '../../Context/Controller';

export default function AllowNotifications() {
  const router = useRouter();
  const { updateAllowsNotifications } = useSequencer();
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const handleAllowNotifications = useCallback(async () => {
    await updateAllowsNotifications(true);
    setShouldNavigate(true);
  }, [updateAllowsNotifications]);

  useEffect(() => {
    if (shouldNavigate) {
      router.replace('/walkthrough');
    }
  }, [shouldNavigate]);

  const handleSkip = useCallback(async() => {
    await updateAllowsNotifications(false);
    setShouldNavigate(true);
    router.replace('/(splash)/walkthrough');
  }, [updateAllowsNotifications, router]);

  return (
      <View style={$backgroundContainer}>
        <ImageBackground
          source={require('../../../assets/images/backgrounds/allowNotifications.png')}
          style={$backgroundImage}
        >
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)', 'black']}
          locations={[0, 0.4, 0.6, 1]}
          style={$gradientOverlay}
        />
        <TouchableOpacity
          onPress={handleSkip}
          style={$skipButtonStyle} >
          <Text style={$skipText} tx="common.skip"/>
        </TouchableOpacity>

        <View style={$container}>
          <View style={[$iconsContainer, $iconBell]}>
            
            <LinearGradient
              colors={['#F6511E', '#902F12']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={$gradientBackground}
            >
            <View style={$textContainer}>
              <Text style={$descriptionText} tx="allowNotifications.title"/>
              <Text style={$subDescriptionText} tx="allowNotifications.description"/>
            </View>
          </LinearGradient>
          <View style={$iconWrapper}>
            <Icon icon="notification" size={270} />
          </View>
        </View>

        <View style={$containerUnderlay}>
        <View style={$line}>
          <View style={$iconStyle}>
            <Icon icon="info" size={37} />
          </View>
          <Text style={$lineText}>
            <Text style={$headline} tx={"common.important"} />
            <Text style={$headline} tx={"allowNotifications.updates"} />
          </Text>
        </View>

          <DottedLineSeparator/>

          <View style={$line}>
            <View style={$iconStyle}>
              <Icon icon="notificationBell" size={40} />
            </View>
              
            <Text style={$lineText}>
              <Text style={$headline} tx={"common.notifications"} />
              <Text style={$headline} tx={"allowNotifications.notifications"}/>
            </Text>
          </View>

          <DottedLineSeparator/>

          <View style={$line}>
            <View style={$iconStyle}>
              <Icon icon="updates" size={40} />
            </View>
              
            <Text style={$lineText}>
              <Text style={$headline} tx={"common.important"} />
              <Text style={$headline} tx={"allowNotifications.softwareUpdates"}/>
            </Text>
          </View>

          <DottedLineSeparator/>
          
          <View style={$line}>
          <View style={$iconStyle}>
            <Icon icon="discounts" size={40} />
          </View>
            
          <Text style={$lineText}>
            <Text style={$headline} tx={"common.discounts"}/>
            <Text style={$headline} tx={"allowNotifications.discounts"}/>
          </Text>
          </View>
        </View>
        <View style={$allowButtonContainer}>
          <TouchableOpacity
            onPress={handleAllowNotifications}
            style={$allowButtonTouchable}
          >
            <LinearGradient
              colors={['#4FBEF8', '#3C5D6F']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={$allowButtonGradient}
            >
              <Text style={$allowButtonText} tx={"allowNotifications.continue"}/>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

    </ImageBackground>
  </View>
);
}

const $backgroundContainer = {
  flex: 1,
}

const $backgroundImage = {
    flex: 1,
    width: '100%',
    height: '100%',
}

const $gradientOverlay = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
}

const $container = {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
}

const $iconsContainer = {
  alignItems: 'center',
  marginTop: '20%',
  marginBottom: -15,
  zIndex: 2,
}

const $containerUnderlay = {
  backgroundColor: colors.palette.neutral800,
  padding: 0,
  borderRadius: 10,
  paddingTop: 20,
}

const $gradientBackground = {
  width: '100%',
  paddingTop: 100, // Adjust this value to control how much of the icon overlaps
  paddingBottom: 20,
  borderRadius: 10,
}

const $textContainer = {
  alignItems: 'center',
}

const $iconWrapper = {
  position: 'absolute',
  top: -100, // Adjust this value to control the icon's position
  zIndex: 1,
}

const $descriptionText = {
  fontWeight: 'bold',
  fontSize: 18,
  textAlign: 'center',
  color: colors.palette.neutral100, // Change text color to white for better visibility on gradient
  paddingHorizontal: 10,
  padding: 10,
}

const $subDescriptionText = {
  marginTop: 0,
  fontSize: 12,
  textAlign: 'center',
  color: colors.palette.neutral100, // Change text color to white for better visibility on gradient
  paddingHorizontal: 10,
  paddingBottom: 5,
}

const $iconBell = Platform.select({
  ios: {
    marginTop: '60%',
  },
  android: {
    marginTop: '55%',
  },
});

const $line = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 20, // Add horizontal padding to the container
}

const $iconStyle = {
  marginRight: 15, // Add margin to the right of the icon
  width: 30, // Set a fixed width for the icon container
  alignItems: 'center', // Center the icon horizontally in its container
}

const $lineText = {
  flex: 1,
  marginLeft: 5, // Add a small margin to the left of the text
}


const $headline = {
    fontWeight: 'bold',
    color: colors.palette.neutral100,
}

const $allowButtonContainer = {
  marginTop: 5,
  paddingHorizontal: 0,
}

const $allowButtonTouchable = {
  borderRadius: 20,
  marginTop: 10,
  overflow: 'hidden', // This ensures the gradient doesn't spill outside the button's rounded corners
}

const $allowButtonText = {
  color: colors.palette.neutral100,
  fontWeight: 'bold',
  fontSize: 16,
}

const $allowButtonGradient = {
  paddingVertical: 15,
  alignItems: 'center',
}

const $skipButtonStyle = {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 35,
    right: 20,
    zIndex: 2,
}
const $skipText = {
    color: colors.palette.neutral100,
    fontSize: 16,
}


