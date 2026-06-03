import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { subscribeQuoteResponses, updateResponse } from '../services/firestoreService';

const STATUS_CONFIG = {
  pending: { color: COLORS.brand, bg: COLORS.pendingBg, label: 'Pending', icon: 'time-outline' },
  accepted: { color: COLORS.saved, bg: COLORS.savedBg, label: 'Accepted', icon: 'checkmark-circle' },
  rejected: { color: COLORS.error, bg: COLORS.errorBg, label: 'Rejected', icon: 'close-circle' },
  saved: { color: COLORS.draft, bg: COLORS.draftBg, label: 'Saved', icon: 'bookmark' },
};

export default function QuoteResponsesScreen({ navigation, route, user }) {
  const quote = route?.params?.quote;
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportingId, setExportingId] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!quote?.id) return;
    const unsub = subscribeQuoteResponses(quote.id, (items) => {
      setResponses(items);
      setLoading(false);
    });
    return unsub;
  }, [quote?.id]);

  if (!quote) {
    return (
      <View style={s.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={rs(48)} color={COLORS.inkFaint} />
          <Text style={s.errorText}>Quote not found</Text>
          <TouchableOpacity style={s.backLink} onPress={() => navigation.goBack()} accessibilityRole="button">
            <Text style={s.backLinkText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleAccept = (responseId) => {
    Alert.alert('Accept Quotation', 'Accept this quotation from the provider?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Accept', onPress: async () => {
        try {
          await updateResponse(quote.id, responseId, { status: 'accepted' });
        } catch (err) {
          Alert.alert('Error', 'Failed to accept quotation.');
        }
      }},
    ]);
  };

  const handleReject = (responseId) => {
    Alert.alert('Reject Quotation', 'Are you sure you want to reject this quotation?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: async () => {
        try {
          await updateResponse(quote.id, responseId, { status: 'rejected' });
        } catch (err) {
          Alert.alert('Error', 'Failed to reject quotation.');
        }
      }},
    ]);
  };

  const handleSave = async (responseId) => {
    try {
      await updateResponse(quote.id, responseId, { status: 'saved' });
    } catch (err) {
      Alert.alert('Error', 'Failed to save quotation.');
    }
  };

  const handleExportPDF = async (response) => {
    setExportingId(response.id);
    try {
      const html = generateResponseHTML(quote, response);
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Quotation from ${response.companyName}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF Generated', 'The PDF has been created but sharing is not available on this device.');
      }
    } catch (err) {
      Alert.alert('Export Error', 'Failed to generate PDF.');
    } finally {
      setExportingId(null);
    }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <View style={s.header}>
        <SafeAreaView>
          <View style={s.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityRole="button">
              <Ionicons name="arrow-back" size={rs(22)} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={s.headerTitleWrap}>
              <Text style={s.headerTitle} numberOfLines={1}>{quote.projectTitle}</Text>
              <Text style={s.headerSub}>{responses.length} response{responses.length !== 1 ? 's' : ''}</Text>
            </View>
            <View style={{ width: rs(40) }} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, { paddingBottom: rs(120) + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.brand} style={{ marginTop: rs(40) }} />
        ) : responses.length === 0 ? (
          <FadeSlideIn delay={150}>
            <View style={s.emptyState}>
              <Ionicons name="document-text-outline" size={rs(48)} color={COLORS.inkFaint} />
              <Text style={s.emptyTitle}>No responses yet</Text>
              <Text style={s.emptyMsg}>Service providers will respond to your request with quotations.</Text>
            </View>
          </FadeSlideIn>
        ) : (
          responses.map((response, i) => {
            const statusConf = STATUS_CONFIG[response.status] || STATUS_CONFIG.pending;
            return (
              <FadeSlideIn key={response.id} delay={i * 80}>
                <View style={s.responseCard}>
                  <View style={s.cardHeader}>
                    <View style={s.providerInfo}>
                      <View style={[s.providerAvatar, { backgroundColor: statusConf.bg }]}>
                        <Ionicons name="business-outline" size={rs(20)} color={statusConf.color} />
                      </View>
                      <View style={s.providerText}>
                        <Text style={s.providerName}>{response.companyName || 'Provider'}</Text>
                        <Text style={s.providerDate}>
                          {response.createdAt
                            ? (response.createdAt.seconds
                              ? new Date(response.createdAt.seconds * 1000).toLocaleDateString('en-NA', { year: 'numeric', month: 'short', day: 'numeric' })
                              : new Date(response.createdAt).toLocaleDateString('en-NA', { year: 'numeric', month: 'short', day: 'numeric' }))
                            : 'N/A'}
                        </Text>
                      </View>
                    </View>
                    <View style={[s.statusBadge, { backgroundColor: statusConf.bg }]}>
                      <Ionicons name={statusConf.icon} size={rs(12)} color={statusConf.color} />
                      <Text style={[s.statusBadgeText, { color: statusConf.color }]}>{statusConf.label}</Text>
                    </View>
                  </View>

                  {response.price ? (
                    <View style={s.priceRow}>
                      <Text style={s.priceLabel}>Quoted Price</Text>
                      <Text style={s.priceValue}>N$ {Number(response.price).toFixed(2)}</Text>
                    </View>
                  ) : null}

                  {response.message ? (
                    <View style={s.messageWrap}>
                      <Text style={s.messageText}>{response.message}</Text>
                    </View>
                  ) : null}

                  {/* Action Buttons */}
                  {response.status === 'pending' ? (
                    <View style={s.actions}>
                      <TouchableOpacity
                        style={[s.actionBtn, s.actionAccept]}
                        onPress={() => handleAccept(response.id)}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                      >
                        <Ionicons name="checkmark-circle-outline" size={rs(16)} color={COLORS.saved} />
                        <Text style={s.actionAcceptText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.actionBtn, s.actionReject]}
                        onPress={() => handleReject(response.id)}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                      >
                        <Ionicons name="close-circle-outline" size={rs(16)} color={COLORS.error} />
                        <Text style={s.actionRejectText}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.actionBtn, s.actionSave]}
                        onPress={() => handleSave(response.id)}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                      >
                        <Ionicons name="bookmark-outline" size={rs(16)} color={COLORS.draft} />
                        <Text style={s.actionSaveText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={s.actions}>
                      <TouchableOpacity
                        style={[s.actionBtn, s.actionPDF]}
                        onPress={() => handleExportPDF(response)}
                        disabled={exportingId === response.id}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                      >
                        {exportingId === response.id ? (
                          <ActivityIndicator color={COLORS.brand} size="small" />
                        ) : (
                          <Ionicons name="document-text-outline" size={rs(16)} color={COLORS.brand} />
                        )}
                        <Text style={s.actionPDFText}>Download PDF</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </FadeSlideIn>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function generateResponseHTML(quote, response) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { font-family: Arial, Helvetica, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
    h1 { color: #F05A00; font-size: 28px; margin-bottom: 4px; }
    .subtitle { color: #999; font-size: 12px; margin-bottom: 24px; }
    .meta { display: flex; justify-content: space-between; margin-bottom: 24px; }
    .meta-block p { margin: 2px 0; font-size: 14px; }
    .meta-label { color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .price-box { background: #FFF5EB; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
    .price-amount { font-size: 32px; font-weight: bold; color: #F05A00; }
    .price-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .message { margin-top: 24px; padding: 16px; background: #FAFAFA; border-radius: 8px; font-size: 14px; line-height: 1.6; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; color: #BBB; font-size: 11px; text-align: center; }
  </style></head><body>
    <h1>QUOTATION RESPONSE</h1>
    <div class="subtitle">QuoteWise · Namibia</div>
    <div class="meta">
      <div class="meta-block">
        <div class="meta-label">Project</div>
        <p><strong>${quote.projectTitle}</strong></p>
        <p>${quote.description?.substring(0, 100) || ''}</p>
      </div>
      <div class="meta-block" style="text-align:right;">
        <div class="meta-label">From</div>
        <p><strong>${response.companyName || 'Service Provider'}</strong></p>
        <p>${response.createdAt ? new Date(response.createdAt.seconds ? response.createdAt.seconds * 1000 : response.createdAt).toLocaleDateString('en-NA') : 'N/A'}</p>
      </div>
    </div>
    <div class="price-box">
      <div class="price-label">Quoted Price</div>
      <div class="price-amount">N$ ${Number(response.price || 0).toFixed(2)}</div>
    </div>
    ${response.message ? `<div class="message">${response.message}</div>` : ''}
    <div class="footer">QuoteWise · Namibia · ${new Date().getFullYear()}</div>
  </body></html>`;
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { backgroundColor: COLORS.brand, paddingBottom: rs(SPACING.xxl) },
  headerContent: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.md),
  },
  backBtn: {
    width: rs(40), height: rs(40), borderRadius: RADII.md,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitleWrap: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: rs(17), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.display },
  headerSub: { fontSize: rs(11), color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body, marginTop: rs(2) },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: rs(SPACING.xl), paddingTop: rs(SPACING.lg),
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: rs(SPACING.xxxl) },
  errorText: { fontSize: rs(16), color: COLORS.inkLight, fontFamily: FONTS.body, marginTop: rs(SPACING.md) },
  backLink: { marginTop: rs(SPACING.lg) },
  backLinkText: { fontSize: rs(14), color: COLORS.brand, fontFamily: FONTS.body, fontWeight: '600' },

  // Empty state
  emptyState: { alignItems: 'center', paddingTop: rs(40) },
  emptyTitle: { fontSize: rs(18), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginTop: rs(SPACING.md), marginBottom: rs(SPACING.sm) },
  emptyMsg: { fontSize: rs(13), color: COLORS.inkLight, fontFamily: FONTS.body, textAlign: 'center', lineHeight: rs(19), paddingHorizontal: rs(SPACING.xxxl) },

  // Response card
  responseCard: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: rs(SPACING.xl),
    marginBottom: rs(SPACING.lg), borderWidth: rs(1), borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: rs(2) },
    shadowOpacity: 0.4, shadowRadius: rs(8), elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: rs(SPACING.md) },
  providerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  providerAvatar: {
    width: rs(40), height: rs(40), borderRadius: RADII.md,
    alignItems: 'center', justifyContent: 'center', marginRight: rs(SPACING.md),
  },
  providerText: { flex: 1 },
  providerName: { fontSize: rs(15), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body },
  providerDate: { fontSize: rs(11), color: COLORS.inkLight, fontFamily: FONTS.body, marginTop: rs(2) },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(10),
    paddingVertical: rs(5), borderRadius: RADII.pill, gap: rs(4),
  },
  statusBadgeText: { fontSize: rs(11), fontWeight: '600', fontFamily: FONTS.body },

  // Price
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.brandGlow, borderRadius: RADII.md, padding: rs(SPACING.lg),
    marginBottom: rs(SPACING.md),
  },
  priceLabel: { fontSize: rs(13), color: COLORS.inkLight, fontFamily: FONTS.body, fontWeight: '600' },
  priceValue: { fontSize: rs(20), fontWeight: '800', color: COLORS.brand, fontFamily: FONTS.mono },

  // Message
  messageWrap: {
    backgroundColor: COLORS.surface, borderRadius: RADII.md, padding: rs(SPACING.md),
    marginBottom: rs(SPACING.md), borderWidth: rs(1), borderColor: COLORS.cardBorder,
  },
  messageText: { fontSize: rs(13), color: COLORS.inkMid, fontFamily: FONTS.body, lineHeight: rs(19) },

  // Actions
  actions: { flexDirection: 'row', gap: rs(SPACING.sm), flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rs(4),
    borderRadius: RADII.xxl, paddingVertical: rs(10), paddingHorizontal: rs(SPACING.md),
    borderWidth: rs(1),
  },
  actionAccept: { backgroundColor: COLORS.savedBg, borderColor: COLORS.saved, flex: 1 },
  actionAcceptText: { fontSize: rs(12), fontWeight: '700', color: COLORS.saved, fontFamily: FONTS.body },
  actionReject: { backgroundColor: COLORS.errorBg, borderColor: 'rgba(220,38,38,0.2)', flex: 1 },
  actionRejectText: { fontSize: rs(12), fontWeight: '700', color: COLORS.error, fontFamily: FONTS.body },
  actionSave: { backgroundColor: COLORS.draftBg, borderColor: COLORS.draft + '30', flex: 1 },
  actionSaveText: { fontSize: rs(12), fontWeight: '700', color: COLORS.draft, fontFamily: FONTS.body },
  actionPDF: { backgroundColor: COLORS.brandGlow, borderColor: COLORS.brand + '30', flex: 1 },
  actionPDFText: { fontSize: rs(12), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.body },
});
