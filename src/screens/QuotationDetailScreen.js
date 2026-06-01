/**
 * QuoteWise Quotation Detail Screen
 * Shows full quotation details with action buttons (Accept, Save, Reject).
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
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import { useQuotations } from '../context/QuotationContext';
import colors from '../theme/colors';
import ROUTES from '../constants/routes';

/**
 * Format a number as currency string.
 * Example: 145500 → "N$ 145,500.00"
 */
function formatCurrency(amount, currency) {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${formatted}`;
}

export default function QuotationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // P0 fix: null-safe params + fetch from context by ID instead of passing full object
  const { quotationId } = route.params ?? {};
  const { quotations, acceptQuotation, rejectQuotation, saveQuotation } = useQuotations();

  const quotation = quotations.find((q) => q.id === quotationId) ?? null;

  // If quotation not found (bad navigation or stale ID), go back
  if (!quotation) {
    navigation.goBack();
    return null;
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAccept = () => {
    acceptQuotation(quotation.id);
    Alert.alert('Accepted', `"${quotation.projectTitle}" has been accepted.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleReject = () => {
    rejectQuotation(quotation.id);
    Alert.alert('Rejected', `"${quotation.projectTitle}" has been rejected.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleSave = () => {
    saveQuotation(quotation.id);
    Alert.alert('Saved', `"${quotation.projectTitle}" has been saved.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={quotation.title || 'Quotation Detail'} onBack={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reference number chip */}
        <View style={styles.refChip}>
          <Text style={styles.refChipText}>
            {quotation.referenceNumber}
          </Text>
        </View>

        {/* Project title */}
        <Text style={styles.projectTitle} accessibilityRole="header">
          {quotation.projectTitle}
        </Text>

        {/* Date range */}
        <View style={styles.dateRow}>
          <MaterialIcons
            name="date-range"
            size={18}
            color={colors.onSurfaceVariant}
            style={styles.dateIcon}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
          <Text style={styles.dateText}>
            {quotation.date} — {quotation.validUntil}
          </Text>
        </View>

        {/* Budget */}
        <Text style={styles.budget}>
          {formatCurrency(quotation.budget, quotation.currency)}
        </Text>

        {/* Supplier */}
        <View style={styles.supplierRow}>
          <MaterialIcons
            name="business"
            size={18}
            color={colors.onSurfaceVariant}
            style={styles.supplierIcon}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
          <Text style={styles.supplierText}>{quotation.supplier}</Text>
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{quotation.description}</Text>

        {/* Download PDF button */}
        <Pressable
          onPress={() => Alert.alert('Coming soon', 'PDF download will be available in a future update.')}
          style={({ pressed }) => [
            styles.downloadButton,
            pressed && styles.downloadButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Download PDF"
          accessibilityHint="PDF download coming in a future update"
          accessibilityState={{ disabled: true }}
        >
          <MaterialIcons name="download" size={20} color={colors.primary} />
          <Text style={styles.downloadLabel}>Download PDF</Text>
        </Pressable>

        {/* Bottom spacer for action bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed bottom action bar */}
      <View style={styles.actionBar}>
        <Pressable
          onPress={handleReject}
          style={({ pressed }) => [
            styles.rejectButton,
            pressed && styles.rejectButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Reject quotation"
          accessibilityHint="Rejects this quotation and navigates back"
        >
          <Text style={styles.rejectLabel}>Reject</Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Save quotation"
          accessibilityHint="Saves this quotation for later and navigates back"
        >
          <Text style={styles.saveLabel}>Save</Text>
        </Pressable>

        <Pressable
          onPress={handleAccept}
          style={({ pressed }) => [
            styles.acceptButton,
            pressed && styles.acceptButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Accept quotation"
          accessibilityHint="Accepts this quotation and navigates back"
        >
          <Text style={styles.acceptLabel}>Accept</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  refChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  refChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.onBackground,
    lineHeight: 32,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateIcon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  budget: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 36,
    marginBottom: 12,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  supplierIcon: {
    marginRight: 6,
  },
  supplierText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onBackground,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 24,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: 8,
    minHeight: 44,
  },
  downloadButtonPressed: {
    opacity: 0.7,
    backgroundColor: colors.primaryFixed,
  },
  downloadLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  bottomSpacer: {
    height: 24,
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    backgroundColor: colors.background,
  },
  rejectButton: {
    flex: 1,
    height: 48,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  rejectButtonPressed: {
    opacity: 0.7,
    backgroundColor: colors.errorContainer,
  },
  rejectLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
  },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  saveButtonPressed: {
    opacity: 0.7,
    backgroundColor: colors.surfaceContainerHigh,
  },
  saveLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onBackground,
  },
  acceptButton: {
    flex: 1,
    height: 48,
    borderRadius: 9999,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  acceptButtonPressed: {
    opacity: 0.85,
  },
  acceptLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});
