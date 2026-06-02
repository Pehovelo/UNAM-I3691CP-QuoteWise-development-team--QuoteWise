import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, ImageBackground, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, IMAGES, rs } from '../constants/designTokens';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { subscribeActiveQuotations } from '../services/firestoreService';
import { auth } from '../services/authService';

const STATUS_CONFIG = {
  draft: { color: COLORS.inkLight, bg: COLORS.draftBg, label: 'Draft', icon: 'create' },
  active: { color: COLORS.brand, bg: COLORS.pendingBg, label: 'Active', icon: 'send' },
};

export default function QuotationsScreen({ navigation, user }) {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeActiveQuotations(user.uid, (items) => {
      setQuotations(items);
      setLoading(false);
    });
    return unsub;
  }, [user?.uid]);

  const getCurrencySymbol = (code) => {
    const map = { NAD: 'N$', ZAR: 'R', USD: '$', EUR: '\u20AC', GBP: '\u00A3', BWP: 'P' };
    return map[code] || 'N$';
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <ImageBackground source={IMAGES.quotationsHeader} style={s.heroBg} imageStyle={s.heroImageStyle}>
        <View style={s.heroOverlay}>
          <SafeAreaView>
            <FadeSlideIn>
              <View style={s.heroRow}>
                <View style={s.heroTextWrap}>
                  <Text style={s.heroTitle}>Quotations</Text>
                  <Text style={s.heroSub}>Active & draft estimates</Text>
                </View>
                <TouchableOpacity style={s.newBtn} onPress={() => navigation.navigate('QuotationForm')} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="New quotation">
                  <Ionicons name="add" size={rs(18)} color="#FFFFFF" />
                  <Text style={s.newBtnText}>New</Text>
                </TouchableOpacity>
              </View>
            </FadeSlideIn>
          </SafeAreaView>
        </View>
      </ImageBackground>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <FadeSlideIn delay={50}>
          <View style={s.statsBar}>
            <Text style={s.statsCount}>{quotations.length} quotations</Text>
          </View>
        </FadeSlideIn>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.brand} style={{ marginTop: rs(40) }} />
        ) : quotations.length === 0 ? (
          <FadeSlideIn delay={150}>
            <View style={s.emptyState}>
              <Ionicons name="document-text-outline" size={rs(48)} color={COLORS.inkFaint} />
              <Text style={s.emptyTitle}>No quotations yet</Text>
              <Text style={s.emptyMsg}>Tap the + New button to create your first quotation.</Text>
            </View>
          </FadeSlideIn>
        ) : (
          quotations.map((item, i) => {
            const statusConf = STATUS_CONFIG[item.status] || STATUS_CONFIG.draft;
            const sym = getCurrencySymbol(item.currency);
            return (
              <FadeSlideIn key={item.id} delay={i * 80}>
                <PressableCard
                  onPress={() => navigation.navigate('QuotationDetail', { quotation: item })}
                  style={s.rowCard}
                >
                  <View style={s.rowLeft}>
                    <View style={[s.rowIconWrap, { backgroundColor: statusConf.bg }]}>
                      <Ionicons name={statusConf.icon} size={rs(20)} color={statusConf.color} />
                    </View>
                    <View style={s.rowTextWrap}>
                      <Text style={s.rowTitle} numberOfLines={1}>{item.title || item.clientName}</Text>
                      <Text style={s.rowSub} numberOfLines={1}>{item.clientName}</Text>
                      <View style={s.rowMeta}>
                        {item.total ? <Text style={s.rowAmount}>{sym} {item.total.toFixed(2)}</Text> : null}
                      </View>
                    </View>
                  </View>
                  <View style={s.rowRight}>
                    <View style={[s.badge, { backgroundColor: statusConf.bg }]}>
                      <View style={[s.badgeDot, { backgroundColor: statusConf.color }]} />
                      <Text style={[s.badgeText, { color: statusConf.color }]}>{statusConf.label}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={rs(20)} color={COLORS.inkFaint} />
                  </View>
                </PressableCard>
              </FadeSlideIn>
            );
          })
        )}
      </ScrollView>

      {/* FAB */}
      <FadeSlideIn delay={400}>
        <TouchableOpacity
          style={s.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('QuotationForm')}
          accessibilityRole="button"
          accessibilityLabel="Create new quotation"
        >
          <Ionicons name="add" size={rs(22)} color="#FFFFFF" />
          <Text style={s.fabText}>New Quote</Text>
        </TouchableOpacity>
      </FadeSlideIn>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  heroBg: { height: rs(180) },
  heroImageStyle: { resizeMode: 'cover' },
  heroOverlay: { flex: 1, backgroundColor: COLORS.overlayDeep, justifyContent: 'flex-end', paddingBottom: rs(SPACING.xl) },
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rs(SPACING.xxl) },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: rs(24), fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display, letterSpacing: rs(-0.5) },
  heroSub: { fontSize: rs(12), color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body, marginTop: rs(2) },
  newBtn: {
    flexDirection: 'row', alignItems: 'center', gap: rs(4),
    paddingHorizontal: rs(SPACING.lg), paddingVertical: rs(SPACING.sm),
    borderRadius: RADII.pill, backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: rs(1), borderColor: 'rgba(255,255,255,0.3)',
  },
  newBtnText: { fontSize: rs(13), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: rs(SPACING.xl), paddingTop: rs(SPACING.lg), paddingBottom: rs(100) },
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rs(SPACING.lg), paddingHorizontal: rs(SPACING.xs) },
  statsCount: { fontSize: rs(13), color: COLORS.inkLight, fontFamily: FONTS.body, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingTop: rs(40) },
  emptyTitle: { fontSize: rs(18), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginTop: rs(SPACING.md), marginBottom: rs(SPACING.sm) },
  emptyMsg: { fontSize: rs(13), color: COLORS.inkLight, fontFamily: FONTS.body, textAlign: 'center', lineHeight: rs(19), paddingHorizontal: rs(SPACING.xxxl) },
  rowCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.card, borderRadius: RADII.lg, paddingVertical: rs(SPACING.lg),
    paddingHorizontal: rs(SPACING.lg), marginBottom: rs(SPACING.md), borderWidth: rs(1),
    borderColor: COLORS.cardBorder, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: rs(2) }, shadowOpacity: 0.6,
    shadowRadius: rs(8), elevation: 2,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: rs(SPACING.md) },
  rowIconWrap: { width: rs(44), height: rs(44), borderRadius: RADII.md, alignItems: 'center', justifyContent: 'center', marginRight: rs(SPACING.md), borderWidth: rs(1), borderColor: 'rgba(240,90,0,0.06)' },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: rs(15), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: rs(2) },
  rowSub: { fontSize: rs(13), color: COLORS.inkMid, fontFamily: FONTS.body, marginBottom: rs(SPACING.xs) },
  rowMeta: { flexDirection: 'row', alignItems: 'center' },
  rowAmount: { fontSize: rs(12), fontWeight: '600', color: COLORS.brand, fontFamily: FONTS.mono },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: rs(SPACING.sm) },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(10), paddingVertical: rs(5), borderRadius: RADII.pill, gap: rs(5) },
  badgeDot: { width: rs(6), height: rs(6), borderRadius: rs(3) },
  badgeText: { fontSize: rs(11), fontWeight: '600', fontFamily: FONTS.body, letterSpacing: rs(0.3) },
  fab: {
    position: 'absolute', bottom: rs(28), right: rs(SPACING.xl),
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.brand,
    borderRadius: RADII.xxl, paddingLeft: rs(18), paddingRight: rs(SPACING.xxl),
    paddingVertical: rs(SPACING.xl), gap: rs(SPACING.sm),
    shadowColor: COLORS.brand, shadowOffset: { width: 0, height: rs(6) },
    shadowOpacity: 0.4, shadowRadius: rs(14), elevation: 8,
  },
  fabText: { fontSize: rs(15), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
});
