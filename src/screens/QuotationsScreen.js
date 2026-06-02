import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, ImageBackground, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADII, IMAGES } from '../constants/designTokens';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { subscribeQuotations } from '../services/firestoreService';

export default function QuotationsScreen({ navigation, user }) {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeQuotations((items) => {
      setQuotations(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const activeData = quotations.filter(q => q.status === 'Pending' || q.status === 'Draft');

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <ImageBackground source={IMAGES.quotationsHeader} style={s.heroBg} imageStyle={s.heroImageStyle}>
        <View style={s.heroOverlay}>
          <SafeAreaView>
            <FadeSlideIn>
              <View style={s.heroRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityRole="button">
                  <Text style={s.backArrow}>←</Text>
                </TouchableOpacity>
                <View style={s.heroTextWrap}>
                  <Text style={s.heroTitle}>Quotations</Text>
                  <Text style={s.heroSub}>Pending & active estimates</Text>
                </View>
              </View>
            </FadeSlideIn>
          </SafeAreaView>
        </View>
      </ImageBackground>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <FadeSlideIn delay={50}>
          <View style={s.statsBar}>
            <Text style={s.statsCount}>{activeData.length} items</Text>
          </View>
        </FadeSlideIn>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.brand} style={{ marginTop: 40 }} />
        ) : activeData.length === 0 ? (
          <FadeSlideIn delay={150}>
            <View style={s.emptyState}>
              <Text style={s.emptyIcon}>📋</Text>
              <Text style={s.emptyTitle}>Nothing here yet</Text>
              <Text style={s.emptyMsg}>No quotations found. They will appear here once added.</Text>
            </View>
          </FadeSlideIn>
        ) : (
          activeData.map((item, i) => (
            <FadeSlideIn key={item.id} delay={i * 80}>
              <PressableCard
                onPress={() => Alert.alert(item.project || item.text, `${item.supplier || item.author}\n${item.amount || ''}\n${item.status}`)}
                style={s.rowCard}
              >
                <View style={s.rowLeft}>
                  <View style={s.rowIconWrap}>
                    <Text style={s.rowIcon}>{item.status === 'Pending' ? '📋' : '✏️'}</Text>
                  </View>
                  <View style={s.rowTextWrap}>
                    <Text style={s.rowTitle} numberOfLines={1}>{item.supplier || item.text}</Text>
                    <Text style={s.rowSub} numberOfLines={1}>{item.project || item.author}</Text>
                    <View style={s.rowMeta}>
                      <Text style={s.rowDate}>{item.date || ''}</Text>
                      {item.amount ? <><Text style={s.rowDot}> · </Text><Text style={s.rowAmount}>{item.amount}</Text></> : null}
                    </View>
                  </View>
                </View>
                <View style={s.rowRight}>
                  <View style={[s.badge, { backgroundColor: item.status === 'Pending' ? COLORS.pendingBg : COLORS.draftBg }]}>
                    <View style={[s.badgeDot, { backgroundColor: item.status === 'Pending' ? COLORS.brand : COLORS.draft }]} />
                    <Text style={[s.badgeText, { color: item.status === 'Pending' ? COLORS.pending : COLORS.draft }]}>{item.status}</Text>
                  </View>
                  <Text style={s.chevron}>›</Text>
                </View>
              </PressableCard>
            </FadeSlideIn>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  heroBg: { height: 180 },
  heroImageStyle: { resizeMode: 'cover' },
  heroOverlay: { flex: 1, backgroundColor: COLORS.overlayDeep, justifyContent: 'flex-end', paddingBottom: SPACING.xl },
  heroRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xxl, gap: SPACING.lg },
  backBtn: { width: 44, height: 44, borderRadius: RADII.lg, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  backArrow: { fontSize: 20, color: '#FFFFFF', fontWeight: '600' },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display, letterSpacing: -0.5 },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: 100 },
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg, paddingHorizontal: SPACING.xs },
  statsCount: { fontSize: 13, color: COLORS.inkLight, fontFamily: FONTS.body, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingTop: 40 },
  emptyIcon: { fontSize: 36, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginBottom: SPACING.sm },
  emptyMsg: { fontSize: 13, color: COLORS.inkLight, fontFamily: FONTS.body, textAlign: 'center', lineHeight: 19, paddingHorizontal: SPACING.xxxl },
  rowCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.card, borderRadius: RADII.lg, paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1,
    borderColor: COLORS.cardBorder, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.6,
    shadowRadius: 8, elevation: 2,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: SPACING.md },
  rowIconWrap: { width: 44, height: 44, borderRadius: RADII.md, backgroundColor: COLORS.brandGlow, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md, borderWidth: 1, borderColor: 'rgba(240,90,0,0.06)' },
  rowIcon: { fontSize: 20 },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: 2 },
  rowSub: { fontSize: 13, color: COLORS.inkMid, fontFamily: FONTS.body, marginBottom: SPACING.xs },
  rowMeta: { flexDirection: 'row', alignItems: 'center' },
  rowDate: { fontSize: 11, color: COLORS.inkLight, fontFamily: FONTS.mono },
  rowDot: { fontSize: 11, color: COLORS.inkFaint },
  rowAmount: { fontSize: 11, fontWeight: '600', color: COLORS.brand, fontFamily: FONTS.mono },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADII.pill, gap: 5 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '600', fontFamily: FONTS.body, letterSpacing: 0.3 },
  chevron: { fontSize: 22, color: COLORS.inkFaint, fontWeight: '300' },
});
