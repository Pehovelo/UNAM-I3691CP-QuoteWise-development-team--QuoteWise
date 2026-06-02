import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, ImageBackground, SafeAreaView, Alert, ActivityIndicator, TextInput,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADII, IMAGES } from '../constants/designTokens';
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
                  <Text style={s.backArrow}>←</Text>
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
              <Text style={s.filterText}>{showForm ? 'Cancel' : '+ New'}</Text>
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
                <Text style={s.saveBtnText}>{saving ? 'Saving...' : 'Save Draft'}</Text>
              </TouchableOpacity>
            </View>
          </FadeSlideIn>
        )}

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.brand} style={{ marginTop: 40 }} />
        ) : drafts.length === 0 && !showForm ? (
          <FadeSlideIn delay={150}>
            <View style={s.emptyState}>
              <Text style={s.emptyIcon}>✏️</Text>
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
                    <Text style={s.rowIcon}>✏️</Text>
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
                  <Text style={s.chevron}>›</Text>
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
            <Text style={s.fabIcon}>+</Text>
            <Text style={s.fabText}>New Draft</Text>
          </TouchableOpacity>
        </FadeSlideIn>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  heroBg: { height: 180 },
  heroImageStyle: { resizeMode: 'cover' },
  heroOverlay: { flex: 1, backgroundColor: COLORS.overlayDeep, justifyContent: 'flex-end', paddingBottom: SPACING.xl },
  heroRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xxl, gap: SPACING.lg },
  backBtn: { width: 44, height: 44, borderRadius: RADII.lg, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  backArrow: { fontSize: 20, color: '#FFFFFF', fontWeight: '600' },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', fontFamily: FONTS.display },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.body, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: 100 },
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg, paddingHorizontal: SPACING.xs },
  statsCount: { fontSize: 13, color: COLORS.inkLight, fontFamily: FONTS.body, fontWeight: '500' },
  filterBtn: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADII.pill, backgroundColor: COLORS.brandGlow, borderWidth: 1, borderColor: COLORS.cardBorder },
  filterText: { fontSize: 12, color: COLORS.brand, fontFamily: FONTS.body, fontWeight: '600' },
  formCard: {
    backgroundColor: COLORS.card, borderRadius: RADII.xxl, padding: SPACING.xl,
    marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.cardBorder,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 2,
  },
  formTitle: { fontSize: 16, fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: SPACING.md },
  formInput: {
    backgroundColor: COLORS.surface, borderRadius: RADII.md, borderWidth: 1,
    borderColor: COLORS.cardBorder, paddingHorizontal: SPACING.md, paddingVertical: 12,
    fontSize: 14, color: COLORS.ink, fontFamily: FONTS.body, marginBottom: SPACING.md,
  },
  saveBtn: {
    backgroundColor: COLORS.brand, borderRadius: RADII.lg, paddingVertical: 14,
    alignItems: 'center', marginTop: SPACING.sm,
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
  emptyState: { alignItems: 'center', paddingTop: 40 },
  emptyIcon: { fontSize: 36, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.display, marginBottom: SPACING.sm },
  emptyMsg: { fontSize: 13, color: COLORS.inkLight, fontFamily: FONTS.body, textAlign: 'center', lineHeight: 19, paddingHorizontal: SPACING.xxxl },
  rowCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.card, borderRadius: RADII.lg, paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1,
    borderColor: COLORS.cardBorder, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.6,
    shadowRadius: 8, elevation: 2,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: SPACING.md },
  rowIconWrap: { width: 44, height: 44, borderRadius: RADII.md, backgroundColor: COLORS.draftBg, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  rowIcon: { fontSize: 20 },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: COLORS.ink, fontFamily: FONTS.body, marginBottom: 2 },
  rowSub: { fontSize: 13, color: COLORS.inkMid, fontFamily: FONTS.body, marginBottom: SPACING.xs },
  rowMeta: { flexDirection: 'row', alignItems: 'center' },
  rowDate: { fontSize: 11, color: COLORS.inkLight, fontFamily: FONTS.mono },
  rowDot: { fontSize: 11, color: COLORS.inkFaint },
  rowAmount: { fontSize: 11, fontWeight: '600', color: COLORS.brand, fontFamily: FONTS.mono },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADII.pill, gap: 5 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '600', fontFamily: FONTS.body },
  chevron: { fontSize: 22, color: COLORS.inkFaint, fontWeight: '300' },
  fab: {
    position: 'absolute', bottom: 28, right: SPACING.xl,
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.brand,
    borderRadius: RADII.xxl, paddingLeft: 18, paddingRight: SPACING.xxl,
    paddingVertical: SPACING.xl, gap: SPACING.sm,
    shadowColor: COLORS.brand, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 8,
  },
  fabIcon: { fontSize: 20, color: '#FFFFFF', fontWeight: '700' },
  fabText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', fontFamily: FONTS.body },
});
