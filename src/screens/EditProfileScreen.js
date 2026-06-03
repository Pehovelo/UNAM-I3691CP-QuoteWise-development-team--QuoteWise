import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeSlideIn } from '../components/Animations';
import { getUserProfile, updateUserProfile } from '../services/firestoreService';
import { updateUserDisplayName } from '../services/authService';
import { auth } from '../services/firebaseConfig';

export default function EditProfileScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      try {
        const profile = await getUserProfile(uid);
        if (profile) {
          setDisplayName(profile.displayName || auth.currentUser?.displayName || '');
          setRole(profile.role || '');
          setCompanyName(profile.companyName || '');
          setPhone(profile.phone || '');
        } else {
          setDisplayName(auth.currentUser?.displayName || '');
        }
      } catch (err) {
        setDisplayName(auth.currentUser?.displayName || '');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Missing Field', 'Please enter a display name.');
      return;
    }
    setSaving(true);
    try {
      const uid = auth.currentUser?.uid;
      // Update Firebase Auth profile
      await updateUserDisplayName(displayName.trim());
      // Update Firestore user document
      await updateUserProfile(uid, {
        displayName: displayName.trim(),
        role: role.trim(),
        companyName: companyName.trim(),
        phone: phone.trim(),
      });
      Alert.alert('Profile Updated', 'Your profile has been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <View style={s.header}>
        <SafeAreaView>
          <View style={s.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityRole="button">
              <Ionicons name="arrow-back" size={rs(22)} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={s.headerTitle}>Edit Profile</Text>
            <View style={{ width: rs(40) }} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={[s.content, { paddingBottom: rs(60) + insets.bottom }]}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.brand} style={{ marginTop: rs(40) }} />
        ) : (
          <>
            <FadeSlideIn>
              <View style={s.avatarSection}>
                <View style={s.avatarLarge}>
                  <Text style={s.avatarText}>
                    {displayName ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'QW'}
                  </Text>
                </View>
              </View>
            </FadeSlideIn>

            <FadeSlideIn delay={60}>
              <View style={s.inputGroup}>
                <Text style={s.label}>Display Name *</Text>
                <View style={s.inputWrap}>
                  <Ionicons name="person-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
                  <TextInput style={s.input} value={displayName} onChangeText={setDisplayName} placeholder="Your name" placeholderTextColor={COLORS.inkFaint} autoCapitalize="words" />
                </View>
              </View>
            </FadeSlideIn>

            <FadeSlideIn delay={120}>
              <View style={s.inputGroup}>
                <Text style={s.label}>Role / Job Title</Text>
                <View style={s.inputWrap}>
                  <Ionicons name="briefcase-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
                  <TextInput style={s.input} value={role} onChangeText={setRole} placeholder="e.g. Freelancer, Contractor" placeholderTextColor={COLORS.inkFaint} autoCapitalize="words" />
                </View>
              </View>
            </FadeSlideIn>

            <FadeSlideIn delay={140}>
              <View style={s.inputGroup}>
                <Text style={s.label}>Company / Business Name</Text>
                <View style={s.inputWrap}>
                  <Ionicons name="business-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
                  <TextInput style={s.input} value={companyName} onChangeText={setCompanyName} placeholder="e.g. Imms Trading CC" placeholderTextColor={COLORS.inkFaint} autoCapitalize="words" />
                </View>
              </View>
            </FadeSlideIn>

            <FadeSlideIn delay={180}>
              <View style={s.inputGroup}>
                <Text style={s.label}>Phone Number</Text>
                <View style={s.inputWrap}>
                  <Ionicons name="call-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
                  <TextInput style={s.input} value={phone} onChangeText={setPhone} placeholder="+264 ..." placeholderTextColor={COLORS.inkFaint} keyboardType="phone-pad" />
                </View>
              </View>
            </FadeSlideIn>

            <FadeSlideIn delay={240}>
              <TouchableOpacity style={[s.saveBtn, saving && s.btnDisabled]} onPress={handleSave} disabled={saving} activeOpacity={0.8} accessibilityRole="button">
                {saving ? <ActivityIndicator color="#FFFFFF" /> : (
                  <><Text style={s.saveBtnText}>Save Changes</Text><Ionicons name="checkmark" size={rs(18)} color="#FFFFFF" /></>
                )}
              </TouchableOpacity>
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

  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: rs(SPACING.xxxl) },
  avatarLarge: {
    width: rs(80), height: rs(80), borderRadius: rs(40), backgroundColor: COLORS.brandGlow,
    alignItems: 'center', justifyContent: 'center', borderWidth: rs(2), borderColor: COLORS.brand,
  },
  avatarText: { fontSize: rs(28), fontWeight: '800', color: COLORS.brand, fontFamily: FONTS.display },

  // Inputs
  inputGroup: { marginBottom: rs(SPACING.xl) },
  label: { fontSize: rs(13), fontWeight: '600', color: COLORS.inkMid, fontFamily: FONTS.body, marginBottom: rs(SPACING.sm) },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADII.lg, borderWidth: rs(1), borderColor: COLORS.cardBorder, paddingHorizontal: rs(SPACING.md), height: rs(50) },
  inputIcon: { marginRight: rs(SPACING.sm) },
  input: { flex: 1, fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body, paddingVertical: 0 },

  // Save button
  saveBtn: {
    flexDirection: 'row', backgroundColor: COLORS.brand, borderRadius: RADII.xxl,
    paddingVertical: rs(16), alignItems: 'center', justifyContent: 'center', gap: rs(8),
    marginTop: rs(SPACING.xl), shadowColor: COLORS.brand, shadowOffset: { width: 0, height: rs(4) },
    shadowOpacity: 0.35, shadowRadius: rs(12), elevation: 6,
  },
  saveBtnText: { fontSize: rs(16), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body, letterSpacing: 0.3 },
  btnDisabled: { opacity: 0.6 },
});
