import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { useSequencer } from 'app/Context/Controller';

export default function WelcomeIndex() {

  return (<Redirect href="/(welcome)/welcome" />)
}