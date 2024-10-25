import React, { useRef, useEffect } from 'react';
import { Animated, Image, Easing } from 'react-native';

export const MovingImage = ({ path }) => {
  // Ref for the animated value
  const animatedValue = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    animatedValue.setValue(0);

    // Sequence of animations
    Animated.sequence([
      // Fade in the image
      Animated.timing(animatedValue, {
        toValue: 0.75, // Target value for fade-in
        duration: 10, // Duration of fade-in in milliseconds
        useNativeDriver: true,
      }),
      // Delay before moving the image
      Animated.delay(1000), // Delay for 1 second
      // Move the image to the left
      Animated.timing(animatedValue, {
        toValue: 1.25, // Target value for initiating the move
        duration: 1000, // Duration of the move in milliseconds
        easing: Easing.linear, // Linear easing for a consistent motion speed
        useNativeDriver: true,
      }),
      // Delay before fading out the image
      Animated.delay(1000), // Delay for 1 second
      // Fade out the image
      Animated.timing(animatedValue, {
        toValue: 1.25, // Target value for fade-out
        duration: 10, // Duration of fade-out in milliseconds
        useNativeDriver: true,
      }),
    ]).start(() => startAnimation()); // Loop the animation
  };

  useEffect(() => {
    startAnimation();
  }, []);

  // Interpolate the animated value for opacity
  const opacity = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3], // Mapping animatedValue to opacity
    outputRange: [0, 1, 1, 0], // Opacity values corresponding to the animatedValue
  });

  const translateX = animatedValue.interpolate({
    inputRange: [1, 2],
    outputRange: [0, -150], // Move left by 150px
  });

  return (
    <Animated.View
      style={{
        opacity: opacity,
        transform: [{ translateX: translateX }],
      }}
    >
      <Image
        source={path}
        style={{ width: 80, height: 80 }} // Set the size as needed
      />
    </Animated.View>
  );
};