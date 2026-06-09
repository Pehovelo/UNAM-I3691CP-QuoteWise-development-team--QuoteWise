#Thank you for contributing to the QuoteWise project. This document outlines the codin

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
