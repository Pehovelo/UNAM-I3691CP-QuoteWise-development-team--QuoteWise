import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, ImageBackground, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, IMAGES, rs, BOTTOM_SAFE, width } from '../constants/designTokens';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { subscribeQuotationCounts, subscribeQuoteCounts, getUserProfile } from '../services/firestoreService';
import { auth } from '../services/authService';

export default function HomeScreen({ navigation, user }) {
  const [counts, setCounts] = useState({ active: 0, draft: 0, saved: 0, total: 0 });
  const [quoteCounts, setQuoteCounts] = useState({ open: 0, responded: 0, closed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('client');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeQuotationCounts(user.uid, (c) => {
      setCounts(c);
      setLoading(false);
    });
    const unsub2 = subscribeQuoteCounts(user.uid, (c) => {
      setQuoteCounts(c);
    });
    // Load user profile for role
    getUserProfile(user.uid).then((profile) => {
      if (profile) {
        setUserRole(profile.role || 'client');
        setCompanyName(profile.companyName || '');
      }
    });
    return () => { unsub(); unsub2(); };
  }, [user?.uid]);

  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'QuoteWise');
  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'QW';

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Client dashboard tiles
  const clientTiles = [
    { label: 'My Requests', count: quoteCounts.total, icon: 'document-text', screen: 'Quotations', color: COLORS.brand, desc: 'Your posted projects' },
    { label: 'Compose', count: null, icon: 'add-circle', screen: 'Compose', color: COLORS.saved, desc: 'Post a new request' },
    { label: 'Saved', count: counts.saved, icon: 'bookmark', screen: 'Saved', color: COLORS.draft, desc: 'Archived quotes' },
    { label: 'Settings', count: null, icon: 'settings', screen: 'Settings', color: COLORS.inkLight, desc: 'Preferences' },
  ];

  // Provider dashboard tiles
  const providerTiles = [
    { label: 'Open Requests', count: quoteCounts.open, icon: 'search', screen: 'Quotations', color: COLORS.brand, desc: 'Available projects' },
    { label: 'My Quotes', count: quoteCounts.responded, icon: 'send', screen: 'Quotations', color: COLORS.saved, desc: 'Quotations sent' },
    { label: 'Saved', count: counts.saved, icon: 'bookmark', screen: 'Saved', color: COLORS.draft, desc: 'Archived items' },
    { label: 'Settings', count: null, icon: 'settings', screen: 'Settings', color: COLORS.inkLight, desc: 'Preferences' },
  ];

  const tiles = userRole === 'provider' ? providerTiles : clientTiles;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <ImageBackground source={IMAGES.homeHeader} style={s.heroBg} imageStyle={s.heroImageStyle}>
        <View style={s.heroOverlay}>
          <SafeAreaView>
            <FadeSlideIn>
              <View style={s.header}>
                <View>
                  <Text style={s.greeting}>{greeting()}</Text>
                  <Text style={s.userName}>{displayName}</Text>
                  {companyName ? <Text style={s.companyName}>{companyName}</Text> : null}
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
            {userRole === 'client' ? (
              <>
                <View style={s.summaryItem}>
                  <Text style={s.summaryNum}>{loading ? '—' : quoteCounts.open}</Text>
                  <Text style={s.summaryLabel}>Open</Text>
                </View>
                <View style={s.summaryDivider} />
                <View style={s.summaryItem}>
                  <Text style={s.summaryNum}>{loading ? '—' : quoteCounts.responded}</Text>
                  <Text style={s.summaryLabel}>Responded</Text>
                </View>
                <View style={s.summaryDivider} />
                <View style={s.summaryItem}>
                  <Text style={s.summaryNum}>{loading ? '—' : counts.draft}</Text>
                  <Text style={s.summaryLabel}>Draft</Text>
                </View>
              </>
            ) : (
              <>
                <View style={s.summaryItem}>
                  <Text style={s.summaryNum}>{loading ? '—' : quoteCounts.open}</Text>
                  <Text style={s.summaryLabel}>Available</Text>
                </View>
                <View style={s.summaryDivider} />
                <View style={s.summaryItem}>
                  <Text style={s.summaryNum}>{loading ? '—' : quoteCounts.responded}</Text>
                  <Text style={s.summaryLabel}>Submitted</Text>
                </View>
                <View style={s.summaryDivider} />
                <View style={s.summaryItem}>
                  <Text style={s.summaryNum}>{loading ? '—' : counts.saved}</Text>
                  <Text style={s.summaryLabel}>Saved</Text>
                </View>
              </>
            )}
          </View>
        </FadeSlideIn>
      </View>

      <FadeSlideIn delay={150}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Dashboard</Text>
          <Text style={s.sectionSub}>{userRole === 'provider' ? 'Service Provider' : 'Client Company'}</Text>
        </View>
      </FadeSlideIn>

      <ScrollView style={s.tilesScroll} contentContainerStyle={s.tilesGrid} showsVerticalScrollIndicator={false}>
        {tiles.map((tile, i) => (
          <FadeSlideIn key={tile.label} delay={200 + i * 70} style={s.tileWrapper}>
            <PressableCard onPress={() => navigation.navigate(tile.screen)} style={s.tile}>
              <View style={[s.tileIconWrap, { backgroundColor: `${tile.color}14` }]}>
                <Ionicons name={tile.icon} size={rs(22)} color={tile.color} />
              </View>
              <Text style={s.tileLabel}>{tile.label}</Text>
              <Text style={s.tileDesc}>{tile.desc}</Text>
              <View style={s.tileBottom}>
                {tile.count !== null && (
                  <View style={[s.tilePill, { backgroundColor: tile.color }]}>
                    <Text style={s.tilePillText}>{loading ? '...' : tile.count}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={rs(20)} color={tile.color} />
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
  heroBg: { height: rs(200) },
  heroImageStyle: { resizeMode: 'cover' },
  heroOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: rs(SPACING.xxl), paddingBottom: rs(SPACING.xxl),
  },
  greeting: { fontSize: rs(13), color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: rs(1.5), marginBottom: rs(2) },
  userName: { fontSize: rs(26), fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display, letterSpacing: rs(-0.5) },
  companyName: { fontSize: rs(12), color: 'rgba(255,255,255,0.6)', fontFamily: FONTS.body, marginTop: rs(2) },
  avatar: {
    width: rs(44), height: rs(44), borderRadius: RADII.lg,
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: rs(1.5),
    borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: rs(12), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body, letterSpacing: rs(0.5) },
  summaryContainer: { marginTop: rs(-28), zIndex: 10 },
  summaryStrip: {
    flexDirection: 'row', marginHorizontal: rs(SPACING.xxl), backgroundColor: COLORS.brand,
    borderRadius: RADII.xxl, paddingVertical: rs(SPACING.xl),
    shadowColor: COLORS.brand, shadowOffset: { width: 0, height: rs(8) }, shadowOpacity: 0.35,
    shadowRadius: rs(16), elevation: 8,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: rs(26), fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display, letterSpacing: rs(-0.5) },
  summaryLabel: { fontSize: rs(11), color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body, marginTop: rs(2), textTransform: 'uppercase', letterSpacing: rs(1) },
  summaryDivider: { width: rs(1), backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: rs(SPACING.xs) },
  sectionHeader: { paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.xxl), paddingBottom: rs(SPACING.md) },
  sectionTitle: { fontSize: rs(18), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, letterSpacing: rs(-0.3) },
  sectionSub: { fontSize: rs(12), color: COLORS.brand, fontFamily: FONTS.body, marginTop: rs(2), fontWeight: '600' },
  tilesScroll: { flex: 1 },
  tilesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: rs(SPACING.lg), gap: rs(SPACING.md), paddingBottom: rs(100) + BOTTOM_SAFE },
  tileWrapper: { width: (width - rs(44)) / 2 },
  tile: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: rs(SPACING.xl),
    borderWidth: rs(1), borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: rs(4) },
    shadowOpacity: 0.6, shadowRadius: rs(12), elevation: 3,
    minHeight: rs(160), justifyContent: 'space-between',
  },
  tileIconWrap: { width: rs(48), height: rs(48), borderRadius: RADII.lg, alignItems: 'center', justifyContent: 'center', marginBottom: rs(SPACING.md) },
  tileLabel: { fontSize: rs(16), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: rs(2) },
  tileDesc: { fontSize: rs(11), color: COLORS.inkLight, fontFamily: FONTS.body, marginBottom: rs(SPACING.md) },
  tileBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tilePill: { borderRadius: RADII.md, paddingHorizontal: rs(8), paddingVertical: rs(3), minWidth: rs(24), alignItems: 'center' },
  tilePillText: { fontSize: rs(11), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
});
