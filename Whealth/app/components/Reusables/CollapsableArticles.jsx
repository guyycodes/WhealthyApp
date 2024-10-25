import React from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native';
import { Text } from "app/components/Text";
import { colors } from "app/theme/colors";
import { spacing } from "app/theme/spacing";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const featuredContentData = [
  {
    id: '1',
    imageUrl: 'https://u-static.fotor.com/images/text-to-image/result/PRO-34a723d317be4e938c66a342d677c720.jpg',
    url: 'https:guymorganb.com',
  },
  {
    id: '2',
    imageUrl: 'https://u-static.fotor.com/images/text-to-image/result/PRO-f908de9bda2f4b188bf62af911070d75.jpg',
    url: 'https://example.com/nutrition-tips',
  },
  {
    id: '3',
    imageUrl: 'https://u-static.fotor.com/images/text-to-image/result/PRO-1730a9f9803d42be8b3f40f8db02c531.jpg',
    url: 'https://example.com/mindfulness',
  },
  {
    id: '4',
    imageUrl: 'https://u-static.fotor.com/images/text-to-image/result/PRO-cd1e1313d2714fb68ff8735de8234595.jpg',
    url: 'https://example.com/sleep-importance',
  },
  // Add more articles as needed
];

export const FeaturedContent = ({ onScroll }) => {
  const handleLearnMore = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <Text tx={"common.featuredContent"} style={styles.title}/>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={featuredContentData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <Text 
                tx={`featuredContentArticles.id${item.id}.title`} 
                style={styles.itemTitle}
              />
              <Text 
                tx={`featuredContentArticles.id${item.id}.description`} 
                style={styles.itemDescription}
              />
            </View>
            <View style={styles.learnMoreBackground}>
              <TouchableOpacity 
                style={styles.learnMoreContainer}
                onPress={() => handleLearnMore(item.url)}
              >
                <Text style={styles.learnMore}>Learn More →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    marginLeft: spacing.xxxs,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.palette.neutral100,
  },
  itemContainer: {
    width: (screenWidth - spacing.lg) * 0.8, // Reduced by 20%
    height: screenHeight * 0.3,
    marginHorizontal: spacing.xs,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: spacing.xs,
  },
  arrow: {
    fontSize: 18,
    color: colors.palette.accent100,
  },
  itemDescription: {
    fontSize: 14,
    color: colors.palette.accent100,
  },
  learnMoreBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  learnMoreContainer: {
    padding: spacing.sm,
    alignItems: 'flex-start',
  },
  learnMore: {
    color: colors.palette.primary500,
    ...Platform.select({
      ios: {
        fontWeight: '600',
        fontFamily: 'System',
      },
      android: {
        fontWeight: 'bold',
      },
    }),
    fontSize: 14,
  },
});