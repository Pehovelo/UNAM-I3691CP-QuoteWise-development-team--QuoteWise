import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

/**
 * A centred empty-state placeholder with an icon, title, and optional subtitle.
 *
 * @param {object} props
 * @param {string} [props.icon="inbox"]    - MaterialIcons icon name
 * @param {string} props.title             - Primary heading text
 * @param {string} [props.subtitle]        - Secondary explanatory text
 */
export default function EmptyState({ icon = 'inbox', title, subtitle }) {
  return (
    <View
      style={styles.container}
      accessibilityLabel={
        subtitle ? `${title}. ${subtitle}` : title
      }
    >
      <MaterialIcons
        name={icon}
        size={64}
        color={colors.outline}
        style={styles.icon}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onBackground,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});
