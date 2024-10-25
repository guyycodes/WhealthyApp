import React, { useEffect } from 'react';
import { useSequencer } from 'app/Context/Controller';
import { WalkthroughScreen } from 'app/screens/SplashScreenElements/Walkthrough';

export default function Walkthrough() {
  const { useTabNavigator } = useSequencer();

  useEffect(() => {
    useTabNavigator(false);
  }, []);

  return <WalkthroughScreen />;
}