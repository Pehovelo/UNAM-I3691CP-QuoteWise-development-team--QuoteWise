import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { registerUser } from '../services/authService';

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!displayName || !email || !password || !confirmPassword) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      await registerUser(email.trim(), password, displayName.trim());
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'This email is already registered.'
        : err.code === 'auth/weak-password' ? 'Password is too weak. Use at least 6 characters.'
        : err.code === 'auth/invalid-email' ? 'Please enter a valid email address.'
        : 'Registration failed. Please try again.';
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
        <Text style={s.headerTitle}>Create Account</Text>
        <Text style={s.headerSub}>Join QuoteWise today</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.formWrap}>
        <ScrollView contentContainerStyle={s.form} keyboardShouldPersistTaps="handled">
          {error ? <View style={s.errorBox}><Ionicons name="alert-circle" size={rs(16)} color={COLORS.error} /><Text style={s.errorText}>{error}</Text></View> : null}

          <View style={s.inputGroup}>
            <Text style={s.label}>Full Name</Text>
            <View style={s.inputWrap}>
              <Ionicons name="person-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
              <TextInput style={s.input} value={displayName} onChangeText={setDisplayName} placeholder="John Doe" placeholderTextColor={COLORS.inkFaint} autoCapitalize="words" accessibilityLabel="Full name" />
            </View>
          </View>
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
              <TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="At least 6 characters" placeholderTextColor={COLORS.inkFaint} secureTextEntry={!showPassword} accessibilityLabel="Password" />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={rs(18)} color={COLORS.inkFaint} /></TouchableOpacity>
            </View>
          </View>
          <View style={s.inputGroup}>
            <Text style={s.label}>Confirm Password</Text>
            <View style={s.inputWrap}>
              <Ionicons name="shield-checkmark-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
              <TextInput style={s.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter your password" placeholderTextColor={COLORS.inkFaint} secureTextEntry={!showPassword} accessibilityLabel="Confirm password" />
            </View>
          </View>

          <TouchableOpacity style={[s.primaryBtn, loading && s.btnDisabled]} onPress={handleRegister} disabled={loading} accessibilityRole="button" accessibilityLabel="Create account">
            {loading ? <ActivityIndicator color="#FFFFFF" /> : (
              <><Text style={s.primaryBtnText}>Create Account</Text><Ionicons name="person-add-outline" size={rs(18)} color="#FFFFFF" /></>
            )}
          </TouchableOpacity>

          <View style={s.loginRow}>
            <Text style={s.loginLabel}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} accessibilityRole="button">
              <Text style={s.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
  form: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxl, paddingBottom: 40 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.errorBg, borderRadius: RADII.md, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: 'rgba(220,38,38,0.15)', gap: SPACING.sm },
  errorText: { color: COLORS.error, fontSize: rs(13), fontFamily: FONTS.body, flex: 1 },
  inputGroup: { marginBottom: SPACING.lg },
  label: { fontSize: rs(13), fontWeight: '600', color: COLORS.inkMid, fontFamily: FONTS.body, marginBottom: SPACING.sm },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADII.lg, borderWidth: 1, borderColor: COLORS.cardBorder, paddingHorizontal: SPACING.md, height: rs(50) },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body, paddingVertical: 0 },
  eyeBtn: { padding: SPACING.sm },
  primaryBtn: { flexDirection: 'row', backgroundColor: COLORS.brand, borderRadius: RADII.xxl, paddingVertical: rs(16), alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, shadowColor: COLORS.brand, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6, marginTop: SPACING.md, marginBottom: SPACING.xl },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: rs(16), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body, letterSpacing: 0.3 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginLabel: { fontSize: rs(14), color: COLORS.inkLight, fontFamily: FONTS.body },
  loginLink: { fontSize: rs(14), color: COLORS.brand, fontFamily: FONTS.body, fontWeight: '700' },
});
