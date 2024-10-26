// app/(tabs)/index.jsx
import React, {useEffect} from 'react';
import { Redirect } from 'expo-router';

export default function IndexTab() {

    useEffect(() => {
    console.log("Home Screen");
  }, []);

  return (
    // redirect to home
    <Redirect href="/(tabs)/home" />
  );
}