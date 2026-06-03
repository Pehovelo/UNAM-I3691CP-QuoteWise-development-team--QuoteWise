# Contributing to QuoteWise

Thank you for contributing to the QuoteWise project. This document outlines the coding standards, branch strategy, and commit conventions that the team follows.

## Coding Standards

### JavaScript

- Use **JavaScript** (not TypeScript) for all source files — the project is configured for plain JS.
- Use `const` for variables that never change, `let` for variables that do. Never use `var`.
- Use arrow functions for callbacks and short helpers. Use `function` declarations for exported components and named functions.
- Always add a JSDoc comment above exported functions and components describing parameters and purpose.

### React Native

- Use `Pressable` for all interactive elements — not `TouchableOpacity` or `TouchableHighlight`.
- Use `StyleSheet.create()` for all styles — never inline style objects in JSX.
- Use `FlashList` from `@shopify/flash-list` for all lists — not `FlatList` or `ScrollView` for repeated items.
- Use `SafeAreaView` as the root element of every screen.
- Use `expo-image` for any remote images (not the built-in `Image` component).
- Import theme tokens from `src/theme/` — never hardcode colours, spacing, or font sizes in screen files.

### Accessibility

- Every `Pressable` must have `accessibilityRole="button"` and a descriptive `accessibilityLabel`.
- Decorative icons must have `accessibilityElementsHidden` and `importantForAccessibility="no"`.
- All touch targets must be at least 44px in both dimensions.

### File Naming

- Screen files: `PascalCaseScreen.js` (e.g. `DashboardScreen.js`)
- Component files: `PascalCase.js` (e.g. `QuotationCard.js`)
- Service/context files: `camelCase.js` (e.g. `quotationService.js`)
- Theme files: `camelCase.js` (e.g. `colors.js`)

### Imports Order

Organise imports in this order, separated by blank lines:

1. React and React Native built-ins
2. Third-party libraries (e.g. @expo/vector-icons, @react-navigation)
3. Internal components and screens
4. Context and services
5. Theme tokens

Example:

```js
import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import Header from '../components/Header';
import QuotationCard from '../components/QuotationCard';

import { useQuotations } from '../context/QuotationContext';

import colors from '../theme/colors';
```

## Branch Strategy

### Main Branches

| Branch | Purpose |
|--------|---------|
| `main` | Stable, tested code. Only merged via pull request. |
| `portfolio` | Portfolio/demo snapshot. Updated from `main` before presentations. |

### Feature Branches

Create a branch for each screen, component, or feature:

```
feat/welcome-login-screen
feat/dashboard-screen
feat/quotation-context
fix/delete-draft-action
docs/architecture
```

### Workflow

1. Create a feature branch from `main`
2. Make changes and commit frequently with descriptive messages
3. Test on a physical device or emulator before merging
4. Open a pull request and request review from the Lead Developer (Lasarus)
5. After approval, merge into `main`

## Commit Standards

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description
```

### Types

| Type | When to use |
|------|------------|
| `feat` | New screen, component, or feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring without changing behaviour |
| `docs` | Documentation changes |
| `style` | Formatting, missing semicolons — no code change |
| `test` | Adding or updating tests |
| `chore` | Build, dependencies, tooling |

### Examples

```
feat(navigation): add native stack navigator with 6 routes
feat(screens): build dashboard with navigation card grid
feat(context): add QuotationContext with useReducer
fix(context): correct deleteDraft action type
refactor(theme): extract color tokens to separate module
docs: add architecture documentation
docs: add firebase integration plan
chore: rename project from temp_expo to quotewise
```

### Commit Frequency

- Commit after every meaningful change — do not bundle multiple features into one commit.
- Each commit should leave the app in a working state (no broken imports or crashes).
- Write commit messages that explain *why* the change was made, not just *what* changed.

## Pull Request Checklist

Before submitting a PR, verify:

- [ ] App starts successfully with `npx expo start`
- [ ] No console errors on any screen
- [ ] Accessibility labels present on all new interactive elements
- [ ] New components follow the import order convention
- [ ] No hardcoded colours or spacing values
- [ ] Commit messages follow Conventional Commits format
