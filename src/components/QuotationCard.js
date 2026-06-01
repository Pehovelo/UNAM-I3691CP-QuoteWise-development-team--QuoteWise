import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import colors from '../theme/colors';

/**
 * Status badge style mapping.
 * Each status maps to a specific border and background colour pair.
 */
const STATUS_STYLES = {
  draft: {
    borderColor: colors.outline,
    backgroundColor: colors.surface,
    textColor: colors.onSurface,
  },
  pending: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondaryContainer,
    textColor: colors.onSecondaryFixedVariant,
  },
  accepted: {
    borderColor: colors.success,
    backgroundColor: colors.successContainer,
    textColor: colors.success,
  },
  rejected: {
    borderColor: colors.error,
    backgroundColor: colors.errorContainer,
    textColor: colors.error,
  },
  saved: {
    borderColor: colors.tertiary,
    backgroundColor: colors.tertiaryFixed,
    textColor: colors.tertiary,
  },
};

/**
 * Capitalise the first letter of a string for display.
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * A card row for displaying a quotation summary in a list.
 *
 * @param {object}   props
 * @param {object}   props.quotation - Quotation data: { id, title, date, status, referenceNumber }
 * @param {Function} props.onPress   - Callback invoked with the quotation object
 */
const QuotationCard = React.memo(function QuotationCard({ quotation, onPress }) {
  const { title, date, status, referenceNumber } = quotation;
  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.draft;

  const accessibilityLabel = [
    title || 'Untitled quotation',
    date ? `dated ${date}` : '',
    status ? `status ${status}` : '',
    referenceNumber ? `reference ${referenceNumber}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const handlePress = useCallback(() => {
    onPress(quotation);
  }, [onPress, quotation]);

  return (
    <Pressable
      onPress={handlePress}
      style={styles.pressable}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.row}>
        <View style={styles.leftContent}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.dateRow}>
            <MaterialIcons
              name="calendar-today"
              size={14}
              color={colors.onSurfaceVariant}
              style={styles.dateIcon}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
            <Text style={styles.dateText} numberOfLines={1}>
              {date}
            </Text>
          </View>
        </View>

        <View style={styles.rightContent}>
          <View
            style={[
              styles.badge,
              {
                borderColor: statusStyle.borderColor,
                backgroundColor: statusStyle.backgroundColor,
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: statusStyle.textColor }]}>
              {capitalize(status)}
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.outline}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </View>
      </View>
    </Pressable>
  );
});

QuotationCard.propTypes = {
  quotation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    date: PropTypes.string,
    status: PropTypes.string,
    referenceNumber: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default QuotationCard;

const styles = StyleSheet.create({
  pressable: {
    minHeight: 44,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onBackground,
    lineHeight: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
