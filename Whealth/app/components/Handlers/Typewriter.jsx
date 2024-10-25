import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from 'app/theme';

export const TypewriterEffect = ({ texts }) => {
  const textArray = Array.isArray(texts) ? texts : [texts];
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const currentText = textArray[textIndex];

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        if (isTyping) {
          // If we just finished typing, start untyping
          setIsTyping(false);
          setIndex(currentText.length);
        } else {
          // If we just finished untyping, move to next text
          setTextIndex((prevIndex) => (prevIndex + 1) % textArray.length);
          setIsTyping(true);
          setIndex(0);
        }
      }, 1000); // Pause for 1 second before changing direction or text
      return () => clearTimeout(pauseTimer);
    }

    const timer = setTimeout(() => {
      if (isTyping) {
        if (index <= currentText.length) {
          setDisplayText(currentText.slice(0, index));
          setIndex((prevIndex) => prevIndex + 1);
        } else {
          setIsPaused(true);
        }
      } else {
        if (index > 0) {
          setDisplayText(currentText.slice(0, index - 1));
          setIndex((prevIndex) => prevIndex - 1);
        } else {
          setIsPaused(true);
        }
      }
    }, isTyping ? 100 : 75); // Adjust typing/untyping speed

    return () => clearTimeout(timer);
  }, [index, currentText, isTyping, isPaused, textIndex, textArray]);

  return <Text style={styles.text}>{displayText}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: colors.palette.neutral100,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    minHeight: 24,
    minWidth: 200,
  },
});