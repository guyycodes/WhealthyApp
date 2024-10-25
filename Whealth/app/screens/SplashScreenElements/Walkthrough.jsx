import { useFocusEffect } from '@react-navigation/native';
import {
  DottedLineSeparator,
  FrostedGlassContainer,
  Gradient,
  GradientTypes,
  languageButtonGradient,
  overlayGradient,
  overlayGradient2
} from 'app/theme/gradients';
import { AsyncStorageUtil } from 'app/util/DeviceStore';
import { Video } from 'expo-av';
import { Redirect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BackHandler, Dimensions, FlatList, ImageBackground, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "app/components/Icon";
import { Text } from "app/components/Text";
import { useSequencer } from 'app/Context/Controller';
import { colors } from "app/theme/colors";
import { spacing } from "app/theme/spacing";
import { MovingImage } from "./FingerPrint";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

/**
 * @typedef {Object} SlideItemProps
 * @property {Object} item - The slide item data
 * @property {number} index - The index of the current slide
 * @property {number} currentIndex - The index of the active slide
 * @property {Function} navigate - Navigation function
 * @property {Function} setGetStarted - Function to set the getStarted state
 * @property {Function} setWalkthroughCompleted - Function to set the walkthrough completion state
 * @property {Object} router - The router object for navigation
 */

/**
 * Renders an individual slide item in the walkthrough.
 * @param {SlideItemProps} props - The props for the SlideItem component
 * @returns {React.ReactElement} The rendered SlideItem component
 */

const SlideItem = React.memo(({ item, index, currentIndex, setGetStarted, setWalkthroughCompleted, router, setSelectedLanguage }) => {
  const [language, setLanguage] = useState('en');
  const videoRef = useRef(null);

  useEffect(() => {
    if (item.isVideo && videoRef.current) {
      if (index === currentIndex) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [currentIndex, index, item.isVideo]);

  const getTxKeyForSlide = useCallback((idx, t) => `walkthrough.slides.slide${idx + 1}.${t}`, []);

  const languages = [
    { code: 'en', name: 'ENGLISH', flag: '🇬🇧' },
    { code: 'fr', name: 'FRENCH', flag: '🇫🇷' },
    { code: 'de', name: 'GERMANY', flag: '🇩🇪' },
    { code: 'es', name: 'SPANISH', flag: '🇪🇸' },
    { code: 'ko', name: 'KOREAN', flag: '🇰🇷' },
  ];

  const handleLanguageSelection = (langCode) => {
    // set local component state
    setLanguage(langCode)

    console.log(`make sure to set the language in the device for ${langCode}`)
    // Here you would typically update your app's language setting
    // set state in the device
    setSelectedLanguage(langCode);
  };

   return (
    <View style={$container}>

      <TouchableOpacity 
        onPress={() => { router.replace('/(welcome)/welcome'); setWalkthroughCompleted(true); }}
        style={$skipButtonStyle}>
        <Text style={$skipText} tx="common.skip" />
      </TouchableOpacity>

      <FrostedGlassContainer style={$frostedGlassContent}>
        
        <View style={$contentContainer}>
        {item.isVideo ? (
            <View style={$videoContainer}>
              <Video
                ref={videoRef}
                source={item.media}
                style={$videoStyle}
                resizeMode="cover"
                isLooping
                shouldPlay={index === currentIndex}
                isMuted={false}
                rate={0.70}
              />
              <View style={$videoOverlay.overlay} />
            </View>
          ) : item.media && index === 2 ? (
            <ImageBackground source={item.media} />
          ) : item.media && index === 3 ? (
            <Icon icon="logo" size={250} style={$icon_logo} />
          ) : (
            <Icon icon="globe" size={80} style={$icon} />
          )}

          <View style={$textContainer}>
            <Text style={$title} tx={getTxKeyForSlide(index, 'title')} />
            <Text style={$description} tx={getTxKeyForSlide(index, 'description')} />
          </View>
          {/* // language section */}
          {index === 0 && (
              <View style={$languageContainer}>
                {languages.map((lang, idx) => (
                  <React.Fragment key={lang.code}>
                    <TouchableOpacity 
                      style={$languageButton}
                      onPress={() => handleLanguageSelection(lang.code)}
                    >
                      {language === lang.code ? (
                        <Gradient type={GradientTypes.ORANGE_RED} style={languageButtonGradient}>
                          <Text style={$flagText}>{lang.flag}</Text>
                          <Text style={[$languageText, $languageTextSelected]}>{lang.name}</Text>
                        </Gradient>
                      ) : (
                        <>
                          <Text style={$flagText}>{lang.flag}</Text>
                          <Text style={$languageText}>{lang.name}</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    {idx < languages.length - 1 && <DottedLineSeparator />}
                  </React.Fragment>
                ))}
              </View>
            )}
          
          <View style={$radioContainer}>
            {[0, 1, 2, 3].map((idx) => ( // Updated to include index 3
              <View key={idx} style={[
                $radioButton, 
                currentIndex === idx ? $radioButtonActive : {}
              ]}/>
            ))}
          </View>

          {index === 3 ? ( // Updated condition to index 3
          
            <TouchableOpacity 
                style={[$getStartedButton, $bottomContainer]} 
                onPress={() => { setGetStarted(true); router.replace('/(welcome)/welcome')}}
              >

              <Gradient type={GradientTypes.BLUE_DARK_BLUE} style={overlayGradient2}>
                  <Text style={$getStartedButtonText} tx="common.getStarted"/>
              </Gradient>

            </TouchableOpacity>
             
              
          ) : (
            <MovingImage style={marginBottom='2'} path={require('../../../assets/images/fingerPrint.png')} />
          )}
        </View>
      </FrostedGlassContainer>
    </View>
  );
});

/**
 * WalkthroughScreen component that displays a series of introductory slides to the user.
 * It handles navigation, prevents going back, and manages the walkthrough state.
 * @returns {React.ReactElement} The rendered WalkthroughScreen component
 */
export function WalkthroughScreen() {

  console.log('WalkthroughScreen rendered');

  const media = useMemo(() => [
    require('../../../assets/images/distributedSys.png'),
    { uri: 'https://i.imgur.com/bcbIhgV.mp4' },
    require('../../../assets/images/distributedSys.png'),
    require('../../../assets/images/distributedSys.png'),
  ], []);

  const walkthroughData = useMemo(() => [
    { key: '1' }, // there is no image here on purpose
    { key: '2', media: media[1], isVideo: true },
    { key: '3', media: media[2] },
    { key: '4', media: media[3] },
  ], [media]);

  const { setWalkthroughCompleted, isWalkthroughCompleted, allowsNotifications, setSelectedLanguage, language } = useSequencer();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [getStarted, setGetStarted] = useState(false);
  const [slides, setSlides] = useState(walkthroughData);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    // Force re-render of all slides when currentIndex changes
    setSlides([...walkthroughData]);
  }, [currentIndex]);

  // Clear the navigation stack and prevent going back
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const clearStack = () => {
        if (router.canDismiss()) {
          router.dismiss();
        }
      };

      clearStack();

      // Handle Android back button
      const onBackPress = () => {
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [router])
  );

  useLayoutEffect(() => {
    const checkWalkthroughCompletion = async () => {
      const completed = await AsyncStorageUtil.getWalkthroughCompleted();
      if (completed) {
        setWalkthroughCompleted(false); // Change to true later
      }
      if (isWalkthroughCompleted) {
        router.replace('/(welcome)/welcome');
      }
    };

    checkWalkthroughCompletion();
  }, [isWalkthroughCompleted, router, setWalkthroughCompleted]);

  /**
   * Renders an individual slide item.
   * @param {Object} params - The render item params
   * @param {Object} params.item - The slide item data
   * @param {number} params.index - The index of the slide
   * @returns {React.ReactElement} The rendered SlideItem component
   */
  const renderItem = useCallback(({ item, index }) => (
    <SlideItem 
      item={item} 
      index={index} 
      currentIndex={currentIndex} 
      setGetStarted={setGetStarted}
      setWalkthroughCompleted={setWalkthroughCompleted}
      router={router}
      setSelectedLanguage={setSelectedLanguage}
      language={language}
    />
  ), [currentIndex, setGetStarted, setWalkthroughCompleted, router]);

  /**
   * Handles the end of slide momentum scrolling.
   * @param {Object} e - The scroll event object
   */
  const onMomentumScrollEnd = useCallback((e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
    if (index === 3 && getStarted) {
      AsyncStorageUtil.setWalkthroughCompleted(true);
      setWalkthroughCompleted(true);
    }
  }, [getStarted, setWalkthroughCompleted, screenWidth]);

  const keyExtractor = useCallback((item) => item.key, []);

  const getItemLayout = useCallback((data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  }), []);

  const memoizedFlatListProps = useMemo(() => ({
    data: slides,
    renderItem,
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    onMomentumScrollEnd,
    keyExtractor,
    getItemLayout,
    initialNumToRender: 4, // Render all slides initially
    maxToRenderPerBatch: 4,
    windowSize: 4,
    extraData: currentIndex, // Add this line
  }), [slides, renderItem, onMomentumScrollEnd, keyExtractor, getItemLayout, currentIndex]);

  if (isWalkthroughCompleted) {
    return <Redirect href="/(welcome)" />;
  }

  return (
    <View style={$backgroundContainer}>
      <ImageBackground
        source={require('../../../assets/images/backgrounds/allowNotifications.png')}
        style={$backgroundImage}
      >
      <Gradient type={GradientTypes.TRANSPARENT_TO_BLACK} style={overlayGradient} />
      <FlatList
        ref={flatListRef}
        {...memoizedFlatListProps}
      />
      </ImageBackground>
    </View>
  );
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const $backgroundContainer = {
  flex: 1,
  backgroundColor: colors.palette.overlay20,
};

const $backgroundImage = {
  flex: 1,
  width: '100%',
  height: '100%',
}

const $languageContainer = {
  width: '100%',
  marginTop: spacing.md,
  marginBottom: spacing.md,
};

const $languageButton = {
  flexDirection: 'row',
  alignItems: 'center',
  height: spacing.xxl,
  borderRadius: 8,
  marginVertical: spacing.xs,
  marginHorizontal: spacing.sm,
  paddingHorizontal: spacing.sm,
};

const $icon = {
  marginBottom: -10,
  marginTop: -5,
};

const $icon_logo = {
  marginBottom: -40,
  marginTop: -5,
};

const $container = {
  flex: 1,
  justifyContent: "center",
  alignItems: 'center',
  width: screenWidth,
};

const $textContainer = {
  alignItems: 'center',
  marginVertical: 0,
};

const $contentContainer = {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};

const $flagText = {
  fontSize: 24,
  marginRight: spacing.sm,
};

const $languageText = {
  color: colors.palette.neutral100,
  fontSize: 16,
};

const $languageTextSelected = {
  color: colors.palette.neutral100,
  fontWeight: 'bold',
};

const $frostedGlassContent = Platform.select({
  ios: {
    width: '90%',
    height: '71%',
    alignItems: 'center',
    justifyContent: 'center',
    top: '7%'
  },
  android: {
    width: '90%',
    height: '77%',
    alignItems: 'center',
    justifyContent: 'center',
    top: '7%',
  },
});

const $skipButtonStyle = {
  position: 'absolute',
  alignSelf: 'flex-end',
  top: "4%",
  right: spacing.md,
  padding: spacing.sm,
  zIndex: 2,
};

const $skipText = {
  color: 'white',
  fontSize: 16,
};

const $img = {
  width: screenWidth * 0.7,
  height: screenHeight * 0.3,
  resizeMode: 'contain',
  marginBottom: -25
};

const $radioContainer = {
  flexDirection: 'row',
};

const $title = {
  fontSize: 22,
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
  
};

const $description = {
  fontSize: 16,
  color: 'white',
  textAlign: 'center',
};

const $radioButton = {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: 'gray',
  marginVertical: 0,
  marginHorizontal: 4,
};

const $radioButtonActive = {
  backgroundColor: 'white',
};

const $getStartedButton = Platform.select({
  ios: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    marginHorizontal: screenWidth * 0.02,
    height:'10%',
    marginBottom: 18,
  },
  android: {
    height:'10%',
    elevation: 10,
    marginBottom: 18,
  },
});

const $getStartedButtonText = {
  color: colors.palette.neutral100,
  textAlign: 'center',
  fontSize: 18,
  
};

const $videoContainer = {
  width: screenWidth * 0.7,
  height: screenHeight * 0.25, // Slightly smaller than the original 0.3
  overflow: 'hidden',
  top: '5%',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 16,
};

const $videoStyle = {
  width: screenWidth * 0.7,
  height: screenHeight * 0.3, // Slightly larger than the container
  // Remove marginTop and marginLeft as we're using the container for positioning
};

const $videoOverlay = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
const $bottomContainer = Platform.select({
  ios: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: "space-around",
  },
  android: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: "space-around",
  },
});