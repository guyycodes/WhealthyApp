import React from 'react';
import { Animated, View } from 'react-native';
import { TypewriterEffect } from './Typewriter';
import { translate } from 'app/i18n';


export function AnimatedTextComponent({ textOpacity, isAtBottom }) {
  
  const quoteKeys = Array.from({ length: 10 }, (_, index) => `quotes.quote${index}`);
  const quotesArray = quoteKeys.map((key) => translate(key));

  return (
    <Animated.View style={[styles.container, { opacity: textOpacity }]}>
      <View style={styles.typewriterContainer}>
        <TypewriterEffect texts={quotesArray} />
      </View>
    </Animated.View>
  );
}

const styles = {
  container: {
    flex: 1,
    position: 'absolute', // if this isnt absolute and the zIndex below it isnt set, the buttons arent clickable
    zIndex: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // paddingTop: Platform.OS === 'ios' ? '20%' : '16.5%',
    // paddingBottom: spacing.sm,
  },
  typewriterContainer: {
    width: '95%',
    minHeight: 115, // Adjust this value based on the maximum height of your typewriter text
    justifyContent: 'center',
    alignItems: 'center',
  },
};