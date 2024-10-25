import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SequenceProvider } from 'app/Context/Controller';
import { ErrorBoundary } from "./screens/ErrorBoundry";


export function App({ children }) {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SequenceProvider>
        <SafeAreaProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <ErrorBoundary catchErrors="always">
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </SafeAreaProvider>
      </SequenceProvider>
    </GestureHandlerRootView>
  );
}