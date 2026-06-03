import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, IMAGES, height, rs } from '../constants/designTokens';

export default function SplashScreen({ onComplete }) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const btnY = useRef(new Animated.Value(20)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const bgScale = useRef(new Animated.Value(1.1)).current;

  useEffect(() => {
    Animated.timing(bgScale, { toValue: 1.0, duration: 3000, useNativeDriver: true }).start();
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
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <Animated.View style={[s.bgWrap, { transform: [{ scale: bgScale }] }]}>
        <Image source={IMAGES.splashBg} style={s.bgImage} resizeMode="cover" />
        <View style={s.bgOverlay} />
      </Animated.View>
      <View style={[s.circle, { width: rs(320), height: rs(320), top: -80, right: -80, opacity: 0.12 }]} />
      <View style={[s.circle, { width: rs(200), height: rs(200), bottom: 120, left: -60, opacity: 0.08 }]} />

      <View style={s.center}>
        <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
          <View style={s.logoWrap}>
            <Ionicons name="document-text" size={rs(44)} color="#FFFFFF" />
          </View>
        </Animated.View>
        <Animated.Text style={[s.title, { opacity: logoOpacity }]}>QuoteWise</Animated.Text>
        <Animated.Text style={[s.tagline, { opacity: taglineOpacity }]}>
          Smart Budgeting & Quotation
        </Animated.Text>
        <Animated.View style={[s.dividerWrap, { opacity: taglineOpacity }]}>
          <View style={s.dividerLine} />
          <View style={s.dividerDiamond} />
          <View style={s.dividerLine} />
        </Animated.View>
        <Animated.Text style={[s.subtitle, { opacity: taglineOpacity }]}>
          Manage supplier quotes,{'\n'}track estimates, close deals.
        </Animated.Text>
      </View>

      <Animated.View style={[s.btnWrap, { opacity: btnOpacity, transform: [{ translateY: btnY }, { scale: pulse }] }]}>
        <TouchableOpacity style={s.btn} onPress={onComplete} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel="Get Started">
          <Text style={s.btnText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={rs(20)} color={COLORS.brand} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.brand, justifyContent: 'space-between', paddingBottom: rs(48), overflow: 'hidden' },
  bgWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bgImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: undefined, height: undefined },
  bgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(240,90,0,0.72)' },
  circle: { position: 'absolute', borderRadius: RADII.pill, backgroundColor: '#FFFFFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxxl, zIndex: 2 },
  logoWrap: {
    width: rs(96), height: rs(96), borderRadius: rs(28), backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xxl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15,
    shadowRadius: 12, elevation: 4,
  },
  title: { fontSize: rs(42), fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display, letterSpacing: -1, marginBottom: SPACING.xs },
  tagline: { fontSize: rs(14), color: 'rgba(255,255,255,0.8)', letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: '500' },
  dividerWrap: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl, gap: SPACING.md },
  dividerLine: { width: rs(32), height: 1, backgroundColor: 'rgba(255,255,255,0.35)' },
  dividerDiamond: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  subtitle: { fontSize: rs(16), color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: rs(24), fontFamily: FONTS.body },
  btnWrap: { paddingHorizontal: SPACING.xxxl, zIndex: 2 },
  btn: {
    backgroundColor: '#FFFFFF', borderRadius: RADII.xxl, paddingVertical: rs(18),
    paddingHorizontal: SPACING.xxxl, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: SPACING.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25,
    shadowRadius: 20, elevation: 10,
  },
  btnText: { fontSize: rs(17), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.body, letterSpacing: 0.3 },
});
