import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Icon } from "app/components/Icon";
import { Text } from "app/components/Text";
import { useSequencer } from 'app/Context/Controller';
import { colors } from "app/theme/colors";
import { spacing } from "app/theme/spacing";
// get the height and width
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// array to manage the FlatList at the bottom of the component
const citiesData = [
  {
    cityName: 'Denver',
    imageUrl: require('../../../assets/images/Denver.jpg'),
  },
  {
    cityName: 'McAllen',
    imageUrl: require('../../../assets/images/McAllen.jpg'),
  },
  {
    cityName: 'San Francisco',
    imageUrl: require('../../../assets/images/SF.jpg'),
  },
  {
    cityName: 'Dallas',
    imageUrl: require('../../../assets/images/Dallas.jpg'),
  },
];

export function PrimaryWelcomeScreen(props) {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [searchBarBottom, setSearchBarBottom] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { clearNavigationStack } = useSequencer()

  useEffect(() => { /// prevents backwards navigation by clearing the stack navigator of previous screens
    const unsubscribe = clearNavigationStack();
    return unsubscribe;
  }, []);
  
  const openSearchScreen = () => {
    console.log("open search screen not defined yet");
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, []);

  const onScroll = ({ nativeEvent }) => {
    const platformAdjustment = Platform.OS === 'android' ? 60 : 0;
        // `searchBarBottom` represents the Y position of the search bar's bottom edge.
    // Subtracting `(screenHeight * -.39)` means you're triggering the effect slightly before
    // reaching the actual bottom of the search bar, based on a percentage of the screen height.
    const isPastSearchBar = nativeEvent.contentOffset.y >= searchBarBottom - (screenHeight * -.38) + platformAdjustment;
    if (isPastSearchBar) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: false,
      }).start();
    } 
    setIsAtBottom(isPastSearchBar);
  };

  return (
    <View style={$mainViewStyle}>
      <TouchableOpacity 
        onPress={openSearchScreen} 
        style={[isAtBottom ? $searchBarContainerScroll : $searchBarContainer]} 
        onLayout={(event) => {
          const {y, height} = event.nativeEvent.layout;
          setSearchBarBottom(y + height);
        }}
      >
        {/* for the animation of the search bar */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={[isAtBottom ? $searchBarWrapperScroll : $searchBarWrapper]}>
            <View pointerEvents="none" style={$searchBar}>
              <TextInput 
                placeholder="Search by Vehicle or Location"
                editable={false} // Non-editable, just for show
                style={{flex: 1}}
              />
            </View>
            <Icon icon="searchIcon" size={30} />
          </View>
        </Animated.View>
      </TouchableOpacity>
      {/* Main Image */}
      <View style={$image_text}>
        <Image
          source={{ uri: 'https://imgur.com/EFe4spv.jpg' }}
          style={$imageStyle}
        />
        {/* Text under the image */}
        <View style={$headerText}>
          <Text> Discover your next move...</Text>
        </View>
      </View>
      {/* Scrollable Content The Collapsable header starts here*/}
      <ScrollView 
        style={$scrollViewStyle}
        nestedScrollEnabled={true}
        onScroll={onScroll} 
        scrollEventThrottle={16}
      >
      {/* This empty view is used to push the content down so it starts after the image */}
        <View style={$emptyView} />
        <View style={$contentContainer}>
        {/* first line */}
        <View style={$line}>
        <Image source={{ uri: 'https://imgur.com/blNg8sm.png' }} style={$lineImage}/>
            <Text style={$lineText}>
            <Text weight="bold" style={$headline}>We're your 24/7</Text>:{'\n'}
            <Text size='xs'>
              We offer a wide range of services, including vehicle maintenance, roadside assistance, and more.
              There's peace of mind knowing that everyone on Seraph is screened, and we are here for you 24/7 with roadside coverage, maintenance, and account support.
            </Text>
            </Text>
        </View>
          {/* Second line */}
        <View style={$line}>
        <Image source={{ uri: 'https://imgur.com/uVVHn54.png' }} style={$lineImage} />
            <Text style={$lineText}><Text weight="bold" style={$headline}>Drive with assurance</Text>:{'\n'}
            <Text size='xs'>
              With a wide selection of subscription options, not only will you be able to access flexible vehicle options but you’ll be fully covered in the event of an emergency.</Text>
            </Text>
        </View>
          {/* Third line */}
        <View style={$line}>
          <Image source={{ uri: 'https://imgur.com/BTAeSuX.jpg' }}
            style={$lineImage}
            />
            <Text style={$lineText}><Text weight="bold" style={$headline}>Preserve Wealth</Text>:{'\n'}
              <Text size='xs'>
              The American Automobile Association (AAA) reported that the average annual cost to own and operate a new vehicle was $9,666 in 2021, translating to approximately $805 per month and within 5 years a vehicle can depreciates up to 60%.
              </Text>
            </Text>
        </View>
          {/* Fourth line */}
        <View style={$line}>
          <Image source={{ uri: 'https://imgur.com/Ib5LXDK.jpg' }}
            style={$lineImage}
            />
              <Text style={$lineText}>
                <Text weight="bold" style={$headline}>Give the gift of drive</Text>:{'\n'}<Text size="xs">
                  Move someone you care about, explore our gift cards for a great way to make someones next drive extra memorable.
                </Text>
              </Text>
        </View>

        {/* Featured Autoblog */}
        <View style={$blogContainer}>
          <View style={$blogTextContainer}>
                <Text style={$blogText}> Featured AutoBlog: </Text>
          </View>
          <View style={$featuredAutoblogContainer}>
            <Image
              source={{ uri: 'https://imgur.com/xfqsUt1.jpg' }}
              style={$featuredAutoblogImage}
            />
            <View style={$descriptionContainer}>
              <Text style={$featuredAutoblogText}> <Text weight="bold" style={$headline} >This week</Text>:{'\n'}“Auto suscription is the future”<Text style={$learnMore}>{'\n'}Learn More</Text></Text>
            </View>
          </View>
        </View>

        {/* Browse by City */}
        <View style={$browseByCity}>
                <Text weight="bold" style={$city}> Browse by City: </Text>
          </View>
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={citiesData} // You'll need to define this array
          renderItem={({ item }) => (
            <View style={$shadowWrapper}>
            <View style={$cityContainer}>
              <Image source={item.imageUrl} style={$cityImage} />
              <Text style={$cityText}>{item.cityName}</Text>
            </View>
            </View>
          )}
        />
        </View>
      </ScrollView>
    </View>
    );
  };


  const $mainViewStyle = {
    flex: 1,
    backgroundColor: 'white',
  };
 
  const $searchBarContainer = Platform.select({
    ios: {
      paddingVertical: spacing.xs,
      top: spacing.xxl, 
      width: '100%',
      paddingHorizontal: spacing.sm, 
    },
    android: {
      paddingBottom: spacing.xs,
      paddingTop: spacing.lg,
      width: '100%',
      paddingHorizontal: spacing.sm
    }
  });

  const $searchBarContainerScroll = Platform.select({
    ios: {
      paddingVertical: spacing.xs,
      zIndex: 3, 
      top: spacing.xxl, 
      width: '100%', 
      paddingHorizontal: spacing.md,
      borderBottomWidth: 2,
      borderColor: 'black',
      borderStyle: 'solid',
      backgroundColor:colors.palette.secondary300,
    },
    android: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.xs,
      width: '100%',
      paddingHorizontal: spacing.md,
      borderBottomWidth: 2,
      backgroundColor:colors.palette.secondary300
    },
  })

  const $searchBarWrapper = Platform.select({
    ios: {
      marginTop:spacing.xxxs,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white', 
      borderRadius: spacing.sm, 
      borderWidth: 1,
      borderColor: '#000',
    },
    android: {
      marginTop:spacing.xxs,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white', 
      borderRadius: spacing.sm, 
      borderWidth: 1, 
      borderColor: '#000', 
    },
  })

  const $searchBarWrapperScroll = Platform.select({
    ios: {
      marginTop:spacing.xxxs,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white', 
      borderRadius: spacing.sm, 
    },
    android: {
      marginTop:spacing.xxs,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white', 
      borderRadius: spacing.sm, 
    },
  })

  const $searchBar = Platform.select({
    ios: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: spacing.sm, 
      height: screenHeight * 0.055, 
      paddingLeft: spacing.md, 
    },
    android: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: spacing.sm, 
      height: screenHeight * 0.055, 
      paddingLeft: spacing.md, 
    },
  })
  const $searchIcon = {
    position: 'absolute',
    right: 10, // Adjust the left value as needed to position the icon inside the search bar
    zIndex: 1,
  };
  // set the image the header will scroll above
  const $imageStyle = {
    width: '100%',
    aspectRatio: 1.2,
    height: screenHeight - (screenHeight * 0.55), // Adjust to the height of your image
    position:'absolute', // position absolute is important
    ...Platform.select({
      ios: { top: 48 },
      android: {}, // No additional padding for Android
    }),
  };
  
  const $scrollViewStyle = {
    flex: 1,
  };
  
  const $contentContainer = {
    padding: 20,
    backgroundColor: '#ffffff', // Use a background color to cover the image as you scroll
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  };
  // empty view that pushes down the scroll tab making the collapsable header
  const $emptyView = {
    height: screenHeight * 0.55, // creates the collapsable header
  }
  // controls the text beneith the image
  const $headerText = Platform.select({
    ios: {
      backgroundColor: '#e8f5e9', // Example light green color, replace with colors.palette.overlay20 if you have it defined
      padding: 8,
      top: screenHeight - (screenHeight*.498),
      width:screenWidth,
      borderRadius: 8,
      alignItems: 'center', // Center child components horizontally
      justifyContent: 'center'
    },
    android: {
      backgroundColor: '#e8f5e9', // Example light green color, replace with colors.palette.overlay20 if you have it defined
      padding: 8,
      position:'absolute',
      width:screenWidth,
      top: screenHeight - (screenHeight*.549),
      borderRadius: 8,
      alignItems: 'center', // Center child components horizontally
      justifyContent: 'center'
    },
  })

  const $headline = {
    fontWeight: 'bold',
  }
  // layout of the images in line with the text
  const $line = {
    flexDirection: 'row',
    alignItems: 'center', // Aligns items vertically within the container
    paddingVertical: spacing.xl, // padding between items
  };

  const $lineImage = {
    width: 40, 
    height: 40, 
    marginRight: 10, 
    paddingBottom: 1, 
    
  };
  // controls the lines with the image on the left
  const $lineText = {
    flex: 1, 
  };

  const $featuredAutoblogContainer = {
    // ... featured autoblog container styles
    alignItems: 'center',
  };
  // controls the blog section
  const $featuredAutoblogImage = {
    width: 250,
    height: 200, 
    marginRight: 10, 
    paddingBottom: 1,
    borderRadius: 8,
    right: 45,
  };
  
  const $blogTextContainer = {
    backgroundColor: '#e8f5e9', // Example light green color
    paddingVertical: spacing.lg,
    borderRadius: 8,
    alignItems: 'baseline', 
    justifyContent: 'center',
    marginBottom:spacing.lg,
  }

  const $blogText = {
    position:'absolute',
    left:10,
    bottom:-10,
    fontSize:22,
  }

  const $featuredAutoblogText = {
    margin:spacing.sm,
  };

  const $descriptionContainer = {
    width: screenWidth - (screenWidth *.6), 
    position: 'absolute',
    backgroundColor: '#e8f5e9', // Example light green color
    borderRadius:8,
    left: screenWidth - (screenWidth *.55),
    top: 100,
  }

  const $learnMore ={
    color:'#009688',
    textDecorationLine:'underline',
    fontWeight:'bold',
    fontSize:14,
  }
  
  const $browseByCity = {
    paddingVertical: spacing.md,
  }

  // controls the city card
  const $cityContainer = {
    width: screenWidth * 0.4, 
    height: screenHeight * 0.3, 
    marginHorizontal: screenWidth * 0.02, 
    marginVertical: screenHeight * 0.02, // Add some space between the cards
    borderRadius: 10, // Rounded corners for the card
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 4 }, // Shadow direction and distance
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 10, // Blur radius
    elevation: 7, // Elevation for Android
    alignItems: 'center', // Center items horizontally in the container
    justifyContent: 'center', // Center items vertically in the container
  };

  const $cityImage = {
    width: '100%', 
    height: '80%', 
    resizeMode: 'cover',
  };

  // this wraper helps enforce shadow styling for iOS
  const $shadowWrapper = Platform.select({
    ios: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      marginHorizontal: screenWidth * 0.02,
      borderRadius: 10,
    },
    android: {

    },
  })

  const $image_text = Platform.select({
    ios: {
      width: '100%', 
      alignItems: 'center',
    },
    android: {
      width: '100%',
    },
  })
  const $city = {

  }

  const $blogContainer = {

  }
  
  const $cityText = {
    
  };
  

  // const $iconShadow = Platform.select({
//     ios: {
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.9,
//       shadowRadius: 10,
//       marginHorizontal: screenWidth * 0.02,
//     },
//     android: {
//       // Android shadow styles
//     },
// })
