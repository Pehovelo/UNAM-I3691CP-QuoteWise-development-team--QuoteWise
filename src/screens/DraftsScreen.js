import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, ImageBackground, SafeAreaView, Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADII, IMAGES, rs } from '../constants/designTokens';
import { FadeSlideIn, PressableCard } from '../components/Animations';
import { subscribeDrafts, addDraft, deleteDraft } from '../services/firestoreService';

export default function DraftsScreen({ navigation, user }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeDrafts(user.uid, (items) => {
      setDrafts(items);
      setLoading(false);
    });
    return unsub;
  }, [user?.uid]);

  const handleAddDraft = async () => {
    if (!newSupplier || !newProject) {
      Alert.alert('Missing fields', 'Please enter at least a supplier and project name.');
      return;
    }
    setSaving(true);
    try {
      await addDraft(user.uid, {
        supplier: newSupplier,
        project: newProject,
        amount: newAmount || 'TBD',
        status: 'Draft',
        date: new Date().toISOString().split('T')[0],
      });
      setNewSupplier('');
      setNewProject('');
      setNewAmount('');
      setShowForm(false);
      Alert.alert('Draft Saved', 'Your draft quotation has been saved.');
    } catch (err) {
      Alert.alert('Error', 'Failed to save draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDraft = (id) => {
    Alert.alert('Delete Draft', 'Are you sure you want to delete this draft?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteDraft(id) },
    ]);
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />
      <ImageBackground source={IMAGES.draftsHeader} style={s.heroBg} imageStyle={s.heroImageStyle}>
        <View style={s.heroOverlay}>
          <SafeAreaView>
            <FadeSlideIn>
              <View style={s.heroRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityRole="button">
                  <Ionicons name="arrow-back" size={rs(22)} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={s.heroTextWrap}>
                  <Text style={s.heroTitle}>Drafts</Text>
                  <Text style={s.heroSub}>Work-in-progress quotations</Text>
                </View>
              </View>
            </FadeSlideIn>
          </SafeAreaView>
        </View>
      </ImageBackground>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <FadeSlideIn delay={50}>
          <View style={s.statsBar}>
            <Text style={s.statsCount}>{drafts.length} drafts</Text>
            <TouchableOpacity style={s.filterBtn} onPress={() => setShowForm(!showForm)}>
              <Ionicons name={showForm ? 'close' : 'add'} size={rs(16)} color={COLORS.brand} />
              <Text style={s.filterText}>{showForm ? 'Cancel' : 'New'}</Text>
            </TouchableOpacity>
          </View>
        </FadeSlideIn>

        {showForm && (
          <FadeSlideIn>
            <View style={s.formCard}>
              <Text style={s.formTitle}>New Draft Quotation</Text>
              <TextInput style={s.formInput} value={newSupplier} onChangeText={setNewSupplier} placeholder="Supplier name" placeholderTextColor={COLORS.inkFaint} />
              <TextInput style={s.formInput} value={newProject} onChangeText={setNewProject} placeholder="Project description" placeholderTextColor={COLORS.inkFaint} />
              <TextInput style={s.formInput} value={newAmount} onChangeText={setNewAmount} placeholder="Amount (e.g. N$ 50,000)" placeholderTextColor={COLORS.inkFaint} keyboardType="numeric" />
              <TouchableOpacity style={s.saveBtn} onPress={handleAddDraft} disabled={saving}>
                <Ionicons name="checkmark" size={rs(18)} color="#FFFFFF" />
                <Text style={s.saveBtnText}>{saving ? 'Saving...' : 'Save Draft'}</Text>
              </TouchableOpacity>
            </View>
          </FadeSlideIn>
        )}

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.brand} style={{ marginTop: rs(40) }} />
        ) : drafts.length === 0 && !showForm ? (
          <FadeSlideIn delay={150}>
            <View style={s.emptyState}>
              <Ionicons name="create-outline" size={rs(48)} color={COLORS.inkFaint} />
              <Text style={s.emptyTitle}>No drafts yet</Text>
              <Text style={s.emptyMsg}>Start a new quotation and save it as a draft.</Text>
            </View>
          </FadeSlideIn>
        ) : (
          drafts.map((item, i) => (
            <FadeSlideIn key={item.id} delay={i * 80}>
              <PressableCard
                onPress={() => Alert.alert(item.project || 'Draft', `${item.supplier}\n${item.amount}\n${item.status}`)}
                onLongPress={() => handleDeleteDraft(item.id)}
                style={s.rowCard}
              >
                <View style={s.rowLeft}>
                  <View style={s.rowIconWrap}>
                    <Ionicons name="create" size={rs(20)} color={COLORS.draft} />
                  </View>
                  <View style={s.rowTextWrap}>
                    <Text style={s.rowTitle} numberOfLines={1}>{item.supplier}</Text>
                    <Text style={s.rowSub} numberOfLines={1}>{item.project}</Text>
                    <View style={s.rowMeta}>
                      <Text style={s.rowDate}>{item.date}</Text>
                      <Text style={s.rowDot}> · </Text>
                      <Text style={s.rowAmount}>{item.amount}</Text>
                    </View>
                  </View>
                </View>
                <View style={s.rowRight}>
                  <View style={[s.badge, { backgroundColor: COLORS.draftBg }]}>
                    <View style={[s.badgeDot, { backgroundColor: COLORS.draft }]} />
                    <Text style={[s.badgeText, { color: COLORS.draft }]}>Draft</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={rs(20)} color={COLORS.inkFaint} />
                </View>
              </PressableCard>
            </FadeSlideIn>
          ))
        )}
      </ScrollView>

      {!showForm && (
        <FadeSlideIn delay={400}>
          <TouchableOpacity
            style={s.fab}
            activeOpacity={0.85}
            onPress={() => setShowForm(true)}
            accessibilityRole="button"
            accessibilityLabel="Create new draft"
          >
            <Ionicons name="add" size={rs(22)} color="#FFFFFF" />
            <Text style={s.fabText}>New Draft</Text>
          </TouchableOpacity>
        </FadeSlideIn>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  heroBg: { height: rs(180) },
  heroImageStyle: { resizeMode: 'cover' },
  heroOverlay: { flex: 1, backgroundColor: COLORS.overlayDeep, justifyContent: 'flex-end', paddingBottom: rs(SPACING.xl) },
  heroRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(SPACING.xxl), gap: rs(SPACING.lg) },
  backBtn: { width: rs(44), height: rs(44), borderRadius: RADII.lg, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: rs(1), borderColor: 'rgba(255,255,255,0.2)' },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: rs(24), fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display },
  heroSub: { fontSize: rs(12), color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body, marginTop: rs(2) },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: rs(SPACING.xl), paddingTop: rs(SPACING.lg), paddingBottom: rs(100) },
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rs(SPACING.lg), paddingHorizontal: rs(SPACING.xs) },
  statsCount: { fontSize: rs(13), color: COLORS.inkLight, fontFamily: FONTS.body, fontWeight: '500' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(SPACING.lg), paddingVertical: rs(SPACING.sm), borderRadius: RADII.pill, backgroundColor: COLORS.brandGlow, borderWidth: rs(1), borderColor: COLORS.cardBorder, gap: rs(4) },
  filterText: { fontSize: rs(12), color: COLORS.brand, fontFamily: FONTS.body, fontWeight: '600' },
  formCard: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: rs(SPACING.xl),
    marginBottom: rs(SPACING.lg), borderWidth: rs(1), borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: rs(2) },
    shadowOpacity: 0.4, shadowRadius: rs(8), elevation: 2,
  },
  formTitle: { fontSize: rs(16), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: rs(SPACING.md) },
  formInput: {
    backgroundColor: COLORS.surface, borderRadius: RADII.md, borderWidth: rs(1),
    borderColor: COLORS.cardBorder, paddingHorizontal: rs(SPACING.md), paddingVertical: rs(12),
    fontSize: rs(14), color: COLORS.ink, fontFamily: FONTS.body, marginBottom: rs(SPACING.md),
  },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rs(6),
    backgroundColor: COLORS.brand, borderRadius: RADII.lg, paddingVertical: rs(14),
    marginTop: rs(SPACING.sm),
  },
  saveBtnText: { fontSize: rs(15), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
  emptyState: { alignItems: 'center', paddingTop: rs(40) },
  emptyTitle: { fontSize: rs(18), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginTop: rs(SPACING.md), marginBottom: rs(SPACING.sm) },
  emptyMsg: { fontSize: rs(13), color: COLORS.inkLight, fontFamily: FONTS.body, textAlign: 'center', lineHeight: rs(19), paddingHorizontal: rs(SPACING.xxxl) },
  rowCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.card, borderRadius: RADII.lg, paddingVertical: rs(SPACING.lg),
    paddingHorizontal: rs(SPACING.lg), marginBottom: rs(SPACING.md), borderWidth: rs(1),
    borderColor: COLORS.cardBorder, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: rs(2) }, shadowOpacity: 0.6,
    shadowRadius: rs(8), elevation: 2,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: rs(SPACING.md) },
  rowIconWrap: { width: rs(44), height: rs(44), borderRadius: RADII.md, backgroundColor: COLORS.draftBg, alignItems: 'center', justifyContent: 'center', marginRight: rs(SPACING.md) },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: rs(15), fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: rs(2) },
  rowSub: { fontSize: rs(13), color: COLORS.inkMid, fontFamily: FONTS.body, marginBottom: rs(SPACING.xs) },
  rowMeta: { flexDirection: 'row', alignItems: 'center' },
  rowDate: { fontSize: rs(11), color: COLORS.inkLight, fontFamily: FONTS.mono },
  rowDot: { fontSize: rs(11), color: COLORS.inkFaint },
  rowAmount: { fontSize: rs(11), fontWeight: '600', color: COLORS.brand, fontFamily: FONTS.mono },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: rs(SPACING.sm) },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(10), paddingVertical: rs(5), borderRadius: RADII.pill, gap: rs(5) },
  badgeDot: { width: rs(6), height: rs(6), borderRadius: rs(3) },
  badgeText: { fontSize: rs(11), fontWeight: '600', fontFamily: FONTS.body },
  fab: {
    position: 'absolute', bottom: rs(28), right: rs(SPACING.xl),
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.brand,
    borderRadius: RADII.xxl, paddingLeft: rs(18), paddingRight: rs(SPACING.xxl),
    paddingVertical: rs(SPACING.xl), gap: rs(SPACING.sm),
    shadowColor: COLORS.brand, shadowOffset: { width: 0, height: rs(6) },
    shadowOpacity: 0.4, shadowRadius: rs(14), elevation: 8,
  },
  fabText: { fontSize: rs(15), fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
});
