/**
 * QuoteWise Saved Quotations Screen
 * Lists archived / saved quotations with FlashList.
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
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

export default function SavedQuotationsScreen() {
  const navigation = useNavigation();
  const { savedQuotations, loading, error } = useQuotations();

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
        <Header title="Saved Quotations" onBack={handleBack} />
        <LoadingState message="Loading saved quotations..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Saved Quotations" onBack={handleBack} />

      {/* Error state UI */}
      {error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      ) : savedQuotations.length === 0 ? (
        <EmptyState
          icon="bookmark-outline"
          title="No Saved Quotations"
          subtitle="Accept or save quotations to find them here later."
        />
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.subtitle}>
            Your archived and saved estimates.
          </Text>
          <FlashList
            data={savedQuotations}
            renderItem={renderQuotation}
            keyExtractor={(item) => item.id}
            estimatedItemSize={90}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
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
});
