import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { colors } from 'app/theme/colors';
import { useStores } from 'app/Models/Stores/index';
import { observer } from "mobx-react-lite";

// Custom Tab Bar Component
export const CustomTabBar = observer(({ state, descriptors, navigation }) => {
    // Calculate the Pay button's position dynamically
    const tabWidth = 100 / state.routes.length; // Percentage width for each tab
    const driveButtonIndex = state.routes.findIndex(route => route.name === 'favorites');
    
    const { authenticationStore } = useStores();
  
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: 'transparent', // Ensure the tabBar background is transparent
                paddingTop: Platform.OS === 'ios' ? 10 : 10,
                height: Platform.OS === 'ios' ? 85 : 100,
                paddingBottom: Platform.OS === 'android' ? 20 : 20,
                position: 'relative',
            }}
        >
            {/* Mapping over routes to render tabs */}
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const isDriveTab = route.name === 'Drive';

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        // Check if the route requires authentication
                        if (!isAuthenticated) {
                            navigation.navigate('LoginSequence');
                        } else {
                            navigation.navigate(route.name);
                        }
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.name}
                        onPress={onPress}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1, // Ensure touchable tabs are above the background
                            ...(isDriveTab && {
                                position: 'absolute',
                                top: -25, // Adjust the top position of the Pay button
                                left: `${driveButtonIndex * tabWidth}%`,
                                width: `${tabWidth}%`,
                            }),
                            ...(index === driveButtonIndex - 1 || index === driveButtonIndex + 1) && {
                                paddingHorizontal: 10, // Add horizontal padding to the icons next to the drive icon
                            },
                        }}
                    >
                        {options.tabBarIcon && options.tabBarIcon({
                            focused: isFocused,
                            color: isFocused ? "rgb(0, 184, 148)" : colors.palette.neutral700,
                            size: 4,
                        })}  
                        {/* Render the text below the icons */}
                        <Text
                            style={{
                                color: isFocused ? "rgb(0, 184, 148)" : colors.palette.neutral700,
                                textAlign: 'center',
                                fontSize: 12,
                            }}
                        >
                            {typeof options.tabBarLabel === 'function'
                                ? options.tabBarLabel({
                                    focused: isFocused,
                                    color: isFocused ? "rgb(0, 184, 148)" : colors.palette.neutral700,
                                    position: 'beside-icon',
                                    children: ''
                                })
                                : options.tabBarLabel}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
});

export default CustomTabBar;