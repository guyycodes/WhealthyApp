// KeyboardHandler.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Dimensions, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const KeyboardHandler = ({ children, inputRef, onFocus, onBlur }) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

  const handleKeyboardDidShow = useCallback(() => {
    setKeyboardVerticalOffset(SCREEN_HEIGHT * (.00)); // in the case we need to cause element to shift
  
      setIsKeyboardVisible(true);
      if (onFocus) onFocus();
   
  }, [onFocus]);

  const handleKeyboardDidHide = useCallback(() => {
    setKeyboardVerticalOffset(0);
    setIsKeyboardVisible(false);
    if (onBlur) onBlur();
  }, [onBlur]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', handleKeyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', handleKeyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [handleKeyboardDidShow, handleKeyboardDidHide]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : keyboardVerticalOffset}
    >
      {children({ dismissKeyboard, isKeyboardVisible, keyboardVerticalOffset })}
    </KeyboardAvoidingView>
  );
};
