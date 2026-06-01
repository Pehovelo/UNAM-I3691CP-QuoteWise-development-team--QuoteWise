/**
 * QuoteWise Dashboard Screen
 * Main hub with 2x2 navigation card grid and quotation counts.
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useQuotations } from '../context/QuotationContext';
import colors from '../theme/colors';
import ROUTES from '../constants/routes';
import { withAlpha } from '../utils/color';

const NAV_CARDS = [
  {
    key: 'quotations',
    label: 'Quotations',
    icon: 'receipt-long',
    color: colors.primary,
    countKey: 'activeQuotations',
    target: ROUTES.QUOTATIONS,
    hint: 'View your active quotations',
  },
  {
    key: 'saved',
    label: 'Saved Quotations',
    icon: 'bookmark',
    color: colors.tertiary,
    countKey: 'savedQuotations',
    target: ROUTES.SAVED_QUOTATIONS,
    hint: 'View your saved quotations',
  },
  {
    key: 'drafts',
    label: 'Drafts',
    icon: 'edit-note',
    color: colors.secondary,
    countKey: 'drafts',
    target: ROUTES.DRAFTS,
    hint: 'View and manage your drafts',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'settings',
    color: colors.outline,
    countKey: null,
    target: null,
    hint: 'Open app settings',
  },
];

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { activeQuotations, savedQuotations, drafts, error } = useQuotations();

  const counts = {
    activeQuotations,
    savedQuotations,
    drafts,
  };

  const handleCardPress = (card) => {
    if (card.target) {
      navigation.navigate(card.target);
    } else {
      Alert.alert('Coming soon', 'Settings will be available in a future update.');
    }
  };

  const rightAction = (
    <View
      style={styles.avatarCircle}
      accessibilityRole="button"
      accessibilityLabel="User profile"
      accessibilityHint="View your profile settings"
    >
      <MaterialIcons name="person" size={22} color={colors.primary} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="QuoteWise" rightAction={rightAction} />

      {/* Error banner */}
      {error ? (
        <View style={styles.errorBanner}>
          <MaterialIcons name="error-outline" size={20} color={colors.error} />
          <Text style={styles.errorText}>Failed to load data. Pull down to retry.</Text>
        </View>
      ) : null}

      <View style={styles.content}>
        <View style={styles.grid}>
          {NAV_CARDS.map((card) => {
            const count = card.countKey ? counts[card.countKey].length : null;
            const label = count !== null ? `${count} ${card.label}` : card.label;

            return (
              <Pressable
                key={card.key}
                onPress={() => handleCardPress(card)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityHint={card.hint}
              >
                <View style={[styles.iconCircle, { backgroundColor: withAlpha(card.color, 0.08) }]}>
                  <MaterialIcons
                    name={card.icon}
                    size={32}
                    color={card.color}
                  />
                </View>
                <Text style={styles.cardLabel} numberOfLines={2}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.errorContainer,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: '47%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
    // Shadow — uses theme token instead of hardcoded '#000'
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onBackground,
    textAlign: 'center',
    lineHeight: 20,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
