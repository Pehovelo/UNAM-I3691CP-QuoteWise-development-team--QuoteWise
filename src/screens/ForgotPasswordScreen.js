import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADII } from '../constants/designTokens';
import { resetPassword } from '../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      const msg = err.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : err.code === 'auth/invalid-email'
        ? 'Please enter a valid email address.'
        : 'Failed to send reset email. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />

      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityRole="button">
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Reset Password</Text>
        <Text style={s.headerSub}>We'll send you a reset link</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.formWrap}
      >
        <ScrollView contentContainerStyle={s.form} keyboardShouldPersistTaps="handled">
          {sent ? (
            <View style={s.successBox}>
              <Text style={s.successIcon}>✉️</Text>
              <Text style={s.successTitle}>Check Your Email</Text>
              <Text style={s.successMsg}>
                We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
              </Text>
              <TouchableOpacity
                style={s.primaryBtn}
                onPress={() => navigation.navigate('Login')}
                accessibilityRole="button"
              >
                <Text style={s.primaryBtnText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {error ? <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View> : null}

              <View style={s.inputGroup}>
                <Text style={s.label}>Email Address</Text>
                <TextInput
                  style={s.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={COLORS.inkFaint}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Email address"
                />
              </View>

              <TouchableOpacity
                style={[s.primaryBtn, loading && s.btnDisabled]}
                onPress={handleReset}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Send reset email"
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={s.primaryBtnText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={s.backLinkBtn}
                onPress={() => navigation.navigate('Login')}
                accessibilityRole="button"
              >
                <Text style={s.backLinkText}>← Back to Sign In</Text>
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
  header: {
    backgroundColor: COLORS.brand,
    paddingTop: 50,
    paddingBottom: 32,
    paddingHorizontal: SPACING.xxl,
    borderBottomLeftRadius: RADII.xxl,
    borderBottomRightRadius: RADII.xxl,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: RADII.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  backArrow: { fontSize: 20, color: '#FFFFFF', fontWeight: '600' },
  headerTitle: {
    fontSize: 26, fontWeight: '800', color: '#FFFFFF',
    fontFamily: FONTS.display,
  },
  headerSub: {
    fontSize: 14, color: 'rgba(255,255,255,0.75)',
    fontFamily: FONTS.body, marginTop: 4,
  },
  formWrap: { flex: 1 },
  form: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxxl,
    paddingBottom: 40,
  },
  errorBox: {
    backgroundColor: COLORS.errorBg,
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.15)',
  },
  errorText: {
    color: COLORS.error, fontSize: 13, fontFamily: FONTS.body,
    textAlign: 'center',
  },
  successBox: { alignItems: 'center', paddingTop: SPACING.xxxl },
  successIcon: { fontSize: 48, marginBottom: SPACING.lg },
  successTitle: {
    fontSize: 22, fontWeight: '700', color: COLORS.ink,
    fontFamily: FONTS.display, marginBottom: SPACING.md,
  },
  successMsg: {
    fontSize: 14, color: COLORS.inkLight, fontFamily: FONTS.body,
    textAlign: 'center', lineHeight: 20, marginBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.md,
  },
  inputGroup: { marginBottom: SPACING.lg },
  label: {
    fontSize: 13, fontWeight: '600', color: COLORS.inkMid,
    fontFamily: FONTS.body, marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.ink,
    fontFamily: FONTS.body,
  },
  primaryBtn: {
    backgroundColor: COLORS.brand,
    borderRadius: RADII.xxl,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: SPACING.xl,
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: {
    fontSize: 16, fontWeight: '700', color: '#FFFFFF',
    fontFamily: FONTS.body, letterSpacing: 0.3,
  },
  backLinkBtn: { alignItems: 'center', paddingVertical: SPACING.md },
  backLinkText: {
    fontSize: 14, color: COLORS.brand, fontFamily: FONTS.body,
    fontWeight: '600',
  },
});
