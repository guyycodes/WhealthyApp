// CollapsibleFrostedText.jsx
import React, {useRef, useEffect} from 'react';
import { View, StyleSheet, Platform, Linking, Animated} from 'react-native';
import { Text } from "app/components/Text";
import { Icon } from "app/components/Icon"; 
import { spacing } from "app/theme/spacing";
import { colors } from "app/theme/colors";
import { DottedLineSeparator } from 'app/theme/gradients'
import { useRouter } from 'expo-router';

const contentData = [
  {
    iconName: 'twentyFourSeven',
    headlineTx: "frostedGlassContent.ai.headline",
    contentTx: "frostedGlassContent.ai.description",
    url: 'https://www.example.com/gift',
  },
  {
    iconName: 'assurance',
    headlineTx: "frostedGlassContent.assurance.headline",
    contentTx: "frostedGlassContent.assurance.description",
    url: 'https://www.example.com/gift',
  },
  {
    iconName: 'health',
    headlineTx: "frostedGlassContent.health.headline",
    contentTx: "frostedGlassContent.health.description",
    url: 'https://www.example.com/gift',
  },
  {
    iconName: 'gift',
    headlineTx: "frostedGlassContent.gift.headline",
    contentTx: "frostedGlassContent.gift.description",
    url: 'https://www.example.com/gift',
  }
];
/**
 * Function to open URLs using React Native's Linking API
 * @param {string} url - The URL to open
 */
const openURL = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open URI: ${url}`);
      // Optionally, you can alert the user
      // Alert.alert("Error", "Unable to open the link.");
    }
  } catch (error) {
    console.error('An error occurred while opening the URL:', error);
    // Optionally, alert the user
    // Alert.alert("Error", "An unexpected error occurred.");
  }
};

const ColorfulTabCarrot = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      })
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: ["#FFBB50", "#B94F5C", "#B94F5C", '#d4af37']
  });

  return (
    <View style={styles.tabCarrotContainer}>
      <Animated.View style={[styles.tabCarrot, { backgroundColor }]} />
    </View>
  );
};

export const FrostedGlassContent = () => {
  const router = useRouter();

  const handleGetStarted = (headlineTx) => {
    switch (headlineTx) {
      case "frostedGlassContent.ai.headline":
        router.push('/(welcome)/ai');
        break;
      case "frostedGlassContent.gift.headline":
        router.push('/(welcome)/giftCards');
        break;
      case "frostedGlassContent.assurance.headline":
        router.push('/(welcome)/community');
        break;
      default:
        router.push('/(login)');
    }
  };

  const getButtonText = (item) => {
    switch (item) {
      case "frostedGlassContent.ai.headline":
        return 'common.ai';
      case "frostedGlassContent.health.headline":
        return 'common.health';
      case "frostedGlassContent.assurance.headline":
        return 'common.assurance';
      case "frostedGlassContent.gift.headline":
        return 'common.gift';
      default:
        return 'common.getStarted';
    }
  };

  return(
  <View style={styles.container}>
    <ColorfulTabCarrot />
    {contentData.map((item, index) => (
      <React.Fragment key={index}>
        <View style={styles.line}>
          <View style={styles.headlineContainer}>
            <Icon icon={item.iconName} style={styles.lineIcon} />
            <Text tx={item.headlineTx} weight="bold" style={[styles.headline, styles.platformSpecificText]} />
          </View>
          <View style={styles.contentContainer}>
            <Text tx={item.contentTx} size='xs' style={[styles.content, styles.platformSpecificText]} />
            <View style={styles.getStartedContainer}>
              <Text 
                style={styles.getStarted} 
                onPress={() => handleGetStarted(item.headlineTx)}
                tx={getButtonText(item.headlineTx)}
              />
              <Text style={styles.getStartedArrow}> → </Text>
            </View>
          </View>
        </View>
        {index < contentData.length - 1 && <DottedLineSeparator style={styles.separator} />}
      </React.Fragment>
    ))}
  </View>
  )
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  tabCarrotContainer: {
    position: 'absolute',
    top: -15,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  tabCarrot: {
    width: 60,
    height: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  line: {
    paddingVertical: spacing.md,
  },
  headlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  lineIcon: {
    width: 30, 
    height: 30, 
    marginRight: 10, 
  },
  headline: {
    fontWeight: 'bold',
    flex: 1,
  },
  contentContainer: {
    width: '100%',
  },
  content: {
    marginBottom: spacing.xs,
  },
  getStartedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  getStarted: {
    color: colors.palette.accent500,
    textDecorationLine: 'underline',
  },
  getStartedArrow: {
    color: colors.palette.accent500,
  },
  platformSpecificText: {
    ...Platform.select({
      ios: {
        color: colors.palette.neutral100,
      },
      android: {
        color: colors.palette.neutral100,
      },
    }),
  },
  separator: {
    marginVertical: spacing.xs,
  },
});