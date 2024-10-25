import React from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native';
import {
    FrostedGlassContainer,
    Gradient,
    GradientTypes,
    overlayGoalsBar,
  } from 'app/theme/gradients';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = ['#E2D2EE', '#CC12CC', '#F24FF2', '#FF5C75'];

const DailyGoal = ({ day, dayNumber, progress, isCurrentDay, onPress }) => {
  const radius = 14;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const fillPercentage = Math.min(progress, 1);
  const strokeDashoffset = circumference * (1 - fillPercentage);
  
  const opacity = isCurrentDay ? 1 : 0.5;

  return (
    <TouchableOpacity onPress={onPress} style={styles.dailyGoalContainer}>
      <Svg height={radius * 2 + strokeWidth} width={radius * 2 + strokeWidth}>
        <Circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke={COLORS[Math.floor(progress * (COLORS.length - 1))]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={[styles.dayNumber, { opacity }]}>{dayNumber}</Text>
      <Text style={[styles.dayText, { opacity }]}>{day}</Text>
    </TouchableOpacity>
  );
};

export const DailyGoalTracker = ({ weeklyProgress }) => {
  const router = useRouter();
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const currentWeekDays = DAYS.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - currentDayIndex + index);
    return {
      day,
      dayNumber: date.getDate(),
      isCurrentDay: index === currentDayIndex,
    };
  });

  const handleDayPress = () => {
    router.push('/(login)');
    console.log('Day pressed');
  };

  return (
    <>
      {Platform.OS === 'ios' ? (
        <FrostedGlassContainer style={styles.container}>
          <Text style={styles.title}>Daily Goal</Text>
          <View style={styles.goalsContainer}>
            {currentWeekDays.map((dayInfo, index) => (
              <DailyGoal
                key={dayInfo.day}
                day={dayInfo.day}
                dayNumber={dayInfo.dayNumber}
                progress={weeklyProgress[index]}
                isCurrentDay={dayInfo.isCurrentDay}
                onPress={handleDayPress}
              />
            ))}
          </View>
        </FrostedGlassContainer>
      ) : (
        <Gradient type={GradientTypes.TRANSPARENT_GRAY_TO_BLACK} style={[styles.container, overlayGoalsBar]}>
          <Text style={styles.title}>Daily Goal</Text>
          <View style={styles.goalsContainer}>
            {currentWeekDays.map((dayInfo, index) => (
              <DailyGoal
                key={dayInfo.day}
                day={dayInfo.day}
                dayNumber={dayInfo.dayNumber}
                progress={weeklyProgress[index]}
                isCurrentDay={dayInfo.isCurrentDay}
                onPress={handleDayPress}
              />
            ))}
          </View>
        </Gradient>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: Platform.select({
    ios: {
        borderRadius: 20,
        overflow: 'hidden',
      
    },
    android: {
        borderRadius: 20,
        overflow: 'hidden',
    },
  }),
  title: Platform.select({ // controls the text 'Daily Goal'
    ios: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
        top: 0,
        left: '6%'
      },
      android: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
        position: 'absolute',
        left: '6%',
        zIndex: 1
      },
  }),
  goalsContainer:Platform.select({
    ios: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        top: '3%'
        
    },
    android: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
        position: 'absolute',
        zIndex: 1,
        
    },
  }),
  dailyGoalContainer: Platform.select({ // moves the entire row of elements around
    ios: { 
        alignItems: 'center',
        marginHorizontal: 10,
        bottom: '3%'
      
    },
    android: { // moves the entire row of elements around
        alignItems: 'center',
        marginHorizontal: 10,
        top: '5%'
    },
  }),
  dayNumber:Platform.select({ // moves the day numbers around
    ios: {
        position: 'absolute',
        top: '17%',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
      
    },
    android: { // moves the day numbers around
        position: 'absolute',
        top: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
  }),
  dayText: Platform.select({  // moves the day text around
    ios: {
        fontSize: 10,
        color: '#FFFFFF',
    },
    android: {  // moves the day text around
        fontSize: 10,
        color: '#FFFFFF',
    },
  }),
});
