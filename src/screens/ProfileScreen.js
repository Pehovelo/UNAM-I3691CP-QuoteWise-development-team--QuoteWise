import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADII } from '../constants/designTokens';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { getUserProfile } from '../services/firestoreService';

export default function ProfileScreen({ navigation, user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    getUserProfile(user.uid).then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, [user?.uid]);

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'QW';

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
              <Text style={s.headerTitle}>Profile</Text>
              <View style={{ width: 40 }} />
            </View>
          </FadeSlideIn>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.brand} style={{ marginTop: 40 }} />
        ) : (
          <>
            <FadeSlideIn>
              <View style={s.avatarSection}>
                <View style={s.avatarLarge}>
                  <Text style={s.avatarText}>{initials}</Text>
                </View>
                <Text style={s.name}>{profile?.displayName || user?.displayName || 'User'}</Text>
                <Text style={s.email}>{profile?.email || user?.email || ''}</Text>
                <View style={s.roleBadge}>
                  <Text style={s.roleText}>{profile?.role || 'student'}</Text>
                </View>
              </View>
            </FadeSlideIn>

            <FadeSlideIn delay={100}>
              <View style={s.infoCard}>
                <Text style={s.infoCardTitle}>Account Information</Text>
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>User ID</Text>
                  <Text style={s.infoValue} numberOfLines={1}>{user?.uid?.slice(0, 20)}...</Text>
                </View>
                <View style={s.infoDivider} />
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>Email</Text>
                  <Text style={s.infoValue}>{profile?.email || user?.email}</Text>
                </View>
                <View style={s.infoDivider} />
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>Role</Text>
                  <Text style={s.infoValue}>{profile?.role || 'student'}</Text>
                </View>
                <View style={s.infoDivider} />
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>Joined</Text>
                  <Text style={s.infoValue}>
                    {profile?.createdAt
                      ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString()
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            </FadeSlideIn>

            <FadeSlideIn delay={200}>
              <PressableCard onPress={() => navigation.navigate('Settings')} style={s.navCard}>
                <Text style={s.navCardIcon}>⚙️</Text>
                <Text style={s.navCardLabel}>Settings</Text>
                <Text style={s.navCardChevron}>›</Text>
              </PressableCard>
            </FadeSlideIn>
          </>
        )}
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
  content: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxxl, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: SPACING.xxxl },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.brandGlow,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg,
    borderWidth: 2, borderColor: COLORS.brand,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: COLORS.brand, fontFamily: FONTS.display },
  name: { fontSize: 22, fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginBottom: 4 },
  email: { fontSize: 14, color: COLORS.inkLight, fontFamily: FONTS.body, marginBottom: SPACING.md },
  roleBadge: { backgroundColor: COLORS.brandGlow, borderRadius: RADII.pill, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  roleText: { fontSize: 12, fontWeight: '600', color: COLORS.brand, fontFamily: FONTS.body, textTransform: 'capitalize' },
  infoCard: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: SPACING.xl,
    marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  infoCardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: SPACING.lg },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  infoLabel: { fontSize: 14, color: COLORS.inkLight, fontFamily: FONTS.body },
  infoValue: { fontSize: 14, color: COLORS.ink, fontFamily: FONTS.body, fontWeight: '500', flex: 1, textAlign: 'right' },
  infoDivider: { height: 1, backgroundColor: COLORS.divider },
  navCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADII.xxl, padding: SPACING.xl, borderWidth: 1,
    borderColor: COLORS.cardBorder, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4,
    shadowRadius: 8, elevation: 2,
  },
  navCardIcon: { fontSize: 22, marginRight: SPACING.md },
  navCardLabel: { fontSize: 16, fontWeight: '600', color: COLORS.ink, fontFamily: FONTS.body, flex: 1 },
  navCardChevron: { fontSize: 22, color: COLORS.inkFaint, fontWeight: '300' },
});
