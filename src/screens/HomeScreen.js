import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, ImageBackground, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADII, IMAGES, width } from '../constants/designTokens';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { subscribeQuotations } from '../services/firestoreService';

export default function HomeScreen({ navigation, user }) {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeQuotations((items) => {
      setQuotations(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const pendingCount = quotations.filter(q => q.status === 'Pending').length;
  const draftCount = quotations.filter(q => q.status === 'Draft').length;
  const savedCount = quotations.filter(q => q.status === 'Saved').length;
  const activeCount = pendingCount + draftCount;

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'QW';

  const tiles = [
    { label: 'Quotations', count: activeCount, icon: '🗂️', screen: 'Quotations', color: COLORS.brand, desc: 'Pending & active' },
    { label: 'Saved', count: savedCount, icon: '🔖', screen: 'Saved', color: COLORS.saved, desc: 'Archived quotes' },
    { label: 'Drafts', count: draftCount, icon: '✏️', screen: 'Drafts', color: COLORS.draft, desc: 'In progress' },
    { label: 'Settings', count: null, icon: '⚙️', screen: 'Settings', color: COLORS.inkLight, desc: 'Preferences' },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />

      <ImageBackground source={IMAGES.homeHeader} style={s.heroBg} imageStyle={s.heroImageStyle}>
        <View style={s.heroOverlay}>
          <SafeAreaView>
            <FadeSlideIn>
              <View style={s.header}>
                <View>
                  <Text style={s.greeting}>Good morning</Text>
                  <Text style={s.userName}>{user?.displayName || 'QuoteWise'}</Text>
                </View>
                <TouchableOpacity
                  style={s.avatar}
                  onPress={() => navigation.navigate('Profile')}
                  accessibilityRole="button"
                  accessibilityLabel="Profile"
                >
                  <Text style={s.avatarText}>{initials}</Text>
                </TouchableOpacity>
              </View>
            </FadeSlideIn>
          </SafeAreaView>
        </View>
      </ImageBackground>

      <View style={s.summaryContainer}>
        <FadeSlideIn delay={100} direction="up">
          <View style={s.summaryStrip}>
            <View style={s.summaryItem}>
              <Text style={s.summaryNum}>{loading ? '—' : activeCount}</Text>
              <Text style={s.summaryLabel}>Active</Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryItem}>
              <Text style={s.summaryNum}>{loading ? '—' : pendingCount}</Text>
              <Text style={s.summaryLabel}>Pending</Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryItem}>
              <Text style={s.summaryNum}>{loading ? '—' : savedCount}</Text>
              <Text style={s.summaryLabel}>Saved</Text>
            </View>
          </View>
        </FadeSlideIn>
      </View>

      <FadeSlideIn delay={150}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Dashboard</Text>
          <Text style={s.sectionSub}>Quick access to all sections</Text>
        </View>
      </FadeSlideIn>

      <ScrollView style={s.tilesScroll} contentContainerStyle={s.tilesGrid} showsVerticalScrollIndicator={false}>
        {tiles.map((tile, i) => (
          <FadeSlideIn key={tile.label} delay={200 + i * 70} style={s.tileWrapper}>
            <PressableCard onPress={() => navigation.navigate(tile.screen)} style={s.tile}>
              <View style={[s.tileIconWrap, { backgroundColor: `${tile.color}14` }]}>
                <Text style={s.tileIcon}>{tile.icon}</Text>
              </View>
              <Text style={s.tileLabel}>{tile.label}</Text>
              <Text style={s.tileDesc}>{tile.desc}</Text>
              <View style={s.tileBottom}>
                {tile.count !== null && (
                  <View style={[s.tilePill, { backgroundColor: tile.color }]}>
                    <Text style={s.tilePillText}>{loading ? '...' : tile.count}</Text>
                  </View>
                )}
                <Text style={[s.tileChevron, { color: tile.color }]}>›</Text>
              </View>
            </PressableCard>
          </FadeSlideIn>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  heroBg: { height: 200 },
  heroImageStyle: { resizeMode: 'cover' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(240,90,0,0.65)', justifyContent: 'flex-end' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.xxl,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 },
  userName: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display, letterSpacing: -0.5 },
  avatar: {
    width: 44, height: 44, borderRadius: RADII.lg,
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body, letterSpacing: 0.5 },
  summaryContainer: { marginTop: -28, zIndex: 10 },
  summaryStrip: {
    flexDirection: 'row', marginHorizontal: SPACING.xxl, backgroundColor: COLORS.brand,
    borderRadius: RADII.xxl, paddingVertical: SPACING.xl,
    shadowColor: COLORS.brand, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35,
    shadowRadius: 16, elevation: 8,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display, letterSpacing: -0.5 },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body, marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: SPACING.xs },
  sectionHeader: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxl, paddingBottom: SPACING.md },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, letterSpacing: -0.3 },
  sectionSub: { fontSize: 12, color: COLORS.inkLight, fontFamily: FONTS.body, marginTop: 2 },
  tilesScroll: { flex: 1 },
  tilesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxxl },
  tileWrapper: { width: (width - 44) / 2 },
  tile: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: SPACING.xl,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6, shadowRadius: 12, elevation: 3,
    minHeight: 160, justifyContent: 'space-between',
  },
  tileIconWrap: { width: 48, height: 48, borderRadius: RADII.lg, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  tileIcon: { fontSize: 22 },
  tileLabel: { fontSize: 16, fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: 2 },
  tileDesc: { fontSize: 11, color: COLORS.inkLight, fontFamily: FONTS.body, marginBottom: SPACING.md },
  tileBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tilePill: { borderRadius: RADII.md, paddingHorizontal: 8, paddingVertical: 3, minWidth: 24, alignItems: 'center' },
  tilePillText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
  tileChevron: { fontSize: 22, fontWeight: '300' },
});
