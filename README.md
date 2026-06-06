# QuoteWise — Smart Budgeting & Quotation

> **Engineering Domain:** Civil Engineering — Construction Budgeting, Quotation Management & Project Cost Tracking

## App Overview

**QuoteWise** is a cross-platform mobile application built with **Expo (React Native SDK 55)** for the construction industry. It enables contractors, project managers, and civil engineering teams to:

- **Manage supplier quotations** — create, review, and compare estimates
- **Track project budgets** — real-time cost breakdowns in Namibian Dollars (N$)
- **Save and archive** — finalized estimates stored for audit and retrieval
- **Draft quotations** — work-in-progress estimates before submission

The app features a premium, warm design language inspired by modern fintech applications, with a deep orange brand color (#F05A00), cream surfaces (#FFFAF7), staggered entrance animations, and architectural photography that reflects the construction industry.

---

## Team Roster

| # | Name | Student Number | Role |
|---|------|---------------|------|
| 1 | Immanuel Oliveira | 225109611 | Project Manager |
| 2 | Nailoke Nghiiteka | 224048007 | Project Manager Assistant |
| 3 | Lasarus Shiyelekeni | 224030698 | Lead Developer |
| 4 | Wilhelm WS Moses | 224096389 | Lead Developer Assistant |
| 5 | Benhard Handura | 225153238 | Firebase Lead |
| 6 | Erikson Shapwa | 222068841 | Firebase Assistant |
| 7 | Veikko Shikage | 225066866 | UI/UX Lead |
| 8 | Kandjimwena Dison | 225072572 | UI/UX Assistant |
| 9 | Lavmo Shiweda | 225051532 | Documentation Lead |
| 10 | Kambonde Lehabeam | 225095211 | Documentation Assistant |
| 11 | Pehovelo Halwoodi | 225050390 | GitHub Manager |
| 12 | Michael Kautuara | 224103806 | GitHub Assistant |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Expo SDK 55 |
| **UI Runtime** | React Native 0.83.6 |
| **UI Library** | React 19.2.0 |
| **Animations** | React Native Animated API (native driver) |
| **Navigation** | useState screen stack (lightweight, no external deps) |
| **Backend (planned)** | Fiber (Go) + Firebase |
| **Language** | JavaScript |
| **Platform** | Android & iOS |

---

## Project Structure

```
QuoteWise/
├── App.js                              # Single-file app (all screens + components + styles)
├── app.json                            # Expo configuration
├── package.json                        # Dependencies
├── index.js                            # Expo root registration
├── metro.config.js                     # Metro bundler config
├── eas.json                            # EAS Build configuration
├── assets/
│   ├── icon.png                        # App icon
│   ├── splash-icon.png                 # Splash screen icon
│   ├── favicon.png                     # Web favicon
│   ├── android-icon-background.png     # Android adaptive icon bg
│   ├── android-icon-foreground.png     # Android adaptive icon fg
│   └── images/                         # Architectural photography
│       ├── splash_bg.jpg               # Splash screen background
│       ├── home_header.jpg             # Home screen hero
│       ├── quotations_header.jpg       # Quotations screen hero
│       ├── saved_header.jpg            # Saved screen hero
│       ├── drafts_header.jpg           # Drafts screen hero
│       ├── desert_shadow.jpg           # Empty state background
│       ├── detail_concrete.jpg         # Card accent
│       └── workspace_tabletop.jpg      # Settings/about accent
└── docs/
    └── QuoteWise_SRS_13691CP.pdf.pdf  # Software Requirements Spec
```

---

## Design System

### Color Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `brand` | `#F05A00` | Primary orange — buttons, headers, accents |
| `brandDeep` | `#C24600` | Dark orange — status bar, deep accents |
| `brandLight` | `#FF7A2F` | Light orange — hover states, highlights |
| `surface` | `#FFFAF7` | Warm cream — screen backgrounds |
| `card` | `#FFFFFF` | White — card backgrounds |
| `ink` | `#1A0A00` | Near-black — primary text |
| `inkMid` | `#5C3A1E` | Warm brown — secondary text |
| `inkLight` | `#A07050` | Light brown — tertiary text |
| `pending` | `#F05A00` | Orange — pending status |
| `draft` | `#8B6914` | Amber — draft status |
| `saved` | `#1A6B4A` | Green — saved status |

### Typography
- **Display**: Georgia (iOS) / serif (Android) — headings, numbers
- **Body**: Helvetica Neue (iOS) / sans-serif (Android) — UI text, labels
- **Mono**: Courier New (iOS) / monospace (Android) — dates, amounts

### Animation System
- **FadeSlideIn**: Parallel opacity timing + spring translateY with staggered delays
- **PressableCard**: Spring scale animation (0.97 on press, bounce back)
- **Pulse**: Looping scale pulse on CTA elements
- **Ken Burns**: Slow zoom on splash background image

---

## Getting Started

### Prerequisites
- **Node.js** 18+ and **npm**
- **Expo CLI** via `npx`

### Installation
```bash
git clone <repository-url>
cd QuoteWise
npm install
npx expo start
```

### Running on a Device
- **Android**: Press `a` in the Expo dev server
- **iOS**: Press `i` in the Expo dev server
- **Physical Device**: Scan QR code with **Expo Go**

### Building APK
```bash
# Install EAS CLI
npm install -g eas-cli

# Login and build
eas login
eas build --platform android --profile preview
```

---

## Screens

| Screen | Description |
|--------|-------------|
| **Splash** | Animated logo card with Ken Burns background, decorative circles, pulsing CTA |
| **Home** | Hero header with image, floating summary strip, 2x2 tile grid with count pills |
| **Quotations** | Hero header, list of active/pending quotations with status badges |
| **Saved** | Hero header, list of archived quotations with green saved badges |
| **Drafts** | Hero header, list of draft quotations with amber badges, FAB for new drafts |

---

## Roadmap

- [x] Expo SDK 55 project with React Native 0.83
- [x] Premium design system with warm orange + cream palette
- [x] Animated splash screen with Ken Burns effect
- [x] Hero headers with architectural photography
- [x] Unified status badge system (Pending/Draft/Saved)
- [x] Staggered entrance animations on all screens
- [x] PressableCard spring press micro-interactions
- [x] FAB on Drafts screen
- [x] Empty state with atmospheric background
- [x] Navigation via useState (no React Navigation dependency)
- [x] EAS Build for Android APK
- [ ] Firebase Authentication 
- [ ] Firestore integration for quotation storage
- [ ] Fiber (Go) backend API connection
- [ ] Quotation creation and editing flow
- [ ] PDF export with company branding
- [ ] Push notifications
- [ ] Offline mode with local caching
- [ ] Dark mode

---

## Contact

For questions or contributions, reach out to the project team via the repository issues or contact **Immanuel Oliveira** (Project Manager).
