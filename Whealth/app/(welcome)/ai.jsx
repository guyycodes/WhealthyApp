import React from 'react';
import { Button, Text, View } from 'react-native';
import { useSequencer } from 'app/Context/Controller';

export default function GiftCardsSection() {
  const { goBack, navigate } = useSequencer();

  const handleBack = () => {
    goBack();
  };

  const handleFinish = () => {
    // Navigate to the main app screen or perform any other action to finish the welcome sequence
    navigate('home'); // Assuming 'home' is your main app screen
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ai Screen</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20 }}>
        <Button title="Back" onPress={handleBack} />
        <Button title="Finish" onPress={handleFinish} />
      </View>
    </View>
  );
}