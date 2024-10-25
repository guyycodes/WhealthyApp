// File: app/components/CityBrowser.js
import React from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, Linking} from 'react-native';
import { Text } from "app/components/Text";
import { spacing } from "app/theme/spacing";
import { colors } from "app/theme/colors";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const citiesData = [
  {
    cityName: 'Denver',
    imageUrl: require('../../../assets/images/Denver.png'),
    webUrl: 'https://www.denvergov.org/',
  },
  {
    cityName: 'McAllen',
    imageUrl: require('../../../assets/images/McAllen.png'),
    webUrl: 'https://www.mcallen.net/',
  },
  {
    cityName: 'Corpus Christi',
    imageUrl: require('../../../assets/images/CorpusChristi.png'),
    webUrl: 'https://www.cctexas.com/',
  },
  {
    cityName: 'Miami',
    imageUrl: require('../../../assets/images/Miami.png'),
    webUrl: 'https://www.miamigov.com/',
  },
  {
    cityName: 'Los Angeles',
    imageUrl: require('../../../assets/images/Los_Angeles.png'),
    webUrl: 'https://www.lacity.org/',
  },
  {
    cityName: 'SanAntonio',
    imageUrl: require('../../../assets/images/SanAntonio.png'),
    webUrl: 'https://www.sanantonio.gov/',
  },
  {
    cityName: 'Boulder',
    imageUrl: require('../../../assets/images/Boulder.png'),
    webUrl: 'https://www.sanantonio.gov/',
  },
  {
    cityName: 'Aurora',
    imageUrl: require('../../../assets/images/Aurora.png'),
    webUrl: 'https://www.sanantonio.gov/',
  },
];

export const CityBrowser = () => {
  const handleCityPress = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <View>
      <View style={styles.browseByCity}>
        <Text tx={'common.browseCities'} weight="bold" style={styles.title}/>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={citiesData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCityPress(item.webUrl)}>
            <View style={styles.cityContainer}>
              <Image source={item.imageUrl} style={styles.cityImage} />
              <Text style={styles.cityText}>{item.cityName}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.cityName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  browseByCity: {
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    marginLeft: 10,
    color: colors.palette.secondary100
  },
  cityContainer: {
    width: screenWidth * 0.25,
    marginHorizontal: screenWidth * 0.02,
    alignItems: 'center',
    marginBottom: spacing.lg, // Added bottom margin to increase space beneath images
  },
  cityImage: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    resizeMode: 'contain',
    marginBottom: spacing.xxxs, // Added margin to create space between image and text
  },
  cityText: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.palette.secondary100
  },
});