/**
 * QuoteWise Welcome / Login Screen
 * Full-screen onboarding with primary brand colour background.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../theme/colors';

export default function WelcomeLoginScreen() {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Centered content */}
        <View style={styles.centerContent}>
          <MaterialIcons
            name="receipt-long"
            size={80}
            color={colors.onPrimary}
            style={styles.icon}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
          <Text style={styles.appName} accessibilityRole="header">
            QuoteWise
          </Text>
          <Text style={styles.subtitle}>
            Smart Budgeting & Quotation
          </Text>
        </View>

        {/* Get Started button */}
        <Pressable
          onPress={handleGetStarted}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Get started with QuoteWise"
          accessibilityHint="Navigate to the main dashboard"
        >
          <Text style={styles.buttonLabel}>Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 48,
  },
  centerContent: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 24,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.onPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.onPrimary,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  button: {
    width: 280,
    height: 56,
    backgroundColor: colors.onPrimary,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
});
