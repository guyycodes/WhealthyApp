import React, { forwardRef } from 'react';
import { Platform, TextInput, View, StyleSheet, Dimensions } from 'react-native';
import { Icon } from 'app/components/Icon';
import { colors } from 'app/theme/colors';
import { spacing } from 'app/theme/spacing';
import {
  FrostedGlassContainer,
  Gradient,
  GradientTypes,
  overlaySearchBar,
} from 'app/theme/gradients';

const screenHeight = Dimensions.get('window').height;

export const SearchBarInput = forwardRef(({ value, onChangeText, onSubmitEditing }, ref) => {
  return (
    <View style={styles.searchBarContainer}>
      {Platform.OS === 'ios' ? (
        <FrostedGlassContainer style={styles.searchBarBackground}>
          <View style={styles.searchBarWrapper}>
            <Icon icon="searchIcon" size={24} color={colors.palette.neutral100} style={styles.searchIcon} />
            <TextInput
              editable={true}
              ref={ref}
              style={styles.searchInput}
              value={value}
              onChangeText={onChangeText}
              placeholder="Search..."
              placeholderTextColor={colors.palette.neutral400}
              onSubmitEditing={onSubmitEditing}
              onFocus={() => {
                console.log('TextInput focused');
              }}
            />
          </View>
        </FrostedGlassContainer>
      ) : (
        <Gradient type={GradientTypes.TRANSPARENT_GRAY_TO_BLACK} style={overlaySearchBar}>
          <View style={styles.searchBarWrapper}>
            <Icon icon="searchIcon" size={24} color={colors.palette.neutral100} style={styles.searchIcon} />
            <TextInput
              editable={true}
              ref={ref}
              style={styles.searchInput}
              value={value}
              onChangeText={onChangeText}
              placeholder="Search..."
              placeholderTextColor={colors.palette.neutral400}
              onSubmitEditing={onSubmitEditing}
              onFocus={() => {
                console.log('TextInput focused');
              }}
            />
          </View>
        </Gradient>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  searchBarContainer: Platform.select({
    ios: {
      width: '100%',
    },
    android: {
      width: '100%',
    },
  }),
  searchBarBackground: {
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  searchBarWrapper: Platform.select({
    ios: {
      flexDirection: 'row',
      alignItems: 'center',
      height: screenHeight * 0.05,
      paddingHorizontal: spacing.sm,
    },
    android: {
      flexDirection: 'row',
      alignItems: 'center',
      height: screenHeight * 0.05,
      paddingHorizontal: spacing.sm,
      bottom: '5%'
    },
  }),
  searchInput: Platform.select({
    ios: {
      flex: 1,
      height: '100%',
      color: colors.palette.neutral100,
      fontSize: 16,
      marginLeft: spacing.xs,
    },
    android: {
      flex: 1,
      height: '100%',
      color: colors.palette.neutral100,
      fontSize: 16,
      marginLeft: spacing.xs,
    },
  }),
  searchIcon: {
    marginRight: spacing.xxs,
  },
});