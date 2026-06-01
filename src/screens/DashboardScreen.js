/**
 * QuoteWise Dashboard Screen
 * Main hub with 2x2 navigation card grid and quotation counts.
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useQuotations } from '../context/QuotationContext';
import colors from '../theme/colors';

const NAV_CARDS = [
  {
    key: 'quotations',
    label: 'Quotations',
    icon: 'receipt-long',
    color: colors.primary,
    countKey: 'activeQuotations',
    target: 'Quotations',
  },
  {
    key: 'saved',
    label: 'Saved Quotations',
    icon: 'bookmark',
    color: colors.tertiary,
    countKey: 'savedQuotations',
    target: 'SavedQuotations',
  },
  {
    key: 'drafts',
    label: 'Drafts',
    icon: 'edit-note',
    color: colors.secondary,
    countKey: 'drafts',
    target: 'Drafts',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'settings',
    color: colors.outline,
    countKey: null,
    target: null,
  },
];

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { activeQuotations, savedQuotations, drafts } = useQuotations();

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
    <View style={styles.avatarCircle}>
      <MaterialIcons name="person" size={22} color={colors.primary} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="QuoteWise" rightAction={rightAction} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
              >
                <View style={[styles.iconCircle, { backgroundColor: card.color + '14' }]}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
    // Shadow
    shadowColor: '#000',
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
