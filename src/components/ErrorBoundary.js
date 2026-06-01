/**
 * QuoteWise Error Boundary
 * Catches unhandled JavaScript errors anywhere in the component tree
 * and displays a fallback UI instead of crashing the entire app.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container} accessibilityLiveRegion="assertive">
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            The app encountered an unexpected error. Try reloading.
          </Text>
          {__DEV__ && this.state.error ? (
            <Text style={styles.debug} numberOfLines={10}>
              {this.state.error.message}
            </Text>
          ) : null}
          <Pressable
            onPress={this.handleReload}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Reload the app"
          >
            <Text style={styles.buttonLabel}>Reload</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  debug: {
    fontSize: 12,
    color: colors.outline,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  button: {
    height: 48,
    paddingHorizontal: 32,
    borderRadius: 9999,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});
