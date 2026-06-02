import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { logoutUser } from '../services/authService';

export default function SettingsScreen({ navigation, user }) {
  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        try { await logoutUser(); } catch (e) { Alert.alert('Error', 'Failed to sign out.'); }
      }},
    ]);
  };

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', onPress: () => navigation.navigate('Profile') },
        { icon: 'lock-closed-outline', label: 'Change Password', onPress: () => navigation.navigate('ForgotPassword') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => Alert.alert('Coming Soon', 'Notifications will be available in a future update.') },
        { icon: 'color-palette-outline', label: 'Appearance', onPress: () => Alert.alert('Coming Soon', 'Dark mode will be available in a future update.') },
        { icon: 'language-outline', label: 'Language', onPress: () => Alert.alert('Language', 'English (default)') },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: 'document-text-outline', label: 'Terms of Service', onPress: () => Alert.alert('Terms', 'QuoteWise Terms of Service v4.1.0') },
        { icon: 'shield-outline', label: 'Privacy Policy', onPress: () => Alert.alert('Privacy', 'QuoteWise Privacy Policy v4.1.0') },
        { icon: 'information-circle-outline', label: 'App Version', onPress: () => Alert.alert('Version', 'QuoteWise v4.1.0\nExpo SDK 55\nFirebase JS SDK') },
      ],
    },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <View style={s.header}>
        <SafeAreaView>
          <FadeSlideIn>
            <View style={s.headerContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityRole="button">
                <Ionicons name="arrow-back" size={rs(22)} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={s.headerTitle}>Settings</Text>
              <View style={{ width: rs(40) }} />
            </View>
          </FadeSlideIn>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {sections.map((section, si) => (
          <FadeSlideIn key={section.title} delay={si * 100}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.sectionCard}>
              {section.items.map((item, ii) => (
                <React.Fragment key={item.label}>
                  {ii > 0 && <View style={s.itemDivider} />}
                  <PressableCard onPress={item.onPress} style={s.itemRow}>
                    <Ionicons name={item.icon} size={rs(20)} color={COLORS.inkMid} />
                    <Text style={s.itemLabel}>{item.label}</Text>
                    <Ionicons name="chevron-forward" size={rs(18)} color={COLORS.inkFaint} />
                  </PressableCard>
                </React.Fragment>
              ))}
            </View>
          </FadeSlideIn>
        ))}

        <FadeSlideIn delay={300}>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} accessibilityRole="button" accessibilityLabel="Sign out">
            <Ionicons name="log-out-outline" size={rs(20)} color={COLORS.error} />
            <Text style={s.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </FadeSlideIn>

        <Text style={s.versionText}>QuoteWise v4.1.0 · Expo SDK 55 · Firebase</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { backgroundColor: COLORS.brand, paddingBottom: rs(SPACING.xxl) },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.md) },
  backBtn: { width: rs(40), height: rs(40), borderRadius: RADII.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: rs(20), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.display },
  content: { paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.xl), paddingBottom: rs(40) },
  sectionTitle: { fontSize: rs(13), fontWeight: '600', color: COLORS.inkLight, fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: rs(1), marginBottom: rs(SPACING.sm), marginTop: rs(SPACING.lg) },
  sectionCard: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, borderWidth: rs(1),
    borderColor: COLORS.cardBorder, overflow: 'hidden',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: rs(2) },
    shadowOpacity: 0.4, shadowRadius: rs(8), elevation: 2,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: rs(SPACING.lg), paddingHorizontal: rs(SPACING.lg) },
  itemLabel: { fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body, flex: 1, marginLeft: rs(SPACING.md) },
  itemDivider: { height: rs(1), backgroundColor: COLORS.divider, marginLeft: rs(56) },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rs(8),
    backgroundColor: COLORS.errorBg, borderRadius: RADII.xxl,
    paddingVertical: rs(SPACING.lg), marginTop: rs(SPACING.xxxl),
    borderWidth: rs(1), borderColor: 'rgba(220,38,38,0.15)',
  },
  logoutText: { fontSize: rs(16), fontWeight: '700', color: COLORS.error, fontFamily: FONTS.body },
  versionText: { fontSize: rs(12), color: COLORS.inkFaint, fontFamily: FONTS.mono, textAlign: 'center', marginTop: rs(SPACING.xl) },
});
