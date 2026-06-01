import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

/**
 * Reusable top app bar for the QuoteWise app.
 *
 * @param {object}  props
 * @param {string}  props.title       - Screen title displayed in the bar
 * @param {Function} [props.onBack]   - Callback when back button is pressed; button hidden when omitted
 * @param {React.ReactNode} [props.rightAction] - Optional element rendered at the trailing edge
 */
export default function Header({ title, onBack, rightAction }) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}

      <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
        {title}
      </Text>

      <View style={styles.rightSlot}>{rightAction ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
    marginRight: 2,
  },
  backPlaceholder: {
    width: 44,
    marginLeft: -10,
    marginRight: 2,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  rightSlot: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
