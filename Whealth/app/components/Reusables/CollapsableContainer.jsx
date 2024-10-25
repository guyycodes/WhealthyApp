// CollapsableContainer.jsx
import React, { useEffect, useRef }  from 'react';
import {
  ScrollView,
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { Text } from 'app/components/Text';
import { spacing } from 'app/theme/spacing';
import {
    DottedLineSeparator,
    FrostedGlassContainer,
  } from 'app/theme/gradients';
import { FrostedGlassContent } from './CollapsableFrostedText';
import { CityBrowser } from './CollapsableCitiesBrowser';
import { FeaturedContent } from './CollapsableArticles'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export const CollapsingContent = ({
  keyboardShouldPersistTaps,
  onScroll,
  }) => {

  return(

      <ScrollView 
        style={styles.scrollViewStyle}
        nestedScrollEnabled={true}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
          <View style={styles.emptyView} />
          <View style={styles.contentContainer}>

      {/* section will changed based on scroll behavior */}


      {/* 4 points explaining the App */}
          <FrostedGlassContainer style={styles.frostedGlassContent}>
            <FrostedGlassContent />
          </FrostedGlassContainer>

      {/* Health and Fitness Articles */}
          <FeaturedContent />

      {/* Browse trending health and fitness by city */}
          <CityBrowser/>

        </View>
      </ScrollView>

  )};
  

const styles = StyleSheet.create({
  scrollViewStyle: {
    flex: 1,
    
  },
  frostedGlassContent: Platform.select({
    ios: {
      width: '90%',
      marginHorizontal: '5%',
      marginBottom: 5,
      paddingHorizontal: 10,
    },
    android: {
      width: '90%',
      marginHorizontal: '5%',
      marginBottom: 2,
      paddingHorizontal: 10,
      height: '190%', // controls the height of the frosted glass
      alignItems: 'center',
      justifyContent: 'center',
      bottom: '100%',
    },
  }),
  searchBarWrapperScroll: Platform.select({
    ios: {
      marginTop: spacing.xxxs,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white', 
      borderRadius: spacing.sm, 
    },
    android: {
      marginTop: spacing.xxs,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white', 
      borderRadius: spacing.sm, 
    },
  }),
  image_text: Platform.select({
    ios: {
      width: '100%', 
      alignItems: 'center',
      position: 'absolute',
      
    },
    android: {
      width: '100%',
      position: 'absolute',
      alignItems: 'center',
      
    },
  }),
  contentContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 20,
  },
  emptyView: Platform.select({
    ios: {
      height: screenHeight * 0.45,
    },
    android: {
      height: screenHeight * 1.55,
    },
  }),
});