import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../theme/colors';

/**
 * A centred loading indicator with an optional message.
 *
 * @param {object} props
 * @param {string} [props.message="Loading..."] - Descriptive text shown below the spinner
 */
export default function LoadingState({ message = 'Loading...' }) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <ActivityIndicator
        size="large"
        color={colors.primary}
        accessibilityLabel={message}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

LoadingState.propTypes = {
  message: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
