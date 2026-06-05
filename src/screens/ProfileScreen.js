import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { getUserProfile } from '../services/firestoreService';
import { logoutUser } from '../services/authService';
import { auth } from '../services/firebaseConfig';

export default function ProfileScreen({ navigation, user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!user?.uid) return;
    getUserProfile(user.uid).then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, [user?.uid]);

  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');
  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'QW';

  // Fix: Use Firebase Auth creationTime instead of Firestore timestamp
  const joinedDate = auth.currentUser?.metadata?.creationTime
    ? new Date(auth.currentUser.metadata.creationTime).toLocaleDateString('en-NA', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : profile?.createdAt
      ? (profile.createdAt.seconds
        ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString('en-NA', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date(profile.createdAt).toLocaleDateString('en-NA', { year: 'numeric', month: 'long', day: 'numeric' }))
      : 'N/A';

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
              <Text style={s.headerTitle}>Profile</Text>
              <View style={{ width: rs(40) }} />
            </View>
          </FadeSlideIn>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={[s.content, { paddingBottom: rs(100) + insets.bottom }]}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.brand} style={{ marginTop: rs(40) }} />
        ) : (
          <>
            <FadeSlideIn>
              <View style={s.avatarSection}>
                <View style={s.avatarLarge}>
                  <Text style={s.avatarText}>{initials}</Text>
                </View>
                <Text style={s.name}>{displayName}</Text>
                <Text style={s.email}>{profile?.email || user?.email || ''}</Text>
                <View style={s.roleBadge}>
                  <Text style={s.roleText}>{profile?.role || 'User'}</Text>
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
                  <Text style={s.infoValue}>{profile?.role || 'User'}</Text>
                </View>
                {profile?.phone ? (
                  <>
                    <View style={s.infoDivider} />
                    <View style={s.infoRow}>
                      <Text style={s.infoLabel}>Phone</Text>
                      <Text style={s.infoValue}>{profile.phone}</Text>
                    </View>
                  </>
                ) : null}
                <View style={s.infoDivider} />
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>Joined</Text>
                  <Text style={s.infoValue}>{joinedDate}</Text>
                </View>
              </View>
            </FadeSlideIn>

            <FadeSlideIn delay={200}>
              <PressableCard onPress={() => navigation.navigate('EditProfile')} style={s.navCard}>
                <Ionicons name="create-outline" size={rs(22)} color={COLORS.brand} />
                <Text style={s.navCardLabel}>Edit Profile</Text>
                <Ionicons name="chevron-forward" size={rs(20)} color={COLORS.inkFaint} />
              </PressableCard>
            </FadeSlideIn>

            <FadeSlideIn delay={250}>
              <PressableCard onPress={() => navigation.navigate('Settings')} style={s.navCard}>
                <Ionicons name="settings-outline" size={rs(22)} color={COLORS.inkMid} />
                <Text style={s.navCardLabel}>Settings</Text>
                <Ionicons name="chevron-forward" size={rs(20)} color={COLORS.inkFaint} />
              </PressableCard>
            </FadeSlideIn>

            <FadeSlideIn delay={300}>
              <PressableCard
                onPress={() => {
                  Alert.alert('Sign Out', 'Switch to a different account?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Sign Out', style: 'destructive', onPress: async () => {
                      try { await logoutUser(); } catch (e) { /* handled by auth listener */ }
                    }},
                  ]);
                }}
                style={s.signOutCard}
              >
                <Ionicons name="log-out-outline" size={rs(22)} color={COLORS.error} />
                <Text style={s.signOutLabel}>Sign Out</Text>
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
  header: { backgroundColor: COLORS.brand, paddingBottom: rs(SPACING.xxl) },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.md) },
  backBtn: { width: rs(40), height: rs(40), borderRadius: RADII.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: rs(20), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.display },
  content: { paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.xxxl) },
  avatarSection: { alignItems: 'center', marginBottom: rs(SPACING.xxxl) },
  avatarLarge: {
    width: rs(80), height: rs(80), borderRadius: rs(40), backgroundColor: COLORS.brandGlow,
    alignItems: 'center', justifyContent: 'center', marginBottom: rs(SPACING.lg),
    borderWidth: rs(2), borderColor: COLORS.brand,
  },
  avatarText: { fontSize: rs(28), fontWeight: '800', color: COLORS.brand, fontFamily: FONTS.display },
  name: { fontSize: rs(22), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginBottom: rs(4) },
  email: { fontSize: rs(14), color: COLORS.inkLight, fontFamily: FONTS.body, marginBottom: rs(SPACING.md) },
  roleBadge: { backgroundColor: COLORS.brandGlow, borderRadius: RADII.pill, paddingHorizontal: rs(SPACING.lg), paddingVertical: rs(SPACING.sm) },
  roleText: { fontSize: rs(12), fontWeight: '600', color: COLORS.brand, fontFamily: FONTS.body, textTransform: 'capitalize' },
  infoCard: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: rs(SPACING.xl),
    marginBottom: rs(SPACING.xl), borderWidth: rs(1), borderColor: COLORS.cardBorder,
  },
  infoCardTitle: { fontSize: rs(16), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: rs(SPACING.lg) },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: rs(SPACING.sm) },
  infoLabel: { fontSize: rs(14), color: COLORS.inkLight, fontFamily: FONTS.body },
  infoValue: { fontSize: rs(14), color: COLORS.ink, fontFamily: FONTS.body, fontWeight: '500', flex: 1, textAlign: 'right' },
  infoDivider: { height: rs(1), backgroundColor: COLORS.divider },
  navCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADII.xxl, padding: rs(SPACING.xl), borderWidth: rs(1),
    borderColor: COLORS.cardBorder, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: rs(2) }, shadowOpacity: 0.4,
    shadowRadius: rs(8), elevation: 2, marginBottom: rs(SPACING.md),
  },
  navCardLabel: { fontSize: rs(16), fontWeight: '600', color: COLORS.ink, fontFamily: FONTS.body, flex: 1, marginLeft: rs(SPACING.md) },
  signOutCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.errorBg, borderRadius: RADII.xxl,
    padding: rs(SPACING.xl), borderWidth: rs(1), borderColor: 'rgba(220,38,38,0.15)',
    marginTop: rs(SPACING.xl),
  },
  signOutLabel: { fontSize: rs(16), fontWeight: '700', color: COLORS.error, fontFamily: FONTS.body, marginLeft: rs(SPACING.sm) },
});
