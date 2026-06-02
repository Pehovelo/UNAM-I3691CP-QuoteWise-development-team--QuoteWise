import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';
import { FadeSlideIn } from '../components/Animations';
import { addQuotation, updateQuotation } from '../services/firestoreService';
import { auth } from '../services/authService';

const CURRENCIES = [
  { code: 'NAD', symbol: 'N$', label: 'Namibian Dollar' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
  { code: 'BWP', symbol: 'P', label: 'Botswana Pula' },
  { code: 'ZMW', symbol: 'ZK', label: 'Zambian Kwacha' },
];

const emptyItem = () => ({ description: '', quantity: 1, unitPrice: 0, total: 0 });

export default function QuotationFormScreen({ navigation, route }) {
  const editData = route?.params?.quotation || null;
  const isEditing = !!editData;

  const [title, setTitle] = useState(editData?.title || '');
  const [clientName, setClientName] = useState(editData?.clientName || '');
  const [clientEmail, setClientEmail] = useState(editData?.clientEmail || '');
  const [currency, setCurrency] = useState(editData?.currency || 'NAD');
  const [items, setItems] = useState(editData?.items?.length ? editData.items : [emptyItem()]);
  const [taxPercent, setTaxPercent] = useState(editData?.taxPercent?.toString() || '0');
  const [notes, setNotes] = useState(editData?.notes || '');
  const [saving, setSaving] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  // AI Assistant state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const userId = auth.currentUser?.uid;

  // Auto-calculate totals
  const calculatedItems = items.map(item => ({
    ...item,
    total: (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0),
  }));
  const subtotal = calculatedItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (parseFloat(taxPercent) || 0) / 100;
  const total = subtotal + taxAmount;

  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || 'N$';

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => setItems([...items, emptyItem()]);

  const removeItem = (index) => {
    if (items.length <= 1) {
      Alert.alert('Cannot Remove', 'You need at least one line item.');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!title.trim()) { Alert.alert('Missing Field', 'Please enter a quotation title.'); return false; }
    if (!clientName.trim()) { Alert.alert('Missing Field', 'Please enter the client name.'); return false; }
    const hasValidItem = items.some(i => i.description.trim() && (parseFloat(i.quantity) > 0) && (parseFloat(i.unitPrice) > 0));
    if (!hasValidItem) { Alert.alert('Missing Items', 'Please add at least one line item with description, quantity, and price.'); return false; }
    return true;
  };

  const handleSave = async (status) => {
    if (!validate()) return;
    setSaving(true);
    try {
      const data = {
        title: title.trim(),
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        currency,
        items: calculatedItems.filter(i => i.description.trim()),
        subtotal,
        taxPercent: parseFloat(taxPercent) || 0,
        taxAmount,
        total,
        notes: notes.trim(),
        status,
      };
      if (isEditing) {
        await updateQuotation(userId, editData.id, data);
        Alert.alert('Updated', 'Quotation updated successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await addQuotation(userId, data);
        Alert.alert(
          status === 'draft' ? 'Draft Saved' : 'Quotation Activated',
          status === 'draft' ? 'Your draft has been saved.' : 'Your quotation is now active.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save quotation. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // AI Assistant - generates suggestions based on keywords
  const handleAiSuggest = () => {
    if (!aiPrompt.trim()) { Alert.alert('Empty', 'Please describe the job.'); return; }
    setAiLoading(true);

    // Smart local suggestion engine
    setTimeout(() => {
      const prompt = aiPrompt.toLowerCase();
      const suggestions = [];

      // Detect project type and suggest items
      if (prompt.includes('website') || prompt.includes('web')) {
        suggestions.push(
          { description: 'UI/UX Design & Wireframes', quantity: 1, unitPrice: 3500 },
          { description: 'Frontend Development', quantity: 1, unitPrice: 8000 },
          { description: 'Backend Development', quantity: 1, unitPrice: 6000 },
          { description: 'Testing & Quality Assurance', quantity: 1, unitPrice: 2000 },
        );
        if (!title) setTitle('Website Development Project');
      } else if (prompt.includes('paint') || prompt.includes('painting')) {
        suggestions.push(
          { description: 'Surface Preparation & Priming', quantity: 1, unitPrice: 2500 },
          { description: 'Interior Painting', quantity: 3, unitPrice: 1800 },
          { description: 'Exterior Painting', quantity: 2, unitPrice: 2200 },
        );
        if (!title) setTitle('Painting Project');
      } else if (prompt.includes('plumb') || prompt.includes('plumbing')) {
        suggestions.push(
          { description: 'Pipe Installation', quantity: 1, unitPrice: 4000 },
          { description: 'Fixture Fitting', quantity: 4, unitPrice: 850 },
          { description: 'Leak Repair & Testing', quantity: 1, unitPrice: 1500 },
        );
        if (!title) setTitle('Plumbing Services');
      } else if (prompt.includes('roof') || prompt.includes('roofing')) {
        suggestions.push(
          { description: 'Roof Inspection & Assessment', quantity: 1, unitPrice: 1500 },
          { description: 'Roof Sheet Installation', quantity: 1, unitPrice: 12000 },
          { description: 'Waterproofing & Sealing', quantity: 1, unitPrice: 3500 },
        );
        if (!title) setTitle('Roofing Project');
      } else if (prompt.includes('electri') || prompt.includes('wiring')) {
        suggestions.push(
          { description: 'Electrical Wiring Installation', quantity: 1, unitPrice: 5500 },
          { description: 'Switch & Outlet Fitting', quantity: 8, unitPrice: 250 },
          { description: 'Distribution Board Setup', quantity: 1, unitPrice: 3000 },
        );
        if (!title) setTitle('Electrical Installation');
      } else if (prompt.includes('concrete') || prompt.includes('foundation')) {
        suggestions.push(
          { description: 'Site Excavation', quantity: 1, unitPrice: 4500 },
          { description: 'Concrete Supply & Pouring', quantity: 1, unitPrice: 8500 },
          { description: 'Reinforcement Steel', quantity: 1, unitPrice: 6000 },
        );
        if (!title) setTitle('Concrete & Foundation Work');
      } else if (prompt.includes('landscap') || prompt.includes('garden')) {
        suggestions.push(
          { description: 'Site Clearing & Levelling', quantity: 1, unitPrice: 2000 },
          { description: 'Plant & Turf Installation', quantity: 1, unitPrice: 3500 },
          { description: 'Irrigation System Setup', quantity: 1, unitPrice: 4000 },
        );
        if (!title) setTitle('Landscaping Project');
      } else {
        // Generic project suggestions
        suggestions.push(
          { description: 'Project Planning & Consultation', quantity: 1, unitPrice: 2000 },
          { description: 'Core Service Delivery', quantity: 1, unitPrice: 5000 },
          { description: 'Quality Review & Handover', quantity: 1, unitPrice: 1500 },
        );
        if (!title) setTitle('Professional Service');
      }

      // Add AI-suggested notes
      let aiNotes = '';
      if (prompt.includes('seo')) aiNotes += 'SEO optimisation included. ';
      if (prompt.includes('urg') || prompt.includes('rush')) aiNotes += 'Rush delivery surcharge may apply. ';
      if (prompt.includes('maint') || prompt.includes('support')) aiNotes += 'Maintenance plan available upon request. ';
      if (!aiNotes) aiNotes = 'Payment: 50% deposit, 50% on completion. Valid for 30 days.';

      setItems(suggestions.map(s => ({ ...s, total: s.quantity * s.unitPrice })));
      if (aiNotes) setNotes(aiNotes);
      setAiLoading(false);
      setShowAiModal(false);
      setAiPrompt('');
    }, 1200);
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
            <Text style={s.headerTitle}>{isEditing ? 'Edit Quotation' : 'New Quotation'}</Text>
            <View style={{ width: rs(40) }} />
          </View>
        </SafeAreaView>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex1}>
        <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={s.scrollContent}>
          {/* AI Assistant Button */}
          {!isEditing && (
            <FadeSlideIn>
              <TouchableOpacity style={s.aiBanner} onPress={() => setShowAiModal(true)} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel="AI Quote Assistant">
                <View style={s.aiBannerLeft}>
                  <Text style={s.aiIcon}>✨</Text>
                  <View>
                    <Text style={s.aiBannerTitle}>AI Quote Assistant</Text>
                    <Text style={s.aiBannerSub}>Describe the job, get instant line items</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={rs(18)} color={COLORS.brand} />
              </TouchableOpacity>
            </FadeSlideIn>
          )}

          {/* Title with AI sparkle for editing */}
          <FadeSlideIn delay={50}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Quotation Title *</Text>
              <View style={s.inputWrap}>
                <TextInput style={s.input} value={title} onChangeText={setTitle} placeholder="e.g. Website Redesign" placeholderTextColor={COLORS.inkFaint} />
              </View>
            </View>
          </FadeSlideIn>

          <FadeSlideIn delay={80}>
            <View style={s.rowInputs}>
              <View style={[s.inputGroup, { flex: 1, marginRight: rs(SPACING.md) }]}>
                <Text style={s.label}>Client Name *</Text>
                <View style={s.inputWrap}>
                  <TextInput style={s.input} value={clientName} onChangeText={setClientName} placeholder="e.g. Acme Corp" placeholderTextColor={COLORS.inkFaint} />
                </View>
              </View>
              <View style={[s.inputGroup, { flex: 1 }]}>
                <Text style={s.label}>Client Email</Text>
                <View style={s.inputWrap}>
                  <TextInput style={s.input} value={clientEmail} onChangeText={setClientEmail} placeholder="optional" placeholderTextColor={COLORS.inkFaint} keyboardType="email-address" autoCapitalize="none" />
                </View>
              </View>
            </View>
          </FadeSlideIn>

          {/* Currency Picker */}
          <FadeSlideIn delay={110}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Currency</Text>
              <TouchableOpacity style={s.currencyBtn} onPress={() => setShowCurrencyPicker(true)} activeOpacity={0.7}>
                <Text style={s.currencyBtnText}>{currency} ({currencySymbol})</Text>
                <Ionicons name="chevron-down" size={rs(16)} color={COLORS.brand} />
              </TouchableOpacity>
            </View>
          </FadeSlideIn>

          {/* Line Items */}
          <FadeSlideIn delay={140}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Line Items</Text>
            </View>
          </FadeSlideIn>

          {calculatedItems.map((item, index) => (
            <FadeSlideIn key={index} delay={150 + index * 40}>
              <View style={s.itemCard}>
                <View style={s.itemCardHeader}>
                  <Text style={s.itemCardNum}>Item {index + 1}</Text>
                  {items.length > 1 && (
                    <TouchableOpacity onPress={() => removeItem(index)} accessibilityRole="button" accessibilityLabel="Remove item">
                      <Ionicons name="trash-outline" size={rs(18)} color={COLORS.error} />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput style={s.itemInput} value={item.description} onChangeText={(v) => updateItem(index, 'description', v)} placeholder="Description" placeholderTextColor={COLORS.inkFaint} />
                <View style={s.itemRowInputs}>
                  <View style={s.itemSmallInput}>
                    <Text style={s.itemSmallLabel}>Qty</Text>
                    <TextInput style={s.itemSmallField} value={item.quantity.toString()} onChangeText={(v) => updateItem(index, 'quantity', v)} keyboardType="decimal-pad" placeholderTextColor={COLORS.inkFaint} />
                  </View>
                  <View style={s.itemSmallInput}>
                    <Text style={s.itemSmallLabel}>Unit Price ({currencySymbol})</Text>
                    <TextInput style={s.itemSmallField} value={item.unitPrice.toString()} onChangeText={(v) => updateItem(index, 'unitPrice', v)} keyboardType="decimal-pad" placeholderTextColor={COLORS.inkFaint} />
                  </View>
                  <View style={s.itemTotalWrap}>
                    <Text style={s.itemSmallLabel}>Total</Text>
                    <Text style={s.itemTotalValue}>{currencySymbol} {item.total.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </FadeSlideIn>
          ))}

          <TouchableOpacity style={s.addItemBtn} onPress={addItem} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Add line item">
            <Ionicons name="add-circle-outline" size={rs(20)} color={COLORS.brand} />
            <Text style={s.addItemText}>Add Item</Text>
          </TouchableOpacity>

          {/* Tax */}
          <FadeSlideIn delay={200}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Tax Rate (%)</Text>
              <View style={[s.inputWrap, { width: rs(120) }]}>
                <TextInput style={s.input} value={taxPercent} onChangeText={setTaxPercent} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={COLORS.inkFaint} />
              </View>
            </View>
          </FadeSlideIn>

          {/* Notes */}
          <FadeSlideIn delay={220}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Notes</Text>
              <View style={[s.inputWrap, s.notesWrap]}>
                <TextInput style={[s.input, s.notesInput]} value={notes} onChangeText={setNotes} placeholder="Payment terms, additional notes..." placeholderTextColor={COLORS.inkFaint} multiline numberOfLines={3} textAlignVertical="top" />
              </View>
            </View>
          </FadeSlideIn>

          {/* Summary Card */}
          <FadeSlideIn delay={250}>
            <View style={s.summaryCard}>
              <Text style={s.summaryTitle}>Summary</Text>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Subtotal</Text>
                <Text style={s.summaryValue}>{currencySymbol} {subtotal.toFixed(2)}</Text>
              </View>
              {parseFloat(taxPercent) > 0 && (
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Tax ({taxPercent}%)</Text>
                  <Text style={s.summaryValue}>{currencySymbol} {taxAmount.toFixed(2)}</Text>
                </View>
              )}
              <View style={s.summaryDivider} />
              <View style={s.summaryRow}>
                <Text style={s.summaryTotalLabel}>TOTAL</Text>
                <Text style={s.summaryTotalValue}>{currencySymbol} {total.toFixed(2)}</Text>
              </View>
            </View>
          </FadeSlideIn>

          {/* Action Buttons */}
          <FadeSlideIn delay={280}>
            <View style={s.actions}>
              <TouchableOpacity style={[s.btn, s.btnDraft]} onPress={() => handleSave('draft')} disabled={saving} activeOpacity={0.8} accessibilityRole="button">
                {saving ? <ActivityIndicator color={COLORS.inkMid} size="small" /> : (
                  <><Ionicons name="document-outline" size={rs(18)} color={COLORS.inkMid} /><Text style={s.btnDraftText}>Save as Draft</Text></>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnActive]} onPress={() => handleSave('active')} disabled={saving} activeOpacity={0.8} accessibilityRole="button">
                {saving ? <ActivityIndicator color="#FFFFFF" size="small" /> : (
                  <><Ionicons name="send-outline" size={rs(18)} color="#FFFFFF" /><Text style={s.btnActiveText}>Activate</Text></>
                )}
              </TouchableOpacity>
            </View>
          </FadeSlideIn>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Currency Picker Modal */}
      <Modal visible={showCurrencyPicker} transparent animationType="fade" onRequestClose={() => setShowCurrencyPicker(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowCurrencyPicker(false)}>
          <View style={s.pickerModal}>
            <Text style={s.pickerTitle}>Select Currency</Text>
            {CURRENCIES.map((c) => (
              <TouchableOpacity key={c.code} style={[s.pickerOption, currency === c.code && s.pickerOptionActive]} onPress={() => { setCurrency(c.code); setShowCurrencyPicker(false); }} accessibilityRole="button">
                <Text style={[s.pickerOptionText, currency === c.code && s.pickerOptionTextActive]}>{c.symbol} {c.code} — {c.label}</Text>
                {currency === c.code && <Ionicons name="checkmark" size={rs(20)} color={COLORS.brand} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* AI Assistant Modal */}
      <Modal visible={showAiModal} transparent animationType="fade" onRequestClose={() => setShowAiModal(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowAiModal(false)}>
          <View style={s.aiModal} onStartShouldSetResponder={() => true}>
            <View style={s.aiModalHeader}>
              <Text style={s.aiModalTitle}>✨ AI Quote Assistant</Text>
              <TouchableOpacity onPress={() => setShowAiModal(false)} accessibilityRole="button">
                <Ionicons name="close" size={rs(22)} color={COLORS.inkMid} />
              </TouchableOpacity>
            </View>
            <Text style={s.aiModalSub}>Describe the job in plain English and the AI will suggest line items with Namibian Dollar pricing.</Text>
            <TextInput
              style={s.aiInput}
              value={aiPrompt}
              onChangeText={setAiPrompt}
              placeholder="e.g. Build a 5-page website for a restaurant, includes SEO"
              placeholderTextColor={COLORS.inkFaint}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity style={[s.aiSuggestBtn, aiLoading && s.btnDisabled]} onPress={handleAiSuggest} disabled={aiLoading} activeOpacity={0.8} accessibilityRole="button">
              {aiLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : (
                <><Text style={s.aiSuggestBtnText}>Generate Suggestions</Text><Ionicons name="sparkles" size={rs(18)} color="#FFFFFF" /></>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  flex1: { flex: 1 },
  header: { backgroundColor: COLORS.brand, paddingBottom: rs(SPACING.xxl) },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.md) },
  backBtn: { width: rs(40), height: rs(40), borderRadius: RADII.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: rs(20), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.display },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: rs(SPACING.xxl), paddingTop: rs(SPACING.xl), paddingBottom: rs(120) },

  // AI Banner
  aiBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.brandGlow, borderRadius: RADII.xxl, padding: rs(SPACING.lg),
    marginBottom: rs(SPACING.lg), borderWidth: rs(1), borderColor: COLORS.brand,
  },
  aiBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: rs(SPACING.md), flex: 1 },
  aiIcon: { fontSize: rs(22) },
  aiBannerTitle: { fontSize: rs(14), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.body },
  aiBannerSub: { fontSize: rs(11), color: COLORS.inkLight, fontFamily: FONTS.body, marginTop: rs(2) },

  // Inputs
  inputGroup: { marginBottom: rs(SPACING.lg) },
  label: { fontSize: rs(13), fontWeight: '600', color: COLORS.inkMid, fontFamily: FONTS.body, marginBottom: rs(SPACING.sm) },
  inputWrap: { backgroundColor: COLORS.card, borderRadius: RADII.md, borderWidth: rs(1), borderColor: COLORS.cardBorder, paddingHorizontal: rs(SPACING.md), paddingVertical: rs(SPACING.md), minHeight: rs(48) },
  input: { fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body, paddingVertical: 0 },
  rowInputs: { flexDirection: 'row' },

  // Currency
  currencyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.card, borderRadius: RADII.md, borderWidth: rs(1),
    borderColor: COLORS.cardBorder, paddingHorizontal: rs(SPACING.md),
    paddingVertical: rs(14), width: rs(200),
  },
  currencyBtnText: { fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body, fontWeight: '600' },

  // Section
  sectionHeader: { marginTop: rs(SPACING.md), marginBottom: rs(SPACING.md) },
  sectionTitle: { fontSize: rs(16), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body },

  // Item Cards
  itemCard: {
    backgroundColor: COLORS.card, borderRadius: RADII.lg, padding: rs(SPACING.lg),
    marginBottom: rs(SPACING.md), borderWidth: rs(1), borderColor: COLORS.cardBorder,
  },
  itemCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rs(SPACING.sm) },
  itemCardNum: { fontSize: rs(12), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: rs(0.5) },
  itemInput: {
    backgroundColor: COLORS.surface, borderRadius: RADII.sm, borderWidth: rs(1),
    borderColor: COLORS.cardBorder, paddingHorizontal: rs(SPACING.md), paddingVertical: rs(10),
    fontSize: rs(14), color: COLORS.ink, fontFamily: FONTS.body, marginBottom: rs(SPACING.md),
  },
  itemRowInputs: { flexDirection: 'row', gap: rs(SPACING.sm) },
  itemSmallInput: { flex: 1 },
  itemSmallLabel: { fontSize: rs(10), color: COLORS.inkLight, fontFamily: FONTS.body, marginBottom: rs(4), fontWeight: '600' },
  itemSmallField: {
    backgroundColor: COLORS.surface, borderRadius: RADII.sm, borderWidth: rs(1),
    borderColor: COLORS.cardBorder, paddingHorizontal: rs(SPACING.sm), paddingVertical: rs(8),
    fontSize: rs(14), color: COLORS.ink, fontFamily: FONTS.mono,
  },
  itemTotalWrap: { flex: 1, justifyContent: 'flex-end' },
  itemTotalValue: { fontSize: rs(15), fontWeight: '700', color: COLORS.brand, fontFamily: FONTS.mono, marginTop: rs(4) },

  // Add Item
  addItemBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rs(6),
    paddingVertical: rs(SPACING.md), marginBottom: rs(SPACING.lg),
    borderRadius: RADII.pill, borderWidth: rs(1), borderColor: COLORS.brand, borderStyle: 'dashed',
  },
  addItemText: { fontSize: rs(14), fontWeight: '600', color: COLORS.brand, fontFamily: FONTS.body },

  // Notes
  notesWrap: { minHeight: rs(80) },
  notesInput: { minHeight: rs(60) },

  // Summary
  summaryCard: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: rs(SPACING.xl),
    borderWidth: rs(1), borderColor: COLORS.cardBorder, marginBottom: rs(SPACING.xl),
  },
  summaryTitle: { fontSize: rs(16), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: rs(SPACING.md) },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: rs(SPACING.xs) },
  summaryLabel: { fontSize: rs(14), color: COLORS.inkLight, fontFamily: FONTS.body },
  summaryValue: { fontSize: rs(14), color: COLORS.ink, fontFamily: FONTS.mono, fontWeight: '500' },
  summaryDivider: { height: rs(1), backgroundColor: COLORS.divider, marginVertical: rs(SPACING.sm) },
  summaryTotalLabel: { fontSize: rs(16), fontWeight: '800', color: COLORS.ink, fontFamily: FONTS.body },
  summaryTotalValue: { fontSize: rs(18), fontWeight: '800', color: COLORS.brand, fontFamily: FONTS.mono },

  // Actions
  actions: { flexDirection: 'row', gap: rs(SPACING.md) },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rs(6), borderRadius: RADII.xxl, paddingVertical: rs(16) },
  btnDraft: { backgroundColor: COLORS.surface, borderWidth: rs(1.5), borderColor: COLORS.cardBorder },
  btnDraftText: { fontSize: rs(15), fontWeight: '700', color: COLORS.inkMid, fontFamily: FONTS.body },
  btnActive: { backgroundColor: COLORS.brand, shadowColor: COLORS.brand, shadowOffset: { width: 0, height: rs(4) }, shadowOpacity: 0.35, shadowRadius: rs(12), elevation: 6 },
  btnActiveText: { fontSize: rs(15), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
  btnDisabled: { opacity: 0.6 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: rs(SPACING.xxl) },
  pickerModal: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: rs(SPACING.xl),
    width: '100%', maxHeight: rs(400),
  },
  pickerTitle: { fontSize: rs(18), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginBottom: rs(SPACING.lg) },
  pickerOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: rs(SPACING.md), paddingHorizontal: rs(SPACING.md),
    borderRadius: RADII.md, marginBottom: rs(4),
  },
  pickerOptionActive: { backgroundColor: COLORS.brandGlow },
  pickerOptionText: { fontSize: rs(15), color: COLORS.ink, fontFamily: FONTS.body },
  pickerOptionTextActive: { color: COLORS.brand, fontWeight: '600' },

  // AI Modal
  aiModal: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: rs(SPACING.xl),
    width: '100%',
  },
  aiModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: rs(SPACING.md) },
  aiModalTitle: { fontSize: rs(18), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display },
  aiModalSub: { fontSize: rs(13), color: COLORS.inkLight, fontFamily: FONTS.body, lineHeight: rs(19), marginBottom: rs(SPACING.lg) },
  aiInput: {
    backgroundColor: COLORS.surface, borderRadius: RADII.md, borderWidth: rs(1),
    borderColor: COLORS.cardBorder, paddingHorizontal: rs(SPACING.md), paddingVertical: rs(SPACING.md),
    fontSize: rs(14), color: COLORS.ink, fontFamily: FONTS.body, minHeight: rs(80),
    textAlignVertical: 'top', marginBottom: rs(SPACING.lg),
  },
  aiSuggestBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rs(6),
    backgroundColor: COLORS.brand, borderRadius: RADII.xxl, paddingVertical: rs(16),
    shadowColor: COLORS.brand, shadowOffset: { width: 0, height: rs(4) }, shadowOpacity: 0.35, shadowRadius: rs(12), elevation: 6,
  },
  aiSuggestBtnText: { fontSize: rs(15), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
});
