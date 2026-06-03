import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, rs, BOTTOM_SAFE } from '../constants/designTokens';
import { FadeSlideIn } from '../components/Animations';
import { addQuote } from '../services/firestoreService';
import { auth } from '../services/authService';

export default function ComposePostScreen({ navigation, user }) {
  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.displayName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.displayName?.split(' ').slice(1).join(' ') || '');
  const [phone, setPhone] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const userId = auth.currentUser?.uid;

  const validate = () => {
    if (!projectTitle.trim()) {
      Alert.alert('Missing Field', 'Please enter a project title.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Missing Field', 'Please describe the project.');
      return false;
    }
    if (!budget.trim()) {
      Alert.alert('Missing Field', 'Please enter an estimated budget.');
      return false;
    }
    return true;
  };

  const handlePost = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await addQuote({
        clientId: userId,
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        projectTitle: projectTitle.trim(),
        budget: parseFloat(budget) || 0,
        currency: 'NAD',
        description: description.trim(),
      });
      Alert.alert(
        'Request Posted',
        'Your quotation request has been posted. Service providers will be able to respond.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to post request. Please try again.');
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
            <Text style={s.headerTitle}>Compose Post</Text>
            <View style={{ width: rs(40) }} />
          </View>
        </SafeAreaView>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex1}>
        <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={s.scrollContent}>
          <FadeSlideIn>
            <View style={s.infoBanner}>
              <Ionicons name="information-circle" size={rs(20)} color={COLORS.brand} />
              <Text style={s.infoBannerText}>
                Describe the project you need quoted. Service providers will see this and respond with their quotations.
              </Text>
            </View>
          </FadeSlideIn>

          {/* Contact Information */}
          <FadeSlideIn delay={50}>
            <Text style={s.sectionLabel}>Contact Information</Text>
          </FadeSlideIn>

          <FadeSlideIn delay={70}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Email</Text>
              <View style={s.inputWrap}>
                <Ionicons name="mail-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
                <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="your@email.com" placeholderTextColor={COLORS.inkFaint} keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>
          </FadeSlideIn>

          <FadeSlideIn delay={90}>
            <View style={s.rowInputs}>
              <View style={[s.inputGroup, { flex: 1, marginRight: rs(SPACING.md) }]}>
                <Text style={s.label}>First Name</Text>
                <View style={s.inputWrap}>
                  <TextInput style={s.input} value={firstName} onChangeText={setFirstName} placeholder="John" placeholderTextColor={COLORS.inkFaint} autoCapitalize="words" />
                </View>
              </View>
              <View style={[s.inputGroup, { flex: 1 }]}>
                <Text style={s.label}>Last Name</Text>
                <View style={s.inputWrap}>
                  <TextInput style={s.input} value={lastName} onChangeText={setLastName} placeholder="Doe" placeholderTextColor={COLORS.inkFaint} autoCapitalize="words" />
                </View>
              </View>
            </View>
          </FadeSlideIn>

          <FadeSlideIn delay={110}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Mobile Number</Text>
              <View style={s.inputWrap}>
                <Ionicons name="call-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
                <TextInput style={s.input} value={phone} onChangeText={setPhone} placeholder="+264 ..." placeholderTextColor={COLORS.inkFaint} keyboardType="phone-pad" />
              </View>
            </View>
          </FadeSlideIn>

          {/* Project Details */}
          <FadeSlideIn delay={140}>
            <Text style={s.sectionLabel}>Project Details</Text>
          </FadeSlideIn>

          <FadeSlideIn delay={160}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Project Title *</Text>
              <View style={s.inputWrap}>
                <Ionicons name="briefcase-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
                <TextInput style={s.input} value={projectTitle} onChangeText={setProjectTitle} placeholder="e.g. Office Renovation in Windhoek" placeholderTextColor={COLORS.inkFaint} />
              </View>
            </View>
          </FadeSlideIn>

          <FadeSlideIn delay={180}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Estimated Budget (N$) *</Text>
              <View style={s.inputWrap}>
                <Text style={s.currencyPrefix}>N$</Text>
                <TextInput style={s.input} value={budget} onChangeText={setBudget} placeholder="0.00" placeholderTextColor={COLORS.inkFaint} keyboardType="decimal-pad" />
              </View>
            </View>
          </FadeSlideIn>

          <FadeSlideIn delay={200}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Project Description *</Text>
              <View style={[s.inputWrap, s.descWrap]}>
                <TextInput
                  style={[s.input, s.descInput]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe what you need: scope, materials, timeline, special requirements..."
                  placeholderTextColor={COLORS.inkFaint}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </FadeSlideIn>

          {/* Submit Button */}
          <FadeSlideIn delay={240}>
            <TouchableOpacity
              style={[s.postBtn, saving && s.btnDisabled]}
              onPress={handlePost}
              disabled={saving}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Post quotation request"
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="send-outline" size={rs(20)} color="#FFFFFF" />
                  <Text style={s.postBtnText}>Post Request</Text>
                </>
              )}
            </TouchableOpacity>
          </FadeSlideIn>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  flex1: { flex: 1 },
  header: { backgroundColor: COLORS.brand, paddingBottom: rs(SPACING.xxl) },
  headerContent: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.md),
  },
  backBtn: {
    width: rs(40), height: rs(40), borderRadius: RADII.md,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: rs(20), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.display },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.xl),
    paddingBottom: rs(120) + BOTTOM_SAFE,
  },

  // Info banner
  infoBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.brandGlow,
    borderRadius: RADII.lg, padding: rs(SPACING.lg), marginBottom: rs(SPACING.xl),
    borderWidth: rs(1), borderColor: COLORS.brand + '30',
  },
  infoBannerText: {
    fontSize: rs(12), color: COLORS.inkMid, fontFamily: FONTS.body,
    lineHeight: rs(18), marginLeft: rs(SPACING.sm), flex: 1,
  },

  // Section labels
  sectionLabel: {
    fontSize: rs(13), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.body,
    textTransform: 'uppercase', letterSpacing: rs(1), marginBottom: rs(SPACING.md),
    marginTop: rs(SPACING.md),
  },

  // Inputs
  inputGroup: { marginBottom: rs(SPACING.lg) },
  label: {
    fontSize: rs(13), fontWeight: '600', color: COLORS.inkMid,
    fontFamily: FONTS.body, marginBottom: rs(SPACING.sm),
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADII.md, borderWidth: rs(1), borderColor: COLORS.cardBorder,
    paddingHorizontal: rs(SPACING.md), paddingVertical: rs(SPACING.md), minHeight: rs(48),
  },
  inputIcon: { marginRight: rs(SPACING.sm) },
  input: { flex: 1, fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body, paddingVertical: 0 },
  rowInputs: { flexDirection: 'row' },
  currencyPrefix: {
    fontSize: rs(15), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.mono,
    marginRight: rs(SPACING.sm),
  },
  descWrap: { minHeight: rs(120), alignItems: 'flex-start' },
  descInput: { minHeight: rs(100) },

  // Post button
  postBtn: {
    flexDirection: 'row', backgroundColor: COLORS.brand, borderRadius: RADII.xxl,
    paddingVertical: rs(16), alignItems: 'center', justifyContent: 'center', gap: rs(8),
    marginTop: rs(SPACING.lg), shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: rs(4) }, shadowOpacity: 0.35,
    shadowRadius: rs(12), elevation: 6,
  },
  postBtnText: {
    fontSize: rs(16), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body, letterSpacing: 0.3,
  },
  btnDisabled: { opacity: 0.6 },
});
