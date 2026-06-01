/**
 * QuoteWise Drafts Screen
 * Lists draft quotations with FlashList and a FAB for creating new drafts.
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
import { FlashList } from '@shopify/flash-list';
import Header from '../components/Header';
import QuotationCard from '../components/QuotationCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { useQuotations } from '../context/QuotationContext';
import colors from '../theme/colors';

export default function DraftScreen() {
  const navigation = useNavigation();
  const { drafts, loading } = useQuotations();

  const handleBack = () => {
    navigation.navigate('Dashboard');
  };

  const handleDraftPress = (quotation) => {
    navigation.navigate('QuotationDetail', { quotation });
  };

  const handleNewDraft = () => {
    Alert.alert(
      'Create draft',
      'Coming with Firebase integration'
    );
  };

  const renderDraft = ({ item }) => (
    <QuotationCard quotation={item} onPress={handleDraftPress} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Drafts" onBack={handleBack} />
        <LoadingState message="Loading drafts..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Drafts" onBack={handleBack} />

      {drafts.length === 0 ? (
        <EmptyState
          icon="edit-note"
          title="No Drafts"
          subtitle="Start a new quotation and save it as a draft."
        />
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.subtitle}>
            Work-in-progress quotations.
          </Text>
          <FlashList
            data={drafts}
            renderItem={renderDraft}
            keyExtractor={(item) => item.id}
            estimatedItemSize={72}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      {/* FAB — New Draft */}
      <Pressable
        onPress={handleNewDraft}
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Create new draft"
      >
        <MaterialIcons name="add" size={24} color={colors.onPrimary} />
        <Text style={styles.fabLabel}>New Draft</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 9999,
    paddingLeft: 16,
    paddingRight: 20,
    paddingVertical: 14,
    gap: 6,
    minHeight: 44,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  fabLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});
