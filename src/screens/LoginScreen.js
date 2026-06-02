import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADII } from '../constants/designTokens';
import { loginUser } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginUser(email.trim(), password);
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : err.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.logo}>🧾</Text>
        <Text style={s.appName}>QuoteWise</Text>
        <Text style={s.tagline}>Smart Budgeting & Quotation</Text>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.formWrap}
      >
        <ScrollView contentContainerStyle={s.form} keyboardShouldPersistTaps="handled">
          <Text style={s.formTitle}>Welcome Back</Text>
          <Text style={s.formSub}>Sign in to manage your quotations</Text>

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

          <View style={s.inputGroup}>
            <Text style={s.label}>Password</Text>
            <TextInput
              style={s.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.inkFaint}
              secureTextEntry
              accessibilityLabel="Password"
            />
          </View>

          <TouchableOpacity
            style={s.forgotBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
            accessibilityRole="button"
          >
            <Text style={s.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.primaryBtn, loading && s.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={s.primaryBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={s.registerRow}>
            <Text style={s.registerLabel}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} accessibilityRole="button">
              <Text style={s.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    backgroundColor: COLORS.brand,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: RADII.xxl,
    borderBottomRightRadius: RADII.xxl,
  },
  logo: { fontSize: 48, marginBottom: SPACING.md },
  appName: {
    fontSize: 28, fontWeight: '800', color: '#FFFFFF',
    fontFamily: FONTS.display, letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13, color: 'rgba(255,255,255,0.75)',
    fontFamily: FONTS.body, marginTop: 4, letterSpacing: 1,
    textTransform: 'uppercase',
  },
  formWrap: { flex: 1 },
  form: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxxl,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 22, fontWeight: '700', color: COLORS.ink,
    fontFamily: FONTS.display, marginBottom: 4,
  },
  formSub: {
    fontSize: 14, color: COLORS.inkLight, fontFamily: FONTS.body,
    marginBottom: SPACING.xxl,
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
  forgotBtn: { alignSelf: 'flex-end', marginBottom: SPACING.xl },
  forgotText: {
    fontSize: 13, color: COLORS.brand, fontFamily: FONTS.body,
    fontWeight: '600',
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
  registerRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center',
  },
  registerLabel: { fontSize: 14, color: COLORS.inkLight, fontFamily: FONTS.body },
  registerLink: {
    fontSize: 14, color: COLORS.brand, fontFamily: FONTS.body,
    fontWeight: '700',
  },
});
