import React, { useState, useEffect, forwardRef } from 'react';
import { Platform, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'app/components/Icon';
import { Text } from 'app/components/Text';
import { colors } from 'app/theme/colors';
import { spacing } from 'app/theme/spacing';
import { DailyGoalTracker } from './GoalTrackerBar';
import { SearchBarInput } from './SearchBarInput';
import { useRouter } from 'expo-router';

const fakeWeeklyProgress = [1.0, 0.4, 1.0, 0.2, 0.0, 0.0, 0.0];

const screenHeight = Dimensions.get('window').height;

export const SearchBar = forwardRef(({
  handleSearchBarPress,
  onLayout,
  ...props 
}, ref) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [showGoalTracker, setShowGoalTracker] = useState(true);
  const [userName, setUsername] = useState('false');
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    console.log('Search text:', searchText);
    // search logic here
  };

  const handlePress = () => {
    router.push('/(login)');
    setNotifications(!notifications)
  };

  const handleAvatarPress = () => {
    router.push('/(login)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={handleAvatarPress} style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text 
            style={styles.greeting} 
            tx="common.greeting"
            txOptions={{
              userName: userName,
              currentTime: currentTime.toLocaleString()
            }}
          />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handlePress}>
            <Icon icon="settings" size={35} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePress}>
            <Icon 
              icon={notifications ? "notification_true" : "notification_false"} 
              size={35} 
              style={styles.icon} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {!showGoalTracker && 
      <View onLayout={onLayout}>
        <SearchBarInput
          ref={ref}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
      </View>}
      {showGoalTracker && <DailyGoalTracker weeklyProgress={fakeWeeklyProgress} />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: Platform.select({
    ios: {
      width: '100%',
      paddingHorizontal: spacing.xs,
      height: screenHeight * 0.11,
    },
    android: {
      width: '100%',
      paddingHorizontal: spacing.xs,
      height: screenHeight * 0.1315,
    },
  }),
  topRow: Platform.select({
    ios: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xxxs,
    },
    android: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xxs,
    },
  }),
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.palette.neutral300,
    marginRight: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    color: colors.palette.neutral100,
  },
  greeting: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.palette.neutral100,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: -spacing.xxs, // Reduced spacing between icons
  },
});