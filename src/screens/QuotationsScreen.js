/**
 * QuoteWise Quotations Screen
 * Lists active (pending + draft) quotations with FlashList.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Header from '../components/Header';
import QuotationCard from '../components/QuotationCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { useQuotations } from '../context/QuotationContext';
import colors from '../theme/colors';
import ROUTES from '../constants/routes';

export default function QuotationsScreen() {
  const navigation = useNavigation();
  const { activeQuotations, loading, error } = useQuotations();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleQuotationPress = (quotation) => {
    // Pass ID instead of full object to avoid data leak via nav state
    navigation.navigate(ROUTES.QUOTATION_DETAIL, { quotationId: quotation.id });
  };

  const renderQuotation = ({ item }) => (
    <QuotationCard quotation={item} onPress={handleQuotationPress} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Quotations" onBack={handleBack} />
        <LoadingState message="Loading quotations..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Quotations" onBack={handleBack} />

      {/* Error state UI */}
      {error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      ) : activeQuotations.length === 0 ? (
        <EmptyState
          icon="receipt-long"
          title="No Quotations"
          subtitle="Quotations will appear here when suppliers submit bids."
        />
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.subtitle}>
            Review and manage your pending and active estimates.
          </Text>
          <FlashList
            data={activeQuotations}
            renderItem={renderQuotation}
            keyExtractor={(item) => item.id}
            estimatedItemSize={90}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      {/* Back button at bottom */}
      <View style={styles.bottomBar}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Go back to Dashboard"
        >
          <Text style={styles.backButtonLabel}>Back</Text>
        </Pressable>
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.error,
    marginTop: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    alignItems: 'center',
  },
  backButton: {
    width: '100%',
    height: 48,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  backButtonPressed: {
    opacity: 0.7,
    backgroundColor: colors.primaryFixed,
  },
  backButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});
