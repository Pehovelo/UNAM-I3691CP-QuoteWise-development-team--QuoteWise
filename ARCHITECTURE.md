# QuoteWise Architecture

This document describes the technical architecture of the QuoteWise mobile application. It is intended for developers joining the project and for reference during future development phases.

## Overview

QuoteWise is a React Native application built with Expo SDK 55 that serves the construction industry. It allows contractors and project managers to create, review, and manage supplier quotations on mobile devices. The app follows a client-first architecture with Firebase planned as the backend.

## Navigation Architecture

The app uses React Navigation with a single `NativeStack` navigator. All screens are registered at the top level — there are no nested tab or drawer navigators.

```
WelcomeLogin (entry point)
  └── Dashboard
        ├── Quotations
        │     └── QuotationDetail
        ├── SavedQuotations
        │     └── QuotationDetail
        └── Drafts
              └── QuotationDetail
```

### Screen Descriptions

| Screen | Route Name | Purpose |
|--------|-----------|---------|
| WelcomeLoginScreen | `WelcomeLogin` | Full-screen splash with "Get Started" button. Will become the authentication screen. |
| DashboardScreen | `Dashboard` | Central hub. Shows 2x2 card grid with counts for Quotations, Saved, Drafts, and Settings. |
| QuotationsScreen | `Quotations` | Lists active quotations (pending + draft status) using FlashList. |
| QuotationDetailScreen | `QuotationDetail` | Full quotation details with Accept/Reject/Save action bar. Receives quotation via route params. |
| DraftScreen | `Drafts` | Lists draft quotations with FAB to create new drafts. |
| SavedQuotationsScreen | `SavedQuotations` | Lists saved/archived quotations. |

### Navigation Setup

The navigation is configured in `src/navigation/AppNavigator.js`. The `QuotationProvider` wraps the `NavigationContainer` so that all screens can access quotation state without prop drilling.

```js
<QuotationProvider>
  <NavigationContainer>
    <Stack.Navigator initialRouteName="WelcomeLogin">
      ...
    </Stack.Navigator>
  </NavigationContainer>
</QuotationProvider>
```

Headers are hidden globally (`headerShown: false`) because each screen renders its own `Header` component. This gives full control over the top bar appearance and back button behavior.

## State Management

### QuotationContext

Global state is managed through a single React Context (`src/context/QuotationContext.js`) backed by `useReducer`. This pattern was chosen over Redux or Zustand because:

- The state shape is simple (one array of quotations plus loading/error flags)
- Only CRUD operations are needed
- No middleware or devtools are required at this stage
- The team is familiar with Context + useReducer from coursework

### State Shape

```js
{
  quotations: [...],  // Array of quotation objects
  loading: false,     // Fetch in progress
  error: null,        // Error message if fetch failed
}
```

### Action Types

| Action | Payload | Effect |
|--------|---------|--------|
| `SET_LOADING` | boolean | Toggle loading state |
| `SET_ERROR` | string | Set error message, clear loading |
| `LOAD_DATA` | Array | Replace entire quotations list |
| `ACCEPT_QUOTATION` | id | Set quotation status to `accepted` |
| `REJECT_QUOTATION` | id | Set quotation status to `rejected` |
| `SAVE_QUOTATION` | id | Set quotation status to `saved` |
| `ADD_DRAFT` | object | Append new quotation with `draft` status |
| `UPDATE_DRAFT` | { id, updates } | Merge updates into existing quotation |
| `DELETE_DRAFT` | id | Remove quotation from list |

### Derived Data

The context computes derived arrays on every render:

- `activeQuotations` — quotations with status `pending` or `draft`
- `pendingQuotations` — quotations with status `pending`
- `savedQuotations` — quotations with status `saved`
- `drafts` — quotations with status `draft`

These are consumed by the Dashboard, Quotations, Drafts, and SavedQuotations screens.

### Custom Hook

Screens access context through `useQuotations()` which throws if used outside the provider:

```js
const { activeQuotations, acceptQuotation, loading } = useQuotations();
```

## Design System

### Theme Tokens

The theme is split into three token files under `src/theme/`:

| File | Contents |
|------|----------|
| `colors.js` | 40+ Material Design 3 color tokens (light + dark variants). Semantic aliases exported as default. |
| `spacing.js` | Spacing scale (xs/sm/md/lg/xl), padding presets, border radius tokens. |
| `typography.js` | Font family platform overrides, size scale, weight tokens, line height ratios. |

All screens import from `colors.js` directly: `import colors from '../theme/colors'`.

### Component Library

| Component | Location | Purpose |
|-----------|----------|---------|
| Header | `src/components/Header.js` | Top bar with optional back button and right action slot |
| QuotationCard | `src/components/QuotationCard.js` | List row for quotation summary. Handles status badge colours. |
| LoadingState | `src/components/LoadingState.js` | Centred spinner with message |
| EmptyState | `src/components/EmptyState.js` | Centred icon + title + subtitle |

## Firebase Integration Plan

The Firebase SDK is **not installed** yet. The app is structured so that adding Firebase requires minimal code changes.

### Step 1: Install SDK

```bash
npx expo install firebase
```

### Step 2: Configure Credentials

Create a `.env` file (already in `.gitignore`):

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
EXPO_PUBLIC_FIREBASE_APP_ID=1:000:web:abc123
```

### Step 3: Uncomment firebase.js

`src/services/firebase.js` contains commented-out Firebase initialization code. Uncomment the import and config blocks once the SDK is installed.

### Step 4: Replace Mock Data with Firestore

The `quotationService.js` module already defines async CRUD functions that return mock data. Each function has a `TODO` comment marking where the Firestore query should go:

```js
// Before (mock)
export async function fetchQuotations() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockQuotations;
}

// After (Firestore)
export async function fetchQuotations() {
  const snapshot = await getDocs(collection(db, 'quotations'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

### Step 5: Add Authentication

Replace the `WelcomeLoginScreen` "Get Started" button with Firebase Auth sign-in:

```js
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const handleLogin = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
  navigation.navigate('Dashboard');
};
```

### Data Model (Firestore)

```
quotations/{quotationId}
  title           string
  supplier        string
  projectTitle    string
  budget          number
  currency        string  (default: "N$")
  description     string
  status          string  (draft | pending | saved | accepted | rejected)
  date            string  (ISO date)
  validUntil      string  (ISO date)
  referenceNumber string
  userId          string  (Firebase Auth UID)
  createdAt       timestamp
  updatedAt       timestamp
```

## Data Flow

```
User Action
    │
    ▼
Screen Component
    │
    ▼
useQuotations() hook
    │
    ▼
QuotationContext dispatch(action)
    │
    ▼
quotationReducer → new state
    │
    ▼
QuotationProvider re-renders
    │
    ▼
All subscribed screens update
```

When Firebase is connected, the flow extends:

```
User Action
    │
    ▼
Screen Component
    │
    ├──→ useQuotations() dispatch (optimistic local update)
    │
    └──→ quotationService async call
              │
              ▼
         Firestore write
              │
              ▼
         onSnapshot listener
              │
              ▼
         LOAD_DATA dispatch (server truth)
```

## Performance Considerations

- **FlashList** is used instead of FlatList for all quotation lists. FlashList recycles cells more efficiently and requires an `estimatedItemSize` prop for accurate layout calculation.
- **Pressable** is used instead of TouchableOpacity. Pressable is the recommended touchable component in modern React Native and supports press state styling through the `pressed` callback.
- **useCallback** wraps all context action dispatchers to prevent unnecessary re-renders in consuming components.
- **Header** uses `hitSlop` on the back button to expand the touch target beyond its visual bounds, improving usability on small screens.

## Accessibility

All interactive elements include:

- `accessibilityRole` — `button` for pressable elements, `header` for titles
- `accessibilityLabel` — descriptive text read by screen readers
- `accessibilityLiveRegion="polite"` on LoadingState (announces when loading appears)
- `accessibilityElementsHidden` + `importantForAccessibility="no"` on decorative icons
- Minimum 44px touch targets on all buttons (iOS Human Interface Guidelines recommendation)

## Error Handling Strategy

- **Loading states**: Every list screen checks `loading` and renders `<LoadingState />` while data is being fetched.
- **Empty states**: When a list has zero items, `<EmptyState />` is shown with a contextual icon and message.
- **Error recovery**: The context stores an `error` field. When Firebase is connected, screens should display a retry button when `error` is non-null.
- **Alert confirmations**: Destructive actions (Accept, Reject) use `Alert.alert` for confirmation before dispatching.
