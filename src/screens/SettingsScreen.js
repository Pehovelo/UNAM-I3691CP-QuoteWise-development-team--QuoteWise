import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Alert, Modal, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { logoutUser, deleteUserAccount, auth } from '../services/authService';
import { deleteAllUserData } from '../services/firestoreService';

const TERMS_TEXT = `QuoteWise Terms of Service

Last updated: June 2026

1. Use of Service
QuoteWise is provided as-is for managing business quotations. You are responsible for the accuracy of your quotes and any business decisions made based on them.

2. Data
Your quotation data is stored securely via Firebase. We do not share your data with third parties. All data transmission is encrypted using industry-standard protocols.

3. Account
You are responsible for maintaining the security of your account credentials. You must not share your password with any other person or entity. You must notify us immediately of any unauthorised use of your account.

4. Liability
QuoteWise is not liable for any financial decisions made based on quotes generated in this app. The app provides tools for quotation management only and does not constitute financial or legal advice.

5. Intellectual Property
All content, design, and functionality of the QuoteWise app are the property of QuoteWise and its developers. You may not reproduce, distribute, or create derivative works without written permission.

6. Changes
We may update these terms at any time. Continued use of the app constitutes acceptance of the updated terms. Significant changes will be communicated through the app or via email.

7. Termination
We reserve the right to suspend or terminate your account if you violate these terms. Upon termination, your data will be deleted in accordance with our data retention policy.

Contact: support@quotewise.app`;

const PRIVACY_TEXT = `QuoteWise Privacy Policy

Last updated: June 2026

What we collect:
- Your email address (for authentication)
- Quotation data you create (stored in Firebase Firestore)
- Display name and profile information you provide
- Basic usage data (via Firebase Analytics, if enabled)

What we do NOT collect:
- Your payment information
- Your contacts or address book
- Your location data
- Access to your device camera or microphone
- Personal files from your device

How we use your data:
- To authenticate and secure your account
- To store and retrieve your quotation data
- To improve app performance and user experience
- To send critical account-related notifications

Your data:
- You can delete your account and all data at any time from Settings
- Data is stored on Google Firebase servers (africa-south1 region)
- All data is encrypted in transit and at rest
- We comply with applicable Namibian data protection regulations

Data retention:
- Active account data is retained as long as your account exists
- Upon account deletion, all personal data is permanently removed within 30 days
- Anonymised usage statistics may be retained for analytics purposes

Third-party services:
- Firebase (Google) for authentication and data storage
- Expo for application delivery and updates

Contact: privacy@quotewise.app`;

export default function SettingsScreen({ navigation, user }) {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        try { await logoutUser(); } catch (e) { Alert.alert('Error', 'Failed to sign out.'); }
      }},
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all quotations. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Everything', style: 'destructive', onPress: async () => {
          setDeleting(true);
          try {
            await deleteAllUserData(user?.uid);
            await deleteUserAccount();
          } catch (err) {
            const msg = err.code === 'auth/requires-recent-login'
              ? 'Please sign out and sign back in, then try again. This action requires recent authentication.'
              : 'Failed to delete account. Please try again.';
            Alert.alert('Error', msg);
            setDeleting(false);
          }
        }},
      ]
    );
  };

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', onPress: () => navigation.navigate('EditProfile') },
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
        { icon: 'document-text-outline', label: 'Terms of Service', onPress: () => setShowTerms(true) },
        { icon: 'shield-outline', label: 'Privacy Policy', onPress: () => setShowPrivacy(true) },
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

        <FadeSlideIn delay={350}>
          <TouchableOpacity style={s.deleteBtn} onPress={handleDeleteAccount} disabled={deleting} accessibilityRole="button" accessibilityLabel="Delete account">
            {deleting ? <ActivityIndicator color={COLORS.error} size="small" /> : (
              <><Ionicons name="trash-outline" size={rs(20)} color={COLORS.error} /><Text style={s.deleteText}>Delete Account</Text></>
            )}
          </TouchableOpacity>
        </FadeSlideIn>

        <Text style={s.versionText}>QuoteWise v4.1.0 · Expo SDK 55 · Firebase</Text>
      </ScrollView>

      {/* Terms of Service Modal */}
      <Modal visible={showTerms} animationType="slide" onRequestClose={() => setShowTerms(false)}>
        <View style={s.modalContainer}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Terms of Service</Text>
            <TouchableOpacity onPress={() => setShowTerms(false)} style={s.modalCloseBtn} accessibilityRole="button">
              <Ionicons name="close" size={rs(24)} color={COLORS.ink} />
            </TouchableOpacity>
          </View>
          <ScrollView style={s.modalScroll} contentContainerStyle={s.modalContent}>
            <Text style={s.modalBody}>{TERMS_TEXT}</Text>
          </ScrollView>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal visible={showPrivacy} animationType="slide" onRequestClose={() => setShowPrivacy(false)}>
        <View style={s.modalContainer}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Privacy Policy</Text>
            <TouchableOpacity onPress={() => setShowPrivacy(false)} style={s.modalCloseBtn} accessibilityRole="button">
              <Ionicons name="close" size={rs(24)} color={COLORS.ink} />
            </TouchableOpacity>
          </View>
          <ScrollView style={s.modalScroll} contentContainerStyle={s.modalContent}>
            <Text style={s.modalBody}>{PRIVACY_TEXT}</Text>
          </ScrollView>
        </View>
      </Modal>
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
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rs(8),
    borderRadius: RADII.xxl, paddingVertical: rs(SPACING.md), marginTop: rs(SPACING.md),
    borderWidth: rs(1), borderColor: 'rgba(220,38,38,0.12)',
  },
  deleteText: { fontSize: rs(14), fontWeight: '600', color: COLORS.error, fontFamily: FONTS.body },
  versionText: { fontSize: rs(12), color: COLORS.inkFaint, fontFamily: FONTS.mono, textAlign: 'center', marginTop: rs(SPACING.xl) },

  // Modal styles
  modalContainer: { flex: 1, backgroundColor: COLORS.surface, paddingTop: rs(50) },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: rs(SPACING.xxl), paddingBottom: rs(SPACING.lg),
    borderBottomWidth: rs(1), borderBottomColor: COLORS.divider,
  },
  modalTitle: { fontSize: rs(20), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display },
  modalCloseBtn: { width: rs(40), height: rs(40), borderRadius: RADII.md, alignItems: 'center', justifyContent: 'center' },
  modalScroll: { flex: 1 },
  modalContent: { padding: rs(SPACING.xxl) },
  modalBody: { fontSize: rs(14), color: COLORS.ink, fontFamily: FONTS.body, lineHeight: rs(22) },
});
