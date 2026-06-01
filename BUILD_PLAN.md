# QuoteWise Build Plan — Autonomous Rebuild Mission

## Repository Analysis Summary

### Invalid Files (Preserved as Design References)
| Original File | Actual Type | Moved To |
|---------------|-------------|----------|
| `DashboardScreen.js` | HTML document | `docs/mockups/DashboardScreen.html` |
| `QuotationsScreen.js` | HTML document | `docs/mockups/QuotationsScreen.html` |
| `DraftScreen.js` | PNG image | `docs/screenshots/DraftScreen.png` |
| `SavedQuotationsScreen.js` | PNG image | `docs/screenshots/SavedQuotationsScreen.png` |
| Various `code*.html`, `screen*.png` | Mixed assets | `docs/mockups/`, `docs/screenshots/` |

### Missing Files
- `src/navigation/AppNavigator.js` — App crashes on import
- `src/screens/WelcomeLoginScreen.js`
- `src/screens/DashboardScreen.js` (real RN component)
- `src/screens/QuotationsScreen.js` (real RN component)
- `src/screens/QuotationDetailScreen.js`
- `src/screens/DraftScreen.js` (real RN component)
- `src/screens/SavedQuotationsScreen.js` (real RN component)
- `src/components/Header.js`
- `src/components/QuotationCard.js`
- `src/components/LoadingState.js`
- `src/components/EmptyState.js`
- `src/context/QuotationContext.js`
- `src/services/firebase.js`
- `src/services/quotationService.js`
- `src/theme/colors.js`
- `src/theme/spacing.js`
- `src/theme/typography.js`
- `assets/` directory with actual app icons

### Broken Imports
- `App.js` imports `./src/navigation/AppNavigator` which doesn't exist

### Invalid Files in Source Tree
- All `.js` files in root that were HTML/PNG — moved to `docs/`

### Project Identity Issues
- `package.json` name: `temp_expo` — must be `quotewise`
- `app.json` slug: `temp_expo` — must be `quotewise`

### Firebase Integration Status
- Not started. Dependencies not installed. No config files exist.

---

## Implementation Strategy

### Phase 1: Foundation (Make Expo Boot)
1. Fix `package.json` and `app.json` identity
2. Create theme system (`colors.js`, `spacing.js`, `typography.js`)
3. Create `AppNavigator.js` with all routes
4. Create stub screens (so navigation works)
5. Update `App.js` entry point
6. Verify Expo starts

### Phase 2: Build Screens & Components
1. Build reusable components first (Header, QuotationCard, LoadingState, EmptyState)
2. Build all 6 screens with proper React Native components
3. Translate HTML mockup designs into native StyleSheet styling
4. Use FlashList for list screens
5. Use Pressable over TouchableOpacity
6. Use expo-image for images

### Phase 3: State Management & Data
1. Create QuotationContext with mock data
2. Create quotationService with CRUD operations
3. Wire screens to context

### Phase 4: Firebase Preparation
1. Create firebase.js with placeholder config
2. Create auth service stubs
3. Create Firestore service stubs
4. Environment variable setup

### Phase 5: Accessibility & Performance
1. Add accessibilityRole and accessibilityLabel to all interactive elements
2. Ensure minimum 44x44 touch targets
3. Memoize list item components
4. Add loading, error, and empty states

### Phase 6: Documentation & Validation
1. Update README to reflect actual project state
2. Fix ROADMAP.md
3. Final Expo startup verification
4. Git commits with meaningful messages

---

## Design System Reference (from HTML Mockups)

### Material Design 3 Color Tokens
```
Primary: #FF6200 (orange - brand color)
Primary Container: #FF6200
On Primary: #FFFFFF
Secondary: #725C00
Secondary Container: #FDD000
Tertiary: #0061A2
Error: #BA1A1A
Background: #FBF9F9
Surface: #FBF9F9
Surface Container: #EFEDED
On Background: #1B1C1C
On Surface: #1B1C1C
On Surface Variant: #5A4137
Outline: #8F7065
Outline Variant: #E3BFB1
```

### Typography
- Headlines: Newsreader (serif) → system serif fallback
- Body/Labels: Geist (sans) → system sans-serif fallback

### Spacing
- xs: 4px, sm: 8px, md: 16px, gutter: 12px, lg: 24px, xl: 40px

---

## Success Criteria Checklist
- [ ] Expo starts successfully
- [ ] No missing imports
- [ ] Navigation works between all 6 screens
- [ ] All screens render with mock data
- [ ] Project structure matches required layout
- [ ] Firebase layer exists (with placeholders)
- [ ] Accessibility labels on interactive elements
- [ ] App can be demonstrated end-to-end
