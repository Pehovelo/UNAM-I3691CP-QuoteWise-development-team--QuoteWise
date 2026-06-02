import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, ImageBackground, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, IMAGES, rs } from '../constants/designTokens';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { subscribeUserQuotationsByStatus } from '../services/firestoreService';
import { auth } from '../services/authService';

export default function SavedScreen({ navigation, user }) {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeUserQuotationsByStatus(user.uid, 'saved', (items) => {
      setSaved(items);
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
      <ImageBackground source={IMAGES.savedHeader} style={s.heroBg} imageStyle={s.heroImageStyle}>
        <View style={s.heroOverlay}>
          <SafeAreaView>
            <FadeSlideIn>
              <View style={s.heroRow}>
                <View style={s.heroTextWrap}>
                  <Text style={s.heroTitle}>Saved</Text>
                  <Text style={s.heroSub}>Archived & saved estimates</Text>
                </View>
              </View>
            </FadeSlideIn>
          </SafeAreaView>
        </View>
      </ImageBackground>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <FadeSlideIn delay={50}>
          <View style={s.statsBar}>
            <Text style={s.statsCount}>{saved.length} saved items</Text>
          </View>
        </FadeSlideIn>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.brand} style={{ marginTop: rs(40) }} />
        ) : saved.length === 0 ? (
          <FadeSlideIn delay={150}>
            <View style={s.emptyState}>
              <Ionicons name="bookmark-outline" size={rs(48)} color={COLORS.inkFaint} />
              <Text style={s.emptyTitle}>No saved quotations</Text>
              <Text style={s.emptyMsg}>Finalized estimates will be archived here.</Text>
            </View>
          </FadeSlideIn>
        ) : (
          saved.map((item, i) => {
            const sym = getCurrencySymbol(item.currency);
            return (
              <FadeSlideIn key={item.id} delay={i * 80}>
                <PressableCard
                  onPress={() => navigation.navigate('QuotationDetail', { quotation: item })}
                  style={s.rowCard}
                >
                  <View style={s.rowLeft}>
                    <View style={s.rowIconWrap}>
                      <Ionicons name="bookmark" size={rs(20)} color={COLORS.saved} />
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
                    <View style={[s.badge, { backgroundColor: COLORS.savedBg }]}>
                      <View style={[s.badgeDot, { backgroundColor: COLORS.saved }]} />
                      <Text style={[s.badgeText, { color: COLORS.saved }]}>Saved</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={rs(20)} color={COLORS.inkFaint} />
                  </View>
                </PressableCard>
              </FadeSlideIn>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  heroBg: { height: rs(180) },
  heroImageStyle: { resizeMode: 'cover' },
  heroOverlay: { flex: 1, backgroundColor: COLORS.overlayDeep, justifyContent: 'flex-end', paddingBottom: rs(SPACING.xl) },
  heroRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(SPACING.xxl), gap: rs(SPACING.lg) },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: rs(24), fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display, letterSpacing: rs(-0.5) },
  heroSub: { fontSize: rs(12), color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body, marginTop: rs(2) },
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
  rowIconWrap: { width: rs(44), height: rs(44), borderRadius: RADII.md, backgroundColor: COLORS.savedBg, alignItems: 'center', justifyContent: 'center', marginRight: rs(SPACING.md) },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: rs(15), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: rs(2) },
  rowSub: { fontSize: rs(13), color: COLORS.inkMid, fontFamily: FONTS.body },
  rowMeta: { flexDirection: 'row', alignItems: 'center' },
  rowAmount: { fontSize: rs(12), fontWeight: '600', color: COLORS.brand, fontFamily: FONTS.mono },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: rs(SPACING.sm) },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(10), paddingVertical: rs(5), borderRadius: RADII.pill, gap: rs(5) },
  badgeDot: { width: rs(6), height: rs(6), borderRadius: rs(3) },
  badgeText: { fontSize: rs(11), fontWeight: '600', fontFamily: FONTS.body },
});
