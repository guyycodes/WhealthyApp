import { Stack } from 'expo-router';
import { BottomTabs } from 'app/components/Navigators/WithBottomTabs';
import { useSequencer } from 'app/Context/Controller';

export default function AuthLayout() {

  const { useTabNavigator, showTabNavigator } = useSequencer();

  useEffect(() => {
    useTabNavigator(true); // Show the tab navigator
    console.log("showTabNavigator ",showTabNavigator)
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        gestureEnabled: false,
        gestureDirection: 'vertical',
        cardShadowEnabled: true,
        cardOverlayEnabled: true,
        ...Platform.select({
          ios: TransitionPresets.ModalPresentationIOS,
          android: TransitionPresets.FadeFromBottomAndroid,
        }),
      }}
    >
      
      <Stack.Screen 
        name="index" 
        options={{
          cardStyleInterpolator: forFade,
        }}
      />
      <Stack.Screen 
        name="callback"
        options={{
          cardStyleInterpolator: combinedTransition,
        }}
      />
      <Stack.Screen 
        name="error" 
        options={{
          cardStyleInterpolator: combinedTransition,
        }}
      />

      <BottomTabs>
        <Stack.Screen 
          name="home" 
          options={{
            cardStyleInterpolator: combinedTransition,
          }}
        />
      </BottomTabs>
      
    </Stack>
  );
}