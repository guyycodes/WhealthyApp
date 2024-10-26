// import React, { useEffect, useState } from 'react';
// import { observer } from 'mobx-react-lite';
// import { Stack, useRouter, useSegments } from 'expo-router';
// import { useStores } from 'app/Models/Stores/index';

// export const AppNavigator = observer(function AppNavigator() {
//   const [currentStack, setCurrentStack] = useState('splash');
//   const router = useRouter();
//   const segments = useSegments();
//   const {
//     userSettings: { notificationsAllowed, isAuthenticated },
//   } = useStores();

//   useEffect(() => {
//     if (currentStack === 'splash') {
//       const timer = setTimeout(() => {
//         setCurrentStack('welcome');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [currentStack]);

//   useEffect(() => {
//     if (currentStack === 'welcome' && notificationsAllowed) {
//       setCurrentStack(isAuthenticated ? 'tabs' : 'login');
//     }
//   }, [currentStack, notificationsAllowed, isAuthenticated]);

//   useEffect(() => {
//     const inAuthGroup = segments[0] === '(auth)';
//     const inTabsGroup = segments[0] === '(tabs)';

//     if (isAuthenticated && !inTabsGroup) {
//       router.replace('/(tabs)');
//     } else if (!isAuthenticated && !inAuthGroup) {
//       router.replace('/(auth)/login');
//     }
//   }, [isAuthenticated, segments]);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {currentStack === 'splash' && <Stack.Screen name="(splash)" />}
//       {currentStack === 'welcome' && <Stack.Screen name="(welcome)" />}
//       {currentStack === 'login' && <Stack.Screen name="(auth)" />}
//       {currentStack === 'tabs' && <Stack.Screen name="(tabs)" />}
//     </Stack>
//   );
// });