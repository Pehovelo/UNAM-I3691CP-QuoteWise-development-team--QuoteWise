import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

export function FadeSlideIn({ children, delay = 0, style, direction = 'up' }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateVal = direction === 'up' ? 24 : direction === 'down' ? -24 : 0;
  const translateXVal = direction === 'left' ? 24 : direction === 'right' ? -24 : 0;
  const translateY = useRef(new Animated.Value(translateVal)).current;
  const translateX = useRef(new Animated.Value(translateXVal)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 480, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }, { translateX }] }, style]}>
      {children}
    </Animated.View>
  );
}

export function PressableCard({ children, onPress, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 300, friction: 12 }).start();
  }, []);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 12 }).start();
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}
