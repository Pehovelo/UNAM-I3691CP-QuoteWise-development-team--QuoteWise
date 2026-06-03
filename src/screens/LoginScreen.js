import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginUser } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      await loginUser(email.trim(), password);
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' ? 'Invalid email or password.'
        : err.code === 'auth/user-not-found' ? 'No account found with this email.'
        : err.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later.'
        : 'Login failed. Check your credentials.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <View style={s.header}>
        <Ionicons name="document-text" size={rs(48)} color="#FFFFFF" />
        <Text style={s.appName}>QuoteWise</Text>
        <Text style={s.tagline}>Smart Budgeting & Quotation</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.formWrap}>
        <ScrollView contentContainerStyle={[s.form, { paddingBottom: rs(40) + insets.bottom }]} keyboardShouldPersistTaps="handled">
          <Text style={s.formTitle}>Welcome Back</Text>
          <Text style={s.formSub}>Sign in to manage your quotations</Text>

          {error ? <View style={s.errorBox}><Ionicons name="alert-circle" size={rs(16)} color={COLORS.error} /><Text style={s.errorText}>{error}</Text></View> : null}

          <View style={s.inputGroup}>
            <Text style={s.label}>Email Address</Text>
            <View style={s.inputWrap}>
              <Ionicons name="mail-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
              <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={COLORS.inkFaint} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} accessibilityLabel="Email address" />
            </View>
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Password</Text>
            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
              <TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor={COLORS.inkFaint} secureTextEntry={!showPassword} accessibilityLabel="Password" />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn} accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={rs(18)} color={COLORS.inkFaint} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={s.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')} accessibilityRole="button">
            <Text style={s.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.primaryBtn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading} accessibilityRole="button" accessibilityLabel="Sign in">
            {loading ? <ActivityIndicator color="#FFFFFF" /> : (
              <><Text style={s.primaryBtnText}>Sign In</Text><Ionicons name="log-in-outline" size={rs(18)} color="#FFFFFF" /></>
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
  header: { backgroundColor: COLORS.brand, paddingTop: rs(60), paddingBottom: rs(40), alignItems: 'center', borderBottomLeftRadius: RADII.xxl, borderBottomRightRadius: RADII.xxl },
  appName: { fontSize: rs(28), fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display, letterSpacing: -0.5, marginTop: SPACING.sm },
  tagline: { fontSize: rs(13), color: 'rgba(255,255,255,0.75)', fontFamily: FONTS.body, marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' },
  formWrap: { flex: 1 },
  form: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxxl, paddingBottom: 40 },
  formTitle: { fontSize: rs(22), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginBottom: 4 },
  formSub: { fontSize: rs(14), color: COLORS.inkLight, fontFamily: FONTS.body, marginBottom: SPACING.xxl },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.errorBg, borderRadius: RADII.md, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: 'rgba(220,38,38,0.15)', gap: SPACING.sm },
  errorText: { color: COLORS.error, fontSize: rs(13), fontFamily: FONTS.body, flex: 1 },
  inputGroup: { marginBottom: SPACING.lg },
  label: { fontSize: rs(13), fontWeight: '600', color: COLORS.inkMid, fontFamily: FONTS.body, marginBottom: SPACING.sm },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADII.lg, borderWidth: 1, borderColor: COLORS.cardBorder, paddingHorizontal: SPACING.md, height: rs(50) },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body, paddingVertical: 0 },
  eyeBtn: { padding: SPACING.sm },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: SPACING.xl },
  forgotText: { fontSize: rs(13), color: COLORS.brand, fontFamily: FONTS.body, fontWeight: '600' },
  primaryBtn: { flexDirection: 'row', backgroundColor: COLORS.brand, borderRadius: RADII.xxl, paddingVertical: rs(16), alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, shadowColor: COLORS.brand, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6, marginBottom: SPACING.xl },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: rs(16), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body, letterSpacing: 0.3 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerLabel: { fontSize: rs(14), color: COLORS.inkLight, fontFamily: FONTS.body },
  registerLink: { fontSize: rs(14), color: COLORS.brand, fontFamily: FONTS.body, fontWeight: '700' },
});
