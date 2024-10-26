import React, {useEffect} from 'react';
import HomeScreen from 'app/screens/TabElements/Home';

export default function HomeTab() {

    useEffect(() => {
    console.log("Home Screen");
  }, []);

  return (
    <HomeScreen />
  );
}