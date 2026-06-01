# QuoteWise Roadmap

## Phase 1 — Foundation (Complete)

- [x] Expo SDK 55 project initialized and configured
- [x] Project renamed from `temp_expo` to `quotewise`
- [x] Material Design 3 theme system (40+ color tokens, light + dark)
- [x] Spacing and typography token systems
- [x] React Navigation Native Stack with all 6 routes
- [x] Invalid HTML/PNG source files moved to `docs/`

## Phase 2 — Core Screens (Complete)

- [x] WelcomeLoginScreen — full-screen onboarding with brand colour
- [x] DashboardScreen — 2x2 navigation card grid with live counts
- [x] QuotationsScreen — active quotations list (FlashList)
- [x] QuotationDetailScreen — detail view with Accept/Reject/Save actions
- [x] DraftScreen — draft list with FAB for new drafts
- [x] SavedQuotationsScreen — archived quotations list
- [x] Reusable components: Header, QuotationCard, LoadingState, EmptyState

## Phase 3 — State & Data (Complete)

- [x] QuotationContext with useReducer — full CRUD operations
- [x] 8 realistic mock quotations (construction industry)
- [x] Derived data: activeQuotations, drafts, savedQuotations, pendingQuotations
- [x] quotationService with async CRUD layer (mock implementation)

## Phase 4 — Firebase Preparation (Complete)

- [x] firebase.js with placeholder config and environment variable support
- [x] quotationService.js with async CRUD stubs
- [x] mockData.js as the data source until Firebase is connected

## Phase 5 — Accessibility & Performance (Complete)

- [x] accessibilityRole + accessibilityLabel on all interactive elements
- [x] Minimum 44px touch targets throughout
- [x] FlashList for all list rendering
- [x] Pressable (not TouchableOpacity) everywhere
- [x] Loading and empty states on all list screens

## Phase 6 — Documentation & Cleanup (In Progress)

- [x] README.md with project overview, setup, structure, roadmap
- [x] BUILD_PLAN.md with audit findings and implementation strategy
- [x] ARCHITECTURE.md with navigation, state, Firebase plan
- [x] CHANGELOG.md tracking development milestones
- [x] CONTRIBUTING.md with coding standards and branch strategy
- [ ] Remove remaining AI-generated artifacts
- [ ] Final Expo startup verification

## Upcoming — Firebase Integration (Not Started)

- [ ] Install Firebase SDK (`npx expo install firebase`)
- [ ] Create Firebase project and configure credentials
- [ ] Implement email/password authentication
- [ ] Connect Firestore for quotation CRUD
- [ ] Add Firebase Storage for PDF uploads
- [ ] Wire quotationService to real Firestore queries

## Future Enhancements

- [ ] Push notifications for quotation status changes
- [ ] Offline mode with local caching
- [ ] Multi-currency support
- [ ] Export quotations to PDF with company branding
- [ ] Dark mode toggle
- [ ] Custom font loading (Newsreader + Geist via @expo-google-fonts)
- [ ] Real-time budget tracking dashboard
