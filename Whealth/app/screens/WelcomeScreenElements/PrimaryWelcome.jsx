import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSafeAreaInsetsStyle } from 'app/util/useSafeAreaInsetsStyle';
import { useSequencer } from 'app/Context/Controller';
import { SearchBar } from 'app/components/Reusables/SearchBar';
import { AnimatedTextComponent } from 'app/components/Handlers/TextAnimation';
import { CollapsingContent } from 'app/components/Reusables/CollapsableContainer';
import { KeyboardHandler } from 'app/components/Handlers/KeyboardHandler';
import { 
  Gradient, 
  GradientTypes, 
  overlayGradient,
} from 'app/theme/gradients';
import { colors } from 'app/theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export function PrimaryWelcomeScreen() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [searchBarBottom, setSearchBarBottom] = useState(0);
  const safeAreaStyleTop = useSafeAreaInsetsStyle(['top'], 'padding', { top: { ios: -1} });
  const safeAreaStyleBottom = useSafeAreaInsetsStyle(['bottom'], 'padding', { bottom: { ios: 3, android: 7 } });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const buttonsOpacity = useRef(new Animated.Value(1)).current;
  const { clearNavigationStack } = useSequencer();
  const searchInputRef = useRef(null);

  const [dismissKeyboard, setDismissKeyboard] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

  useEffect(() => {
    const unsubscribe = clearNavigationStack();
    return unsubscribe;
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, []);

  // controls the text animation dissapearing
  const onScroll = ({ nativeEvent }) => {
    const platformAdjustment = Platform.OS === 'android' ? 50 : 150;
    const triggerPoint = searchBarBottom - screenHeight * -0.11 + platformAdjustment;
    const scrollPosition = nativeEvent.contentOffset.y;

    const fadeOutDistance = 90;
    const opacity = Math.max(0, Math.min(1, (triggerPoint - scrollPosition) / fadeOutDistance));

    textOpacity.setValue(opacity);
    buttonsOpacity.setValue(opacity);

    const isPastSearchBar = scrollPosition >= triggerPoint;
    if (isPastSearchBar) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: false,
      }).start();
    }
    setIsAtBottom(isPastSearchBar);
  };

  const handleSearchBarPress = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      console.log('Search bar pressed');
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../assets/images/backgrounds/WelcomeScreen.png')}
        style={styles.backgroundImage}
      />
      <Gradient type={GradientTypes.TRANSPARENT_TO_BLACK} style={overlayGradient} />
      
      <KeyboardHandler inputRef={searchInputRef}>
        {({ dismissKeyboard, isKeyboardVisible, keyboardVerticalOffset }) => {
          useEffect(() => {
            setDismissKeyboard(() => dismissKeyboard);
            setIsKeyboardVisible(isKeyboardVisible);
            setKeyboardVerticalOffset(keyboardVerticalOffset);
          }, [dismissKeyboard, isKeyboardVisible, keyboardVerticalOffset]);

          return (
            <View style={[styles.mainViewStyle, safeAreaStyleTop, safeAreaStyleBottom]}>
              <SearchBar
                onPress={handleSearchBarPress}
                fadeAnim={fadeAnim}
                onLayout={(event) => {
                  const { y, height } = event.nativeEvent.layout;
                  setSearchBarBottom(y + height);
                }}
                inputRef={searchInputRef}
              />

              <View style={styles.contentContainer}>
                {!isKeyboardVisible && (
                  <AnimatedTextComponent
                    textOpacity={textOpacity}
                    isAtBottom={isAtBottom}
                  />
                )}
                
                <CollapsingContent
                  isKeyboardVisible={isKeyboardVisible}
                  keyboardVerticalOffset={keyboardVerticalOffset}
                  onScroll={onScroll}
                  keyboardShouldPersistTaps="handled"
                />
            
              </View>
            </View>
          );
        }}
      </KeyboardHandler>
    </View>
  );
}

const styles = {
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  mainViewStyle: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
};