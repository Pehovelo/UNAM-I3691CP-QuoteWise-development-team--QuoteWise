import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADII } from '../constants/designTokens';
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
        { icon: '👤', label: 'Edit Profile', onPress: () => navigation.navigate('Profile') },
        { icon: '🔒', label: 'Change Password', onPress: () => navigation.navigate('ForgotPassword') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: '🔔', label: 'Notifications', onPress: () => Alert.alert('Coming Soon', 'Notifications will be available in a future update.') },
        { icon: '🎨', label: 'Appearance', onPress: () => Alert.alert('Coming Soon', 'Dark mode will be available in a future update.') },
        { icon: '🌐', label: 'Language', onPress: () => Alert.alert('Language', 'English (default)') },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: '📄', label: 'Terms of Service', onPress: () => Alert.alert('Terms', 'QuoteWise Terms of Service v3.0.0') },
        { icon: '🔒', label: 'Privacy Policy', onPress: () => Alert.alert('Privacy', 'QuoteWise Privacy Policy v3.0.0') },
        { icon: 'ℹ️', label: 'App Version', onPress: () => Alert.alert('Version', 'QuoteWise v3.0.0\nExpo SDK 55\nFirebase JS SDK') },
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
                <Text style={s.backArrow}>←</Text>
              </TouchableOpacity>
              <Text style={s.headerTitle}>Settings</Text>
              <View style={{ width: 40 }} />
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
                    <Text style={s.itemIcon}>{item.icon}</Text>
                    <Text style={s.itemLabel}>{item.label}</Text>
                    <Text style={s.itemChevron}>›</Text>
                  </PressableCard>
                </React.Fragment>
              ))}
            </View>
          </FadeSlideIn>
        ))}

        <FadeSlideIn delay={300}>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} accessibilityRole="button" accessibilityLabel="Sign out">
            <Text style={s.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </FadeSlideIn>

        <Text style={s.versionText}>QuoteWise v3.0.0 · Expo SDK 55 · Firebase</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { backgroundColor: COLORS.brand, paddingBottom: SPACING.xxl },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.xxl, paddingTop: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: RADII.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20, color: '#FFFFFF', fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.display },
  content: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xl, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.inkLight, fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.lg },
  sectionCard: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, borderWidth: 1,
    borderColor: COLORS.cardBorder, overflow: 'hidden',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 2,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.lg, paddingHorizontal: SPACING.lg },
  itemIcon: { fontSize: 20, marginRight: SPACING.md, width: 28, textAlign: 'center' },
  itemLabel: { fontSize: 15, color: COLORS.ink, fontFamily: FONTS.body, flex: 1 },
  itemChevron: { fontSize: 20, color: COLORS.inkFaint, fontWeight: '300' },
  itemDivider: { height: 1, backgroundColor: COLORS.divider, marginLeft: 56 },
  logoutBtn: {
    backgroundColor: COLORS.errorBg, borderRadius: RADII.xxl,
    paddingVertical: SPACING.lg, alignItems: 'center', marginTop: SPACING.xxxl,
    borderWidth: 1, borderColor: 'rgba(220,38,38,0.15)',
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: COLORS.error, fontFamily: FONTS.body },
  versionText: { fontSize: 12, color: COLORS.inkFaint, fontFamily: FONTS.mono, textAlign: 'center', marginTop: SPACING.xl },
});
