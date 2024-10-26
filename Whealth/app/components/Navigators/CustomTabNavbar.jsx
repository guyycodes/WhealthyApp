import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsetsStyle } from 'app/util/useSafeAreaInsetsStyle';
import { Icon } from 'app/components/Icon';
import { colors } from 'app/theme/colors';
import { Text } from 'app/components/Text';
import { useSequencer } from 'app/Context/Controller';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const tabBarHeight = Platform.OS === 'ios' ? 73 : 65; 

const CurvedBottomBar = ({ children }) => (
  <View style={styles.curvedBarContainer}>
    <Svg
      width={screenWidth + 1} // Add 1 to the width
      height={tabBarHeight}
      viewBox={`0 0 ${screenWidth + 1} ${tabBarHeight}`} // Update viewBox
      style={styles.curvedBarSvg}
    >
      <Path
        d={`M0,0 
           C${screenWidth * 0.1},0 ${screenWidth * 0.3},0 ${screenWidth * 0.35},0 
           C${screenWidth * 0.4},0 ${screenWidth * 0.45},${tabBarHeight / 2} ${screenWidth * 0.5},${tabBarHeight / 2} 
           C${screenWidth * 0.55},${tabBarHeight / 2} ${screenWidth * 0.6},0 ${screenWidth * 0.65},0
           C${screenWidth * 0.7},0 ${screenWidth * 0.9},0 ${screenWidth},0 
           L${screenWidth},${tabBarHeight} L0,${tabBarHeight} Z`}
        fill="#1E1E1E"
      />
    </Svg>
    {children}
  </View>
);

export function BottomTabNavigator() {
  const router = useRouter();
  const currentPath = usePathname();
  const safeAreaStyle = useSafeAreaInsetsStyle(['end'], 'padding');
  const { getToken, checkAndRefreshToken } = useSequencer();

  const tabs = [
    { nameTx: 'tabsNavigator.home', icon: 'homeIcon', path: '/(tabs)/home' },
    { nameTx: 'tabsNavigator.visuals', icon: 'visuals', path: '/(tabs)/visuals' },
    { nameTx: 'tabsNavigator.ai', icon: 'ai', path: '/(tabs)/ai' },
    { nameTx: 'tabsNavigator.featured_content', icon: 'article', path: '/(tabs)/featured_content' },
    { nameTx: 'tabsNavigator.profile', icon: 'profile', path: '/(tabs)/profile' },
  ];

  const handleNavigation = async (path) => {
    try {
      const token = await getToken();
      if (!token) {
        router.push('/(login)');
        return;
      }

      const isTokenValid = await checkAndRefreshToken();
      if (isTokenValid) {
        router.push('/(login)');
        // router.replace(path);
      } else {
        router.push('/(login)');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.push('/(login)');
    }
  };

  return (
    <View style={[styles.outerContainer, safeAreaStyle]}>
      <CurvedBottomBar>
        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => {
            const isFocused = currentPath === tab.path;
            const isMiddleTab = index === Math.floor(tabs.length / 2);

            return (
              <TouchableOpacity
                key={tab.path}
                onPress={() => handleNavigation(tab.path)}
                style={[
                  styles.tab,
                  isMiddleTab && styles.middleTab,
                  isFocused && styles.focusedTab,
                ]}
              >
                <Icon
                  icon={tab.icon}
                  size={isMiddleTab ? 90 : 28}
                  style={[
                    !isMiddleTab && styles.regularTabIcon,
                    isMiddleTab && styles.middleTabIcon
                  ]}
                  color={
                    !isMiddleTab
                      ? isFocused
                        ? colors.palette.neutral100
                        : colors.palette.neutral200
                      : undefined
                  }
                />
                {isFocused && !isMiddleTab && (
                  <View style={styles.focusIndicator} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </CurvedBottomBar>
    </View>
  );
}


const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  curvedBarContainer: {
    height: tabBarHeight,
    position: 'relative',
  },
  curvedBarSvg: {
    position: 'absolute',
    bottom: 0,
    left: 1, // Shift the SVG slightly to the left
  },
  tabContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: tabBarHeight - 10,
    paddingBottom: 5,
    paddingHorizontal: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleTab: {
    backgroundColor: '#2A9D8F',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? -(tabBarHeight / 2) + 10 : -(tabBarHeight / 2) + 15, // Adjusted to move down by 10 units
    shadowColor: "#2A9D8F",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  focusedTab: {
    // Add any specific styles for focused tabs if needed
  },
  focusIndicator: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  regularTabIcon: {
    transform: [
      { translateY: -10 }, // Adjust this value to move icons up or down
    ],
  },
  middleTabIcon: {
    transform: [
      { translateY: -2 },
      { translateX: -3 }
    ],
  },
});

export default BottomTabNavigator;