import React, {useEffect} from 'react';
import MoreScreen from 'app/screens/TabElements/More';

export default function More() {

    useEffect(() => {
    console.log("More Screen");
  }, []);
// this should open up as a side slide out with options on it
  return (
    <MoreScreen />
  );
}