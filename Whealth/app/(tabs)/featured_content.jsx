import React, {useEffect} from 'react';
import {ContentScreen} from 'app/screens/TabElements/Content';

export default function FeaturedContentTab() {

    useEffect(() => {
    console.log("Featured Content Screen");
  }, []);
// this should open up as a side slide out with options on it
  return (
    <ContentScreen />
  );
}