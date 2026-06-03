# Changelog

All notable changes to the QuoteWise project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.0.0] — 2026-06-01

### Added

- Expo SDK 55 project with React Native 0.83.6 and React 19.2.0
- Project identity fixed: renamed from `temp_expo` to `quotewise`
- React Navigation Native Stack with 6 routes (WelcomeLogin, Dashboard, Quotations, QuotationDetail, Drafts, SavedQuotations)
- WelcomeLoginScreen — full-screen onboarding with brand orange background and "Get Started" button
- DashboardScreen — 2x2 navigation card grid with live quotation counts from context
- QuotationsScreen — active quotations list (pending + draft) rendered with FlashList
- QuotationDetailScreen — full detail view with reference chip, budget, dates, supplier, description, PDF download button, and Accept/Reject/Save action bar
- DraftScreen — draft quotations list with floating action button for new drafts
- SavedQuotationsScreen — archived/saved quotations list
- Header component — reusable top bar with optional back button and right action slot
- QuotationCard component — list row with title, date, status badge, and chevron
- LoadingState component — centred ActivityIndicator with message
- EmptyState component — centred icon, title, and subtitle
- QuotationContext — global state management with useReducer, full CRUD actions, and derived data
- 8 realistic mock quotations for the Namibian construction industry
- Material Design 3 color token system (40+ tokens, light and dark variants)
- Spacing token system with padding presets and border radius scale
- Typography token system with platform-specific font families
- firebase.js — placeholder configuration with environment variable support (SDK not installed yet)
- quotationService.js — async CRUD service layer with mock implementations
- mockData.js — standalone mock data source
- Accessibility: accessibilityRole and accessibilityLabel on all interactive elements
- Accessibility: minimum 44px touch targets throughout
- Performance: FlashList for all list screens, Pressable instead of TouchableOpacity
- .gitignore configured for Expo project
- README.md with project overview, team roster, tech stack, structure, and roadmap
- ARCHITECTURE.md documenting navigation, state management, and Firebase integration plan
- CONTRIBUTING.md with coding standards, branch strategy, and commit conventions
- BUILD_PLAN.md with initial audit findings and implementation strategy

### Changed

- Invalid HTML source files (DashboardScreen.js, QuotationsScreen.js) moved to docs/mockups/
- Invalid PNG source files (DraftScreen.js, SavedQuotationsScreen.js) moved to docs/screenshots/
- app.json slug updated from `temp_expo` to `quotewise`
- package.json name updated from `temp_expo` to `quotewise`

### Fixed

- AppNavigator.js missing import — app crashed on startup
- QuotationContext `deleteDraft` action was dispatching wrong action type (DELETE_QUOTATION instead of DELETE_DRAFT)
- Firebase import crash — firebase.js now uses safe placeholder exports instead of importing uninstalled SDK

### Removed

- claudia.md — AI tool artifact
- Agende.md — AI tool artifact
- SUMMARY.md — outdated AI-generated roadmap
- ROADMAP.md replaced — was JSON config instead of proper markdown
