import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Alert, ActivityIndicator, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { updateQuotation, deleteQuotation } from '../services/firestoreService';
import { auth } from '../services/authService';

const STATUS_CONFIG = {
  draft: { color: COLORS.inkLight, bg: 'rgba(139,101,20,0.10)', label: 'Draft', icon: 'create' },
  active: { color: COLORS.brand, bg: COLORS.pendingBg, label: 'Active', icon: 'send' },
  saved: { color: COLORS.saved, bg: COLORS.savedBg, label: 'Saved', icon: 'bookmark' },
};

export default function QuotationDetailScreen({ navigation, route }) {
  const quotation = route?.params?.quotation;
  const userId = auth.currentUser?.uid;
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!quotation) {
    return (
      <View style={s.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={rs(48)} color={COLORS.inkFaint} />
          <Text style={s.errorText}>Quotation not found</Text>
          <TouchableOpacity style={s.backLink} onPress={() => navigation.goBack()} accessibilityRole="button">
            <Text style={s.backLinkText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusConf = STATUS_CONFIG[quotation.status] || STATUS_CONFIG.draft;
  const currencySymbol = getCurrencySymbol(quotation.currency);

  const handleEdit = () => {
    navigation.navigate('QuotationForm', { quotation });
  };

  const handleMarkSaved = () => {
    Alert.alert('Mark as Saved', 'Archive this quotation?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: async () => {
        try {
          await updateQuotation(userId, quotation.id, { status: 'saved' });
          navigation.goBack();
        } catch (err) {
          Alert.alert('Error', 'Failed to update status.');
        }
      }},
    ]);
  };

  const handleMarkActive = () => {
    Alert.alert('Activate', 'Set this quotation as active?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Activate', onPress: async () => {
        try {
          await updateQuotation(userId, quotation.id, { status: 'active' });
          navigation.goBack();
        } catch (err) {
          Alert.alert('Error', 'Failed to update status.');
        }
      }},
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Delete Quotation', 'This cannot be undone. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        setDeleting(true);
        try {
          await deleteQuotation(userId, quotation.id);
          navigation.goBack();
        } catch (err) {
          Alert.alert('Error', 'Failed to delete quotation.');
          setDeleting(false);
        }
      }},
    ]);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html = generateQuotationHTML(quotation, currencySymbol);
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Share ${quotation.title}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF Generated', 'The PDF has been created but sharing is not available on this device.');
      }
    } catch (err) {
      Alert.alert('Export Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const createdDate = quotation.createdAt
    ? (quotation.createdAt.seconds
      ? new Date(quotation.createdAt.seconds * 1000).toLocaleDateString('en-NA', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date(quotation.createdAt).toLocaleDateString('en-NA', { year: 'numeric', month: 'long', day: 'numeric' }))
    : 'N/A';

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <View style={s.header}>
        <SafeAreaView>
          <View style={s.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityRole="button">
              <Ionicons name="arrow-back" size={rs(22)} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={s.headerTitle}>Quotation</Text>
            <TouchableOpacity onPress={handleExportPDF} disabled={exporting} style={s.shareBtn} accessibilityRole="button" accessibilityLabel="Share PDF">
              {exporting ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Ionicons name="share-outline" size={rs(22)} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <FadeSlideIn>
          <View style={s.titleRow}>
            <View style={s.titleWrap}>
              <Text style={s.quotationTitle} numberOfLines={2}>{quotation.title}</Text>
              <Text style={s.quotationDate}>{createdDate}</Text>
            </View>
            <View style={[s.statusBadge, { backgroundColor: statusConf.bg }]}>
              <Ionicons name={statusConf.icon} size={rs(14)} color={statusConf.color} />
              <Text style={[s.statusBadgeText, { color: statusConf.color }]}>{statusConf.label}</Text>
            </View>
          </View>
        </FadeSlideIn>

        {/* Client Info Card */}
        <FadeSlideIn delay={60}>
          <View style={s.card}>
            <Text style={s.cardTitle}>Client Details</Text>
            <View style={s.infoRow}>
              <Ionicons name="person-outline" size={rs(18)} color={COLORS.inkLight} />
              <View style={s.infoTextWrap}>
                <Text style={s.infoLabel}>Client</Text>
                <Text style={s.infoValue}>{quotation.clientName}</Text>
              </View>
            </View>
            {quotation.clientEmail ? (
              <>
                <View style={s.infoDivider} />
                <View style={s.infoRow}>
                  <Ionicons name="mail-outline" size={rs(18)} color={COLORS.inkLight} />
                  <View style={s.infoTextWrap}>
                    <Text style={s.infoLabel}>Email</Text>
                    <Text style={s.infoValue}>{quotation.clientEmail}</Text>
                  </View>
                </View>
              </>
            ) : null}
          </View>
        </FadeSlideIn>

        {/* Line Items Card */}
        <FadeSlideIn delay={120}>
          <View style={s.card}>
            <Text style={s.cardTitle}>Line Items</Text>
            {/* Table Header */}
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderText, { flex: 2 }]}>Description</Text>
              <Text style={[s.tableHeaderText, { flex: 0.6, textAlign: 'center' }]}>Qty</Text>
              <Text style={[s.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Price</Text>
              <Text style={[s.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Total</Text>
            </View>
            {(quotation.items || []).map((item, i) => (
              <View key={i} style={s.tableRow}>
                <Text style={[s.tableCell, { flex: 2 }]} numberOfLines={2}>{item.description}</Text>
                <Text style={[s.tableCell, { flex: 0.6, textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[s.tableCell, { flex: 1, textAlign: 'right' }]}>{currencySymbol} {(item.unitPrice || 0).toFixed(2)}</Text>
                <Text style={[s.tableCellBold, { flex: 1, textAlign: 'right' }]}>{currencySymbol} {(item.total || 0).toFixed(2)}</Text>
              </View>
            ))}
            <View style={s.totalsSection}>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Subtotal</Text>
                <Text style={s.totalValue}>{currencySymbol} {(quotation.subtotal || 0).toFixed(2)}</Text>
              </View>
              {quotation.taxPercent > 0 && (
                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>Tax ({quotation.taxPercent}%)</Text>
                  <Text style={s.totalValue}>{currencySymbol} {(quotation.taxAmount || 0).toFixed(2)}</Text>
                </View>
              )}
              <View style={s.grandTotalRow}>
                <Text style={s.grandTotalLabel}>TOTAL</Text>
                <Text style={s.grandTotalValue}>{currencySymbol} {(quotation.total || 0).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </FadeSlideIn>

        {/* Notes Card */}
        {quotation.notes ? (
          <FadeSlideIn delay={180}>
            <View style={s.card}>
              <Text style={s.cardTitle}>Notes</Text>
              <Text style={s.notesText}>{quotation.notes}</Text>
            </View>
          </FadeSlideIn>
        ) : null}

        {/* Action Buttons */}
        <FadeSlideIn delay={240}>
          <View style={s.actions}>
            <TouchableOpacity style={s.actionBtn} onPress={handleEdit} activeOpacity={0.8} accessibilityRole="button">
              <Ionicons name="create-outline" size={rs(18)} color={COLORS.brand} />
              <Text style={s.actionBtnText}>Edit</Text>
            </TouchableOpacity>
            {quotation.status === 'draft' && (
              <TouchableOpacity style={[s.actionBtn, s.actionBtnPrimary]} onPress={handleMarkActive} activeOpacity={0.8} accessibilityRole="button">
                <Ionicons name="send-outline" size={rs(18)} color="#FFFFFF" />
                <Text style={s.actionBtnPrimaryText}>Activate</Text>
              </TouchableOpacity>
            )}
            {quotation.status === 'active' && (
              <TouchableOpacity style={[s.actionBtn, s.actionBtnSaved]} onPress={handleMarkSaved} activeOpacity={0.8} accessibilityRole="button">
                <Ionicons name="bookmark-outline" size={rs(18)} color={COLORS.saved} />
                <Text style={s.actionBtnSavedText}>Archive</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[s.actionBtn, s.actionBtnDanger]} onPress={handleDelete} activeOpacity={0.8} accessibilityRole="button">
              <Ionicons name="trash-outline" size={rs(18)} color={COLORS.error} />
              <Text style={s.actionBtnDangerText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </FadeSlideIn>
      </ScrollView>
    </View>
  );
}

function getCurrencySymbol(code) {
  const map = { NAD: 'N$', ZAR: 'R', USD: '$', EUR: '\u20AC', GBP: '\u00A3', BWP: 'P' };
  return map[code] || 'N$';
}

function generateQuotationHTML(q, sym) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { font-family: Arial, Helvetica, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
    h1 { color: #E85D04; font-size: 28px; margin-bottom: 4px; }
    .subtitle { color: #999; font-size: 12px; margin-bottom: 24px; }
    .meta { display: flex; justify-content: space-between; margin-bottom: 24px; }
    .meta-block p { margin: 2px 0; font-size: 14px; }
    .meta-label { color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #E85D04; color: white; padding: 10px 12px; text-align: left; font-size: 13px; }
    td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
    .right { text-align: right; }
    .center { text-align: center; }
    .totals { margin-top: 8px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 12px; font-size: 14px; }
    .grand-total { display: flex; justify-content: space-between; padding: 12px; background: #FFF5EB; border-radius: 8px; margin-top: 8px; font-size: 18px; font-weight: bold; color: #E85D04; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-active { background: #FFF0E0; color: #E85D04; }
    .badge-draft { background: #F5F5F5; color: #999; }
    .badge-saved { background: #E8F5EE; color: #1A6B4A; }
    .notes { margin-top: 24px; padding: 16px; background: #FAFAFA; border-radius: 8px; font-style: italic; color: #666; font-size: 13px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; color: #BBB; font-size: 11px; text-align: center; }
  </style></head><body>
    <h1>QUOTATION</h1>
    <div class="subtitle">QuoteWise v4.1.0</div>
    <div class="meta">
      <div class="meta-block">
        <p class="meta-label">Prepared For</p>
        <p><strong>${q.clientName}</strong></p>
        ${q.clientEmail ? `<p>${q.clientEmail}</p>` : ''}
      </div>
      <div class="meta-block" style="text-align:right">
        <p class="meta-label">Quotation</p>
        <p><strong>${q.title}</strong></p>
        <p>${q.createdAt ? (q.createdAt.seconds ? new Date(q.createdAt.seconds * 1000).toLocaleDateString() : new Date(q.createdAt).toLocaleDateString()) : 'N/A'}</p>
        <span class="badge badge-${q.status}">${q.status.toUpperCase()}</span>
      </div>
    </div>
    <table>
      <tr><th>Description</th><th class="center">Qty</th><th class="right">Unit Price</th><th class="right">Total</th></tr>
      ${(q.items || []).map(item => `<tr><td>${item.description}</td><td class="center">${item.quantity}</td><td class="right">${sym} ${(item.unitPrice || 0).toFixed(2)}</td><td class="right">${sym} ${(item.total || 0).toFixed(2)}</td></tr>`).join('')}
    </table>
    <div class="totals">
      <div class="total-row"><span>Subtotal</span><span>${sym} ${(q.subtotal || 0).toFixed(2)}</span></div>
      ${q.taxPercent > 0 ? `<div class="total-row"><span>Tax (${q.taxPercent}%)</span><span>${sym} ${(q.taxAmount || 0).toFixed(2)}</span></div>` : ''}
      <div class="grand-total"><span>TOTAL</span><span>${sym} ${(q.total || 0).toFixed(2)}</span></div>
    </div>
    ${q.notes ? `<div class="notes">${q.notes}</div>` : ''}
    <div class="footer">Generated by QuoteWise v4.1.0 — Smart Budgeting & Quotation</div>
  </body></html>`;
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { backgroundColor: COLORS.brand, paddingBottom: rs(SPACING.xxl) },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.md) },
  backBtn: { width: rs(40), height: rs(40), borderRadius: RADII.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: rs(20), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.display },
  shareBtn: { width: rs(40), height: rs(40), borderRadius: RADII.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.xl), paddingBottom: rs(120) },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: rs(SPACING.xxxl) },
  errorText: { fontSize: rs(16), color: COLORS.inkLight, fontFamily: FONTS.body, marginTop: rs(SPACING.md) },
  backLink: { marginTop: rs(SPACING.lg) },
  backLinkText: { fontSize: rs(14), color: COLORS.brand, fontFamily: FONTS.body, fontWeight: '600' },

  // Title row
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: rs(SPACING.xl) },
  titleWrap: { flex: 1, marginRight: rs(SPACING.md) },
  quotationTitle: { fontSize: rs(22), fontWeight: '800', color: COLORS.ink, fontFamily: FONTS.display, letterSpacing: rs(-0.3) },
  quotationDate: { fontSize: rs(13), color: COLORS.inkLight, fontFamily: FONTS.body, marginTop: rs(4) },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(12), paddingVertical: rs(6), borderRadius: RADII.pill, gap: rs(5) },
  statusBadgeText: { fontSize: rs(12), fontWeight: '700', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: rs(0.5) },

  // Card
  card: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: rs(SPACING.xl),
    marginBottom: rs(SPACING.lg), borderWidth: rs(1), borderColor: COLORS.cardBorder,
  },
  cardTitle: { fontSize: rs(14), fontWeight: '700', color: COLORS.inkLight, fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: rs(0.5), marginBottom: rs(SPACING.md) },

  // Info rows
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: rs(SPACING.md), paddingVertical: rs(SPACING.sm) },
  infoTextWrap: { flex: 1 },
  infoLabel: { fontSize: rs(11), color: COLORS.inkLight, fontFamily: FONTS.body },
  infoValue: { fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body, fontWeight: '500' },
  infoDivider: { height: rs(1), backgroundColor: COLORS.divider, marginLeft: rs(32) },

  // Table
  tableHeader: { flexDirection: 'row', paddingVertical: rs(SPACING.sm), borderBottomWidth: rs(1), borderBottomColor: COLORS.cardBorder, marginBottom: rs(SPACING.xs) },
  tableHeaderText: { fontSize: rs(11), fontWeight: '700', color: COLORS.inkLight, fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: rs(0.5) },
  tableRow: { flexDirection: 'row', paddingVertical: rs(SPACING.sm), borderBottomWidth: rs(0.5), borderBottomColor: COLORS.divider },
  tableCell: { fontSize: rs(13), color: COLORS.ink, fontFamily: FONTS.body },
  tableCellBold: { fontSize: rs(13), color: COLORS.ink, fontFamily: FONTS.mono, fontWeight: '600' },

  // Totals
  totalsSection: { marginTop: rs(SPACING.md), paddingTop: rs(SPACING.md), borderTopWidth: rs(1), borderTopColor: COLORS.cardBorder },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: rs(SPACING.xs) },
  totalLabel: { fontSize: rs(14), color: COLORS.inkLight, fontFamily: FONTS.body },
  totalValue: { fontSize: rs(14), color: COLORS.ink, fontFamily: FONTS.mono, fontWeight: '500' },
  grandTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: rs(SPACING.sm),
    paddingTop: rs(SPACING.md), borderTopWidth: rs(2), borderTopColor: COLORS.brand,
  },
  grandTotalLabel: { fontSize: rs(16), fontWeight: '800', color: COLORS.ink, fontFamily: FONTS.body },
  grandTotalValue: { fontSize: rs(18), fontWeight: '800', color: COLORS.brand, fontFamily: FONTS.mono },

  // Notes
  notesText: { fontSize: rs(14), color: COLORS.inkMid, fontFamily: FONTS.body, lineHeight: rs(20) },

  // Actions
  actions: { flexDirection: 'row', gap: rs(SPACING.md), flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: rs(6),
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, paddingVertical: rs(14),
    paddingHorizontal: rs(SPACING.xl), borderWidth: rs(1), borderColor: COLORS.cardBorder,
    flex: 1, justifyContent: 'center', minWidth: rs(100),
  },
  actionBtnText: { fontSize: rs(14), fontWeight: '600', color: COLORS.brand, fontFamily: FONTS.body },
  actionBtnPrimary: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  actionBtnPrimaryText: { fontSize: rs(14), fontWeight: '600', color: '#FFFFFF', fontFamily: FONTS.body },
  actionBtnSaved: { backgroundColor: COLORS.savedBg, borderColor: COLORS.saved },
  actionBtnSavedText: { fontSize: rs(14), fontWeight: '600', color: COLORS.saved, fontFamily: FONTS.body },
  actionBtnDanger: { borderColor: 'rgba(220,38,38,0.2)' },
  actionBtnDangerText: { fontSize: rs(14), fontWeight: '600', color: COLORS.error, fontFamily: FONTS.body },
});
