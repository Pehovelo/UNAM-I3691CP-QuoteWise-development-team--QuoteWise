import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { resetPassword } from '../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();

  const handleReset = async () => {
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true); setError('');
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      const msg = err.code === 'auth/user-not-found' ? 'No account found with this email.'
        : err.code === 'auth/invalid-email' ? 'Please enter a valid email address.'
        : 'Failed to send reset email. Please try again.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityRole="button">
          <Ionicons name="arrow-back" size={rs(20)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Reset Password</Text>
        <Text style={s.headerSub}>We'll send you a reset link</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.formWrap}>
        <ScrollView contentContainerStyle={[s.form, { paddingBottom: rs(40) + insets.bottom }]} keyboardShouldPersistTaps="handled">
          {sent ? (
            <View style={s.successBox}>
              <Ionicons name="mail-open-outline" size={rs(48)} color={COLORS.brand} />
              <Text style={s.successTitle}>Check Your Email</Text>
              <Text style={s.successMsg}>We've sent a password reset link to {email}. Check your inbox and follow the instructions.</Text>
              <TouchableOpacity style={s.primaryBtn} onPress={() => navigation.navigate('Login')} accessibilityRole="button">
                <Text style={s.primaryBtnText}>Back to Sign In</Text>
                <Ionicons name="arrow-forward" size={rs(18)} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {error ? <View style={s.errorBox}><Ionicons name="alert-circle" size={rs(16)} color={COLORS.error} /><Text style={s.errorText}>{error}</Text></View> : null}
              <View style={s.inputGroup}>
                <Text style={s.label}>Email Address</Text>
                <View style={s.inputWrap}>
                  <Ionicons name="mail-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
                  <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={COLORS.inkFaint} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} accessibilityLabel="Email address" />
                </View>
              </View>
              <TouchableOpacity style={[s.primaryBtn, loading && s.btnDisabled]} onPress={handleReset} disabled={loading} accessibilityRole="button" accessibilityLabel="Send reset email">
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <><Text style={s.primaryBtnText}>Send Reset Link</Text><Ionicons name="send-outline" size={rs(18)} color="#FFFFFF" /></>}
              </TouchableOpacity>
              <TouchableOpacity style={s.backLinkBtn} onPress={() => navigation.navigate('Login')} accessibilityRole="button">
                <Ionicons name="arrow-back" size={rs(14)} color={COLORS.brand} />
                <Text style={s.backLinkText}>Back to Sign In</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { backgroundColor: COLORS.brand, paddingTop: rs(50), paddingBottom: rs(32), paddingHorizontal: SPACING.xxl, borderBottomLeftRadius: RADII.xxl, borderBottomRightRadius: RADII.xxl },
  backBtn: { width: rs(40), height: rs(40), borderRadius: RADII.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  headerTitle: { fontSize: rs(26), fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display },
  headerSub: { fontSize: rs(14), color: 'rgba(255,255,255,0.75)', fontFamily: FONTS.body, marginTop: 4 },
  formWrap: { flex: 1 },
  form: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxxl, paddingBottom: 40 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.errorBg, borderRadius: RADII.md, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: 'rgba(220,38,38,0.15)', gap: SPACING.sm },
  errorText: { color: COLORS.error, fontSize: rs(13), fontFamily: FONTS.body, flex: 1 },
  successBox: { alignItems: 'center', paddingTop: SPACING.xxxl },
  successTitle: { fontSize: rs(22), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginTop: SPACING.lg, marginBottom: SPACING.md },
  successMsg: { fontSize: rs(14), color: COLORS.inkLight, fontFamily: FONTS.body, textAlign: 'center', lineHeight: rs(20), marginBottom: SPACING.xxxl, paddingHorizontal: SPACING.md },
  inputGroup: { marginBottom: SPACING.lg },
  label: { fontSize: rs(13), fontWeight: '600', color: COLORS.inkMid, fontFamily: FONTS.body, marginBottom: SPACING.sm },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADII.lg, borderWidth: 1, borderColor: COLORS.cardBorder, paddingHorizontal: SPACING.md, height: rs(50) },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body, paddingVertical: 0 },
  primaryBtn: { flexDirection: 'row', backgroundColor: COLORS.brand, borderRadius: RADII.xxl, paddingVertical: rs(16), alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.xl },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: rs(16), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
  backLinkBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.md },
  backLinkText: { fontSize: rs(14), color: COLORS.brand, fontFamily: FONTS.body, fontWeight: '600' },
});
