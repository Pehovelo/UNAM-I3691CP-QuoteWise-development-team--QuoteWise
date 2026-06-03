import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeSlideIn } from '../components/Animations';
import { getQuote, addResponse, getUserProfile } from '../services/firestoreService';
import { auth } from '../services/authService';

export default function SubmitQuotationScreen({ navigation, route, user }) {
  const quoteId = route?.params?.quoteId;
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (quoteId) {
          const q = await getQuote(quoteId);
          setQuote(q);
        }
        const uid = auth.currentUser?.uid;
        if (uid) {
          const profile = await getUserProfile(uid);
          if (profile?.companyName) setCompanyName(profile.companyName);
          else if (profile?.displayName) setCompanyName(profile.displayName);
        }
      } catch (err) {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [quoteId]);

  const validate = () => {
    if (!companyName.trim()) {
      Alert.alert('Missing Field', 'Please enter your company name.');
      return false;
    }
    if (!price.trim() || parseFloat(price) <= 0) {
      Alert.alert('Missing Field', 'Please enter a valid price.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addResponse(quoteId, {
        providerId: auth.currentUser?.uid,
        companyName: companyName.trim(),
        price: parseFloat(price) || 0,
        currency: 'NAD',
        message: message.trim(),
      });
      Alert.alert(
        'Quotation Submitted',
        'Your quotation has been submitted to the client.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to submit quotation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={s.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
        <View style={s.header}>
          <SafeAreaView>
            <View style={s.headerContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityRole="button">
                <Ionicons name="arrow-back" size={rs(22)} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={s.headerTitle}>Submit Quotation</Text>
              <View style={{ width: rs(40) }} />
            </View>
          </SafeAreaView>
        </View>
        <View style={s.center}>
          <ActivityIndicator size="large" color={COLORS.brand} />
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <View style={s.header}>
        <SafeAreaView>
          <View style={s.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityRole="button">
              <Ionicons name="arrow-back" size={rs(22)} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={s.headerTitle}>Submit Quotation</Text>
            <View style={{ width: rs(40) }} />
          </View>
        </SafeAreaView>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex1}>
        <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={[s.scrollContent, { paddingBottom: rs(120) + insets.bottom }]}>
          {/* Project summary */}
          {quote && (
            <FadeSlideIn>
              <View style={s.projectCard}>
                <Text style={s.projectLabel}>Responding to</Text>
                <Text style={s.projectTitle}>{quote.projectTitle}</Text>
                <Text style={s.projectDesc} numberOfLines={3}>{quote.description}</Text>
                {quote.budget ? (
                  <View style={s.budgetRow}>
                    <Text style={s.budgetLabel}>Client Budget:</Text>
                    <Text style={s.budgetValue}>N$ {Number(quote.budget).toFixed(2)}</Text>
                  </View>
                ) : null}
              </View>
            </FadeSlideIn>
          )}

          {/* Your Quotation Form */}
          <FadeSlideIn delay={80}>
            <Text style={s.sectionLabel}>Your Quotation</Text>
          </FadeSlideIn>

          <FadeSlideIn delay={100}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Company / Business Name *</Text>
              <View style={s.inputWrap}>
                <Ionicons name="business-outline" size={rs(18)} color={COLORS.inkFaint} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder="e.g. Imms Trading CC"
                  placeholderTextColor={COLORS.inkFaint}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </FadeSlideIn>

          <FadeSlideIn delay={130}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Your Price (N$) *</Text>
              <View style={s.inputWrap}>
                <Text style={s.currencyPrefix}>N$</Text>
                <TextInput
                  style={s.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.inkFaint}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </FadeSlideIn>

          <FadeSlideIn delay={160}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Message to Client</Text>
              <View style={[s.inputWrap, s.msgWrap]}>
                <TextInput
                  style={[s.input, s.msgInput]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Describe your services, timeline, terms, and what's included in your price..."
                  placeholderTextColor={COLORS.inkFaint}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </FadeSlideIn>

          {/* Submit Button */}
          <FadeSlideIn delay={200}>
            <TouchableOpacity
              style={[s.submitBtn, submitting && s.btnDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Submit quotation"
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="send-outline" size={rs(20)} color="#FFFFFF" />
                  <Text style={s.submitBtnText}>Submit Quotation</Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.xl),
  },

  // Project card
  projectCard: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: rs(SPACING.xl),
    marginBottom: rs(SPACING.xl), borderWidth: rs(1), borderColor: COLORS.cardBorder,
    borderLeftWidth: rs(4), borderLeftColor: COLORS.brand,
  },
  projectLabel: {
    fontSize: rs(10), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.body,
    textTransform: 'uppercase', letterSpacing: rs(1), marginBottom: rs(SPACING.sm),
  },
  projectTitle: { fontSize: rs(17), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginBottom: rs(SPACING.sm) },
  projectDesc: { fontSize: rs(13), color: COLORS.inkLight, fontFamily: FONTS.body, lineHeight: rs(19), marginBottom: rs(SPACING.md) },
  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: rs(SPACING.sm) },
  budgetLabel: { fontSize: rs(12), color: COLORS.inkLight, fontFamily: FONTS.body },
  budgetValue: { fontSize: rs(14), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.mono },

  // Section
  sectionLabel: {
    fontSize: rs(13), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.body,
    textTransform: 'uppercase', letterSpacing: rs(1), marginBottom: rs(SPACING.md),
  },

  // Inputs
  inputGroup: { marginBottom: rs(SPACING.lg) },
  label: { fontSize: rs(13), fontWeight: '600', color: COLORS.inkMid, fontFamily: FONTS.body, marginBottom: rs(SPACING.sm) },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADII.md, borderWidth: rs(1), borderColor: COLORS.cardBorder,
    paddingHorizontal: rs(SPACING.md), paddingVertical: rs(SPACING.md), minHeight: rs(48),
  },
  inputIcon: { marginRight: rs(SPACING.sm) },
  input: { flex: 1, fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body, paddingVertical: 0 },
  currencyPrefix: {
    fontSize: rs(15), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.mono,
    marginRight: rs(SPACING.sm),
  },
  msgWrap: { minHeight: rs(120), alignItems: 'flex-start' },
  msgInput: { minHeight: rs(100) },

  // Submit button
  submitBtn: {
    flexDirection: 'row', backgroundColor: COLORS.brand, borderRadius: RADII.xxl,
    paddingVertical: rs(16), alignItems: 'center', justifyContent: 'center', gap: rs(8),
    marginTop: rs(SPACING.lg), shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: rs(4) }, shadowOpacity: 0.35,
    shadowRadius: rs(12), elevation: 6,
  },
  submitBtnText: { fontSize: rs(16), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body, letterSpacing: 0.3 },
  btnDisabled: { opacity: 0.6 },
});
