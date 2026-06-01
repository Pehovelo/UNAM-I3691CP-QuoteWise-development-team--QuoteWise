import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

// ─── Asset Images ─────────────────────────────────────────────────────────────
const IMAGES = {
  splashBg: require('./assets/images/splash_bg.jpg'),
  homeHeader: require('./assets/images/home_header.jpg'),
  quotationsHeader: require('./assets/images/quotations_header.jpg'),
  savedHeader: require('./assets/images/saved_header.jpg'),
  draftsHeader: require('./assets/images/drafts_header.jpg'),
  desertShadow: require('./assets/images/desert_shadow.jpg'),
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  brand: '#F05A00',
  brandDeep: '#C24600',
  brandLight: '#FF7A2F',
  brandGlow: 'rgba(240,90,0,0.12)',
  brandMist: 'rgba(240,90,0,0.06)',
  ink: '#1A0A00',
  inkMid: '#5C3A1E',
  inkLight: '#A07050',
  inkFaint: '#C4A88A',
  surface: '#FFFAF7',
  card: '#FFFFFF',
  cardBorder: 'rgba(240,90,0,0.10)',
  pending: '#F05A00',
  pendingBg: 'rgba(240,90,0,0.10)',
  draft: '#8B6914',
  draftBg: 'rgba(139,105,20,0.10)',
  saved: '#1A6B4A',
  savedBg: 'rgba(26,107,74,0.10)',
  shadow: 'rgba(240,90,0,0.15)',
  divider: 'rgba(240,90,0,0.08)',
  overlay: 'rgba(240,90,0,0.55)',
  overlayDeep: 'rgba(26,10,0,0.65)',
  overlayLight: 'rgba(255,250,247,0.85)',
};

const FONTS = {
  display: isIOS ? 'Georgia' : 'serif',
  body: isIOS ? 'Helvetica Neue' : 'sans-serif',
  mono: isIOS ? 'Courier New' : 'monospace',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

const RADII = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_QUOTATIONS = [
  { id: 'QT-001', supplier: 'Imms Trading CC', project: 'Office Renovation Phase 2', date: '2026-04-01', amount: 'N$ 145,500', status: 'Pending' },
  { id: 'QT-002', supplier: 'Imms Trading CC', project: 'Warehouse Electrical', date: '2026-04-01', amount: 'N$ 78,200', status: 'Pending' },
  { id: 'QT-003', supplier: 'BuildMat Suppliers', project: 'Concrete Foundation Mix', date: '2026-03-28', amount: 'N$ 34,900', status: 'Draft' },
  { id: 'QT-004', supplier: 'NamSteel Works', project: 'Structural Steel Frame', date: '2026-03-15', amount: 'N$ 267,000', status: 'Draft' },
  { id: 'QT-005', supplier: 'Imms Trading CC', project: 'Plumbing & Sanitary', date: '2026-02-20', amount: 'N$ 52,800', status: 'Saved' },
  { id: 'QT-006', supplier: 'ElectraConnect', project: 'LV Distribution Board', date: '2026-02-10', amount: 'N$ 91,400', status: 'Saved' },
];

// ─── Animated Components ──────────────────────────────────────────────────────

function FadeSlideIn({ children, delay = 0, style, direction = 'up' }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateVal = direction === 'up' ? 24 : direction === 'down' ? -24 : 0;
  const translateXVal = direction === 'left' ? 24 : direction === 'right' ? -24 : 0;
  const translateY = useRef(new Animated.Value(translateVal)).current;
  const translateX = useRef(new Animated.Value(translateXVal)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 480,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }, { translateX }] }, style]}>
      {children}
    </Animated.View>
  );
}

function PressableCard({ children, onPress, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 12,
    }).start();
  }, []);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 12,
    }).start();
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}



// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    Pending: { color: COLORS.pending, bg: COLORS.pendingBg, dot: COLORS.brand },
    Draft: { color: COLORS.draft, bg: COLORS.draftBg, dot: COLORS.draft },
    Saved: { color: COLORS.saved, bg: COLORS.savedBg, dot: COLORS.saved },
  }[status] || { color: COLORS.inkLight, bg: COLORS.cardBorder, dot: COLORS.inkLight };

  return (
    <View style={[badgeStyles.container, { backgroundColor: config.bg }]}>
      <View style={[badgeStyles.dot, { backgroundColor: config.dot }]} />
      <Text style={[badgeStyles.text, { color: config.color }]}>{status}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: FONTS.body,
    letterSpacing: 0.3,
  },
});

// ─── Quotation Row ────────────────────────────────────────────────────────────
function QuotationRow({ quotation, index, onPress }) {
  const statusIcons = { Pending: '📋', Draft: '✏️', Saved: '🔖' };
  return (
    <FadeSlideIn delay={index * 80}>
      <PressableCard onPress={onPress} style={rowStyles.card}>
        <View style={rowStyles.left}>
          <View style={rowStyles.iconWrap}>
            <Text style={rowStyles.icon}>{statusIcons[quotation.status] || '📄'}</Text>
          </View>
          <View style={rowStyles.textWrap}>
            <Text style={rowStyles.supplier} numberOfLines={1}>{quotation.supplier}</Text>
            <Text style={rowStyles.project} numberOfLines={1}>{quotation.project}</Text>
            <View style={rowStyles.metaRow}>
              <Text style={rowStyles.date}>{quotation.date}</Text>
              <Text style={rowStyles.dotSep}> · </Text>
              <Text style={rowStyles.amount}>{quotation.amount}</Text>
            </View>
          </View>
        </View>
        <View style={rowStyles.right}>
          <StatusBadge status={quotation.status} />
          <Text style={rowStyles.chevron}>›</Text>
        </View>
      </PressableCard>
    </FadeSlideIn>
  );
}

const rowStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADII.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADII.md,
    backgroundColor: COLORS.brandGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(240,90,0,0.06)',
  },
  icon: { fontSize: 20 },
  textWrap: { flex: 1 },
  supplier: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
    fontFamily: FONTS.body,
    marginBottom: 2,
  },
  project: {
    fontSize: 13,
    color: COLORS.inkMid,
    fontFamily: FONTS.body,
    marginBottom: SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 11,
    color: COLORS.inkLight,
    fontFamily: FONTS.mono,
  },
  dotSep: {
    fontSize: 11,
    color: COLORS.inkFaint,
  },
  amount: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.brand,
    fontFamily: FONTS.mono,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  chevron: {
    fontSize: 22,
    color: COLORS.inkFaint,
    fontWeight: '300',
  },
});

// ─── Hero Header (reusable for list screens) ──────────────────────────────────
function HeroHeader({ image, title, subtitle, goBack }) {
  return (
    <View style={heroStyles.wrapper}>
      <ImageBackground
        source={image}
        style={heroStyles.imageBg}
        imageStyle={heroStyles.imageStyle}
      >
        <View style={heroStyles.overlay}>
          <SafeAreaView>
            <FadeSlideIn>
              <View style={heroStyles.row}>
                <TouchableOpacity onPress={goBack} style={heroStyles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                  <Text style={heroStyles.backArrow}>←</Text>
                </TouchableOpacity>
                <View style={heroStyles.textWrap}>
                  <Text style={heroStyles.title}>{title}</Text>
                  <Text style={heroStyles.subtitle}>{subtitle}</Text>
                </View>
              </View>
            </FadeSlideIn>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const heroStyles = StyleSheet.create({
  wrapper: {
    height: 180,
    overflow: 'hidden',
  },
  imageBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlayDeep,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.lg,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: RADII.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: FONTS.display,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONTS.body,
    marginTop: 2,
    letterSpacing: 0.3,
  },
});

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ onStart }) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const btnY = useRef(new Animated.Value(20)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const bgScale = useRef(new Animated.Value(1.1)).current;

  useEffect(() => {
    // Subtle Ken Burns zoom on background
    Animated.timing(bgScale, {
      toValue: 1.0,
      duration: 3000,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(btnOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(btnY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
      ]),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.04, duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={splashStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />

      {/* Background image with Ken Burns zoom */}
      <Animated.View style={[splashStyles.bgWrap, { transform: [{ scale: bgScale }] }]}>
        <Image
          source={IMAGES.splashBg}
          style={splashStyles.bgImage}
          resizeMode="cover"
        />
        <View style={splashStyles.bgOverlay} />
      </Animated.View>

      {/* Decorative circles */}
      <View style={[splashStyles.circle, { width: 320, height: 320, top: -80, right: -80, opacity: 0.12 }]} />
      <View style={[splashStyles.circle, { width: 200, height: 200, bottom: 120, left: -60, opacity: 0.08 }]} />
      <View style={[splashStyles.circle, { width: 140, height: 140, top: height * 0.32, right: -30, opacity: 0.06 }]} />

      {/* Center content */}
      <View style={splashStyles.center}>
        <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
          <View style={splashStyles.logoWrap}>
            <Text style={splashStyles.logoEmoji}>🧾</Text>
          </View>
        </Animated.View>

        <Animated.Text style={[splashStyles.title, { opacity: logoOpacity }]}>
          QuoteWise
        </Animated.Text>

        <Animated.Text style={[splashStyles.tagline, { opacity: taglineOpacity }]}>
          Smart Budgeting & Quotation
        </Animated.Text>

        <Animated.View style={[splashStyles.dividerWrap, { opacity: taglineOpacity }]}>
          <View style={splashStyles.dividerLine} />
          <Text style={splashStyles.dividerDiamond}>◆</Text>
          <View style={splashStyles.dividerLine} />
        </Animated.View>

        <Animated.Text style={[splashStyles.subtitle, { opacity: taglineOpacity }]}>
          Manage supplier quotes,{'\n'}track estimates, close deals.
        </Animated.Text>
      </View>

      {/* CTA button */}
      <Animated.View
        style={[
          splashStyles.btnWrap,
          { opacity: btnOpacity, transform: [{ translateY: btnY }, { scale: pulse }] },
        ]}
      >
        <TouchableOpacity
          style={splashStyles.btn}
          onPress={onStart}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <Text style={splashStyles.btnText}>Get Started</Text>
          <Text style={splashStyles.btnArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand,
    justifyContent: 'space-between',
    paddingBottom: 48,
    overflow: 'hidden',
  },
  bgWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: undefined,
    height: undefined,
  },
  bgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(240,90,0,0.72)',
  },
  circle: {
    position: 'absolute',
    borderRadius: RADII.pill,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxxl,
    zIndex: 2,
  },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  logoEmoji: { fontSize: 44 },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: FONTS.display,
    letterSpacing: -1,
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    fontFamily: FONTS.body,
    fontWeight: '500',
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
    gap: SPACING.md,
  },
  dividerLine: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dividerDiamond: {
    fontSize: 6,
    color: 'rgba(255,255,255,0.5)',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: FONTS.body,
  },
  btnWrap: {
    paddingHorizontal: SPACING.xxxl,
    zIndex: 2,
  },
  btn: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADII.xxl,
    paddingVertical: 18,
    paddingHorizontal: SPACING.xxxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  btnText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.brand,
    fontFamily: FONTS.body,
    letterSpacing: 0.3,
  },
  btnArrow: {
    fontSize: 20,
    color: COLORS.brand,
    fontWeight: '600',
  },
});

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ navigate }) {
  const pendingCount = MOCK_QUOTATIONS.filter(q => q.status === 'Pending').length;
  const draftCount = MOCK_QUOTATIONS.filter(q => q.status === 'Draft').length;
  const savedCount = MOCK_QUOTATIONS.filter(q => q.status === 'Saved').length;
  const activeCount = pendingCount + draftCount;

  const tiles = [
    { label: 'Quotations', count: activeCount, icon: '🗂️', screen: 'quotations', color: COLORS.brand, desc: 'Pending & active' },
    { label: 'Saved', count: savedCount, icon: '🔖', screen: 'saved', color: COLORS.saved, desc: 'Archived quotes' },
    { label: 'Drafts', count: draftCount, icon: '✏️', screen: 'drafts', color: COLORS.draft, desc: 'In progress' },
    { label: 'Settings', count: null, icon: '⚙️', screen: null, color: COLORS.inkLight, desc: 'Preferences' },
  ];

  return (
    <View style={homeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />

      {/* Hero header with image */}
      <ImageBackground
        source={IMAGES.homeHeader}
        style={homeStyles.heroBg}
        imageStyle={homeStyles.heroImageStyle}
      >
        <View style={homeStyles.heroOverlay}>
          <SafeAreaView>
            <FadeSlideIn>
              <View style={homeStyles.header}>
                <View>
                  <Text style={homeStyles.greeting}>Good morning</Text>
                  <Text style={homeStyles.title}>QuoteWise</Text>
                </View>
                <TouchableOpacity style={homeStyles.avatar} accessibilityRole="button" accessibilityLabel="Profile">
                  <Text style={homeStyles.avatarText}>QW</Text>
                </TouchableOpacity>
              </View>
            </FadeSlideIn>
          </SafeAreaView>
        </View>
      </ImageBackground>

      {/* Summary strip - floating over hero */}
      <View style={homeStyles.summaryContainer}>
        <FadeSlideIn delay={100} direction="up">
          <View style={homeStyles.summaryStrip}>
            <View style={homeStyles.summaryItem}>
              <Text style={homeStyles.summaryNum}>{activeCount}</Text>
              <Text style={homeStyles.summaryLabel}>Active</Text>
            </View>
            <View style={homeStyles.summaryDivider} />
            <View style={homeStyles.summaryItem}>
              <Text style={homeStyles.summaryNum}>{pendingCount}</Text>
              <Text style={homeStyles.summaryLabel}>Pending</Text>
            </View>
            <View style={homeStyles.summaryDivider} />
            <View style={homeStyles.summaryItem}>
              <Text style={homeStyles.summaryNum}>{savedCount}</Text>
              <Text style={homeStyles.summaryLabel}>Saved</Text>
            </View>
          </View>
        </FadeSlideIn>
      </View>

      {/* Section label */}
      <FadeSlideIn delay={150}>
        <View style={homeStyles.sectionHeader}>
          <Text style={homeStyles.sectionTitle}>Dashboard</Text>
          <Text style={homeStyles.sectionSub}>Quick access to all sections</Text>
        </View>
      </FadeSlideIn>

      {/* Tiles */}
      <ScrollView
        style={homeStyles.tilesScroll}
        contentContainerStyle={homeStyles.tilesGrid}
        showsVerticalScrollIndicator={false}
      >
        {tiles.map((tile, i) => (
          <FadeSlideIn key={tile.label} delay={200 + i * 70} style={homeStyles.tileWrapper}>
            <PressableCard
              onPress={() => tile.screen
                ? navigate(tile.screen)
                : Alert.alert('Settings', 'Coming in the next update ✨')
              }
              style={homeStyles.tile}
            >
              <View style={[homeStyles.tileIconWrap, { backgroundColor: `${tile.color}14` }]}>
                <Text style={homeStyles.tileIcon}>{tile.icon}</Text>
              </View>
              <Text style={homeStyles.tileLabel}>{tile.label}</Text>
              <Text style={homeStyles.tileDesc}>{tile.desc}</Text>
              <View style={homeStyles.tileBottom}>
                {tile.count !== null && (
                  <View style={[homeStyles.tilePill, { backgroundColor: tile.color }]}>
                    <Text style={homeStyles.tilePillText}>{tile.count}</Text>
                  </View>
                )}
                <Text style={[homeStyles.tileChevron, { color: tile.color }]}>›</Text>
              </View>
            </PressableCard>
          </FadeSlideIn>
        ))}
      </ScrollView>
    </View>
  );
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  heroBg: {
    height: 200,
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(240,90,0,0.65)',
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONTS.body,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: FONTS.display,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: RADII.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: FONTS.body,
    letterSpacing: 0.5,
  },
  summaryContainer: {
    marginTop: -28,
    zIndex: 10,
  },
  summaryStrip: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xxl,
    backgroundColor: COLORS.brand,
    borderRadius: RADII.xxl,
    paddingVertical: SPACING.xl,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: FONTS.display,
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONTS.body,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: SPACING.xs,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ink,
    fontFamily: FONTS.display,
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.inkLight,
    fontFamily: FONTS.body,
    marginTop: 2,
  },
  tilesScroll: { flex: 1 },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  tileWrapper: { width: (width - 44) / 2 },
  tile: {
    backgroundColor: COLORS.card,
    borderRadius: RADII.xxl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 3,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  tileIconWrap: {
    width: 48,
    height: 48,
    borderRadius: RADII.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  tileIcon: { fontSize: 22 },
  tileLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
    fontFamily: FONTS.body,
    marginBottom: 2,
  },
  tileDesc: {
    fontSize: 11,
    color: COLORS.inkLight,
    fontFamily: FONTS.body,
    marginBottom: SPACING.md,
  },
  tileBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tilePill: {
    borderRadius: RADII.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 24,
    alignItems: 'center',
  },
  tilePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: FONTS.body,
  },
  tileChevron: {
    fontSize: 22,
    fontWeight: '300',
  },
});

// ─── LIST SCREEN (shared for Quotations, Saved, Drafts) ───────────────────────
function ListScreen({ title, subtitle, data, goBack, showFab, heroImage }) {
  const emptyMessage = {
    'Quotations': 'No quotations yet. Your active and pending estimates will appear here.',
    'Saved': 'No saved quotations yet. Finalized estimates will be archived here.',
    'Drafts': 'No drafts yet. Start a new quotation and save it as a draft.',
  }[title] || 'No items to display.';

  return (
    <View style={listStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />

      {/* Hero header with image */}
      <HeroHeader
        image={heroImage}
        title={title}
        subtitle={subtitle}
        goBack={goBack}
      />

      {/* List */}
      <ScrollView
        style={listStyles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={listStyles.scrollContent}
      >
        {/* Stats bar */}
        <FadeSlideIn delay={50}>
          <View style={listStyles.statsBar}>
            <Text style={listStyles.statsCount}>{data.length} {data.length === 1 ? 'item' : 'items'}</Text>
            <TouchableOpacity style={listStyles.filterBtn}>
              <Text style={listStyles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </FadeSlideIn>

        {data.length === 0 ? (
          <FadeSlideIn delay={150}>
            <View style={listStyles.emptyState}>
              <ImageBackground
                source={IMAGES.desertShadow}
                style={listStyles.emptyImage}
                imageStyle={listStyles.emptyImageStyle}
              >
                <View style={listStyles.emptyOverlay}>
                  <Text style={listStyles.emptyIcon}>📋</Text>
                  <Text style={listStyles.emptyTitle}>Nothing here yet</Text>
                  <Text style={listStyles.emptyMsg}>{emptyMessage}</Text>
                </View>
              </ImageBackground>
            </View>
          </FadeSlideIn>
        ) : (
          data.map((item, i) => (
            <QuotationRow
              key={item.id}
              quotation={item}
              index={i}
              onPress={() => Alert.alert(item.project, `${item.supplier}\n${item.amount}\n${item.status}`)}
            />
          ))
        )}
      </ScrollView>

      {/* FAB for Drafts */}
      {showFab && (
        <FadeSlideIn delay={400}>
          <TouchableOpacity
            style={listStyles.fab}
            activeOpacity={0.85}
            onPress={() => Alert.alert('New Draft', 'Draft creation coming with Firebase integration')}
            accessibilityRole="button"
            accessibilityLabel="Create new draft"
          >
            <Text style={listStyles.fabIcon}>+</Text>
            <Text style={listStyles.fabText}>New Draft</Text>
          </TouchableOpacity>
        </FadeSlideIn>
      )}
    </View>
  );
}

const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: 100,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xs,
  },
  statsCount: {
    fontSize: 13,
    color: COLORS.inkLight,
    fontFamily: FONTS.body,
    fontWeight: '500',
  },
  filterBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.brandGlow,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.brand,
    fontFamily: FONTS.body,
    fontWeight: '600',
  },
  emptyState: {
    borderRadius: RADII.xxl,
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  emptyImage: {
    height: 220,
    justifyContent: 'flex-end',
  },
  emptyImageStyle: {
    resizeMode: 'cover',
  },
  emptyOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,250,247,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ink,
    fontFamily: FONTS.display,
    marginBottom: SPACING.sm,
  },
  emptyMsg: {
    fontSize: 13,
    color: COLORS.inkLight,
    fontFamily: FONTS.body,
    textAlign: 'center',
    lineHeight: 19,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brand,
    borderRadius: RADII.xxl,
    paddingLeft: 18,
    paddingRight: SPACING.xxl,
    paddingVertical: SPACING.xl,
    gap: SPACING.sm,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  fabText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: FONTS.body,
  },
});

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('splash');

  const navigate = (s) => setScreen(s);
  const goBack = () => setScreen('home');

  if (screen === 'splash') return <SplashScreen onStart={() => navigate('home')} />;
  if (screen === 'home') return <HomeScreen navigate={navigate} />;
  if (screen === 'quotations') {
    return (
      <ListScreen
        title="Quotations"
        subtitle="Pending & active estimates"
        data={MOCK_QUOTATIONS.filter(q => q.status === 'Pending' || q.status === 'Draft')}
        goBack={goBack}
        showFab={false}
        heroImage={IMAGES.quotationsHeader}
      />
    );
  }
  if (screen === 'saved') {
    return (
      <ListScreen
        title="Saved"
        subtitle="Archived & saved estimates"
        data={MOCK_QUOTATIONS.filter(q => q.status === 'Saved')}
        goBack={goBack}
        showFab={false}
        heroImage={IMAGES.savedHeader}
      />
    );
  }
  if (screen === 'drafts') {
    return (
      <ListScreen
        title="Drafts"
        subtitle="Work-in-progress quotations"
        data={MOCK_QUOTATIONS.filter(q => q.status === 'Draft')}
        goBack={goBack}
        showFab={true}
        heroImage={IMAGES.draftsHeader}
      />
    );
  }
  return null;
}
