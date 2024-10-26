// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import {
//   Animated,
//   Dimensions,
//   Platform,
//   View,
//   ImageBackground,
//   TouchableOpacity,
//   Text,
//   Image,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
// import { useSafeAreaInsetsStyle } from 'app/util/useSafeAreaInsetsStyle';
// import { useSequencer } from 'app/Context/Controller';
// import { SearchBar } from 'app/components/Reusables/SearchBar';
// import { AnimatedTextComponent } from 'app/components/Handlers/TextAnimation';
// import { CollapsingContent } from 'app/components/Reusables/CollapsableContainer';
// import { KeyboardHandler } from 'app/components/Handlers/KeyboardHandler';
// import { 
//   Gradient, 
//   GradientTypes, 
//   overlayGradient,
// } from 'app/theme/gradients';
// import { colors } from 'app/theme';

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

// const processImage = async (imageUri) => {
//   try {
//     // Process image to match the required dimensions (430x834)
//     const manipulateResult = await manipulateAsync(
//       imageUri,
//       [
//         {
//           resize: {
//             width: 430,
//             height: 834,
//           },
//         },
//       ],
//       {
//         compress: 0.8,
//         format: SaveFormat.PNG,
//       }
//     );
//     return manipulateResult.uri;
//   } catch (error) {
//     console.error('Error processing image:', error);
//     return null;
//   }
// };

// export function AuthenticatedHomeScreen() {
//   const [isAtBottom, setIsAtBottom] = useState(false);
//   const [searchBarBottom, setSearchBarBottom] = useState(0);
//   const [backgroundImage, setBackgroundImage] = useState(null);
//   const safeAreaStyleTop = useSafeAreaInsetsStyle(['top'], 'padding', { top: { ios: -1} });
//   const safeAreaStyleBottom = useSafeAreaInsetsStyle(['bottom'], 'padding', { bottom: { ios: 3, android: 7 } });
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const textOpacity = useRef(new Animated.Value(1)).current;
//   const buttonsOpacity = useRef(new Animated.Value(1)).current;
//   const { clearNavigationStack } = useSequencer();
//   const searchInputRef = useRef(null);

//   const [dismissKeyboard, setDismissKeyboard] = useState(null);
//   const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
//   const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

//   const pickImage = async () => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
//     if (permissionResult.granted === false) {
//       alert('Permission to access camera roll is required!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [430, 834],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const processedImage = await processImage(result.assets[0].uri);
//       if (processedImage) {
//         setBackgroundImage(processedImage);
//       }
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = clearNavigationStack();
//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 250,
//       useNativeDriver: false,
//     }).start();
//   }, []);

//   const onScroll = ({ nativeEvent }) => {
//     const platformAdjustment = Platform.OS === 'android' ? 50 : 150;
//     const triggerPoint = searchBarBottom - screenHeight * -0.11 + platformAdjustment;
//     const scrollPosition = nativeEvent.contentOffset.y;

//     const fadeOutDistance = 90;
//     const opacity = Math.max(0, Math.min(1, (triggerPoint - scrollPosition) / fadeOutDistance));

//     textOpacity.setValue(opacity);
//     buttonsOpacity.setValue(opacity);

//     const isPastSearchBar = scrollPosition >= triggerPoint;
//     setIsAtBottom(isPastSearchBar);
//   };

//   const handleSearchBarPress = useCallback(() => {
//     if (searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, []);

//   return (
//     <View style={{ flex: 1 }}>
//       <ImageBackground
//         source={backgroundImage ? { uri: backgroundImage } : require('../../../assets/images/backgrounds/WelcomeScreen.png')}
//         style={styles.backgroundImage}
//       />
//       <Gradient type={GradientTypes.TRANSPARENT_TO_BLACK} style={overlayGradient} />
      
//       {!backgroundImage && (
//         <TouchableOpacity 
//           style={styles.uploadButton} 
//           onPress={pickImage}
//         >
//           <Text style={styles.uploadButtonText}>Upload Background Image</Text>
//         </TouchableOpacity>
//       )}

//       <KeyboardHandler inputRef={searchInputRef}>
//         {({ dismissKeyboard, isKeyboardVisible, keyboardVerticalOffset }) => {
//           useEffect(() => {
//             setDismissKeyboard(() => dismissKeyboard);
//             setIsKeyboardVisible(isKeyboardVisible);
//             setKeyboardVerticalOffset(keyboardVerticalOffset);
//           }, [dismissKeyboard, isKeyboardVisible, keyboardVerticalOffset]);

//           return (
//             <View style={[styles.mainViewStyle, safeAreaStyleTop, safeAreaStyleBottom]}>
//               <SearchBar
//                 onPress={handleSearchBarPress}
//                 fadeAnim={fadeAnim}
//                 onLayout={(event) => {
//                   const { y, height } = event.nativeEvent.layout;
//                   setSearchBarBottom(y + height);
//                 }}
//                 inputRef={searchInputRef}
//               />

//               <View style={styles.contentContainer}>
//                 {!isKeyboardVisible && (
//                   <AnimatedTextComponent
//                     textOpacity={textOpacity}
//                     isAtBottom={isAtBottom}
//                   />
//                 )}
                
//                 <CollapsingContent
//                   isKeyboardVisible={isKeyboardVisible}
//                   keyboardVerticalOffset={keyboardVerticalOffset}
//                   onScroll={onScroll}
//                   keyboardShouldPersistTaps="handled"
//                 />
//               </View>
//             </View>
//           );
//         }}
//       </KeyboardHandler>
//     </View>
//   );
// }

// const styles = {
//   backgroundImage: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     resizeMode: 'cover',
//   },
//   mainViewStyle: {
//     flex: 1,
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   uploadButton: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     padding: 10,
//     borderRadius: 8,
//     zIndex: 1,
//   },
//   uploadButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//   },
// };